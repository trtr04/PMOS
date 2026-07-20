-- Safe extension for an existing PMOS Supabase project.
-- It intentionally does NOT create or modify existing forum tables: posts, comments, likes.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text check (char_length(display_name) between 1 and 120), avatar_path text,
  timezone text not null default 'Asia/Shanghai', daily_sleep_target smallint not null default 8 check (daily_sleep_target between 4 and 12),
  daily_movement_target smallint not null default 30 check (daily_movement_target between 1 and 300), privacy_mode text not null default 'private' check (privacy_mode in ('private','team')),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.habit_templates (
  id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id) on delete cascade,
  source text not null default 'preset' check (source in ('preset','custom')), kind text not null check (kind in ('nutrition','movement','mood','sleep','custom')),
  name text not null check (char_length(name) between 1 and 120), description text, icon text not null default 'Sparkles',
  record_mode text not null default 'toggle' check (record_mode in ('toggle','value','choice')), unit text, goal_value numeric,
  score_value smallint not null default 10, sort_order smallint not null default 0, is_active boolean not null default true,
  metadata jsonb not null default '{}', created_at timestamptz not null default now()
);
create table if not exists public.daily_checkins (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  template_id uuid not null references public.habit_templates(id) on delete cascade, record_date date not null,
  completed boolean not null default false, numeric_value numeric, text_value text, note text, earned_score smallint not null default 0,
  completed_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique (user_id, template_id, record_date)
);
create table if not exists public.menstrual_cycles (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  start_date date not null, end_date date, created_at timestamptz not null default now(), check (end_date is null or end_date >= start_date)
);
create unique index if not exists one_active_cycle_per_user on public.menstrual_cycles(user_id) where end_date is null;
create table if not exists public.cycle_symptoms (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  cycle_id uuid references public.menstrual_cycles(id) on delete set null, record_date date not null,
  pain text check (pain in ('pain','no_pain')), breast_swelling text check (breast_swelling in ('swollen','not_swollen')),
  acne text check (acne in ('acne','clear')), unique (user_id, record_date)
);
create table if not exists public.health_reports (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  report_type text not null check (report_type in ('weekly','on_demand')), period_start date not null, period_end date not null,
  health_score smallint not null check (health_score between 0 and 100), completion_rate numeric not null,
  metrics jsonb not null, correlations jsonb not null, content text not null, model text, created_at timestamptz not null default now()
);
create table if not exists public.teams (
  id uuid primary key default gen_random_uuid(), owner_id uuid not null references auth.users(id),
  name text not null check (char_length(name) between 1 and 60), invite_code text unique not null default encode(gen_random_bytes(9),'hex'), created_at timestamptz not null default now()
);
create table if not exists public.team_members (
  team_id uuid not null references public.teams(id) on delete cascade, user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('owner','member')), share_progress boolean not null default false,
  joined_at timestamptz not null default now(), primary key (team_id,user_id)
);

alter table public.profiles enable row level security; alter table public.habit_templates enable row level security; alter table public.daily_checkins enable row level security;
alter table public.menstrual_cycles enable row level security; alter table public.cycle_symptoms enable row level security; alter table public.health_reports enable row level security;
alter table public.teams enable row level security; alter table public.team_members enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='profiles' and policyname='own profile') then create policy "own profile" on public.profiles for all to authenticated using (id=auth.uid()) with check(id=auth.uid()); end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='habit_templates' and policyname='own health templates') then create policy "own health templates" on public.habit_templates for all to authenticated using (user_id is null or user_id=auth.uid()) with check(user_id=auth.uid()); end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='daily_checkins' and policyname='own checkins') then create policy "own checkins" on public.daily_checkins for all to authenticated using(user_id=auth.uid()) with check(user_id=auth.uid()); end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='menstrual_cycles' and policyname='own cycles') then create policy "own cycles" on public.menstrual_cycles for all to authenticated using(user_id=auth.uid()) with check(user_id=auth.uid()); end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='cycle_symptoms' and policyname='own symptoms') then create policy "own symptoms" on public.cycle_symptoms for all to authenticated using(user_id=auth.uid()) with check(user_id=auth.uid()); end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='health_reports' and policyname='own reports') then create policy "own reports" on public.health_reports for all to authenticated using(user_id=auth.uid()) with check(user_id=auth.uid()); end if;
end $$;
