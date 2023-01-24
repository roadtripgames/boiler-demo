import { z } from "zod";
import { useRouter } from "next/router";
import { api } from "../utils/api";

export const TeamRouteQueryType = z.object({
  team: z.string(),
});

export function useTeam() {
  const router = useRouter();

  const query = TeamRouteQueryType.safeParse(router.query);
  const slug = query.success ? query.data.team : "";

  const data = api.teams.get.useQuery({ slug });

  return {
    ...data,
    slug,
  };
}
