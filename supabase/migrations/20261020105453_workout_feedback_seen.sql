-- Additive read receipt; existing sessions remain unread until explicitly acknowledged.
alter table public.pp_sessions_v2 add column feedback_seen_at timestamptz;
alter table public.pp_sessions_v2 add constraint pp_feedback_seen_completed
 check(feedback_seen_at is null or completed_at is not null);

create function pp_private.mark_feedback_seen(p_session_id uuid)
returns timestamptz language plpgsql security definer set search_path='' as $$
declare seen timestamptz;
begin
 if auth.uid() is null then raise exception 'Autenticação necessária' using errcode='42501';end if;
 update public.pp_sessions_v2 s set feedback_seen_at=coalesce(s.feedback_seen_at,now())
 from public.pp_links l,public.pp_members m
 where s.id=p_session_id and s.completed_at is not null and s.link_id=l.id
 and l.trainer_id=auth.uid() and m.user_id=auth.uid() and m.role='trainer'
 returning s.feedback_seen_at into seen;
 if not found then raise exception 'Treino concluído não encontrado para este personal.' using errcode='42501';end if;
 return seen;
end $$;
create function public.pp_mark_feedback_seen(p_session_id uuid)
returns timestamptz language sql security invoker set search_path=''
as $$ select pp_private.mark_feedback_seen(p_session_id) $$;
revoke all on function pp_private.mark_feedback_seen(uuid),public.pp_mark_feedback_seen(uuid) from public,anon;
grant execute on function pp_private.mark_feedback_seen(uuid),public.pp_mark_feedback_seen(uuid) to authenticated;
notify pgrst,'reload schema';
