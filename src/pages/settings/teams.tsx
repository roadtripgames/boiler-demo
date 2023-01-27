import { CubeIcon } from "@radix-ui/react-icons";
import type { Team } from "@prisma/client";
import { Avatar } from "../../components/design-system/Avatar";
import { Button } from "../../components/design-system/Button";
import { api } from "../../utils/api";
import SettingsLayout from "./layout";
import CreateTeamModal from "../../components/app/CreateTeamModal";
import { useRouter } from "next/router";
import { useCallback } from "react";

export default function Team() {
  const router = useRouter();
  const teams = api.teams.getAllTeams.useQuery();

  const handleManageTeam = useCallback(
    (team: Team) => {
      router.push(`/${team.slug}/settings/general`);
    },
    [router]
  );

  return (
    <SettingsLayout
      title="Teams"
      description="Manage the Teams that you're a part of or create a new one."
    >
      <div className="mb-4 flex justify-end">
        <CreateTeamModal>
          <Button className="flex items-center gap-x-1">
            <CubeIcon />
            Create a Team
          </Button>
        </CreateTeamModal>
      </div>
      <div className="flex flex-col rounded-lg border">
        {teams?.data?.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-y-4 rounded-lg bg-slate-50 px-4 py-24 text-slate-500">
            <p>You do not currently belong to any teams.</p>
          </div>
        )}
        {teams?.data?.map((t) => {
          return (
            <div
              className="flex justify-between border-b px-4 py-3 last-of-type:border-none"
              envKey={t.id}
            >
              <div className="flex items-center gap-x-2">
                <Avatar name={t.name} />
                <p className="font-medium">{t.name}</p>
              </div>
              <Button variant="outline" onClick={() => handleManageTeam(t)}>
                Manage
              </Button>
            </div>
          );
        })}
      </div>
    </SettingsLayout>
  );
}
