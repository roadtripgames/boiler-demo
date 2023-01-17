import _ from "lodash";
import { z } from "zod";
import type { Database } from "../../../../databaseTypes";
import { ROLES, ROLE_ADMIN, ROLE_MEMBER } from "../../../lib/roles";

import { createTRPCRouter, protectedProcedure } from "../trpc";
import { fetchTeamForUserIfValid } from "../utils";

const membersRouter = createTRPCRouter({
  get: protectedProcedure
    .input(z.object({ teamId: z.number().or(z.undefined()) }))
    .query(async ({ ctx, input }) => {
      if (input.teamId == null) {
        return null;
      }

      // fetch team to make sure you're a member
      const { data: team, error } = await ctx.supabase
        .from("teams")
        .select(
          `*,
          users:teams_users(id:user_id)
        `
        )
        .eq("teams_users.user_id", ctx.session.user.id)
        .eq("id", input.teamId)
        .single();

      if (!team || error) {
        console.error(error);
        throw new Error("Could not get team");
      }

      const { data: membersRaw, error: membersError } = await ctx.supabase
        .from("teams_users")
        .select(
          `
          users (
            id,
            full_name,
            job_title,
            avatar_url,
            email
          ),
          role
          `
        )
        .eq("team_id", input.teamId)
        .order("created_at", { ascending: true });

      if (membersError || !membersRaw) {
        console.error(membersError);
        throw new Error("Could not get members");
      }

      // return membersRaw;

      // need this type because supabase interprets the users
      // as potentially null even though its enforced as "not null"
      // by postgres
      const members = membersRaw.map((m) => ({
        ...m.users,
        role: m.role,
      })) as (Pick<
        Database["public"]["Tables"]["users"]["Row"],
        "avatar_url" | "full_name" | "id" | "job_title" | "email"
      > & { role: string })[];
      return members;
    }),
  invite: protectedProcedure
    .input(
      z.object({
        teamId: z.number(),
        invites: z.array(
          z.object({
            email: z.string().email(),
            role: z.enum([ROLE_ADMIN, ROLE_MEMBER]),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const team = await fetchTeamForUserIfValid(
        ctx.supabase,
        ctx.session.user.id,
        input.teamId
      );

      // create users
      const newUsers = await Promise.all(
        input.invites.map(({ email }) =>
          ctx.supabase.auth.admin.inviteUserByEmail(email)
        )
      );

      // TODO: set the current_team_id to this team

      const inputValuesByEmail = _.keyBy(input.invites, "email");
      await ctx.supabase.from("teams_users").insert(
        newUsers.flatMap(({ data: { user } }) => {
          const team_id = team.id;
          const user_id = user?.id;
          const role = inputValuesByEmail[user?.email ?? ""]?.role;

          if (!user_id || !team_id || !role) return [];

          return [
            {
              team_id,
              user_id,
              role,
            },
          ];
        })
      );
    }),
});

export default membersRouter;
