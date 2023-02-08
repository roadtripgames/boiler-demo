import type { GetServerSideProps } from "next/types";
import Header from "@/components/app/Header";

import { Button } from "@/components/design-system/Button";
import Link from "next/link";
import { useTeam } from "@/lib/useTeam";
import { createSSG } from "@/utils/ssg";
import NeorepoSetup from "@/components/app/NeorepoSetup";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Spinner from "@/components/design-system/Spinner";

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
  const router = useRouter();
  const { data: team, isError } = useTeam();

  useEffect(() => {
    if (isError) {
      router.push("@/");
    } else {
      console.log("not pushing!");
    }
  }, [isError, router]);

  if (!team) {
    return (
      <div className="flex h-full w-full items-center justify-between">
        <Spinner />
      </div>
    );
  }

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
