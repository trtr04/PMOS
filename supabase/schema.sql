-- Run this entire file in Supabase SQL Editor.
create table public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references auth.users(id) on delete cascade,
  author_name text not null default '匿名同伴' check (char_length(author_name) between 1 and 30),
  title text not null check (char_length(title) between 1 and 50),
  content text not null check (char_length(content) between 1 and 2000),
  tag text not null check (tag in ('饮食交流','运动打卡','经期与情绪','备孕/调理','吐槽树洞','其他')),
  image_urls text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  author_name text not null default '匿名同伴' check (char_length(author_name) between 1 and 30),
  content text not null check (char_length(content) between 1 and 300),
  created_at timestamptz not null default now()
);

create table public.likes (
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

create index comments_post_created_at on public.comments (post_id, created_at);
create index posts_created_at on public.posts (created_at desc);

alter table public.posts enable row level security;
alter table public.comments enable row level security;
alter table public.likes enable row level security;

create policy "public forum reading" on public.posts for select using (true);
create policy "anonymous users create own posts" on public.posts for insert to authenticated with check (author_id = auth.uid());
create policy "authors delete own posts" on public.posts for delete to authenticated using (author_id = auth.uid());
create policy "public comment reading" on public.comments for select using (true);
create policy "anonymous users create own comments" on public.comments for insert to authenticated with check (author_id = auth.uid());
create policy "public like reading" on public.likes for select using (true);
create policy "anonymous users create own likes" on public.likes for insert to authenticated with check (user_id = auth.uid());

insert into storage.buckets (id, name, public) values ('forum-images', 'forum-images', true)
on conflict (id) do nothing;
create policy "public forum image reading" on storage.objects for select using (bucket_id = 'forum-images');
create policy "anonymous users upload to own folder" on storage.objects for insert to authenticated
with check (bucket_id = 'forum-images' and (storage.foldername(name))[1] = auth.uid()::text);
