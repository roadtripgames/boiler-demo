import { z } from "zod";
import bcrypt from "bcrypt";

import teams from "./teams";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

export const ERROR_EMAIL_ALREADY_IN_USE = "ERROR_EMAIL_ALREADY_IN_USE";

const userRouter = createTRPCRouter({
  registerWithEmailAndPassword: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(8, 'Password is not long enough'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const passwordHash = await bcrypt.hash(input.password, 12);
      try {
        await ctx.prisma.user.create({
          data: { email: input.email, passwordHash },
        });
      } catch (e) {
        if (e instanceof PrismaClientKnownRequestError) {
          if (e.code === "P2002") {
            return;
          } else {
            throw e;
          }
        }
      }
    }),
  get: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.session.user.id },
      include: {
        teams: { select: { id: true, name: true, slug: true } },
      },
    });

    return user;
  }),
  update: protectedProcedure
    .input(
      z.object({
        name: z.string().optional(),
        image: z.string().optional(),
        billing_address: z.string().optional(),
        has_onboarded: z.boolean().optional(),
        payment_method: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.user.update({
        data: input,
        where: { id: ctx.session.user.id },
      });
    }),
  finishOnboarding: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        teamName: z.string().min(1).max(24),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: {
          name: input.name,
          hasOnboarded: true,
        },
      });

      const team = await teams
        .createCaller(ctx)
        .create({ name: input.teamName });

      return { team };
    }),
});

export default userRouter;
