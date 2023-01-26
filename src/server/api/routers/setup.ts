import { env } from "../../../env/server.mjs";
import { createTRPCRouter, publicProcedure } from "../trpc";

const setupRouter = createTRPCRouter({
  vars: publicProcedure.query(async () => {
    return Object.entries(env).reduce((acc, [key, value]) => {
      acc[key] = !!value ? "✅" : undefined;
      return acc;
    }, {} as Record<string, string | undefined>);
  }),
});

export default setupRouter;
