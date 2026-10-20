-- Isolated fixtures only. Every change, including time travel, is rolled back.
begin;
insert into auth.users(id) values ('d4000000-0000-4000-8000-000000000001'),('d4000000-0000-4000-8000-000000000002');
insert into public.pp_members(user_id,role,name,created_at) values
 ('d4000000-0000-4000-8000-000000000001','trainer','QA Trainer',now()-interval '31 days'),
 ('d4000000-0000-4000-8000-000000000002','student','QA Student',now()-interval '30 days'+interval '1 second');
insert into public.personal_pro_accounts(user_id,profile,students) values('d4000000-0000-4000-8000-000000000001','{}','[{"id":"qa","name":"QA","planValue":0,"workout":[{"id":"ex","day":"A","name":"QA exercise","series":"1","repetitions":"10"}]}]');
insert into public.pp_links(trainer_id,student_user_id,legacy_student_id) values('d4000000-0000-4000-8000-000000000001','d4000000-0000-4000-8000-000000000002','qa');
set local role authenticated;
select set_config('request.jwt.claim.sub','d4000000-0000-4000-8000-000000000002',true);
do $$begin
 if public.pp_student_access()->>'status'<>'trial' or not (public.pp_student_access()->>'active')::boolean then raise exception 'FAIL: last trial second';end if;
 if public.pp_student_access()->>'adsAllowed'<>'false' then raise exception 'FAIL: student ads';end if;
 perform public.pp_start_session('d4000000-0000-4000-8000-000000000010','A');
 insert into public.pp_nutrition_entries(user_id,kind,text) values(auth.uid(),'meal','QA trial meal');
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
do $$declare denied boolean=false;begin
 if (public.pp_student_access()->>'active')::boolean then raise exception 'FAIL: exact boundary not blocked';end if;
 begin perform public.pp_student_data();exception when insufficient_privilege then denied=true;end;
 if not denied then raise exception 'FAIL: expired projection';end if;
 denied=false;begin perform public.pp_start_session(gen_random_uuid(),'A');exception when insufficient_privilege then denied=true;end;
 if not denied then raise exception 'FAIL: expired start';end if;
 denied=false;begin perform public.pp_save_session('d4000000-0000-4000-8000-000000000010',0,'[]',false,null,'');exception when insufficient_privilege then denied=true;end;
 if not denied then raise exception 'FAIL: expired save';end if;
 if exists(select 1 from public.pp_sessions_v2) or exists(select 1 from public.pp_nutrition_entries) then raise exception 'FAIL: expired REST read';end if;
 if exists(select 1 from storage.objects where bucket_id='pp-nutrition') then raise exception 'FAIL: expired file access';end if;
 denied=false;begin insert into public.pp_nutrition_entries(user_id,kind,text) values(auth.uid(),'meal','blocked');exception when insufficient_privilege then denied=true;end;
 if not denied then raise exception 'FAIL: expired nutrition write';end if;
 denied=false;begin update public.pp_members set created_at=now() where user_id=auth.uid();exception when insufficient_privilege then denied=true;end;
 if not denied then raise exception 'FAIL: trial can be reset by client';end if;
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
 if (select count(*) from public.pp_nutrition_entries where user_id='d4000000-0000-4000-8000-000000000002')<>1 then raise exception 'FAIL: expired data erased';end if;
end $$;
select 'PASS: exact 30-day boundary, private file metadata RLS, blocked reads/writes, no client trial reset, preserved student data and trainer ads' as result;
rollback;
