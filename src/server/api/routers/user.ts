import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

const userRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    const { data, error } = await ctx.supabase
      .from("users")
      .select(
        `
      *,
      current_team:teams!users_current_team_id_fkey (*)
      `
      )
      .eq("id", ctx.session.user.id)
      .single();

    if (error) {
      console.error(error);
      throw new Error(`Could not get user ${ctx.session.user.id}`);
    }

    const current_team = Array.isArray(data?.current_team)
      ? data?.current_team[0]
      : data?.current_team;

    return {
      ...data,
      email: ctx.session.user.email,
      session: ctx.session.user.id,
      current_team,
    };
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
  finishOnboarding: protectedProcedure
    .input(
      z.object({
        full_name: z.string(),
        job_title: z.string(),
        interests: z.array(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.supabase
        .from("users")
        .update({ ...input, has_onboarded: true })
        .eq("id", ctx.session.user.id);
    }),
  selectTeam: protectedProcedure
    .input(
      z.object({
        teamId: z.number().or(z.null()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // null means personal account
      if (input.teamId != null) {
        // fetch the team to make sure the user owns it
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

        if (!team) {
          console.error(error);
          throw new Error(`Cannot join a team you're not part of.`);
        }
      }

      await ctx.supabase
        .from("users")
        .update({ current_team_id: input.teamId })
        .eq("id", ctx.session.user.id);
    }),
});

export default userRouter;
