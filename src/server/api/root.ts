import { createTRPCRouter } from "./trpc";
import userRouter from "./routers/user";
import teamsRouter from "./routers/teams";
import stripeRouter from "./routers/stripe";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  teams: teamsRouter,
  stripe: stripeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
