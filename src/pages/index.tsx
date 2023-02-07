import { useSession } from "next-auth/react";
import Onboarding from "../components/app/Onboarding";
import { api } from "../utils/api";
import NeorepoSetup from "../components/app/NeorepoSetup";
import CreateTeamModal from "../components/app/CreateTeamModal";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

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
        <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-center overflow-auto">
          <NeorepoSetup />
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
