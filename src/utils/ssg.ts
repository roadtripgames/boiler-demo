import superjson from "superjson";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { appRouter } from "../server/api/root";
import { createTRPCContext } from "../server/api/trpc";
import type { ServerSessionOptions } from "../server/auth";

export const createSSG = async (params: ServerSessionOptions) =>
  createProxySSGHelpers({
    router: appRouter,
    ctx: await createTRPCContext(params),
    transformer: superjson,
  });
