import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../../../databaseTypes";

export const fetchTeamForUserIfValid = async (
  supabase: SupabaseClient<Database>,
  userId: string,
  teamId: number
) => {
  const { data: team, error } = await supabase
    .from("teams")
    .select(
      `*,
    users:teams_users(id:user_id)
  `
    )
    .eq("teams_users.user_id", userId)
    .eq("id", teamId)
    .single();

  if (!team) {
    console.error(error);
    throw new Error(
      `Could not find team with id ${teamId} for user ${userId}}`
    );
  }

  return team;
};
