-- Execute within BEGIN/ROLLBACK. Temporary identities only.
insert into auth.users(id) select ('d2000000-0000-4000-8000-'||lpad(i::text,12,'0'))::uuid from generate_series(1,8) i;
insert into public.pp_members(user_id,role,name) select ('d2000000-0000-4000-8000-'||lpad(i::text,12,'0'))::uuid,'trainer','Teste de indicação' from generate_series(1,8) i;
set local role service_role;
select set_config('request.jwt.claims','{"role":"service_role"}',true);
select public.pp_record_verified_purchase('d2000000-0000-4000-8000-000000000001','trainer',repeat('a',64),now()-interval '1 day',now()+interval '29 days');
reset role;
insert into public.pp_referrals(referred_id,referrer_id) select ('d2000000-0000-4000-8000-'||lpad(i::text,12,'0'))::uuid,'d2000000-0000-4000-8000-000000000001'::uuid from generate_series(2,7) i;
set local role service_role;
do $$declare i int;begin for i in 2..7 loop perform public.pp_record_verified_purchase(('d2000000-0000-4000-8000-'||lpad(i::text,12,'0'))::uuid,'trainer',lpad(i::text,64,'0'),now()-interval '1 hour',now()+interval '30 days');end loop;end $$;
-- Replaying a verified token cannot duplicate referral credit.
select public.pp_record_verified_purchase('d2000000-0000-4000-8000-000000000002','trainer',lpad('2',64,'0'),now()-interval '1 hour',now()+interval '30 days');
reset role;
do $$begin if (select sum(credit_days) from public.pp_referrals where referrer_id='d2000000-0000-4000-8000-000000000001')<>15 then raise exception 'FAIL: referral cap';end if;end $$;
-- A verified renewal resets the cap by Google's authoritative expiry, not by local date arithmetic.
set local role service_role;
select public.pp_record_verified_purchase('d2000000-0000-4000-8000-000000000001','trainer',repeat('a',64),now()-interval '1 day',now()+interval '59 days');
reset role;
insert into public.pp_referrals(referred_id,referrer_id) values('d2000000-0000-4000-8000-000000000008','d2000000-0000-4000-8000-000000000001');
set local role service_role;
select public.pp_record_verified_purchase('d2000000-0000-4000-8000-000000000008','trainer',repeat('b',64),now(),now()+interval '30 days');
reset role;
do $$begin if (select credit_days from public.pp_referrals where referred_id='d2000000-0000-4000-8000-000000000008')<>3 then raise exception 'FAIL: renewed cycle did not reset referral limit';end if;end $$;
set local role authenticated;
select set_config('request.jwt.claim.sub','d2000000-0000-4000-8000-000000000002',true);
do $$declare denied boolean=false;begin begin perform public.pp_record_verified_purchase(auth.uid(),'trainer',repeat('f',64),now(),now()+interval '30 days');exception when insufficient_privilege then denied=true;end;if not denied then raise exception 'FAIL: client can activate payment';end if;end $$;
reset role;
select 'PASS: server-only verified receipt, replay protection, maximum 5 paid referrals / 15 days per cycle' as result;
