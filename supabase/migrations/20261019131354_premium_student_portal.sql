-- Additive preview integration. The legacy account records are never rewritten.
-- Authenticated RPC wrappers delegate to an unexposed schema, with explicit UID checks.
begin;
create schema if not exists pp_private;
revoke all on schema pp_private from public, anon;
grant usage on schema pp_private to authenticated;
create table pp_private.account_backup_20261019 as select *, now() as backed_up_at from public.personal_pro_accounts;
revoke all on pp_private.account_backup_20261019 from public,anon,authenticated;
alter table pp_private.account_backup_20261019 enable row level security;
create table public.pp_members (
 user_id uuid primary key references auth.users(id) on delete cascade,
 role text not null check(role in ('trainer','student')),
 name text not null check(length(name) between 3 and 120),
 gender text not null default 'undisclosed' check(gender in ('male','female','undisclosed')),
 created_at timestamptz not null default now(),
 free_with_ads boolean not null default false
);
create table public.pp_links (
 id uuid primary key default gen_random_uuid(), trainer_id uuid not null references public.pp_members(user_id),
 legacy_student_id text not null, student_user_id uuid unique references public.pp_members(user_id),
 created_at timestamptz not null default now(), unique(trainer_id,legacy_student_id)
);
create index pp_links_trainer_idx on public.pp_links(trainer_id);
create table pp_private.invites (
 token_hash text primary key, link_id uuid not null references public.pp_links(id),
 expires_at timestamptz not null default now()+interval '7 days', used_by uuid references public.pp_members(user_id),
 created_at timestamptz not null default now()
);
create table public.pp_sessions_v2 (
 id uuid primary key, link_id uuid not null references public.pp_links(id),
 student_user_id uuid not null references public.pp_members(user_id),
 day text not null check(day in ('A','B','C')),
 started_at timestamptz not null default now(), completed_at timestamptz,
 prescription jsonb not null, logs jsonb not null default '[]', revision integer not null default 0,
 effort text check(effort in ('Leve','Na medida','Puxado','Muito puxado')),
 student_note text check(length(student_note)<=1000), congratulations text check(length(congratulations)<=500)
);
create index pp_sessions_student_date_idx on public.pp_sessions_v2(student_user_id,started_at desc);
create index pp_sessions_link_date_idx on public.pp_sessions_v2(link_id,started_at desc);
create unique index pp_session_one_active on public.pp_sessions_v2(student_user_id) where completed_at is null;
create table public.pp_entitlements (
 user_id uuid not null references public.pp_members(user_id), product text not null check(product in ('trainer','nutrition')),
 valid_until timestamptz not null, verified_at timestamptz not null default now(),
 primary key(user_id,product)
);
create table pp_private.purchase_receipts (
 purchase_token_hash text primary key, user_id uuid not null references public.pp_members(user_id),
 product text not null, cycle_start timestamptz not null, cycle_end timestamptz not null, verified_at timestamptz not null default now()
);
create table public.pp_referrals (
 referred_id uuid primary key references public.pp_members(user_id), referrer_id uuid not null references public.pp_members(user_id),
 registered_at timestamptz not null default now(), credited_cycle text, credit_days int not null default 0 check(credit_days in (0,3)),
 check(referred_id<>referrer_id)
);
create table public.pp_nutrition_settings (
 user_id uuid primary key references public.pp_members(user_id), goal_ml int not null default 2500 check(goal_ml between 1000 and 5000),
 portion_ml int not null default 240 check(portion_ml between 1 and 5000),
 reminders jsonb not null default '[]' check(jsonb_typeof(reminders)='array'),
 consent_at timestamptz not null default now()
);
create table public.pp_nutrition_entries (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references public.pp_members(user_id),
 kind text not null check(kind in ('meal','water','plan')), occurred_at timestamptz not null default now(),
 text text not null default '' check(length(text)<=30000), amount_ml int check(amount_ml between 1 and 5000),
 file_path text, plan_data jsonb, confirmed boolean not null default false,
 check(file_path is null or split_part(file_path,'/',1)=user_id::text)
);
create index pp_nutrition_user_time on public.pp_nutrition_entries(user_id,occurred_at desc);

create function pp_private.nutrition_allowed() returns boolean language sql stable security definer set search_path='' as $$
 select auth.uid() is not null and exists(select 1 from public.pp_members m join public.pp_entitlements e using(user_id)
 where m.user_id=auth.uid() and m.role='student' and e.product='nutrition' and e.valid_until>now())
$$;
create function pp_private.register_member(p_role text,p_name text,p_gender text) returns jsonb language plpgsql security definer set search_path='' as $$
begin
 if auth.uid() is null then raise exception 'Autenticação necessária'; end if;
 if exists(select 1 from public.personal_pro_accounts where user_id=auth.uid() and jsonb_array_length(students)>0) and p_role<>'trainer' then raise exception 'Conta profissional existente'; end if;
 insert into public.pp_members(user_id,role,name,gender) values(auth.uid(),p_role,trim(p_name),p_gender);
 return (select to_jsonb(m) from public.pp_members m where user_id=auth.uid());
end $$;
create function pp_private.create_invite(p_student_id text) returns text language plpgsql security definer set search_path='' as $$
declare v_link uuid; v_token text;
begin
 if auth.uid() is null or not exists(select 1 from public.pp_members where user_id=auth.uid() and role='trainer') then raise exception 'Acesso exclusivo do profissional'; end if;
 if not exists(select 1 from public.personal_pro_accounts a, jsonb_array_elements(a.students) s where a.user_id=auth.uid() and s->>'id'=p_student_id and coalesce((s->>'archived')::boolean,false)=false) then raise exception 'Aluno não encontrado'; end if;
 insert into public.pp_links(trainer_id,legacy_student_id) values(auth.uid(),p_student_id) on conflict(trainer_id,legacy_student_id) do nothing;
 select id into v_link from public.pp_links where trainer_id=auth.uid() and legacy_student_id=p_student_id and student_user_id is null for update;
 if v_link is null then raise exception 'Este aluno já está vinculado'; end if;
 v_token=encode(extensions.gen_random_bytes(16),'hex');
 delete from pp_private.invites where link_id=v_link and used_by is null;
 insert into pp_private.invites(token_hash,link_id) values(encode(extensions.digest(v_token,'sha256'),'hex'),v_link);
 return v_token;
end $$;
create function pp_private.accept_invite(p_token text) returns uuid language plpgsql security definer set search_path='' as $$
declare v_inv pp_private.invites; v_link public.pp_links;
begin
 if auth.uid() is null or not exists(select 1 from public.pp_members where user_id=auth.uid() and role='student') then raise exception 'Entre com uma conta de aluno'; end if;
 select * into v_inv from pp_private.invites where token_hash=encode(extensions.digest(lower(trim(p_token)),'sha256'),'hex') for update;
 if v_inv is null or v_inv.expires_at<now() or v_inv.used_by is not null then raise exception 'Convite inválido, usado ou expirado'; end if;
 select * into v_link from public.pp_links where id=v_inv.link_id for update;
 if not exists(select 1 from public.personal_pro_accounts a, jsonb_array_elements(a.students) s where a.user_id=v_link.trainer_id and s->>'id'=v_link.legacy_student_id and coalesce((s->>'archived')::boolean,false)=false) then raise exception 'Aluno indisponível'; end if;
 if v_link.student_user_id is not null then raise exception 'Vínculo já utilizado'; end if;
 update public.pp_links set student_user_id=auth.uid() where id=v_link.id;
 update pp_private.invites set used_by=auth.uid() where token_hash=v_inv.token_hash;
 return v_link.id;
end $$;
create function pp_private.student_data() returns jsonb language plpgsql stable security definer set search_path='' as $$
declare v_link public.pp_links; v_data jsonb;
begin
 if auth.uid() is null then raise exception 'Autenticação necessária'; end if;
 select * into v_link from public.pp_links where student_user_id=auth.uid();
 if v_link is null then return null; end if;
 select s into v_data from public.personal_pro_accounts a, jsonb_array_elements(a.students) s
 where a.user_id=v_link.trainer_id and s->>'id'=v_link.legacy_student_id and coalesce((s->>'archived')::boolean,false)=false;
 if v_data is null then return null; end if;
 return jsonb_build_object('linkId',v_link.id,'trainerName',(select name from public.pp_members where user_id=v_link.trainer_id),
 'student',jsonb_build_object('id',v_link.legacy_student_id,'name',(select name from public.pp_members where user_id=auth.uid()),
 'gender',(select gender from public.pp_members where user_id=auth.uid()),'workout',coalesce(v_data->'workout','[]'::jsonb),
 'workoutWeekdays',v_data->'workoutWeekdays','workoutUpdatedAt',v_data->'workoutUpdatedAt',
 'weightHistory',v_data->'weightHistory','weightRecords',v_data->'weightRecords','height',v_data->'height',
 'measures',v_data->'measures','measureHistory',v_data->'measureHistory','measureDates',v_data->'measureDates','lastAssessmentDate',v_data->'lastAssessmentDate'));
end $$;
create function pp_private.start_session(p_id uuid,p_day text) returns jsonb language plpgsql security definer set search_path='' as $$
declare v_data jsonb; v_session public.pp_sessions_v2; v_ex jsonb;
begin
 if auth.uid() is null then raise exception 'Autenticação necessária'; end if;
 -- Serialize starts even when no active session row exists.
 perform 1 from public.pp_members where user_id=auth.uid() and role='student' for update;
 if not found then raise exception 'Conta de aluno necessária'; end if;
 v_data=pp_private.student_data();
 if v_data is null then raise exception 'Vincule-se ao profissional primeiro'; end if;
 select * into v_session from public.pp_sessions_v2 where student_user_id=auth.uid() and completed_at is null;
 if found then return to_jsonb(v_session); end if;
 select jsonb_agg(e) into v_ex from jsonb_array_elements(v_data->'student'->'workout') e where coalesce(e->>'day','A')=p_day;
 if v_ex is null or jsonb_array_length(v_ex)=0 then raise exception 'Nenhum exercício prescrito neste treino'; end if;
 insert into public.pp_sessions_v2(id,link_id,student_user_id,day,prescription) values(p_id,(v_data->>'linkId')::uuid,auth.uid(),p_day,v_ex) returning * into v_session;
 return to_jsonb(v_session);
end $$;
create function pp_private.save_session(p_id uuid,p_revision int,p_logs jsonb,p_finish boolean,p_effort text,p_note text) returns jsonb language plpgsql security definer set search_path='' as $$
declare v_s public.pp_sessions_v2; v_log jsonb; v_ex jsonb; v_count int; v_idx int; v_sets int;
begin
 if auth.uid() is null then raise exception 'Autenticação nécessaire'; end if;
 select * into v_s from public.pp_sessions_v2 where id=p_id and student_user_id=auth.uid() for update;
 if not found then raise exception 'Sessão não encontrada'; end if;
 if v_s.revision<>p_revision then raise exception 'Sessão alterada em outro dispositivo. Recarregue para continuar.'; end if;
 if v_s.completed_at is not null then raise exception 'Treino já concluído'; end if;
 if p_logs is null or jsonb_typeof(p_logs)<>'array' or jsonb_array_length(p_logs)>2000 then raise exception 'Registros inválidos'; end if;
 for v_log in select value from jsonb_array_elements(p_logs) loop
  if jsonb_typeof(v_log->'setNumber')<>'number' or jsonb_typeof(v_log->'reps')<>'number' or jsonb_typeof(v_log->'weightKg')<>'number' or v_log->>'exerciseId' is null or v_log->>'setNumber' is null or v_log->>'reps' is null or v_log->>'weightKg' is null or (v_log->>'setNumber')::numeric<>trunc((v_log->>'setNumber')::numeric) or (v_log->>'reps')::numeric<>trunc((v_log->>'reps')::numeric) then raise exception 'Registro incompleto'; end if;
  v_idx=null;
  select ordinality::int-1 into v_idx from jsonb_array_elements(v_s.prescription) with ordinality where (value->>'id')||'-'||(ordinality-1)::text=v_log->>'exerciseId';
  if v_idx is null then raise exception 'Exercício fora da prescrição'; end if;
  v_ex=v_s.prescription->v_idx;
  v_sets=coalesce(nullif(substring(coalesce(v_ex->>'series',v_ex->>'sets','3') from '[0-9]+'),''),'3')::int;
  if (v_log->>'setNumber')::int not between 1 and least(20,v_sets) or (v_log->>'reps')::int not between 0 and 100 or (v_log->>'weightKg')::numeric not between 0 and 1000 or not(v_log ?& array['setNumber','reps','weightKg']) then raise exception 'Série, repetição ou carga inválida'; end if;
 end loop;
 select count(*)-count(distinct (value->>'exerciseId')||':'||(value->>'setNumber')) into v_count from jsonb_array_elements(p_logs);
 if v_count<>0 then raise exception 'Séries duplicadas'; end if;
 if p_finish and jsonb_array_length(p_logs)=0 then raise exception 'Registre pelo menos uma série'; end if;
 update public.pp_sessions_v2 set logs=p_logs,revision=revision+1,completed_at=case when p_finish then now() end,effort=p_effort,student_note=p_note where id=p_id returning * into v_s;
 return to_jsonb(v_s);
end $$;
create function pp_private.congratulate(p_session_id uuid,p_message text) returns void language plpgsql security definer set search_path='' as $$
begin
 if auth.uid() is null then raise exception 'Autenticação necessária'; end if;
 update public.pp_sessions_v2 s set congratulations=trim(p_message) from public.pp_links l
 where s.id=p_session_id and s.link_id=l.id and l.trainer_id=auth.uid() and s.completed_at is not null;
 if not found then raise exception 'Treino concluído não encontrado'; end if;
end $$;
create function pp_private.choose_free() returns void language plpgsql security definer set search_path='' as $$
begin
 if auth.uid() is null then raise exception 'Autenticação necessária'; end if;
 update public.pp_members set free_with_ads=true where user_id=auth.uid() and role='trainer';
end $$;
create function pp_private.register_referral(p_referrer uuid) returns void language plpgsql security definer set search_path='' as $$
begin
 if auth.uid() is null or not exists(select 1 from public.pp_members where user_id=auth.uid() and role='trainer') then raise exception 'Conta profissional necessária'; end if;
 if exists(select 1 from public.pp_entitlements where user_id=auth.uid() and product='trainer') then raise exception 'Indicação deve anteceder a assinatura'; end if;
 if not exists(select 1 from public.pp_members m join public.pp_entitlements e using(user_id) where m.user_id=p_referrer and m.role='trainer' and e.product='trainer' and e.valid_until>now()) then raise exception 'Indicador deve ter assinatura ativa'; end if;
 insert into public.pp_referrals(referred_id,referrer_id) values(auth.uid(),p_referrer);
end $$;
create function public.pp_register_member(p_role text,p_name text,p_gender text) returns jsonb language sql security invoker set search_path='' as $$ select pp_private.register_member(p_role,p_name,p_gender) $$;
create function public.pp_create_invite(p_student_id text) returns text language sql security invoker set search_path='' as $$ select pp_private.create_invite(p_student_id) $$;
create function public.pp_accept_invite(p_token text) returns uuid language sql security invoker set search_path='' as $$ select pp_private.accept_invite(p_token) $$;
create function public.pp_student_data() returns jsonb language sql security invoker set search_path='' as $$ select pp_private.student_data() $$;
create function public.pp_start_session(p_id uuid,p_day text) returns jsonb language sql security invoker set search_path='' as $$ select pp_private.start_session(p_id,p_day) $$;
create function public.pp_save_session(p_id uuid,p_revision int,p_logs jsonb,p_finish boolean,p_effort text,p_note text) returns jsonb language sql security invoker set search_path='' as $$ select pp_private.save_session(p_id,p_revision,p_logs,p_finish,p_effort,p_note) $$;
create function public.pp_congratulate(p_session_id uuid,p_message text) returns void language sql security invoker set search_path='' as $$ select pp_private.congratulate(p_session_id,p_message) $$;
create function public.pp_choose_free() returns void language sql security invoker set search_path='' as $$ select pp_private.choose_free() $$;
create function public.pp_register_referral(p_referrer uuid) returns void language sql security invoker set search_path='' as $$ select pp_private.register_referral(p_referrer) $$;
alter table public.pp_members enable row level security;
revoke all on public.pp_members from public,anon,authenticated;
grant select on public.pp_members to authenticated;
alter table public.pp_links enable row level security;
revoke all on public.pp_links from public,anon,authenticated;
grant select on public.pp_links to authenticated;
alter table public.pp_sessions_v2 enable row level security;
revoke all on public.pp_sessions_v2 from public,anon,authenticated;
grant select on public.pp_sessions_v2 to authenticated;
alter table public.pp_entitlements enable row level security;
revoke all on public.pp_entitlements from public,anon,authenticated;
grant select on public.pp_entitlements to authenticated;
alter table public.pp_referrals enable row level security;
revoke all on public.pp_referrals from public,anon,authenticated;
grant select on public.pp_referrals to authenticated;
alter table public.pp_nutrition_settings enable row level security;
revoke all on public.pp_nutrition_settings from public,anon,authenticated;
grant select on public.pp_nutrition_settings to authenticated;
alter table public.pp_nutrition_entries enable row level security;
revoke all on public.pp_nutrition_entries from public,anon,authenticated;
grant select on public.pp_nutrition_entries to authenticated;

alter table pp_private.invites enable row level security;
alter table pp_private.purchase_receipts enable row level security;
create policy pp_members_own on public.pp_members for select to authenticated using(user_id=(select auth.uid()));
create policy pp_links_participant on public.pp_links for select to authenticated using(trainer_id=(select auth.uid()) or student_user_id=(select auth.uid()));
create policy pp_sessions_participant on public.pp_sessions_v2 for select to authenticated using(student_user_id=(select auth.uid()) or exists(select 1 from public.pp_links l where l.id=link_id and l.trainer_id=(select auth.uid())));
create policy pp_entitlements_own on public.pp_entitlements for select to authenticated using(user_id=(select auth.uid()));
create policy pp_referrals_own on public.pp_referrals for select to authenticated using(referrer_id=(select auth.uid()) or referred_id=(select auth.uid()));
create policy pp_nutrition_settings_read on public.pp_nutrition_settings for select to authenticated using(user_id=(select auth.uid()));
create policy pp_nutrition_entries_read on public.pp_nutrition_entries for select to authenticated using(user_id=(select auth.uid()));
grant insert,update,delete on public.pp_nutrition_settings,public.pp_nutrition_entries to authenticated;
create policy pp_nutrition_settings_write on public.pp_nutrition_settings for all to authenticated using(user_id=(select auth.uid()) and (select pp_private.nutrition_allowed())) with check(user_id=(select auth.uid()) and (select pp_private.nutrition_allowed()));
create policy pp_nutrition_entries_write on public.pp_nutrition_entries for all to authenticated using(user_id=(select auth.uid()) and (select pp_private.nutrition_allowed())) with check(user_id=(select auth.uid()) and (select pp_private.nutrition_allowed()));
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('pp-nutrition','pp-nutrition',false,10485760,array['image/jpeg','image/png','image/webp','application/pdf']);
create policy pp_nutrition_files_read on storage.objects for select to authenticated using(bucket_id='pp-nutrition' and (storage.foldername(name))[1]=(select auth.uid())::text);
create policy pp_nutrition_files_insert on storage.objects for insert to authenticated with check(bucket_id='pp-nutrition' and (storage.foldername(name))[1]=(select auth.uid())::text and (select pp_private.nutrition_allowed()));
create policy pp_nutrition_files_delete on storage.objects for delete to authenticated using(bucket_id='pp-nutrition' and (storage.foldername(name))[1]=(select auth.uid())::text);
revoke all on all tables in schema pp_private from public,anon,authenticated;
revoke all on all functions in schema pp_private from public,anon;
grant execute on all functions in schema pp_private to authenticated;
revoke all on function public.pp_register_member(text,text,text) from public,anon;
grant execute on function public.pp_register_member(text,text,text) to authenticated;
revoke all on function public.pp_create_invite(text) from public,anon;
grant execute on function public.pp_create_invite(text) to authenticated;
revoke all on function public.pp_accept_invite(text) from public,anon;
grant execute on function public.pp_accept_invite(text) to authenticated;
revoke all on function public.pp_student_data() from public,anon;
grant execute on function public.pp_student_data() to authenticated;
revoke all on function public.pp_start_session(uuid,text) from public,anon;
grant execute on function public.pp_start_session(uuid,text) to authenticated;
revoke all on function public.pp_save_session(uuid,int,jsonb,boolean,text,text) from public,anon;
grant execute on function public.pp_save_session(uuid,int,jsonb,boolean,text,text) to authenticated;
revoke all on function public.pp_congratulate(uuid,text) from public,anon;
grant execute on function public.pp_congratulate(uuid,text) to authenticated;
revoke all on function public.pp_choose_free() from public,anon;
grant execute on function public.pp_choose_free() to authenticated;
revoke all on function public.pp_register_referral(uuid) from public,anon;
grant execute on function public.pp_register_referral(uuid) to authenticated;
notify pgrst, 'reload schema';
commit;
