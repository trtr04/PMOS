-- PMOS production schema for Supabase PostgreSQL.
-- Run in Supabase SQL Editor after enabling Authentication > Anonymous sign-ins.
create extension if not exists pgcrypto;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text check (char_length(display_name) between 1 and 120),
  avatar_path text,
  timezone text not null default 'Asia/Shanghai',
  daily_sleep_target smallint not null default 8 check (daily_sleep_target between 4 and 12),
  daily_movement_target smallint not null default 30 check (daily_movement_target between 1 and 300),
  privacy_mode text not null default 'private' check (privacy_mode in ('private','team')),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.habit_templates (
  id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id) on delete cascade,
  source text not null default 'preset' check (source in ('preset','custom')),
  kind text not null check (kind in ('nutrition','movement','mood','sleep','custom')),
  name text not null check (char_length(name) between 1 and 120), description text,
  icon text not null default 'Sparkles', record_mode text not null default 'toggle' check (record_mode in ('toggle','value','choice')),
  unit text, goal_value numeric, score_value smallint not null default 10, sort_order smallint not null default 0,
  is_active boolean not null default true, metadata jsonb not null default '{}', created_at timestamptz not null default now()
);
create table public.daily_checkins (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  template_id uuid not null references public.habit_templates(id) on delete cascade, record_date date not null,
  completed boolean not null default false, numeric_value numeric, text_value text, note text,
  earned_score smallint not null default 0, completed_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique (user_id, template_id, record_date)
);
create table public.menstrual_cycles (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  start_date date not null, end_date date, created_at timestamptz not null default now(), check (end_date is null or end_date >= start_date)
);
create unique index one_active_cycle_per_user on public.menstrual_cycles(user_id) where end_date is null;
create table public.cycle_symptoms (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  cycle_id uuid references public.menstrual_cycles(id) on delete set null, record_date date not null,
  pain text check (pain in ('pain','no_pain')), breast_swelling text check (breast_swelling in ('swollen','not_swollen')),
  acne text check (acne in ('acne','clear')), unique (user_id, record_date)
);
create table public.health_reports (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  report_type text not null check (report_type in ('weekly','on_demand')), period_start date not null, period_end date not null,
  health_score smallint not null check (health_score between 0 and 100), completion_rate numeric not null,
  metrics jsonb not null, correlations jsonb not null, content text not null, model text, created_at timestamptz not null default now()
);

create table public.teams (id uuid primary key default gen_random_uuid(), owner_id uuid not null references auth.users(id), name text not null check (char_length(name) between 1 and 60), invite_code text unique not null default encode(gen_random_bytes(9),'hex'), created_at timestamptz not null default now());
create table public.team_members (team_id uuid not null references public.teams(id) on delete cascade, user_id uuid not null references auth.users(id) on delete cascade, role text not null default 'member' check (role in ('owner','member')), share_progress boolean not null default false, joined_at timestamptz not null default now(), primary key (team_id,user_id));

create table public.posts (id uuid primary key default gen_random_uuid(), author_id uuid not null references auth.users(id) on delete cascade, author_name text not null default '匿名同伴', title text not null check(char_length(title) between 1 and 50), content text not null check(char_length(content) between 1 and 2000), tag text not null check(tag in ('饮食交流','运动打卡','经期与情绪','备孕/调理','吐槽树洞','其他')), image_urls text[] not null default '{}', created_at timestamptz not null default now());
create table public.comments (id uuid primary key default gen_random_uuid(), post_id uuid not null references public.posts(id) on delete cascade, author_id uuid not null references auth.users(id) on delete cascade, author_name text not null default '匿名同伴', content text not null check(char_length(content) between 1 and 300), created_at timestamptz not null default now());
create table public.likes (post_id uuid not null references public.posts(id) on delete cascade, user_id uuid not null references auth.users(id) on delete cascade, created_at timestamptz not null default now(), primary key(post_id,user_id));
create table public.post_reports (id uuid primary key default gen_random_uuid(), post_id uuid not null references public.posts(id) on delete cascade, reporter_id uuid not null references auth.users(id) on delete cascade, reason text not null, created_at timestamptz not null default now(), unique(post_id, reporter_id));

alter table public.profiles enable row level security; alter table public.habit_templates enable row level security; alter table public.daily_checkins enable row level security; alter table public.menstrual_cycles enable row level security; alter table public.cycle_symptoms enable row level security; alter table public.health_reports enable row level security; alter table public.teams enable row level security; alter table public.team_members enable row level security; alter table public.posts enable row level security; alter table public.comments enable row level security; alter table public.likes enable row level security; alter table public.post_reports enable row level security;

create policy "own profile" on public.profiles for all to authenticated using (id=auth.uid()) with check(id=auth.uid());
create policy "own health templates" on public.habit_templates for all to authenticated using (user_id is null or user_id=auth.uid()) with check(user_id=auth.uid());
create policy "own checkins" on public.daily_checkins for all to authenticated using(user_id=auth.uid()) with check(user_id=auth.uid());
create policy "own cycles" on public.menstrual_cycles for all to authenticated using(user_id=auth.uid()) with check(user_id=auth.uid());
create policy "own symptoms" on public.cycle_symptoms for all to authenticated using(user_id=auth.uid()) with check(user_id=auth.uid());
create policy "own reports" on public.health_reports for all to authenticated using(user_id=auth.uid()) with check(user_id=auth.uid());
create policy "team member reads team" on public.teams for select to authenticated using(exists(select 1 from public.team_members m where m.team_id=id and m.user_id=auth.uid()));
create policy "owner creates team" on public.teams for insert to authenticated with check(owner_id=auth.uid());
create policy "public forum reading" on public.posts for select using(true); create policy "author creates posts" on public.posts for insert to authenticated with check(author_id=auth.uid()); create policy "author deletes posts" on public.posts for delete to authenticated using(author_id=auth.uid());
create policy "public comment reading" on public.comments for select using(true); create policy "author creates comments" on public.comments for insert to authenticated with check(author_id=auth.uid());
create policy "public like reading" on public.likes for select using(true); create policy "author creates likes" on public.likes for insert to authenticated with check(user_id=auth.uid());
create policy "reporter creates report" on public.post_reports for insert to authenticated with check(reporter_id=auth.uid());

insert into storage.buckets(id,name,public) values ('forum-images','forum-images',true) on conflict(id) do nothing;
create policy "public image reads" on storage.objects for select using(bucket_id='forum-images');
create policy "upload own images" on storage.objects for insert to authenticated with check(bucket_id='forum-images' and (storage.foldername(name))[1]=auth.uid()::text);
