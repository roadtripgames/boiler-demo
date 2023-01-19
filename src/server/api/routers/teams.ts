import { z } from "zod";
import { ROLE_ADMIN, ROLE_MEMBER } from "../../../lib/roles";
import { send } from "../email";

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
  getMembers: protectedProcedure
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
  inviteMembers: protectedProcedure
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
        skipDuplicates: true,
      });

      await Promise.all(
        input.invites.map((invite) =>
          send(
            invite.email,
            `${ctx.session.user.name} has invited you to join ${team.name} on Selene`,
            {
              type: "invite-user",
              props: {
                teamName: team.name,
                fromEmail: ctx.session.user.email,
                fromName: ctx.session.user.name,
                toEmail: invite.email,
              },
            }
          )
        )
      );
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
