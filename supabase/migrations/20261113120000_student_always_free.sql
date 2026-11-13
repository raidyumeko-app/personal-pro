-- Student portal is free forever. No trial expiry, no student subscription.
-- Overrides the previous 30-day trial + R$9.90 logic.
begin;

create or replace function pp_private.student_access() returns jsonb
language plpgsql stable security definer set search_path='' as $$
declare m public.pp_members;
begin
  select * into m from public.pp_members where user_id=auth.uid() and role='student';
  if not found then raise exception 'Conta de aluno necessária'; end if;
  return jsonb_build_object(
    'active', true,
    'status', 'free',
    'trialUntil', null,
    'expiresAt', null,
    'serverNow', now(),
    'monthlyPriceBRL', 0,
    'adsAllowed', false
  );
end $$;

create or replace function pp_private.student_allowed() returns boolean
language sql stable security definer set search_path='' as $$
  select exists(select 1 from public.pp_members where user_id=auth.uid() and role='student')
$$;

-- Keep the public wrapper
create or replace function public.pp_student_access() returns jsonb
language sql stable security invoker set search_path='' as $$
  select pp_private.student_access()
$$;

notify pgrst, 'reload schema';
commit;
