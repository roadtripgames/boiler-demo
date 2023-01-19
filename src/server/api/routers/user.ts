import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";
import { getTeamOrThrow } from "../utils";

const userRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.session.user.id },
      include: {
        currentTeam: true,
      },
    });

    return user;

    // const currentTeam = Array.isArray(data?.currentTeam)
    //   ? data?.currentTeam[0]
    //   : data?.currentTeam;

    // return {
    //   ...data,
    //   email: ctx.session.user.email,
    //   session: ctx.session.user.id,
    //   currentTeam,
    // };
  }),
  update: protectedProcedure
    .input(
      z.object({
        name: z.string().optional(),
        jobTitle: z.string().optional(),
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
        jobTitle: z.string(),
        interest: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: {
          ...input,
          hasOnboarded: true,
        },
      });
    }),
  selectTeam: protectedProcedure
    .input(
      z.object({
        teamId: z.string().or(z.null()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!input.teamId) {
        await ctx.prisma.user.update({
          where: { id: ctx.session.user.id },
          data: { currentTeamId: null },
        });
        return;
      }

      const team = await getTeamOrThrow(ctx, input.teamId);

      await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          currentTeamId: team.id,
        },
      });
    }),
});

export default userRouter;
