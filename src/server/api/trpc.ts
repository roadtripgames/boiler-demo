/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1)
 * 2. You want to create a new middleware or type of procedure (see Part 3)
 *
 * tl;dr - this is where all the tRPC server stuff is created and plugged in.
 * The pieces you will need to use are documented accordingly near the end
 */

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API
 *
 * These allow you to access things like the database, the session, etc, when
 * processing a request
 *
 */
import { type Session } from "next-auth";
import type { ServerSessionOptions } from "../auth";
import { getServerAuthSession } from "../auth";
import { prisma } from "../db";
import { z } from "zod";

type CreateContextOptions = {
  session: Session | null;
  team: Team | null;
};

/**
 * This helper generates the "internals" for a tRPC context. If you need to use
 * it, you can export it from here
 *
 * Examples of things you may need it for:
 * - testing, so we dont have to mock Next.js' req/res
 * - trpc's `createSSGHelpers` where we don't have req/res
 * @see https://create.t3.gg/en/usage/trpc#-servertrpccontextts
 */
const createInnerTRPCContext = (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    prisma,
  };
};

/**
 * This is the actual context you'll use in your router. It will be used to
 * process every request that goes through your tRPC endpoint
 * @link https://trpc.io/docs/context
 */
export const createTRPCContext = async (opts: ServerSessionOptions) => {
  const { req, res } = opts;

  // Get the session from the server using the unstable_getServerSession wrapper function
  const session = await getServerAuthSession({ req, res });

  return createInnerTRPCContext({
    session,
    team: null,
  });
};

/**
 * 2. INITIALIZATION
 *
 * This is where the trpc api is initialized, connecting the context and
 * transformer
 */
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { Team } from "@prisma/client";

export type ServerContext = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<ServerContext>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these
 * a lot in the /src/server/api/routers folder
 */

/**
 * This is how you create new routers and subrouters in your tRPC API
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Public (unauthed) procedure
 *
 * This is the base piece you use to build new queries and mutations on your
 * tRPC API. It does not guarantee that a user querying is authorized, but you
 * can still access user session data if they are logged in
 */
export const publicProcedure = t.procedure;

/**
 * Reusable middleware that enforces users are logged in before running the
 * procedure
 */
const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

/**
 * Protected (authed) procedure
 *
 * If you want a query or mutation to ONLY be accessible to logged in users, use
 * this. It verifies the session is valid and guarantees ctx.session.user is not
 * null
 *
 * @see https://trpc.io/docs/procedures
 */
export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);

const TeamInput = z
  .object({
    teamId: z.string(),
    slug: z.string(),
  })
  .partial()
  .refine(({ teamId, slug }) => {
    if (!teamId && !slug) {
      throw new Error("You must provide either teamId or slug");
    }

    return true;
  });

export const adminProcedure = protectedProcedure
  .input(TeamInput)
  .use(async ({ next, ctx, input, ...rest }) => {
    const idObj =
      "teamId" in input ? { id: input.teamId } : { slug: input.slug };

    const user = ctx.session.user;
    const team = await prisma.team.findFirst({
      where: {
        ...idObj,
        users: { some: { id: user.id } },
        roles: { some: { name: "ADMIN", user: { id: user.id } } },
      },
      include: {
        roles: true,
        subscription: { include: { price: { include: { product: true } } } },
      },
    });

    if (!team) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You must be an admin to do this",
      });
    }

    return next({
      ...rest,
      ctx: { ...ctx, team },
    });
  });

export const memberProcedure = protectedProcedure
  .input(TeamInput)
  .use(async ({ next, ctx, input, ...rest }) => {
    const idObj =
      "teamId" in input ? { id: input.teamId } : { slug: input.slug };
    const user = ctx.session.user;
    const team = await prisma.team.findFirst({
      where: {
        ...idObj,
        users: { some: { id: user.id } },
      },
      include: {
        roles: true,
        subscription: { include: { price: { include: { product: true } } } },
      },
    });

    if (!team) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You're not in this team",
      });
    }

    return next({
      ...rest,
      ctx: { ...ctx, team },
    });
  });
