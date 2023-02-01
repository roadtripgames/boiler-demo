import { env } from "../../../env/server.mjs";
import _ from "lodash";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { DEFAULT_VALUE_DO_NOT_USE_IN_PRODUCTION } from "../../../env/schema.mjs";
import stripeRouter from "./stripe";
import { send } from "../email";

const setupRouter = createTRPCRouter({
  vars: publicProcedure.query(async () => {
    return _.mapValues(env, (value) =>
      !value || value.includes(DEFAULT_VALUE_DO_NOT_USE_IN_PRODUCTION)
        ? undefined
        : "set"
    );
  }),
  hasUsers: protectedProcedure.query(async ({ ctx }) => {
    return (await ctx.prisma.user.count()) > 0;
  }),
  hasProducts: protectedProcedure.query(async ({ ctx }) => {
    return (await ctx.prisma.product.count()) > 0;
  }),
  sendWelcomeEmail: protectedProcedure.mutation(async ({ ctx }) => {
    const user = ctx.session.user;

    if (!user.email) return;

    send(user.email, "Test Welcome!", {
      type: "welcome",
      props: { toEmail: user.email },
    });
  }),
  syncStripeProducts: protectedProcedure.mutation(async ({ ctx }) => {
    const caller = stripeRouter.createCaller(ctx);

    await caller.syncProducts();
    await caller.syncPrices();
  }),
});

export default setupRouter;
