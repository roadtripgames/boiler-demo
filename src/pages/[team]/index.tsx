import type { GetServerSideProps } from "next/types";
import Header from "../../components/app/Header";
import NeorepoAlert from "../../components/design-system/NeorepoAlert";

import { Button } from "../../components/design-system/Button";
import Link from "next/link";
import { useTeam } from "../../lib/useTeam";
import { createSSG } from "../../utils/ssg";
import Todos from "../../components/app/Todos";

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
  return (
    <div className="flex h-full min-h-screen flex-col">
      <Header />
      <div className="mx-auto flex h-full w-full max-w-7xl animate-fadeIn flex-col p-4">
        <div className="container mx-auto w-full">
          <Todos />
        </div>
      </div>
    </div>
  );
}
