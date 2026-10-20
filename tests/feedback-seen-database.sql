-- Isolated read-receipt authorization and persistence checks; no existing data changed.
begin;
insert into auth.users(id) values
 ('d5000000-0000-4000-8000-000000000001'),('d5000000-0000-4000-8000-000000000002'),
 ('d5000000-0000-4000-8000-000000000003');
set local role authenticated;
do $$declare token text;s jsonb;seen timestamptz;again timestamptz;denied boolean;begin
 perform set_config('request.jwt.claim.sub','d5000000-0000-4000-8000-000000000001',true);
 perform public.pp_register_member('trainer','QA receipt personal','undisclosed');
 insert into public.personal_pro_accounts(user_id,profile,students) values(auth.uid(),'{}','[{"id":"qa","name":"QA","workout":[{"id":"ex","day":"A","name":"QA","series":"1","repetitions":"8"}]}]');
 token=public.pp_create_invite('qa');
 perform set_config('request.jwt.claim.sub','d5000000-0000-4000-8000-000000000002',true);
 perform public.pp_register_member('student','QA receipt aluno','undisclosed');
 perform public.pp_accept_invite(token);
 s=public.pp_start_session('d5000000-0000-4000-8000-000000000010','A');
 s=public.pp_save_session((s->>'id')::uuid,0,'[{"exerciseId":"ex-0","setNumber":1,"reps":8,"weightKg":10}]',true,'Puxado','QA feedback');
 if (s->>'feedback_seen_at') is not null then raise exception 'FAIL: completion auto-marks receipt';end if;
 denied=false;begin perform public.pp_mark_feedback_seen((s->>'id')::uuid);exception when insufficient_privilege then denied=true;end;
 if not denied then raise exception 'FAIL: student can mark own receipt';end if;
 denied=false;begin update public.pp_sessions_v2 set feedback_seen_at=now() where id=(s->>'id')::uuid;exception when insufficient_privilege then denied=true;end;
 if not denied then raise exception 'FAIL: client can directly overwrite receipt';end if;
 perform set_config('request.jwt.claim.sub','d5000000-0000-4000-8000-000000000003',true);
 perform public.pp_register_member('trainer','QA other personal','undisclosed');
 denied=false;begin perform public.pp_mark_feedback_seen((s->>'id')::uuid);exception when insufficient_privilege then denied=true;end;
 if not denied then raise exception 'FAIL: unrelated trainer can acknowledge';end if;
 perform set_config('request.jwt.claim.sub','d5000000-0000-4000-8000-000000000001',true);
 seen=public.pp_mark_feedback_seen((s->>'id')::uuid);
 again=public.pp_mark_feedback_seen((s->>'id')::uuid);
 if seen is null or seen<>again then raise exception 'FAIL: acknowledgement not idempotent';end if;
 perform set_config('request.jwt.claim.sub','d5000000-0000-4000-8000-000000000002',true);
 if (select feedback_seen_at from public.pp_sessions_v2 where id=(s->>'id')::uuid)<>seen then raise exception 'FAIL: student cannot read receipt';end if;
 if (select logs from public.pp_sessions_v2 where id=(s->>'id')::uuid)<>s->'logs' or (select revision from public.pp_sessions_v2 where id=(s->>'id')::uuid)<>1 then raise exception 'FAIL: receipt modifies workout';end if;
 if (select effort from public.pp_sessions_v2 where id=(s->>'id')::uuid)<>'Puxado' or (select student_note from public.pp_sessions_v2 where id=(s->>'id')::uuid)<>'QA feedback' then raise exception 'FAIL: receipt modifies feedback';end if;
 s=public.pp_start_session('d5000000-0000-4000-8000-000000000011','A');
 perform set_config('request.jwt.claim.sub','d5000000-0000-4000-8000-000000000001',true);
 denied=false;begin perform public.pp_mark_feedback_seen((s->>'id')::uuid);exception when insufficient_privilege then denied=true;end;
 if not denied then raise exception 'FAIL: unfinished workout acknowledged';end if;
end $$;
reset role;
do $$begin
 if has_function_privilege('anon','public.pp_mark_feedback_seen(uuid)','execute') then raise exception 'FAIL: anonymous receipt access';end if;
 if (select count(*) from public.pp_sessions_v2 where student_user_id='d5000000-0000-4000-8000-000000000002')<>2 then raise exception 'FAIL: receipt changes session count';end if;
end $$;
select 'PASS: explicit receipt, trainer ownership, student readback, no client overwrite, idempotency, unchanged feedback and unfinished/anonymous denial' as result;
rollback;
