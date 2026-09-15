-- Assistant chat history saved to the user's account ("Save to my account" in the
-- assistant's settings — off unless the user picks it; the default keeps chats in the
-- browser). Adapted from page-assistant's reference migration
-- (packages/widget/supabase/assistant_chats.sql at d0d8856) and paired with
-- supabaseChatHistoryAdapter(supabase, { table: "psyc_assistant_chats", app: "psycscope" })
-- in src/lib/page-assistant/chatHistory.ts.
--
-- This Supabase project is shared by many apps, so every object here carries the psyc_
-- prefix: the table, its indexes, trigger, functions and policies, and the pg_cron job.
-- Nothing in this file touches another app's objects. The table lives in `public`, not
-- `psyc`, because the widget's adapter queries the default schema. It is new, and belongs
-- to PsycScope alone; the key (user_id, app, id) matches the adapter's upsert.
--
-- Access: row-level security. A signed-in user can read, add, change and delete only their
-- own rows. The anon role gets nothing. The widget reaches this table only through the
-- app's browser supabase-js client, with the user's session — never the service role.
--
-- Retention: chats with no activity for 12 months (updated_at) are deleted by
-- public.psyc_assistant_chats_delete_inactive(). Scheduled below with pg_cron when it is
-- enabled; see the end of the file for databases without it.

create table if not exists public.psyc_assistant_chats (
  id          text        not null check (char_length(id) between 1 and 128),
  user_id     uuid        not null default auth.uid() references auth.users (id) on delete cascade,
  -- The adapter's `app` option ("psycscope"). Part of the key the adapter upserts on.
  app         text        not null default '' check (char_length(app) <= 128),
  title       text        not null default 'New chat' check (char_length(title) <= 500),
  messages    jsonb       not null default '[]'::jsonb
                          check (jsonb_typeof(messages) = 'array')
                          -- Generous cap so one user cannot fill the database. The widget
                          -- keeps at most 100 messages per chat.
                          check (octet_length(messages::text) <= 5000000),
  pinned      boolean     not null default false,
  archived    boolean     not null default false,
  group_id    text,
  model       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  -- The adapter upserts with onConflict "user_id,app,id".
  primary key (user_id, app, id)
);

-- The list: one user's chats in one app, newest first.
create index if not exists psyc_assistant_chats_user_app_updated_idx
  on public.psyc_assistant_chats (user_id, app, updated_at desc);
-- The retention sweep.
create index if not exists psyc_assistant_chats_updated_idx
  on public.psyc_assistant_chats (updated_at);

-- The client sends its own timestamps: created_at keeps a moved chat's real age, and
-- updated_at is its last activity. The widget counts a move from the device as activity, so
-- the sweep never deletes a chat right after the user was told it was moved.
-- It may never send one in the future: that would dodge the retention rule.
create or replace function public.psyc_assistant_chats_clamp_times()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := least(coalesce(new.updated_at, now()), now());
  new.created_at := least(coalesce(new.created_at, now()), new.updated_at);
  return new;
end;
$$;

drop trigger if exists psyc_assistant_chats_clamp_times on public.psyc_assistant_chats;
create trigger psyc_assistant_chats_clamp_times
  before insert or update on public.psyc_assistant_chats
  for each row execute function public.psyc_assistant_chats_clamp_times();

-- Row-level security: every policy is "the row is mine".
alter table public.psyc_assistant_chats enable row level security;

drop policy if exists "psyc_assistant_chats select own" on public.psyc_assistant_chats;
create policy "psyc_assistant_chats select own" on public.psyc_assistant_chats
  for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "psyc_assistant_chats insert own" on public.psyc_assistant_chats;
create policy "psyc_assistant_chats insert own" on public.psyc_assistant_chats
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "psyc_assistant_chats update own" on public.psyc_assistant_chats;
create policy "psyc_assistant_chats update own" on public.psyc_assistant_chats
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "psyc_assistant_chats delete own" on public.psyc_assistant_chats;
create policy "psyc_assistant_chats delete own" on public.psyc_assistant_chats
  for delete to authenticated
  using ((select auth.uid()) = user_id);

revoke all on table public.psyc_assistant_chats from anon;
grant select, insert, update, delete on table public.psyc_assistant_chats to authenticated;

-- Retention: delete chats with no activity for 12 months. Returns how many went.
create or replace function public.psyc_assistant_chats_delete_inactive()
returns integer
language plpgsql
set search_path = ''
as $$
declare
  deleted integer;
begin
  delete from public.psyc_assistant_chats
  where updated_at < now() - interval '12 months';
  get diagnostics deleted = row_count;
  return deleted;
end;
$$;

-- Only the database owner and the service role may run it; never a signed-in user.
revoke execute on function public.psyc_assistant_chats_delete_inactive() from public, anon, authenticated;
grant execute on function public.psyc_assistant_chats_delete_inactive() to service_role;

-- Schedule it daily at 03:17 UTC with pg_cron, when pg_cron is enabled
-- (Supabase: Database → Extensions → pg_cron). Re-running this file updates the same job.
do $$
begin
  if exists (select 1 from pg_extension where extname = 'pg_cron') then
    perform cron.schedule(
      'psyc-assistant-chats-retention',
      '17 3 * * *',
      'select public.psyc_assistant_chats_delete_inactive()'
    );
  else
    raise notice 'pg_cron is not enabled: schedule public.psyc_assistant_chats_delete_inactive() another way (see the end of 0002_psyc_assistant_chats.sql).';
  end if;
end;
$$;

-- Without pg_cron, run the same statement once a day from any scheduler that holds the
-- service-role key (a cron route, a scheduled function, a CI schedule — never a browser):
--
--   await supabaseAdmin.rpc("psyc_assistant_chats_delete_inactive")
--
-- or with a direct database connection:
--
--   psql "$DATABASE_URL" -c "select public.psyc_assistant_chats_delete_inactive()"
--
-- supabaseChatHistoryAdapter() also hides and deletes a user's own inactive chats each time
-- they open the assistant, but a user who never comes back is only covered by a scheduled run.
