-- LGPD (art. 18, VI): exclusão da própria conta pelo titular.
-- Decisão de 11/11/2026 (Wagner): apaga tudo do usuário, mas GUARDA os recibos de compra
-- (pp_private.purchase_receipts) por obrigação legal/fiscal, desvinculados da pessoa:
-- user_id vira NULL e ficam só o identificador da compra (hash do token da Google Play),
-- o produto e as datas do ciclo. O recibo anônimo continua bloqueando reuso do mesmo token.
-- pp_entitlements (acesso liberado) não é necessário para o recibo e é apagado.
--
-- Uso pelo app (cloud.js > deleteAccount):
--   1. rpc pp_delete_my_account(dry_run => true)  -> mostra o que será apagado;
--   2. o app apaga os arquivos do usuário no bucket pp-nutrition pela Storage API
--      (a política pp_nutrition_files_delete permite isso ao dono);
--   3. rpc pp_delete_my_account(dry_run => false) -> apaga os dados e o usuário.
-- A função recusa a exclusão se ainda houver arquivos no Storage, para não
-- deixar arquivos órfãos (o Supabase não permite apagar storage.objects por SQL).

-- Recibos podem existir sem titular depois da exclusão da conta.
alter table pp_private.purchase_receipts alter column user_id drop not null;
alter table pp_private.purchase_receipts drop constraint if exists purchase_receipts_user_id_fkey;
alter table pp_private.purchase_receipts
  add constraint purchase_receipts_user_id_fkey foreign key (user_id)
  references public.pp_members(user_id) on delete set null;

create or replace function public.pp_delete_my_account(dry_run boolean default true)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  me uuid := (select auth.uid());
  trainer_links uuid[];
  files_left int;
  receipts_kept int;
  summary jsonb;
begin
  if me is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;

  select coalesce(array_agg(id), '{}') into trainer_links
    from public.pp_links where trainer_id = me;

  select count(*) into files_left
    from storage.objects
   where bucket_id = 'pp-nutrition' and (storage.foldername(name))[1] = me::text;

  select count(*) into receipts_kept from pp_private.purchase_receipts where user_id = me;

  summary := jsonb_build_object(
    'role', (select role from public.pp_members where user_id = me),
    'student_links_as_trainer', coalesce(array_length(trainer_links, 1), 0),
    'sessions', (select count(*) from public.pp_sessions_v2 where student_user_id = me or link_id = any(trainer_links)),
    'parq_responses', (select count(*) from public.pp_parq_responses where student_user_id = me or link_id = any(trainer_links)),
    'nutrition_entries', (select count(*) from public.pp_nutrition_entries where user_id = me),
    'storage_files', files_left,
    'purchase_receipts_kept_anonymized', receipts_kept
  );

  if dry_run then
    return summary || jsonb_build_object('deleted', false);
  end if;

  if files_left > 0 then
    raise exception 'storage_files_pending' using errcode = 'P0001',
      hint = 'Apague os arquivos do bucket pp-nutrition antes de excluir a conta.';
  end if;

  -- Recibos: ficam guardados, sem vínculo com a pessoa.
  update pp_private.purchase_receipts set user_id = null where user_id = me;

  -- Revisões de PAR-Q feitas por este usuário em vínculos que continuam existindo.
  update public.pp_parq_responses set reviewed_by = null, reviewed_at = null, review_note = null
   where reviewed_by = me and not (link_id = any(trainer_links));

  -- Como aluno: apaga o próprio histórico e solta o vínculo do personal.
  delete from public.pp_sessions_v2 where student_user_id = me;
  delete from public.pp_parq_responses where student_user_id = me;
  update pp_private.invites set used_by = null where used_by = me;
  update public.pp_links set student_user_id = null where student_user_id = me;

  -- Como personal: apaga os vínculos com alunos e o que depende deles.
  delete from public.pp_sessions_v2 where link_id = any(trainer_links);
  delete from public.pp_parq_responses where link_id = any(trainer_links);
  delete from pp_private.invites where link_id = any(trainer_links);
  delete from public.pp_links where id = any(trainer_links);

  delete from public.pp_nutrition_entries where user_id = me;
  delete from public.pp_nutrition_settings where user_id = me;
  delete from public.pp_referrals where referred_id = me or referrer_id = me;
  delete from public.pp_entitlements where user_id = me;
  delete from public.personal_pro_accounts where user_id = me;
  -- Cópia de segurança antiga da migração de 19/10 também tem dados da conta.
  if to_regclass('pp_private.account_backup_20261019') is not null then
    execute 'delete from pp_private.account_backup_20261019 where user_id = $1' using me;
  end if;
  delete from public.pp_members where user_id = me;
  delete from auth.users where id = me; -- remove identidades e sessões em cascata

  return summary || jsonb_build_object('deleted', true);
end;
$$;

revoke all on function public.pp_delete_my_account(boolean) from public, anon;
grant execute on function public.pp_delete_my_account(boolean) to authenticated;
