-- Student access: 30 days from server-controlled profile creation, then one subscription.
-- Preview portal only; preserve all records and the professional's ads option.
begin;
create or replace function pp_private.student_access() returns jsonb language plpgsql stable security definer set search_path='' as $$
declare m public.pp_members; trial_end timestamptz; paid_end timestamptz; access_end timestamptz;
begin
 select * into m from public.pp_members where user_id=auth.uid() and role='student';
 if not found then raise exception 'Conta de aluno necessária'; end if;
 trial_end=m.created_at+interval '30 days';
 select max(valid_until) into paid_end from public.pp_entitlements where user_id=auth.uid() and product='personal_pro_plus';
 access_end=greatest(trial_end,paid_end);
 return jsonb_build_object('active',m.created_at<=now() and access_end>now(),'status',case when paid_end>now() then 'paid' when m.created_at<=now() and trial_end>now() then 'trial' else 'expired' end,
 'trialUntil',trial_end,'expiresAt',access_end,'serverNow',now(),'monthlyPriceBRL',9.90,'adsAllowed',false);
end $$;
create or replace function pp_private.student_allowed() returns boolean language sql stable security definer set search_path='' as $$
 select coalesce((pp_private.student_access()->>'active')::boolean,false)
$$;
create or replace function public.pp_student_access() returns jsonb language sql stable security invoker set search_path='' as $$ select pp_private.student_access() $$;
revoke all on function pp_private.student_access(),pp_private.student_allowed(),public.pp_student_access() from public,anon;
grant execute on function pp_private.student_access(),pp_private.student_allowed(),public.pp_student_access() to authenticated;
create or replace function pp_private.nutrition_allowed() returns boolean language sql stable security definer set search_path='' as $$
 select case when exists(select 1 from public.pp_members where user_id=auth.uid() and role='student') then pp_private.student_allowed() else false end
$$;
create or replace function pp_private.student_data() returns jsonb language plpgsql stable security definer set search_path='' as $$
declare v_link public.pp_links; v_data jsonb;
begin
 if not pp_private.student_allowed() then raise exception 'Período gratuito encerrado. Assine por R$ 9,90/mês para continuar.' using errcode='42501'; end if;
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
create or replace function pp_private.start_session(p_id uuid,p_day text) returns jsonb language plpgsql security definer set search_path='' as $$
declare v_data jsonb; v_session public.pp_sessions_v2; v_ex jsonb;
begin
 if not pp_private.student_allowed() then raise exception 'Período gratuito encerrado. Assine por R$ 9,90/mês para continuar.' using errcode='42501'; end if;
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
create or replace function pp_private.save_session(p_id uuid,p_revision int,p_logs jsonb,p_finish boolean,p_effort text,p_note text) returns jsonb language plpgsql security definer set search_path='' as $$
declare v_s public.pp_sessions_v2; v_log jsonb; v_ex jsonb; v_count int; v_idx int; v_sets int;
begin
 if not pp_private.student_allowed() then raise exception 'Período gratuito encerrado. Assine por R$ 9,90/mês para continuar.' using errcode='42501'; end if;
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
alter policy pp_sessions_participant on public.pp_sessions_v2 using((student_user_id=(select auth.uid()) and (select pp_private.nutrition_allowed())) or exists(select 1 from public.pp_links l where l.id=link_id and l.trainer_id=(select auth.uid())));
alter policy pp_nutrition_settings_read on public.pp_nutrition_settings using(user_id=(select auth.uid()) and (select pp_private.nutrition_allowed()));
alter policy pp_nutrition_entries_read on public.pp_nutrition_entries using(user_id=(select auth.uid()) and (select pp_private.nutrition_allowed()));
alter policy pp_nutrition_files_read on storage.objects using(bucket_id='pp-nutrition' and (storage.foldername(name))[1]=(select auth.uid())::text and (select pp_private.nutrition_allowed()));
notify pgrst,'reload schema';
commit;
