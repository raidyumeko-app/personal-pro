-- Exclusão da própria conta (LGPD): apaga tudo do titular e guarda os recibos de compra anonimizados.
-- Fixtures isoladas; tudo é desfeito no rollback.
begin;
insert into auth.users(id) values
 ('e6000000-0000-4000-8000-000000000001'),('e6000000-0000-4000-8000-000000000002'),('e6000000-0000-4000-8000-000000000003'),
 ('e6000000-0000-4000-8000-000000000004'),('e6000000-0000-4000-8000-000000000005');
insert into public.pp_members(user_id,role,name) values
 ('e6000000-0000-4000-8000-000000000001','trainer','QA Trainer One'),('e6000000-0000-4000-8000-000000000002','student','QA Student One'),
 ('e6000000-0000-4000-8000-000000000003','trainer','QA Trainer Two'),('e6000000-0000-4000-8000-000000000004','student','QA Student Two'),
 ('e6000000-0000-4000-8000-000000000005','student','QA Student Lone');
insert into public.personal_pro_accounts(user_id,profile,students) values
 ('e6000000-0000-4000-8000-000000000001','{}','[{"id":"s1","name":"QA S1","workout":[{"id":"ex","day":"A","name":"QA exercise","series":"1","repetitions":"10"}]}]'),
 ('e6000000-0000-4000-8000-000000000003','{}','[{"id":"s2","name":"QA S2","workout":[{"id":"ex","day":"A","name":"QA exercise","series":"1","repetitions":"10"}]}]');
insert into public.pp_links(id,trainer_id,student_user_id,legacy_student_id) values
 ('e6000000-0000-4000-8000-0000000000a1','e6000000-0000-4000-8000-000000000001','e6000000-0000-4000-8000-000000000002','s1'),
 ('e6000000-0000-4000-8000-0000000000a2','e6000000-0000-4000-8000-000000000003','e6000000-0000-4000-8000-000000000004','s2');
insert into public.pp_sessions_v2(id,link_id,student_user_id,day,prescription) values
 ('e6000000-0000-4000-8000-0000000000b1','e6000000-0000-4000-8000-0000000000a1','e6000000-0000-4000-8000-000000000002','A','[]'),
 ('e6000000-0000-4000-8000-0000000000b2','e6000000-0000-4000-8000-0000000000a2','e6000000-0000-4000-8000-000000000004','A','[]');
insert into public.pp_parq_responses(id,link_id,student_user_id,respondent_name,questionnaire,answers,reviewed_at,reviewed_by) values
 ('e6000000-0000-4000-8000-0000000000c1','e6000000-0000-4000-8000-0000000000a1','e6000000-0000-4000-8000-000000000002','QA S1','{}','[false,false,false,false,false,false,false]',now(),'e6000000-0000-4000-8000-000000000001'),
 ('e6000000-0000-4000-8000-0000000000c2','e6000000-0000-4000-8000-0000000000a2','e6000000-0000-4000-8000-000000000004','QA S2','{}','[false,false,false,false,false,false,false]',null,null);
insert into public.pp_nutrition_entries(user_id,kind,text) values('e6000000-0000-4000-8000-000000000002','meal','QA S1 meal'),('e6000000-0000-4000-8000-000000000004','meal','QA S2 meal');
insert into public.pp_nutrition_settings(user_id) values('e6000000-0000-4000-8000-000000000002'),('e6000000-0000-4000-8000-000000000004');
insert into public.pp_referrals(referred_id,referrer_id) values('e6000000-0000-4000-8000-000000000001','e6000000-0000-4000-8000-000000000003');
insert into public.pp_entitlements(user_id,product,valid_until) values
 ('e6000000-0000-4000-8000-000000000001','trainer',now()+interval '20 days'),('e6000000-0000-4000-8000-000000000002','personal_pro_plus',now()+interval '20 days'),
 ('e6000000-0000-4000-8000-000000000003','trainer',now()+interval '20 days');
insert into pp_private.purchase_receipts(purchase_token_hash,user_id,product,cycle_start,cycle_end) values
 (repeat('1',64),'e6000000-0000-4000-8000-000000000001','trainer',now()-interval '10 days',now()+interval '20 days'),
 (repeat('2',64),'e6000000-0000-4000-8000-000000000002','personal_pro_plus',now()-interval '10 days',now()+interval '20 days'),
 (repeat('3',64),'e6000000-0000-4000-8000-000000000003','trainer',now()-interval '10 days',now()+interval '20 days');
insert into pp_private.account_backup_20261019 select *, now() from public.personal_pro_accounts where user_id='e6000000-0000-4000-8000-000000000001';
insert into storage.buckets(id,name,public) values('pp-nutrition','pp-nutrition',false) on conflict do nothing;
insert into storage.objects(bucket_id,name) values('pp-nutrition','e6000000-0000-4000-8000-000000000002/meal.jpg');

-- Sem login não executa; anon nem tem permissão.
set local role anon;
do $$declare denied boolean=false;begin
 begin perform public.pp_delete_my_account(false);exception when insufficient_privilege then denied=true;end;
 if not denied then raise exception 'FAIL: anon executed account deletion';end if;
end $$;
reset role;
set local role authenticated;
select set_config('request.jwt.claim.sub','',true);
do $$declare denied boolean=false;begin
 begin perform public.pp_delete_my_account(false);exception when sqlstate '28000' then denied=true;end;
 if not denied then raise exception 'FAIL: unauthenticated deletion';end if;
end $$;

-- Aluno com recibo e arquivo no Storage.
select set_config('request.jwt.claim.sub','e6000000-0000-4000-8000-000000000002',true);
do $$declare r jsonb;blocked boolean=false;begin
 r=public.pp_delete_my_account(true);
 if (r->>'deleted')::boolean or (r->>'purchase_receipts_kept_anonymized')::int<>1 or (r->>'storage_files')::int<>1 then raise exception 'FAIL: dry run summary %',r;end if;
 begin perform public.pp_delete_my_account(false);exception when others then blocked = sqlerrm='storage_files_pending';end;
 if not blocked then raise exception 'FAIL: deletion must wait for storage files';end if;
end $$;
reset role;
delete from storage.objects where name like 'e6000000-0000-4000-8000-000000000002/%'; -- o app apaga pela Storage API
set local role authenticated;
select set_config('request.jwt.claim.sub','e6000000-0000-4000-8000-000000000002',true);
do $$declare r jsonb;begin r=public.pp_delete_my_account(false);if not (r->>'deleted')::boolean then raise exception 'FAIL: student not deleted';end if;end $$;
reset role;
do $$declare me uuid='e6000000-0000-4000-8000-000000000002';begin
 if exists(select 1 from auth.users where id=me) or exists(select 1 from public.pp_members where user_id=me) then raise exception 'FAIL: student identity remains';end if;
 if exists(select 1 from public.pp_sessions_v2 where student_user_id=me) or exists(select 1 from public.pp_parq_responses where student_user_id=me) then raise exception 'FAIL: student history remains';end if;
 if exists(select 1 from public.pp_nutrition_entries where user_id=me) or exists(select 1 from public.pp_nutrition_settings where user_id=me) or exists(select 1 from public.pp_entitlements where user_id=me) then raise exception 'FAIL: student nutrition/entitlement remains';end if;
 if (select student_user_id from public.pp_links where id='e6000000-0000-4000-8000-0000000000a1') is not null then raise exception 'FAIL: trainer link still points to deleted student';end if;
 if not exists(select 1 from pp_private.purchase_receipts where purchase_token_hash=repeat('2',64) and user_id is null and product='personal_pro_plus' and cycle_start is not null and cycle_end is not null) then raise exception 'FAIL: student receipt must stay anonymized';end if;
 if not exists(select 1 from public.personal_pro_accounts where user_id='e6000000-0000-4000-8000-000000000001') then raise exception 'FAIL: trainer account touched by student deletion';end if;
end $$;

-- Personal com recibo, indicação e aluno vinculado já sem conta.
set local role authenticated;
select set_config('request.jwt.claim.sub','e6000000-0000-4000-8000-000000000001',true);
do $$declare r jsonb;begin r=public.pp_delete_my_account(false);if not (r->>'deleted')::boolean then raise exception 'FAIL: trainer not deleted';end if;end $$;
reset role;
do $$declare me uuid='e6000000-0000-4000-8000-000000000001';begin
 if exists(select 1 from auth.users where id=me) or exists(select 1 from public.pp_members where user_id=me) or exists(select 1 from public.personal_pro_accounts where user_id=me) then raise exception 'FAIL: trainer identity/account remains';end if;
 if exists(select 1 from pp_private.account_backup_20261019 where user_id=me) then raise exception 'FAIL: backup copy remains';end if;
 if exists(select 1 from public.pp_links where trainer_id=me) or exists(select 1 from public.pp_sessions_v2 where link_id='e6000000-0000-4000-8000-0000000000a1') or exists(select 1 from public.pp_parq_responses where link_id='e6000000-0000-4000-8000-0000000000a1') then raise exception 'FAIL: trainer links remain';end if;
 if exists(select 1 from public.pp_entitlements where user_id=me) or exists(select 1 from public.pp_referrals where referred_id=me or referrer_id=me) then raise exception 'FAIL: trainer entitlement/referral remains';end if;
 if not exists(select 1 from pp_private.purchase_receipts where purchase_token_hash=repeat('1',64) and user_id is null and product='trainer') then raise exception 'FAIL: trainer receipt must stay anonymized';end if;
end $$;

-- Aluno sem recibo nem vínculo.
set local role authenticated;
select set_config('request.jwt.claim.sub','e6000000-0000-4000-8000-000000000005',true);
do $$declare r jsonb;begin r=public.pp_delete_my_account(false);if not (r->>'deleted')::boolean or (r->>'purchase_receipts_kept_anonymized')::int<>0 then raise exception 'FAIL: lone student %',r;end if;end $$;
reset role;

-- Outros usuários intactos; recibo anônimo não pode ser reaproveitado.
do $$declare blocked boolean=false;begin
 if exists(select 1 from auth.users where id='e6000000-0000-4000-8000-000000000005') then raise exception 'FAIL: lone student remains';end if;
 if (select count(*) from auth.users where id in ('e6000000-0000-4000-8000-000000000003','e6000000-0000-4000-8000-000000000004'))<>2 then raise exception 'FAIL: other users deleted';end if;
 if not exists(select 1 from public.pp_links where id='e6000000-0000-4000-8000-0000000000a2' and student_user_id='e6000000-0000-4000-8000-000000000004') then raise exception 'FAIL: other link changed';end if;
 if (select count(*) from public.pp_sessions_v2 where student_user_id='e6000000-0000-4000-8000-000000000004')<>1 or (select count(*) from public.pp_parq_responses where student_user_id='e6000000-0000-4000-8000-000000000004')<>1 then raise exception 'FAIL: other history changed';end if;
 if (select count(*) from public.pp_nutrition_entries where user_id='e6000000-0000-4000-8000-000000000004')<>1 then raise exception 'FAIL: other nutrition changed';end if;
 if not exists(select 1 from pp_private.purchase_receipts where purchase_token_hash=repeat('3',64) and user_id='e6000000-0000-4000-8000-000000000003') or not exists(select 1 from public.pp_entitlements where user_id='e6000000-0000-4000-8000-000000000003') then raise exception 'FAIL: other receipt/entitlement changed';end if;
 if (select count(*) from pp_private.purchase_receipts where purchase_token_hash in (repeat('1',64),repeat('2',64),repeat('3',64)))<>3 then raise exception 'FAIL: receipts lost';end if;
 perform set_config('request.jwt.claims','{"role":"service_role"}',true);
 begin perform pp_private.record_verified_purchase('e6000000-0000-4000-8000-000000000003','trainer',repeat('1',64),now(),now()+interval '30 days');exception when others then blocked = sqlerrm like 'Compra já vinculada%';end;
 if not blocked then raise exception 'FAIL: anonymized receipt token was reused';end if;
end $$;
select 'PASS: anon/unauthenticated denied; storage files block; student and trainer (with receipts) and lone student (without) fully deleted incl. auth user, links, sessions, PAR-Q, nutrition, entitlements, referrals, backup copy; receipts kept anonymized (user_id null, product and cycle dates); token cannot be reused; other users untouched' as result;
rollback;
