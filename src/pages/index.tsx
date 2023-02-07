import { useSession } from "next-auth/react";
import Onboarding from "../components/app/Onboarding";
import { api } from "../utils/api";
import CreateTeamModal from "../components/app/CreateTeamModal";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button } from "../components/design-system/Button";

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { data: user, isLoading: userIsLoading } = api.user.get.useQuery(
    undefined,
    {
      enabled: !!session,
    }
  );

  const [createTeamModalOpen, setCreateTeamModalOpen] = useState(false);

  useEffect(() => {
    const team = user?.teams[0];
    if (team) {
      router.push(`${team.slug}/`);
    } else if (!userIsLoading) {
      setCreateTeamModalOpen(true);
    }
  }, [router, user, userIsLoading]);

  if (status === "unauthenticated") {
    return (
      <div className="relative flex h-full min-h-screen flex-col">
        <div className="mx-auto flex h-full w-full max-w-7xl flex-col items-center justify-center overflow-auto">
          <h1 className="mb-4 text-xl font-medium">
            Welcome to the Neorepo demo
          </h1>
          <Link href="/auth/sign-in" className="mx-auto">
            <Button>Sign in</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!session || !user) {
    return null;
  }

  if (!user.hasOnboarded) {
    return (
      <>
        <Onboarding />;
      </>
    );
  }

  return (
    <>
      <div className="flex h-full min-h-screen flex-col">
        <CreateTeamModal
          open={createTeamModalOpen}
          onOpenChange={setCreateTeamModalOpen}
        />
      </div>
    </>
  );
}
