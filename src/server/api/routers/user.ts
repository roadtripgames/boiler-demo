import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

const userRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.session.user.id },
    });

    return user;

    // const current_team = Array.isArray(data?.current_team)
    //   ? data?.current_team[0]
    //   : data?.current_team;

    // return {
    //   ...data,
    //   email: ctx.session.user.email,
    //   session: ctx.session.user.id,
    //   current_team,
    // };
  }),
  update: protectedProcedure
    .input(
      z.object({
        name: z.string().optional(),
        jobtitle: z.string().optional(),
        interests: z.array(z.string()).optional(),
        image: z.string().optional(),
        billing_address: z.string().optional(),
        has_onboarded: z.boolean().optional(),
        payment_method: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // await ctx.supabase
      //   .from("users")
      //   .update(input)
      //   .eq("id", ctx.session.user.id);
    }),
  finishOnboarding: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        jobtitle: z.string(),
        interests: z.array(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // await ctx.supabase
      //   .from("users")
      //   .update({ ...input, has_onboarded: true })
      //   .eq("id", ctx.session.user.id);
    }),
  selectTeam: protectedProcedure
    .input(
      z.object({
        teamId: z.string().or(z.null()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: {
          currentTeamId: input.teamId,
        },
      });
    }),
});

export default userRouter;
