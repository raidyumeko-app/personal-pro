-- Isolated fixtures only. Every change, including time travel, is rolled back.
-- Regra de 11/11/2026: treino, ficha, histórico e PAR-Q do aluno são grátis para sempre;
-- só a nutrição extra (Personal Pro+, R$ 4,90/mês) depende de período gratuito ou assinatura.
begin;
insert into auth.users(id) values ('d4000000-0000-4000-8000-000000000001'),('d4000000-0000-4000-8000-000000000002'),('d4000000-0000-4000-8000-000000000003');
insert into public.pp_members(user_id,role,name,created_at) values
 ('d4000000-0000-4000-8000-000000000001','trainer','QA Trainer',now()-interval '31 days'),
 ('d4000000-0000-4000-8000-000000000002','student','QA Student',now()-interval '30 days'+interval '1 second'),
 ('d4000000-0000-4000-8000-000000000003','student','QA Other Student',now()-interval '10 days');
insert into public.personal_pro_accounts(user_id,profile,students) values('d4000000-0000-4000-8000-000000000001','{}','[{"id":"qa","name":"QA","planValue":0,"workout":[{"id":"ex","day":"A","name":"QA exercise","series":"1","repetitions":"10"}]}]');
insert into public.pp_links(trainer_id,student_user_id,legacy_student_id) values('d4000000-0000-4000-8000-000000000001','d4000000-0000-4000-8000-000000000002','qa');
set local role authenticated;
select set_config('request.jwt.claim.sub','d4000000-0000-4000-8000-000000000002',true);
do $$begin
 if public.pp_student_access()->>'status'<>'trial' or not (public.pp_student_access()->>'active')::boolean then raise exception 'FAIL: last trial second';end if;
 if public.pp_student_access()->>'adsAllowed'<>'false' then raise exception 'FAIL: student ads';end if;
 if (public.pp_student_access()->>'monthlyPriceBRL')::numeric<>4.90 then raise exception 'FAIL: Personal Pro+ price must be R$ 4,90';end if;
 if public.pp_student_access()->>'scope'<>'nutrition' then raise exception 'FAIL: paid scope must be nutrition only';end if;
 perform public.pp_start_session('d4000000-0000-4000-8000-000000000010','A');
 insert into public.pp_nutrition_entries(user_id,kind,text) values(auth.uid(),'meal','QA trial meal');
 insert into public.pp_nutrition_entries(user_id,kind,text) values(auth.uid(),'meal','QA meal to delete');
end $$;
-- Metadata-only storage fixtures: exercise RLS, never claim these are uploaded blobs.
insert into storage.objects(bucket_id,name) values('pp-nutrition',auth.uid()::text||'/isolated-qa.pdf');
do $$declare denied boolean=false;begin
 if (select count(*) from storage.objects where bucket_id='pp-nutrition')<>1 then raise exception 'FAIL: own file metadata hidden during trial';end if;
 begin insert into storage.objects(bucket_id,name) values('pp-nutrition','another-owner/isolated-qa.pdf');exception when insufficient_privilege then denied=true;end;
 if not denied then raise exception 'FAIL: cross-owner file path accepted';end if;
end $$;
reset role;
update public.pp_members set created_at=now()-interval '30 days' where user_id='d4000000-0000-4000-8000-000000000002';
set local role authenticated;
do $$declare denied boolean=false;d jsonb;s jsonb;begin
 if (public.pp_student_access()->>'active')::boolean then raise exception 'FAIL: exact boundary must end the nutrition trial';end if;
 if public.pp_student_access()->>'status'<>'expired' then raise exception 'FAIL: expired Plus status';end if;
 -- Área de treino continua livre depois dos 30 dias.
 d=public.pp_student_data();
 if d is null or d->'student'->'workout'->0->>'name'<>'QA exercise' then raise exception 'FAIL: workout sheet must stay free after 30 days';end if;
 s=public.pp_start_session(gen_random_uuid(),'A');
 if s->>'id'<>'d4000000-0000-4000-8000-000000000010' then raise exception 'FAIL: start must resume the open session after 30 days';end if;
 s=public.pp_save_session('d4000000-0000-4000-8000-000000000010',0,'[{"exerciseId":"ex-0","setNumber":1,"reps":10,"weightKg":20}]',true,'Na medida','');
 if s->>'completed_at' is null then raise exception 'FAIL: workout logging must stay free after 30 days';end if;
 if (select count(*) from public.pp_sessions_v2)<>1 then raise exception 'FAIL: history must stay readable after 30 days';end if;
 -- Nutrição: o que já foi salvo continua visível; gravar e enviar arquivos exige Personal Pro+;
 -- excluir o próprio registro é livre mesmo depois dos 30 dias.
 if (select count(*) from public.pp_nutrition_entries)<>2 then raise exception 'FAIL: saved nutrition must stay visible';end if;
 if (select count(*) from storage.objects where bucket_id='pp-nutrition')<>1 then raise exception 'FAIL: saved nutrition files must stay visible';end if;
 begin insert into public.pp_nutrition_entries(user_id,kind,text) values(auth.uid(),'meal','blocked');exception when insufficient_privilege then denied=true;end;
 if not denied then raise exception 'FAIL: expired nutrition write';end if;
 denied=false;begin update public.pp_nutrition_entries set text='changed' where user_id=auth.uid();
  if found then raise exception 'FAIL: expired nutrition update';end if;
 exception when insufficient_privilege then denied=true;end;
 if (select count(*) from public.pp_nutrition_entries where user_id=auth.uid() and text in ('QA trial meal','QA meal to delete'))<>2 then raise exception 'FAIL: expired nutrition update changed data';end if;
 denied=false;begin insert into public.pp_nutrition_settings(user_id) values(auth.uid());exception when insufficient_privilege then denied=true;end;
 if not denied then raise exception 'FAIL: expired nutrition settings write';end if;
 denied=false;begin insert into storage.objects(bucket_id,name) values('pp-nutrition',auth.uid()::text||'/after-expiry.jpg');exception when insufficient_privilege then denied=true;end;
 if not denied then raise exception 'FAIL: expired photo/PDF upload';end if;
 denied=false;begin update public.pp_members set created_at=now() where user_id=auth.uid();exception when insufficient_privilege then denied=true;end;
 if not denied then raise exception 'FAIL: trial can be reset by client';end if;
end $$;
-- Outro usuário e o personal vinculado não podem apagar os registros do aluno.
reset role;
set local role authenticated;
select set_config('request.jwt.claim.sub','d4000000-0000-4000-8000-000000000003',true);
delete from public.pp_nutrition_entries;
reset role;
do $$begin
 if (select count(*) from public.pp_nutrition_entries where user_id='d4000000-0000-4000-8000-000000000002')<>2 then raise exception 'FAIL: another user deleted student nutrition';end if;
end $$;
set local role authenticated;
select set_config('request.jwt.claim.sub','d4000000-0000-4000-8000-000000000001',true);
delete from public.pp_nutrition_entries;
reset role;
do $$begin
 if (select count(*) from public.pp_nutrition_entries where user_id='d4000000-0000-4000-8000-000000000002')<>2 then raise exception 'FAIL: linked trainer deleted student nutrition';end if;
end $$;
-- O próprio aluno, já fora do período gratuito e sem Plus, pode excluir o registro dele, mas não criar outro.
set local role authenticated;
select set_config('request.jwt.claim.sub','d4000000-0000-4000-8000-000000000002',true);
do $$declare denied boolean=false;begin
 delete from public.pp_nutrition_entries where text='QA meal to delete';
 if exists(select 1 from public.pp_nutrition_entries where text='QA meal to delete') then raise exception 'FAIL: expired student must be able to delete own nutrition entry';end if;
 if (select count(*) from public.pp_nutrition_entries)<>1 then raise exception 'FAIL: expired student delete removed the wrong rows';end if;
 begin insert into public.pp_nutrition_entries(user_id,kind,text) values(auth.uid(),'meal','blocked after delete');exception when insufficient_privilege then denied=true;end;
 if not denied then raise exception 'FAIL: expired nutrition write after delete';end if;
end $$;
-- Assinatura confirmada pelo servidor reabre a nutrição extra.
reset role;
insert into public.pp_entitlements(user_id,product,valid_until) values('d4000000-0000-4000-8000-000000000002','personal_pro_plus',now()+interval '30 days');
set local role authenticated;
do $$begin
 if public.pp_student_access()->>'status'<>'paid' or not (public.pp_student_access()->>'active')::boolean then raise exception 'FAIL: paid Plus status';end if;
 insert into public.pp_nutrition_entries(user_id,kind,amount_ml) values(auth.uid(),'water',250);
end $$;
select set_config('request.jwt.claim.sub','d4000000-0000-4000-8000-000000000001',true);
select public.pp_choose_free();
do $$begin
 if not (select free_with_ads from public.pp_members where user_id=auth.uid()) then raise exception 'FAIL: trainer ads option';end if;
 if (select count(*) from public.pp_sessions_v2)<>1 then raise exception 'FAIL: trainer loses student history';end if;
 if exists(select 1 from public.pp_nutrition_entries) then raise exception 'FAIL: trainer nutrition privacy';end if;
 if exists(select 1 from storage.objects where bucket_id='pp-nutrition') then raise exception 'FAIL: trainer private files access';end if;
end $$;
reset role;
do $$begin
 if (select count(*) from public.pp_nutrition_entries where user_id='d4000000-0000-4000-8000-000000000002')<>2 then raise exception 'FAIL: student data erased';end if;
end $$;
select 'PASS: workout, sheet, logging and history free after 30 days; nutrition trial boundary; saved nutrition visible; writes/uploads need Personal Pro+ (R$ 4,90); own entry delete is free after 30 days; other user and linked trainer cannot delete; no client trial reset; trainer ads and privacy' as result;
rollback;
