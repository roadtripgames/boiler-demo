import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";
import { z } from "zod";
import { ROLE_ADMIN, ROLE_MEMBER } from "../../../lib/roles";
import { send } from "../email";

import {
  adminProcedure,
  createTRPCRouter,
  memberProcedure,
  protectedProcedure,
  publicProcedure,
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
  getAllTeams: protectedProcedure.query(async ({ ctx }) => {
    const teams = await ctx.prisma.team.findMany({
      where: {
        users: { some: { id: ctx.session.user.id } },
      },
    });

    return teams;
  }),
  delete: adminProcedure.mutation(async ({ ctx }) => {
    // cannot do implicit many-to-many on delete cascade, so we manually disconnect
    await ctx.prisma.$transaction(async (tx) => {
      await tx.team.update({
        where: { id: ctx.team.id },
        data: {
          users: { set: [] },
        },
      });

      await tx.team.deleteMany({
        where: {
          id: ctx.team.id,
        },
      });
    });
  }),
  leave: memberProcedure.mutation(async ({ ctx }) => {
    if (ctx.team.roles.length === 1) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `You are the last member of this team. Please transfer ownership before leaving.`,
      });
    }

    await ctx.prisma.team.update({
      where: { id: ctx.team.id },
      data: {
        users: { disconnect: { id: ctx.session.user.id } },
      },
    });
  }),
  create: protectedProcedure
    .input(z.object({ name: z.string().min(1).max(24) }))
    .mutation(async ({ ctx, input }) => {
      let slug = input.name.replaceAll(" ", "-").toLowerCase();

      const slugExists = await ctx.prisma.team.findFirst({ where: { slug } });
      if (slugExists) {
        slug += "-" + Math.floor(Math.random() * 100000000);
      }

      return await ctx.prisma.team.create({
        data: {
          name: input.name,
          slug,
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
  getMembers: memberProcedure.query(async ({ ctx }) => {
    const members = await ctx.prisma.user.findMany({
      where: {
        teams: { some: { id: ctx.team.id } },
      },
      include: {
        roles: {
          where: { teamId: ctx.team.id },
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
          code: nanoid(),
        })),
        skipDuplicates: true,
      });

      await Promise.all(
        input.invites.map((invite) =>
          send(
            invite.email,
            `${ctx.session.user.name} has invited you to join ${team.name} on Neorepo`,
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
  invites: memberProcedure.query(async ({ ctx }) => {
    const invites = await ctx.prisma.userInvite.findMany({
      where: {
        teamId: ctx.team.id,
        team: { users: { some: { id: ctx.session.user.id } } },
      },
    });

    return invites;
  }),
  resendInviteEmail: adminProcedure
    .input(z.object({ inviteId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const invite = await ctx.prisma.userInvite.findFirst({
        where: { id: input.inviteId },
      });

      if (!invite) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Invite not found`,
        });
      }

      send(
        invite.email,
        `${ctx.session.user.name} has invited you to join ${ctx.team.name} on Neorepo`,
        {
          type: "invite-user",
          props: {
            team: ctx.team,
            from: {
              name: ctx.session.user.name ?? ctx.team.name,
              email: ctx.session.user.email ?? "",
            },
            toEmail: invite.email,
          },
        }
      );
    }),
  deleteInvite: adminProcedure
    .input(z.object({ inviteId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.userInvite.delete({
        where: { id: input.inviteId },
      });
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
          userId_teamId: { userId: input.userId, teamId: ctx.team.id },
        },
        data: { name: input.role },
      });
    }),
  acceptInvite: protectedProcedure
    .input(z.object({ code: z.string(), email: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const invite = await ctx.prisma.userInvite.findFirst({
        where: { code: input.code, email: input.email },
        include: { team: true },
      });

      if (!invite) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Invite not found`,
        });
      }

      await ctx.prisma.userInvite.delete({ where: { id: invite.id } });
      const team = await ctx.prisma.team.update({
        data: {
          users: {
            connect: { id: ctx.session.user.id },
          },
          roles: {
            create: {
              name: invite.role,
              user: { connect: { id: ctx.session.user.id } },
            },
          },
        },
        where: { id: invite.teamId },
        select: { id: true, name: true, slug: true },
      });

      return team;
    }),
});

export default teamsRouter;
