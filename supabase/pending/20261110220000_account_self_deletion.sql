-- LGPD (art. 18, VI): exclusão da própria conta pelo titular.
-- PENDENTE DE APROVAÇÃO: este arquivo NÃO foi aplicado no Supabase.
-- Fica em supabase/pending/ (fora de supabase/migrations/) para nenhuma integração aplicar sozinha.
-- Para aplicar depois da aprovação: mover para supabase/migrations/ e rodar supabase db push.
--
-- Uso pelo app (cloud.js > deleteAccount):
--   1. rpc pp_delete_my_account(dry_run => true)  -> mostra o que será apagado;
--   2. o app apaga os arquivos do usuário no bucket pp-nutrition pela Storage API
--      (a política pp_nutrition_files_delete já permite isso ao dono);
--   3. rpc pp_delete_my_account(dry_run => false) -> apaga os dados e o usuário.
-- A função recusa a exclusão se ainda houver arquivos no Storage, para não
-- deixar arquivos órfãos (o Supabase não permite apagar storage.objects por SQL).
--
-- Antes de aplicar, decidir com o jurídico se pp_private.purchase_receipts
-- precisa ser mantido por obrigação fiscal; aqui os recibos são anonimizados
-- por remoção, porque a chave estrangeira impede manter o membro.

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

  summary := jsonb_build_object(
    'role', (select role from public.pp_members where user_id = me),
    'student_links_as_trainer', coalesce(array_length(trainer_links, 1), 0),
    'sessions', (select count(*) from public.pp_sessions_v2 where student_user_id = me or link_id = any(trainer_links)),
    'parq_responses', (select count(*) from public.pp_parq_responses where student_user_id = me or link_id = any(trainer_links)),
    'nutrition_entries', (select count(*) from public.pp_nutrition_entries where user_id = me),
    'storage_files', files_left
  );

  if dry_run then
    return summary || jsonb_build_object('deleted', false);
  end if;

  if files_left > 0 then
    raise exception 'storage_files_pending' using errcode = 'P0001',
      hint = 'Apague os arquivos do bucket pp-nutrition antes de excluir a conta.';
  end if;

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
  delete from pp_private.purchase_receipts where user_id = me;
  delete from public.personal_pro_accounts where user_id = me;
  delete from public.pp_members where user_id = me;
  delete from auth.users where id = me; -- remove identidades e sessões em cascata

  return summary || jsonb_build_object('deleted', true);
end;
$$;

revoke all on function public.pp_delete_my_account(boolean) from public, anon;
grant execute on function public.pp_delete_my_account(boolean) to authenticated;
