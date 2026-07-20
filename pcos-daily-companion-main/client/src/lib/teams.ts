import { ensureAnonymousSession, supabase } from "@/lib/supabase";

export type Team = {
  id: string;
  name: string;
  invite_code: string;
  owner_id: string;
  created_at: string;
  viewer_id: string;
  team_members: { user_id: string; role: "owner" | "member"; share_progress: boolean }[];
};

export async function getMyTeams() {
  const user = await ensureAnonymousSession();
  const { data, error } = await supabase
    .from("teams")
    .select("id,name,invite_code,owner_id,created_at,team_members(user_id,role,share_progress)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(team => ({ ...team, viewer_id: user.id })) as Team[];
}

export async function createTeam(name: string) {
  await ensureAnonymousSession();
  const { data, error } = await supabase.rpc("create_private_team", { team_name: name });
  if (error) throw error;
  return data as Team;
}

export async function joinTeam(inviteCode: string) {
  await ensureAnonymousSession();
  const { data, error } = await supabase.rpc("join_private_team", { code: inviteCode });
  if (error) throw error;
  return data as Team;
}

export async function setProgressSharing(teamId: string, shareProgress: boolean) {
  const user = await ensureAnonymousSession();
  const { error } = await supabase
    .from("team_members")
    .update({ share_progress: shareProgress })
    .eq("team_id", teamId)
    .eq("user_id", user.id);
  if (error) throw error;
}
