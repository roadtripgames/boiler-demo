import type { GetServerSideProps } from "next/types";
import Header from "../../components/app/Header";
import BoilerAlert from "../../components/design-system/BoilerAlert";

import { Button } from "../../components/design-system/Button";
import Link from "next/link";
import { useTeam } from "../../lib/useTeam";
import { createSSG } from "../../utils/ssg";
import NeorepoSetup from "../../components/app/NeorepoSetup";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, res } = context;

  const ssg = await createSSG({ req, res });

  await ssg.teams.get.prefetch({
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
      <div className="mx-auto flex h-full w-full max-w-7xl animate-fadeIn flex-col p-4">
        {team && (
          <div className="flex items-center gap-x-24">
            <h1 className="text-xl font-medium">{team.name} workspace</h1>
            <Link
              className=""
              href={{
                pathname: `/[team]/settings/general`,
                query: { team: team.slug },
              }}
            >
              <Button>Manage team</Button>
            </Link>
          </div>
        )}
        <div className="my-4">
          <NeorepoSetup />
        </div>
        <BoilerAlert className="absolute bottom-4 right-4">
          This is a team&apos;s home page
        </BoilerAlert>
      </div>
    </div>
  );
}
