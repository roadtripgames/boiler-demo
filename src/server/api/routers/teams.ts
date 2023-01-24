import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { ROLE_ADMIN, ROLE_MEMBER } from "../../../lib/roles";
import { send } from "../email";

import {
  adminProcedure,
  createTRPCRouter,
  memberProcedure,
  protectedProcedure,
} from "../trpc";

const teamsRouter = createTRPCRouter({
  get: memberProcedure.query(async ({ ctx }) => {
    const team = ctx.team;

    return team;
  }),
  update: adminProcedure
    .input(
      z.object({
        name: z.string(),
        slug: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.team.update({
          where: { id: ctx.team.id },
          data: {
            name: input.name,
            slug: input.slug,
          },
        });
      } catch (e) {
        if (e instanceof PrismaClientKnownRequestError) {
          if (e.code === "P2002") {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: `URL unavailable. Please try another.`,
              cause: e,
            });
          }
        }
      }
    }),
  getBySlug: protectedProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      console.log(input);
      const team = await ctx.prisma.team.findFirst({
        where: {
          slug: input.slug,
          users: { some: { id: ctx.session.user.id } },
        },
      });

      return team;
    }),
  getAllTeams: protectedProcedure.query(async ({ ctx }) => {
    const teams = await ctx.prisma.team.findMany({
      where: {
        users: { some: { id: ctx.session.user.id } },
      },
    });

    return teams;
  }),
  delete: adminProcedure.mutation(async ({ ctx, input }) => {
    // cannot do implicit many-to-many on delete cascade, so we manually disconnect
    await ctx.prisma.$transaction(async (tx) => {
      await tx.team.update({
        where: { id: input.teamId },
        data: {
          users: { set: [] },
        },
      });

      await tx.team.deleteMany({
        where: {
          id: input.teamId,
        },
      });
    });
  }),
  create: protectedProcedure
    .input(z.object({ name: z.string().min(1).max(24) }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.team.create({
        data: {
          name: input.name,
          slug: input.name.replaceAll(" ", "-").toLowerCase(),
          users: {
            connect: { id: ctx.session.user.id },
          },
          roles: {
            create: {
              name: ROLE_ADMIN,
              user: { connect: { id: ctx.session.user.id } },
            },
          },
        },
      });
    }),
  getMembers: memberProcedure.query(async ({ ctx, input }) => {
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
  inviteMembers: adminProcedure
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
      const team = ctx.team;

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
                team,
                from: {
                  name: ctx.session.user.name ?? team.name,
                  email: ctx.session.user.email ?? "",
                },
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
  updateRole: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        role: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.userTeamRole.update({
        where: {
          userId_teamId: { userId: input.userId, teamId: input.teamId },
        },
        data: { name: input.role },
      });
    }),
});

export default teamsRouter;
