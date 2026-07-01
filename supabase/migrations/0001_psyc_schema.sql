-- PsycScope schema on shared 6x7 Supabase project
create schema if not exists psyc;

create table if not exists psyc.assessments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  overall_percent int not null,
  positive_count int not null,
  answers jsonb not null,
  scores jsonb not null,
  narrative text,
  ai_summary text
);

alter table psyc.assessments enable row level security;

create policy "users read own assessments"
  on psyc.assessments for select
  using (auth.uid() = user_id);

create policy "users insert own assessments"
  on psyc.assessments for insert
  with check (auth.uid() = user_id);

create policy "users delete own assessments"
  on psyc.assessments for delete
  using (auth.uid() = user_id);
