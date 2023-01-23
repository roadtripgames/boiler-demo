import { z } from "zod";
import { useRouter } from "next/router";
import { api } from "../utils/api";

const RouteQuerySchema = z.object({
  team: z.string(),
});

export function useTeam() {
  const router = useRouter();

  const query = RouteQuerySchema.safeParse(router.query);
  const slug = query.success ? query.data.team : "";

  const data = api.teams.getBySlug.useQuery({ slug });

  return {
    ...data,
    slug,
  };
}
