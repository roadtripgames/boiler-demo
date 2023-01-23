import type { GetServerSideProps } from "next/types";
import Header from "../../components/app/Header";
import BoilerAlert from "../../components/design-system/BoilerAlert";
import { api } from "../../utils/api";

import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { createTRPCContext } from "../../server/api/trpc";
import { appRouter } from "../../server/api/root";
import superjson from "superjson";
import { useRouter } from "next/router";
import { Button } from "../../components/design-system/Button";
import Link from "next/link";
import { useTeam } from "../../lib/useTeam";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, res } = context;

  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: await createTRPCContext({ req, res }),
    transformer: superjson,
  });

  await ssg.teams.getBySlug.prefetch({
    slug: context.query.team as string,
  });

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
  };
};

export default function TeamHome() {
  const { data: team } = useTeam();

  return (
    <div className="flex h-full min-h-screen flex-col">
      <Header />
      <div className="mx-auto flex h-full w-full max-w-7xl flex-col p-4">
        {team && (
          <>
            <div className="text-xl font-medium">{team.name} workspace</div>
            <Link
              className="mt-2"
              href={{
                pathname: `/[team]/settings/general`,
                query: { team: team.slug },
              }}
            >
              <Button>Manage team</Button>
            </Link>
          </>
        )}
        <BoilerAlert className="absolute bottom-4 right-4">
          This is a team&apos;s home page
        </BoilerAlert>
      </div>
    </div>
  );
}
