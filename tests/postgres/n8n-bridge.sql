-- Disposable integration check; input is the validated synthetic fixture.
-- Never run this test against a hosted database.
begin;

insert into auth.users(id) values
  ('00000000-0000-4000-8000-000000000011'),
  ('00000000-0000-4000-8000-000000000012'),
  ('00000000-0000-4000-8000-000000000013'),
  ('00000000-0000-4000-8000-000000000014');

insert into genyx_crm.members(user_id, role) values
  ('00000000-0000-4000-8000-000000000011', 'operator'),
  ('00000000-0000-4000-8000-000000000012', 'operator'),
  ('00000000-0000-4000-8000-000000000013', 'viewer');

select set_config('genyx.test.request_id', :'request_id', true);
select set_config('genyx.test.locale', :'locale', true);
select set_config('genyx.test.service', :'service', true);
select set_config('genyx.test.timeline', :'timeline', true);
select set_config('genyx.test.priority', :'priority', true);

set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000011', true);

do $$
declare
  first_lead genyx_crm.leads%rowtype;
  replayed genyx_crm.leads%rowtype;
  req text := current_setting('genyx.test.request_id');
  loc text := current_setting('genyx.test.locale');
  svc text := current_setting('genyx.test.service');
  tl text := current_setting('genyx.test.timeline');
begin
  first_lead := genyx_crm.record_test_lead(req, loc, svc, tl);
  if first_lead.stage is distinct from 'new'
    or first_lead.priority is distinct from current_setting('genyx.test.priority')
    or first_lead.owner_id is distinct from auth.uid() then
    raise exception 'Initial verified ingestion failed';
  end if;

  update genyx_crm.leads set stage = 'contacted' where request_id = req and stage = 'new';
  if not found then raise exception 'Expected stage change'; end if;

  replayed := genyx_crm.record_test_lead(req, loc, svc, tl);
  if replayed.stage is distinct from 'contacted'
    or replayed.created_at is distinct from first_lead.created_at
    or (select count(*) from genyx_crm.leads) <> 1
    or (select array_agg(stage order by sequence) from genyx_crm.lead_events)
      is distinct from array['new', 'contacted'] then
    raise exception 'Replay duplicated or reset lead';
  end if;

  begin
    perform genyx_crm.record_test_lead(
      req, loc, case svc when 'web' then 'automation' else 'web' end, tl
    );
    raise exception 'Conflicting replay accepted';
  exception when unique_violation then null;
  end;

  begin
    perform genyx_crm.record_test_lead('real-customer', loc, svc, tl);
    raise exception 'Non-synthetic input accepted';
  exception when check_violation then null;
  end;

  if (select count(*) from genyx_crm.leads) <> 1
    or (select count(*) from genyx_crm.lead_events) <> 2 then
    raise exception 'Rejected request changed storage';
  end if;
end $$;

select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000012', true);
do $$
declare
  own_lead genyx_crm.leads%rowtype;
begin
  if exists (select 1 from genyx_crm.leads) then
    raise exception 'Cross-owner read';
  end if;
  own_lead := genyx_crm.record_test_lead(
    current_setting('genyx.test.request_id'),
    current_setting('genyx.test.locale'),
    current_setting('genyx.test.service'),
    current_setting('genyx.test.timeline')
  );
  if own_lead.owner_id is distinct from auth.uid()
    or own_lead.stage is distinct from 'new'
    or (select count(*) from genyx_crm.lead_events) <> 1 then
    raise exception 'Owner scope failed';
  end if;
end $$;

select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000013', true);
do $$
begin
  begin
    perform genyx_crm.record_test_lead('genyx-test-viewer', 'es', 'web', 'urgent');
    raise exception 'Viewer ingested';
  exception when insufficient_privilege then null;
  end;
end $$;

select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000014', true);
do $$
begin
  begin
    perform genyx_crm.record_test_lead('genyx-test-nonmember', 'es', 'web', 'urgent');
    raise exception 'Nonmember ingested';
  exception when insufficient_privilege then null;
  end;
end $$;
reset role;

set local role anon;
do $$
begin
  begin
    perform genyx_crm.record_test_lead('genyx-test-anon', 'es', 'web', 'urgent');
    raise exception 'Anonymous ingestion';
  exception when insufficient_privilege then null;
  end;
end $$;
reset role;

set local role service_role;
do $$
begin
  begin
    perform genyx_crm.record_test_lead('genyx-test-service', 'es', 'web', 'urgent');
    raise exception 'Service role ingestion';
  exception when insufficient_privilege then null;
  end;
end $$;
reset role;

rollback;
select 'GENYX n8n PostgreSQL ingestion and replay checks passed' as result;
