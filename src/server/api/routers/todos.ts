import _ from "lodash";
import { createTRPCRouter, memberProcedure } from "../trpc";
import { z } from "zod";

const todoRouter = createTRPCRouter({
  get: memberProcedure.query(async ({ ctx }) => {
    return ctx.prisma.todo.findMany({ where: { teamId: ctx.team.id } });
  }),
  create: memberProcedure
    .input(z.object({ text: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.todo.create({
        data: { text: input.text, teamId: ctx.team.id },
      });
    }),
});

export default todoRouter;
