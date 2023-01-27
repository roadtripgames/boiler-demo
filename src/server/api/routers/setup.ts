import { env } from "../../../env/server.mjs";
import _ from "lodash";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { DEFAULT_VALUE_DO_NOT_USE_IN_PRODUCTION } from "../../../env/schema.mjs";

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
});

export default setupRouter;
