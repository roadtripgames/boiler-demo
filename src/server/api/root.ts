import { createTRPCRouter } from "./trpc";
import setupRouter from "./routers/setup";
import userRouter from "./routers/user";
import teamsRouter from "./routers/teams";
import billingRouter from "./routers/billing";
import stripeRouter from "./routers/stripe";
import todoRouter from "./routers/todos";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  setup: setupRouter,
  user: userRouter,
  teams: teamsRouter,
  billing: billingRouter,
  stripe: stripeRouter,
  todos: todoRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
