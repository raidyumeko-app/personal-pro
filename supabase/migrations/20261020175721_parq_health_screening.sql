-- Additive PAR-Q records. Responses are append-only; only the linked trainer can review.
begin;
create table public.pp_parq_responses (
 id uuid primary key,link_id uuid not null references public.pp_links(id),
 student_user_id uuid not null references public.pp_members(user_id),
 respondent_name text not null,questionnaire jsonb not null,
 answers jsonb not null check(jsonb_typeof(answers)='array' and jsonb_array_length(answers)=7),
 consent_at timestamptz not null default now(),submitted_at timestamptz not null default now(),
 reviewed_at timestamptz,reviewed_by uuid references public.pp_members(user_id),
 review_note text check(length(review_note)<=2000),
 check((reviewed_at is null)=(reviewed_by is null))
);
create index pp_parq_link_date on public.pp_parq_responses(link_id,submitted_at desc);
create index pp_parq_student on public.pp_parq_responses(student_user_id);
alter table public.pp_parq_responses enable row level security;
revoke all on public.pp_parq_responses from public,anon,authenticated;
grant select on public.pp_parq_responses to authenticated;
create policy pp_parq_participant on public.pp_parq_responses for select to authenticated
 using (exists(select 1 from public.pp_links l where l.id=link_id and (
 l.trainer_id=(select auth.uid()) or case when l.student_user_id=(select auth.uid()) and student_user_id=(select auth.uid()) then pp_private.student_allowed() else false end)));

create function pp_private.submit_parq(p_id uuid,p_link_id uuid,p_answers jsonb,p_consent boolean)
returns jsonb language plpgsql security definer set search_path='' as $$
declare l public.pp_links;r public.pp_parq_responses;person text;definition jsonb='{"version": "ms-cab38-2014-anexo-f-v1", "title": "PAR-Q — prontidão para atividade física", "sourceTitle": "Ministério da Saúde · Cadernos de Atenção Básica nº 38 · 2014 · Anexo F (Q-PAF), p. 194", "sourceUrl": "https://bvsms.saude.gov.br/bvs/publicacoes/estrategias_cuidado_doenca_cronica_obesidade_cab38.pdf", "questions": ["Seu médico já mencionou alguma vez que você tem uma condição cardíaca e que você só deve realizar atividade física recomendada por um médico?", "Você sente dor no tórax quando realiza atividade física?", "No mês passado, você teve dor torácica quando não estava realizando atividade física?", "Você perdeu o equilíbrio por causa de tontura ou alguma vez perdeu a consciência?", "Você tem algum problema ósseo ou de articulação que poderia piorar em consequência de uma alteração em sua atividade física?", "Seu médico está prescrevendo medicamentos (por exemplo, água pílulas) para sua pressão ou condição cardíaca?", "Conhece alguma outra razão pela qual você não deveria praticar atividade física?"], "consent": "Confirmo que estas são minhas respostas e autorizo o compartilhamento deste questionário de saúde com meu personal vinculado para acompanhamento da atividade física."}'::jsonb;
begin
 if auth.uid() is null then raise exception 'Autenticação necessária' using errcode='42501';end if;
 select name into person from public.pp_members where user_id=auth.uid() and role='student';
 if not found then raise exception 'Conta de aluno necessária' using errcode='42501';end if;
 if not pp_private.student_allowed() then raise exception 'Acesso do aluno encerrado.' using errcode='42501';end if;
 select * into l from public.pp_links where id=p_link_id and student_user_id=auth.uid();
 if not found then raise exception 'Vínculo com o personal não encontrado.' using errcode='42501';end if;
 if p_id is null or p_consent is distinct from true or p_answers is null or jsonb_typeof(p_answers)<>'array' or jsonb_array_length(p_answers)<>7 then
 raise exception 'Responda às sete perguntas e confirme o compartilhamento.' using errcode='22023';end if;
 if exists(select 1 from jsonb_array_elements(p_answers) x where jsonb_typeof(x)<>'boolean') then raise exception 'Cada resposta deve ser sim ou não.' using errcode='22023';end if;
 insert into public.pp_parq_responses(id,link_id,student_user_id,respondent_name,questionnaire,answers)
 values(p_id,l.id,auth.uid(),person,definition,p_answers) on conflict(id) do nothing;
 select * into r from public.pp_parq_responses where id=p_id;
 if r.student_user_id<>auth.uid() or r.link_id<>p_link_id or r.answers<>p_answers then raise exception 'Identificador já utilizado por outra resposta.' using errcode='22023';end if;
 return to_jsonb(r);
end $$;
create function pp_private.review_parq(p_id uuid,p_note text)
returns jsonb language plpgsql security definer set search_path='' as $$
declare r public.pp_parq_responses;
begin
 if auth.uid() is null or not exists(select 1 from public.pp_members where user_id=auth.uid() and role='trainer') then raise exception 'Conta de personal necessária' using errcode='42501';end if;
 if length(coalesce(p_note,''))>2000 then raise exception 'Observação muito longa.' using errcode='22023';end if;
 select q.* into r from public.pp_parq_responses q join public.pp_links l on l.id=q.link_id where q.id=p_id and l.trainer_id=auth.uid() for update of q;
 if not found then raise exception 'Questionário não encontrado para este personal.' using errcode='42501';end if;
 if r.reviewed_at is null then
 update public.pp_parq_responses set reviewed_at=now(),reviewed_by=auth.uid(),review_note=nullif(trim(coalesce(p_note,'')),'') where id=p_id returning * into r;
 end if;
 return to_jsonb(r);
end $$;
create function public.pp_submit_parq(p_id uuid,p_link_id uuid,p_answers jsonb,p_consent boolean)
returns jsonb language sql security invoker set search_path='' as $$select pp_private.submit_parq(p_id,p_link_id,p_answers,p_consent)$$;
create function public.pp_review_parq(p_id uuid,p_note text default '')
returns jsonb language sql security invoker set search_path='' as $$select pp_private.review_parq(p_id,p_note)$$;
revoke all on function pp_private.submit_parq(uuid,uuid,jsonb,boolean),pp_private.review_parq(uuid,text),public.pp_submit_parq(uuid,uuid,jsonb,boolean),public.pp_review_parq(uuid,text) from public,anon;
grant execute on function pp_private.submit_parq(uuid,uuid,jsonb,boolean),pp_private.review_parq(uuid,text),public.pp_submit_parq(uuid,uuid,jsonb,boolean),public.pp_review_parq(uuid,text) to authenticated;
notify pgrst,'reload schema';
commit;
