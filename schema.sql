create table public.personal_pro_accounts (
 user_id uuid primary key references auth.users(id) on delete cascade,
 profile jsonb not null default '{}'::jsonb check (jsonb_typeof(profile) = 'object'),
 students jsonb not null default '[]'::jsonb check (jsonb_typeof(students) = 'array'),
 updated_at timestamptz not null default now()
);
alter table public.personal_pro_accounts enable row level security;
revoke all on public.personal_pro_accounts from anon;
grant select, insert, update, delete on public.personal_pro_accounts to authenticated;
create policy own_account on public.personal_pro_accounts for all to authenticated
 using ((select auth.uid()) = user_id)
 with check ((select auth.uid()) = user_id);
