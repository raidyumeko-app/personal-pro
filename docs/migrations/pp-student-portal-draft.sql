-- DESIGN ONLY: do not apply to production. Review with security specialist and
-- test in an isolated Supabase development environment before deployment.
-- Existing personal_pro_accounts remains unchanged.
create table if not exists public.pp_students (
  id uuid primary key default gen_random_uuid(),
  trainer_id uuid not null references auth.users(id) on delete cascade,
  student_user_id uuid unique references auth.users(id) on delete set null,
  display_name text not null check (char_length(display_name) between 2 and 120),
  created_at timestamptz not null default now(),
  unique(id, trainer_id)
);
create table if not exists public.pp_workout_assignments (
  id uuid primary key default gen_random_uuid(),
  trainer_id uuid not null references auth.users(id) on delete cascade,
  student_id uuid not null,
  title text not null check (char_length(title) between 1 and 160),
  prescription jsonb not null check (jsonb_typeof(prescription) = 'array'),
  created_at timestamptz not null default now(),
  foreign key (student_id,trainer_id) references public.pp_students(id,trainer_id) on delete cascade,
  unique(id,student_id)
);
create table if not exists public.pp_workout_sessions (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null,
  student_id uuid not null references public.pp_students(id) on delete cascade,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  foreign key (assignment_id,student_id) references public.pp_workout_assignments(id,student_id) on delete cascade,
  check (completed_at is null or completed_at >= started_at)
);
create table if not exists public.pp_workout_set_logs (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.pp_workout_sessions(id) on delete cascade,
  exercise_id text not null check (char_length(exercise_id) between 1 and 120),
  set_number int not null check (set_number between 1 and 20),
  reps int not null check (reps between 0 and 100),
  weight_kg numeric(7,2) not null check (weight_kg between 0 and 1000),
  recorded_at timestamptz not null default now(),
  unique(session_id,exercise_id,set_number)
);
alter table public.pp_students enable row level security;
alter table public.pp_workout_assignments enable row level security;
alter table public.pp_workout_sessions enable row level security;
alter table public.pp_workout_set_logs enable row level security;
revoke all on public.pp_students,public.pp_workout_assignments,public.pp_workout_sessions,public.pp_workout_set_logs from anon,public;
grant select,insert,update,delete on public.pp_students,public.pp_workout_assignments,public.pp_workout_sessions,public.pp_workout_set_logs to authenticated;

-- Trainer owns students. Student can only read their own minimal row.
create policy pp_students_read on public.pp_students for select to authenticated using (trainer_id=(select auth.uid()) or student_user_id=(select auth.uid()));
create policy pp_students_insert on public.pp_students for insert to authenticated with check (trainer_id=(select auth.uid()) and student_user_id is null);
create policy pp_students_update on public.pp_students for update to authenticated using (trainer_id=(select auth.uid())) with check (trainer_id=(select auth.uid()));
create policy pp_students_delete on public.pp_students for delete to authenticated using (trainer_id=(select auth.uid()));
-- Assignment visibility: trainer or linked student, but only trainer can write.
create policy pp_assignments_read on public.pp_workout_assignments for select to authenticated using (
 trainer_id=(select auth.uid()) or exists(select 1 from public.pp_students s where s.id=student_id and s.student_user_id=(select auth.uid()))
);
create policy pp_assignments_insert on public.pp_workout_assignments for insert to authenticated with check (trainer_id=(select auth.uid()));
create policy pp_assignments_update on public.pp_workout_assignments for update to authenticated using (trainer_id=(select auth.uid())) with check (trainer_id=(select auth.uid()));
create policy pp_assignments_delete on public.pp_workout_assignments for delete to authenticated using (trainer_id=(select auth.uid()));
-- Session access: trainer can manage; linked student can create and update own sessions.
create policy pp_sessions_read on public.pp_workout_sessions for select to authenticated using (
 exists(select 1 from public.pp_students s where s.id=student_id and (s.trainer_id=(select auth.uid()) or s.student_user_id=(select auth.uid())))
);
create policy pp_sessions_insert on public.pp_workout_sessions for insert to authenticated with check (
 exists(select 1 from public.pp_students s where s.id=student_id and (s.trainer_id=(select auth.uid()) or s.student_user_id=(select auth.uid())))
);
create policy pp_sessions_update on public.pp_workout_sessions for update to authenticated using (
 exists(select 1 from public.pp_students s where s.id=student_id and (s.trainer_id=(select auth.uid()) or s.student_user_id=(select auth.uid())))
) with check (
 exists(select 1 from public.pp_students s where s.id=student_id and (s.trainer_id=(select auth.uid()) or s.student_user_id=(select auth.uid())))
);
-- No session delete from client.
create policy pp_logs_read on public.pp_workout_set_logs for select to authenticated using (
 exists(select 1 from public.pp_workout_sessions w join public.pp_students s on s.id=w.student_id where w.id=session_id and (s.trainer_id=(select auth.uid()) or s.student_user_id=(select auth.uid())))
);
create policy pp_logs_insert on public.pp_workout_set_logs for insert to authenticated with check (
 exists(select 1 from public.pp_workout_sessions w join public.pp_students s on s.id=w.student_id where w.id=session_id and w.completed_at is null and (s.trainer_id=(select auth.uid()) or s.student_user_id=(select auth.uid())))
);
create policy pp_logs_update on public.pp_workout_set_logs for update to authenticated using (
 exists(select 1 from public.pp_workout_sessions w join public.pp_students s on s.id=w.student_id where w.id=session_id and w.completed_at is null and (s.trainer_id=(select auth.uid()) or s.student_user_id=(select auth.uid())))
) with check (
 exists(select 1 from public.pp_workout_sessions w join public.pp_students s on s.id=w.student_id where w.id=session_id and w.completed_at is null and (s.trainer_id=(select auth.uid()) or s.student_user_id=(select auth.uid())))
);
-- No log delete from client.
-- BEFORE USING: add controlled invitation/linking flow; restrict assignment mutations,
-- verify that session completion and log changes cannot race, and perform multi-account RLS tests.
