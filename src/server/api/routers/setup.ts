import { env } from "../../../env/server.mjs";
import _ from "lodash";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { DEFAULT_VALUE_DO_NOT_USE_IN_PRODUCTION } from "../../../env/schema.mjs";
import stripeRouter from "./stripe";
import { send } from "../email";

const setupRouter = createTRPCRouter({
  vars: publicProcedure.query(async () => {
    return _.mapValues(env, (value) =>
      !value || value === DEFAULT_VALUE_DO_NOT_USE_IN_PRODUCTION
        ? undefined
        : "✅"
    );
  }),
  hasUsers: protectedProcedure.query(async ({ ctx }) => {
    return (await ctx.prisma.user.count()) > 1;
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
