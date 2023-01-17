import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

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
      // fetch the team to make sure the user owns it
      const { data: team, error } = await ctx.supabase
        .from("teams")
        .select(
          `*,
          users:teams_users(id:user_id)
        `
        )
        .eq("teams_users.user_id", ctx.session.user.id)
        .eq("id", input.id)
        .single();

      if (team) {
        const { error } = await ctx.supabase
          .from("teams")
          .delete()
          .eq("id", input.id);
        if (error) {
          console.error(error);
          throw new Error("Could not delete team");
        }
      } else {
        console.error(error);
        throw new Error("Could not delete team");
      }
    }),
  create: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
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
        .insert({ team_id: team.id, user_id: ctx.session.user.id });
    }),
  update: protectedProcedure
    .input(
      z.object({
        full_name: z.string().optional(),
        job_title: z.string().optional(),
        interests: z.array(z.string()).optional(),
        avatar_url: z.string().optional(),
        billing_address: z.string().optional(),
        has_onboarded: z.boolean().optional(),
        payment_method: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.supabase
        .from("users")
        .update(input)
        .eq("id", ctx.session.user.id);
    }),
});

export default teamsRouter;
