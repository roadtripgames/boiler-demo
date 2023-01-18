import { z } from "zod";
import { ROLE_ADMIN } from "../../../lib/roles";

import { createTRPCRouter, protectedProcedure } from "../trpc";

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
          AND: [
            {
              users: { some: { id: ctx.session.user.id } },
            },
            {
              id: input.id,
            },
          ],
        },
      });
      // const team = await fetchTeamForUserIfValid(
      //   ctx.supabase,
      //   ctx.session.user.id,
      //   input.id
      // );
      // const { error } = await ctx.supabase
      //   .from("teams")
      //   .delete()
      //   .eq("id", team.id);
      // if (error) {
      //   console.error(error);
      //   throw new Error(
      //     `Could not delete team with id ${team.id} for user ${ctx.session.user.id}}`
      //   );
      // }
    }),
  create: protectedProcedure
    .input(z.object({ name: z.string().min(1).max(24) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.$transaction(async (tx) => {
        const team = await tx.team.create({
          data: {
            name: input.name,
            users: {
              connect: { id: ctx.session.user.id },
            },
          },
        });

        await tx.user.update({
          where: { id: ctx.session.user.id },
          data: { currentTeamId: team.id },
        });
      });
    }),
});

export default teamsRouter;
