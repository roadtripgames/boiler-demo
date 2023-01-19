import _ from "lodash";
import { z } from "zod";
import { ROLE_ADMIN, ROLE_MEMBER } from "../../../lib/roles";

import { createTRPCRouter, protectedProcedure } from "../trpc";
import { getTeamOrThrow } from "../utils";

const membersRouter = createTRPCRouter({
  get: protectedProcedure
    .input(z.object({ teamId: z.string() }))
    .query(async ({ ctx, input }) => {
      const members = await ctx.prisma.user.findMany({
        where: { teams: { some: { id: input.teamId } } },
        include: {
          roles: {
            where: { teamId: input.teamId },
            take: 1,
            select: { name: true },
          },
        },
      });

      return members;
    }),
  invite: protectedProcedure
    .input(
      z.object({
        teamId: z.string(),
        invites: z.array(
          z.object({
            email: z.string().email(),
            role: z.enum([ROLE_ADMIN, ROLE_MEMBER]),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const team = await getTeamOrThrow(ctx, input.teamId);

      await ctx.prisma.userInvite.createMany({
        data: input.invites.map(({ email, role }) => ({
          email,
          role,
          teamId: team.id,
        })),
      });
    }),
});

export default membersRouter;
