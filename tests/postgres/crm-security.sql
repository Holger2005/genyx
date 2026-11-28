-- Isolated SQL authorization and transition checks. All fixtures are synthetic.
begin;

insert into auth.users(id) values
  ('00000000-0000-4000-8000-000000000001'),
  ('00000000-0000-4000-8000-000000000002'),
  ('00000000-0000-4000-8000-000000000003'),
  ('00000000-0000-4000-8000-000000000004');

insert into genyx_crm.members(user_id, role) values
  ('00000000-0000-4000-8000-000000000001', 'operator'),
  ('00000000-0000-4000-8000-000000000002', 'operator'),
  ('00000000-0000-4000-8000-000000000003', 'viewer');

-- Owner-managed membership; a viewer's preassigned example.
insert into genyx_crm.leads(owner_id, request_id, locale, service, timeline)
values ('00000000-0000-4000-8000-000000000003', 'genyx-test-viewer', 'es', 'web', 'exploring');

set local role anon;
do $$
begin
  begin
    perform 1 from genyx_crm.leads;
    raise exception 'anon unexpectedly read leads';
  exception when insufficient_privilege then null;
  end;
end $$;
reset role;

set local role service_role;
do $$
begin
  begin
    perform 1 from genyx_crm.leads;
    raise exception 'service_role unexpectedly has schema access';
  exception when insufficient_privilege then null;
  end;
end $$;
reset role;

set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);
insert into genyx_crm.leads(request_id, locale, service, timeline)
values ('genyx-test-alpha', 'es', 'automation', 'urgent');
do $$
begin
  if (select count(*) from genyx_crm.members) <> 1 then
    raise exception 'membership visibility failed';
  end if;
  if (select count(*) from genyx_crm.leads) <> 1 then
    raise exception 'lead visibility failed';
  end if;
  if (select priority from genyx_crm.leads where request_id = 'genyx-test-alpha') <> 'high' then
    raise exception 'priority failed';
  end if;
  if (select count(*) from genyx_crm.lead_events) <> 1 then
    raise exception 'initial audit failed';
  end if;
  begin
    insert into genyx_crm.leads(request_id, locale, service, timeline)
    values ('genyx-test-alpha', 'es', 'automation', 'urgent');
    raise exception 'duplicate accepted';
  exception when unique_violation then null;
  end;
  begin
    insert into genyx_crm.leads(request_id, locale, service, timeline)
    values ('real-customer', 'es', 'web', 'urgent');
    raise exception 'non-synthetic ID accepted';
  exception when check_violation then null;
  end;
  begin
    update genyx_crm.leads set stage = 'won';
    raise exception 'stage skipped';
  exception when check_violation then null;
  end;
  begin
    update genyx_crm.leads set owner_id = '00000000-0000-4000-8000-000000000002';
    raise exception 'owner reassigned';
  exception when insufficient_privilege then null;
  end;
  begin
    update genyx_crm.members set role = 'viewer';
    raise exception 'membership modified';
  exception when insufficient_privilege then null;
  end;
  begin
    delete from genyx_crm.leads;
    raise exception 'lead deleted';
  exception when insufficient_privilege then null;
  end;
  begin
    delete from genyx_crm.lead_events;
    raise exception 'audit deleted';
  exception when insufficient_privilege then null;
  end;
  begin
    insert into genyx_crm.lead_events(owner_id, request_id, stage)
    values ('00000000-0000-4000-8000-000000000001', 'genyx-test-alpha', 'won');
    raise exception 'forged event';
  exception when insufficient_privilege then null;
  end;
end $$;

update genyx_crm.leads set stage = 'contacted' where stage = 'new';
update genyx_crm.leads set stage = 'consultation' where stage = 'contacted';
update genyx_crm.leads set stage = 'proposal' where stage = 'consultation';
update genyx_crm.leads set stage = 'won' where stage = 'proposal';
do $$
begin
  if (select array_agg(stage order by sequence) from genyx_crm.lead_events)
      <> array['new', 'contacted', 'consultation', 'proposal', 'won'] then
    raise exception 'audit sequence failed';
  end if;
  begin
    update genyx_crm.leads set stage = 'lost';
    raise exception 'terminal lead changed';
  exception when check_violation then null;
  end;
end $$;

select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000002', true);
do $$
begin
  if exists (select 1 from genyx_crm.leads) or exists (select 1 from genyx_crm.lead_events) then
    raise exception 'cross-owner disclosure';
  end if;
  update genyx_crm.leads set stage = 'lost' where request_id = 'genyx-test-alpha';
  if found then raise exception 'cross-owner mutation'; end if;
end $$;
insert into genyx_crm.leads(request_id, locale, service, timeline)
values ('genyx-test-alpha', 'en', 'web', 'one-to-three');
update genyx_crm.leads set stage = 'lost';
do $$
begin
  if (select priority from genyx_crm.leads) <> 'normal'
    or (select count(*) from genyx_crm.lead_events) <> 2 then
    raise exception 'independent operator or lost history failed';
  end if;
end $$;

select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000003', true);
do $$
begin
  if (select count(*) from genyx_crm.leads) <> 1
    or (select priority from genyx_crm.leads) <> 'low' then
    raise exception 'viewer read failed';
  end if;
  update genyx_crm.leads set stage = 'lost';
  if found then raise exception 'viewer modified lead'; end if;
  begin
    insert into genyx_crm.leads(request_id, locale, service, timeline)
    values ('genyx-test-forbidden', 'es', 'web', 'urgent');
    raise exception 'viewer inserted lead';
  exception when insufficient_privilege then null;
  end;
end $$;

select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000004', true);
do $$
begin
  if exists (select 1 from genyx_crm.members)
    or exists (select 1 from genyx_crm.leads)
    or exists (select 1 from genyx_crm.lead_events) then
    raise exception 'nonmember disclosure';
  end if;
  begin
    insert into genyx_crm.leads(request_id, locale, service, timeline)
    values ('genyx-test-unapproved', 'es', 'web', 'urgent');
    raise exception 'unapproved user inserted lead';
  exception when insufficient_privilege then null;
  end;
end $$;

reset role;
rollback;
select 'GENYX PostgreSQL authorization and history checks passed' as result;
