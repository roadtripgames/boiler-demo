import { z } from "zod";
import { ROLE_ADMIN, ROLE_MEMBER } from "../../../lib/roles";

import { createTRPCRouter, protectedProcedure } from "../trpc";
import { getTeamOrThrow } from "../utils";

const teamsRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    const teams = await ctx.prisma.team.findMany({
      where: {
        users: { some: { id: ctx.session.user.id } },
      },
    });

    return teams;
  }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.team.deleteMany({
        where: {
          users: { some: { id: ctx.session.user.id } },
          id: input.id,
        },
      });
    }),
  create: protectedProcedure
    .input(z.object({ name: z.string().min(1).max(24) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.team.create({
        data: {
          name: input.name,
          users: {
            connect: { id: ctx.session.user.id },
          },
          roles: {
            create: {
              name: ROLE_ADMIN,
              user: { connect: { id: ctx.session.user.id } },
            },
          },
          currentTeamUsers: {
            connect: { id: ctx.session.user.id },
          },
        },
      });
    }),
  invites: protectedProcedure
    .input(z.object({ teamId: z.string() }))
    .query(async ({ ctx, input }) => {
      const invites = await ctx.prisma.userInvite.findMany({
        where: {
          teamId: input.teamId,
          team: { users: { some: { id: ctx.session.user.id } } },
        },
      });

      return invites;
    }),
});

export default teamsRouter;
