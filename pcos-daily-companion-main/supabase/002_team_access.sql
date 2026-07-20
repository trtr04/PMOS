-- Run after 001_health_and_team_extension.sql.
-- Private teams: only members can see a team, and joining requires its invite code.

drop policy if exists "team members can read teams" on public.teams;
drop policy if exists "team owners can update teams" on public.teams;
drop policy if exists "team owners can delete teams" on public.teams;
drop policy if exists "members can read their team roster" on public.team_members;
drop policy if exists "members can update their own sharing choice" on public.team_members;

create or replace function public.is_team_member(target_team_id uuid)
returns boolean
language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.team_members where team_id = target_team_id and user_id = auth.uid()) $$;

create policy "team members can read teams" on public.teams for select to authenticated
using (
  owner_id = auth.uid()
  or public.is_team_member(id)
);

create policy "team owners can update teams" on public.teams for update to authenticated
using (owner_id = auth.uid()) with check (owner_id = auth.uid());

create policy "team owners can delete teams" on public.teams for delete to authenticated
using (owner_id = auth.uid());

create policy "members can read their team roster" on public.team_members for select to authenticated
using (public.is_team_member(team_id));

create policy "members can update their own sharing choice" on public.team_members for update to authenticated
using (user_id = auth.uid()) with check (user_id = auth.uid());

create or replace function public.create_private_team(team_name text)
returns public.teams
language plpgsql security definer set search_path = public
as $$
declare new_team public.teams;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  if char_length(trim(team_name)) not between 1 and 60 then raise exception 'Team name must be 1-60 characters'; end if;
  insert into public.teams (owner_id, name) values (auth.uid(), trim(team_name)) returning * into new_team;
  insert into public.team_members (team_id, user_id, role) values (new_team.id, auth.uid(), 'owner');
  return new_team;
end;
$$;

create or replace function public.join_private_team(code text)
returns public.teams
language plpgsql security definer set search_path = public
as $$
declare joined_team public.teams;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  select * into joined_team from public.teams where invite_code = lower(trim(code));
  if joined_team.id is null then raise exception 'Invitation code is invalid'; end if;
  insert into public.team_members (team_id, user_id, role) values (joined_team.id, auth.uid(), 'member')
  on conflict (team_id, user_id) do nothing;
  return joined_team;
end;
$$;

grant execute on function public.create_private_team(text) to authenticated;
grant execute on function public.join_private_team(text) to authenticated;
