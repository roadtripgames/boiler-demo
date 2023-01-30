import Image from "next/image";
import { useSession } from "next-auth/react";
import Header from "../components/app/Header";
import Onboarding from "../components/app/Onboarding";
import { api } from "../utils/api";
import BoilerAlert from "../components/design-system/BoilerAlert";
import { Button } from "../components/design-system/Button";
import Link from "next/link";
import _ from "lodash";
import NeorepoSetup from "../components/app/NeorepoSetup";
import CreateTeamModal from "../components/app/CreateTeamModal";
import { useEffect, useState } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const user = api.user.get.useQuery(undefined, { enabled: !!session });
  const [createTeamModalOpen, setCreateTeamModalOpen] = useState(false);

  useEffect(() => {
    if (user.data && user.data.teams.length === 0) {
      setCreateTeamModalOpen(true);
    }
  }, [user]);

  if (status === "unauthenticated") {
    return (
      <div className="relative flex h-full min-h-screen flex-col">
        <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-center">
          <div className="flex flex-col items-center gap-y-4">
            <NeorepoSetup />
          </div>
          <BoilerAlert className="absolute bottom-4 right-4">
            This is your un-authenticated page
          </BoilerAlert>
        </div>
      </div>
    );
  }

  if (!session || !user.data) {
    return null;
  }

  if (!user.data.hasOnboarded) {
    return (
      <>
        <Onboarding />;
      </>
    );
  }

  return (
    <>
      <div className="flex h-full min-h-screen flex-col">
        <Header />
        <div className="mx-auto flex h-full w-full max-w-7xl flex-col p-4">
          <div className="px-8 py-4">
            <div className="mb-4 text-xl font-medium">
              Welcome {user?.data?.name ?? "Unknown user"}!
            </div>
            <NeorepoSetup />
          </div>
        </div>
        <CreateTeamModal
          open={createTeamModalOpen}
          onOpenChange={setCreateTeamModalOpen}
        />
      </div>
    </>
  );
}
