import { z } from "zod";
import { ROLE_ADMIN } from "../../../lib/roles";

import { createTRPCRouter, protectedProcedure } from "../trpc";
import { fetchTeamForUserIfValid } from "../utils";

const teamsRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    const { data, error } = await ctx.supabase
      .from("teams")
      .select(
        `*,
          users:teams_users(id:user_id)
        `
      )
      .eq("teams_users.user_id", ctx.session.user.id);

    if (error) {
      console.error(error);
      throw new Error("Could not get teams");
    }

    return data;
  }),
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const team = await fetchTeamForUserIfValid(
        ctx.supabase,
        ctx.session.user.id,
        input.id
      );

      const { error } = await ctx.supabase
        .from("teams")
        .delete()
        .eq("id", team.id);

      if (error) {
        console.error(error);
        throw new Error(
          `Could not delete team with id ${team.id} for user ${ctx.session.user.id}}`
        );
      }
    }),
  create: protectedProcedure
    .input(z.object({ name: z.string().min(1).max(24) }))
    .mutation(async ({ ctx, input }) => {
      // Supabase does not yet support transactions
      // The best way to currently do this is to make a postgres function
      // and then call that. Since we want to avoid that, we're going to just make calls here
      // Any failures will just be orphaned teams with no members which we can clean up
      const { data: team, error } = await ctx.supabase
        .from("teams")
        .insert({ name: input.name })
        .select()
        .single();

      if (error || !team) {
        console.error(error);
        throw new Error("Could not create team");
      }

      await ctx.supabase
        .from("teams_users")
        .insert({
          team_id: team.id,
          user_id: ctx.session.user.id,
          role: ROLE_ADMIN,
        });
    }),
});

export default teamsRouter;
