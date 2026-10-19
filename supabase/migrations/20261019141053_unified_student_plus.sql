begin;
alter table public.pp_entitlements drop constraint pp_entitlements_product_check;
update public.pp_entitlements set product='personal_pro_plus' where product='nutrition';
update pp_private.purchase_receipts set product='personal_pro_plus' where product='nutrition';
alter table public.pp_entitlements add constraint pp_entitlements_product_check check(product in ('trainer','personal_pro_plus'));
create or replace function pp_private.nutrition_allowed() returns boolean language sql stable security definer set search_path='' as $$
 select auth.uid() is not null and exists(select 1 from public.pp_members m join public.pp_entitlements e using(user_id)
 where m.user_id=auth.uid() and m.role='student' and e.product='personal_pro_plus' and e.valid_until>now())
$$;
revoke all on function pp_private.nutrition_allowed() from public,anon;
grant execute on function pp_private.nutrition_allowed() to authenticated;
notify pgrst,'reload schema';


create or replace function pp_private.record_verified_purchase(p_user uuid,p_product text,p_token_hash text,p_start timestamptz,p_end timestamptz) returns jsonb language plpgsql security definer set search_path='' as $$
declare v_owner uuid;v_ref uuid;v_cycle text;v_count int;v_days int=0;
begin
 if coalesce(auth.jwt()->>'role','')<>'service_role' then raise exception 'Acesso restrito ao servidor de pagamentos';end if;
 if p_product not in ('trainer','personal_pro_plus') or p_start is null or p_end is null or p_end<=now() or p_end<=p_start or length(p_token_hash)<>64 then raise exception 'Compra verificada inválida';end if;
 perform 1 from public.pp_members where user_id=p_user and role=case when p_product='trainer' then 'trainer' else 'student' end for update;
 if not found then raise exception 'Produto incompatível com o perfil';end if;
 select user_id into v_owner from pp_private.purchase_receipts where purchase_token_hash=p_token_hash for update;
 if v_owner is not null and v_owner<>p_user then raise exception 'Compra já vinculada a outra conta';end if;
 insert into pp_private.purchase_receipts(purchase_token_hash,user_id,product,cycle_start,cycle_end) values(p_token_hash,p_user,p_product,p_start,p_end)
 on conflict(purchase_token_hash) do update set cycle_start=excluded.cycle_start,cycle_end=greatest(pp_private.purchase_receipts.cycle_end,excluded.cycle_end),verified_at=now() where pp_private.purchase_receipts.user_id=excluded.user_id and pp_private.purchase_receipts.product=excluded.product;
 if not found then raise exception 'Compra já vinculada a outra conta ou produto';end if;
 insert into public.pp_entitlements(user_id,product,valid_until) values(p_user,p_product,p_end)
 on conflict(user_id,product) do update set valid_until=greatest(public.pp_entitlements.valid_until,excluded.valid_until),verified_at=now();
 if p_product='trainer' then
  select referrer_id into v_ref from public.pp_referrals where referred_id=p_user and credit_days=0 for update;
  if v_ref is not null then
   perform 1 from public.pp_members where user_id=v_ref for update;
   select r.cycle_end::text into v_cycle from pp_private.purchase_receipts r join public.pp_entitlements e on e.user_id=r.user_id and e.product=r.product
    where r.user_id=v_ref and r.product='trainer' and e.valid_until>now() order by r.cycle_end desc limit 1;
   if v_cycle is not null then
    select count(*) into v_count from public.pp_referrals where referrer_id=v_ref and credited_cycle=v_cycle and credit_days=3;
    if v_count<5 then update public.pp_referrals set credit_days=3,credited_cycle=v_cycle where referred_id=p_user;v_days=3;end if;
   end if;
  end if;
 end if;
 -- Credits are recorded, never used to rewrite Google renewal dates in the client.
 return jsonb_build_object('referralCreditDays',v_days,'application','pending_google_play');
end $$;
revoke all on function pp_private.record_verified_purchase(uuid,text,text,timestamptz,timestamptz) from public,anon,authenticated;
grant usage on schema pp_private to service_role;
grant execute on function pp_private.record_verified_purchase(uuid,text,text,timestamptz,timestamptz) to service_role;
create or replace function public.pp_record_verified_purchase(p_user uuid,p_product text,p_token_hash text,p_start timestamptz,p_end timestamptz) returns jsonb language sql security invoker set search_path='' as $$select pp_private.record_verified_purchase(p_user,p_product,p_token_hash,p_start,p_end)$$;
revoke all on function public.pp_record_verified_purchase(uuid,text,text,timestamptz,timestamptz) from public,anon,authenticated;
grant execute on function public.pp_record_verified_purchase(uuid,text,text,timestamptz,timestamptz) to service_role;
notify pgrst,'reload schema';


commit;
