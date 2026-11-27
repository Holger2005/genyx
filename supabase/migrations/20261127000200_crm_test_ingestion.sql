-- Idempotent synthetic-only ingestion. Not an exposed public RPC.
begin;

create function genyx_crm.record_test_lead(
  p_request_id text,
  p_locale text,
  p_service text,
  p_timeline text
)
returns genyx_crm.leads
language plpgsql
security invoker
set search_path = ''
as $$
declare
  result genyx_crm.leads%rowtype;
begin
  if not exists (
    select 1 from genyx_crm.members m
    where m.user_id = (select auth.uid()) and m.role = 'operator'
  ) then
    raise exception 'Operator membership required' using errcode = '42501';
  end if;

  insert into genyx_crm.leads(request_id, locale, service, timeline)
  values (p_request_id, p_locale, p_service, p_timeline)
  on conflict (owner_id, request_id) do nothing;

  select l.* into strict result
  from genyx_crm.leads l
  where l.owner_id = (select auth.uid()) and l.request_id = p_request_id;

  if result.locale is distinct from p_locale
    or result.service is distinct from p_service
    or result.timeline is distinct from p_timeline then
    raise exception 'Conflicting synthetic request ID' using errcode = '23505';
  end if;

  return result;
end;
$$;

revoke all on function genyx_crm.record_test_lead(text, text, text, text)
  from public, anon, authenticated, service_role;
grant execute on function genyx_crm.record_test_lead(text, text, text, text)
  to authenticated;

commit;
