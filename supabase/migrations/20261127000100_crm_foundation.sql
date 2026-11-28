-- Synthetic-only CRM foundation. Apply to a reviewed development project only.
begin;

create schema genyx_crm;
revoke all on schema genyx_crm from public, anon, authenticated, service_role;
grant usage on schema genyx_crm to authenticated;

create table genyx_crm.members (
  user_id uuid primary key references auth.users(id) on delete restrict,
  role text not null check (role in ('operator', 'viewer')),
  created_at timestamptz not null default now()
);

create table genyx_crm.leads (
  owner_id uuid not null default auth.uid()
    references genyx_crm.members(user_id) on delete restrict,
  request_id text not null check (request_id ~ '^genyx-test-[a-z0-9-]{1,48}$'),
  locale text not null check (locale in ('es', 'en')),
  service text not null check (service in
    ('web', 'mobile', 'enterprise', 'ai', 'automation', 'integrations')),
  timeline text not null check (timeline in
    ('exploring', 'urgent', 'one-to-three', 'three-plus')),
  priority text generated always as (
    case timeline when 'urgent' then 'high'
      when 'exploring' then 'low' else 'normal' end
  ) stored,
  stage text not null default 'new' check (stage in
    ('new', 'contacted', 'consultation', 'proposal', 'won', 'lost')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (owner_id, request_id)
);

create table genyx_crm.lead_events (
  sequence bigint generated always as identity primary key,
  owner_id uuid not null,
  request_id text not null,
  stage text not null check (stage in
    ('new', 'contacted', 'consultation', 'proposal', 'won', 'lost')),
  occurred_at timestamptz not null default now(),
  foreign key (owner_id, request_id)
    references genyx_crm.leads(owner_id, request_id) on delete restrict
);

create index lead_events_history_idx
  on genyx_crm.lead_events(owner_id, request_id, sequence);

-- Trigger functions are not callable by application roles. A narrowly scoped
-- owner-executed trigger inserts history without granting clients event writes.
create function genyx_crm.enforce_stage()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if old.stage in ('won', 'lost') or not (
    new.stage = 'lost'
    or (old.stage = 'new' and new.stage = 'contacted')
    or (old.stage = 'contacted' and new.stage = 'consultation')
    or (old.stage = 'consultation' and new.stage = 'proposal')
    or (old.stage = 'proposal' and new.stage = 'won')
  ) then
    raise exception 'Invalid stage transition' using errcode = '23514';
  end if;
  new.updated_at := pg_catalog.clock_timestamp();
  return new;
end;
$$;

create function genyx_crm.append_lead_event()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into genyx_crm.lead_events(owner_id, request_id, stage)
  values (new.owner_id, new.request_id, new.stage);
  return new;
end;
$$;

revoke all on function genyx_crm.enforce_stage() from public, anon, authenticated, service_role;
revoke all on function genyx_crm.append_lead_event() from public, anon, authenticated, service_role;

create trigger enforce_stage
  before update of stage on genyx_crm.leads
  for each row execute function genyx_crm.enforce_stage();
create trigger append_initial_event
  after insert on genyx_crm.leads
  for each row execute function genyx_crm.append_lead_event();
create trigger append_stage_event
  after update of stage on genyx_crm.leads
  for each row execute function genyx_crm.append_lead_event();

alter table genyx_crm.members enable row level security;
alter table genyx_crm.leads enable row level security;
alter table genyx_crm.lead_events enable row level security;

revoke all on all tables in schema genyx_crm from public, anon, authenticated, service_role;
revoke all on all sequences in schema genyx_crm from public, anon, authenticated, service_role;
grant select on genyx_crm.members, genyx_crm.leads, genyx_crm.lead_events to authenticated;
grant insert (request_id, locale, service, timeline) on genyx_crm.leads to authenticated;
grant update (stage) on genyx_crm.leads to authenticated;

create policy member_self_read on genyx_crm.members
  for select to authenticated using (user_id = (select auth.uid()));

create policy lead_owner_read on genyx_crm.leads
  for select to authenticated
  using (
    owner_id = (select auth.uid())
    and exists (select 1 from genyx_crm.members m where m.user_id = owner_id)
  );

create policy lead_operator_insert on genyx_crm.leads
  for insert to authenticated
  with check (
    owner_id = (select auth.uid()) and stage = 'new'
    and exists (
      select 1 from genyx_crm.members m where m.user_id = owner_id and m.role = 'operator'
    )
  );

create policy lead_operator_update on genyx_crm.leads
  for update to authenticated
  using (
    owner_id = (select auth.uid())
    and exists (
      select 1 from genyx_crm.members m where m.user_id = owner_id and m.role = 'operator'
    )
  )
  with check (
    owner_id = (select auth.uid())
    and exists (
      select 1 from genyx_crm.members m where m.user_id = owner_id and m.role = 'operator'
    )
  );

create policy event_owner_read on genyx_crm.lead_events
  for select to authenticated
  using (
    owner_id = (select auth.uid())
    and exists (select 1 from genyx_crm.members m where m.user_id = owner_id)
  );

commit;
