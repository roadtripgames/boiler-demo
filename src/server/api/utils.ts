import type { ServerContext } from "./trpc";

export const getTeamOrThrow = async (ctx: ServerContext, teamId: string) => {
  if (!ctx.session?.user) throw new Error("Not authenticated");

  const team = await ctx.prisma.team.findFirst({
    where: {
      id: teamId,
      users: { some: { id: ctx.session.user.id } },
    },
  });

  if (!team) {
    throw new Error(`Team not found or you're not a member of it`);
  }

  return team;
};
