import { useEffect } from "react";
import { CubeIcon, PlusIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/router";
import { Avatar } from "../../components/design-system/Avatar";
import { Button } from "../../components/design-system/Button";
import { api } from "../../utils/api";
import SettingsLayout from "./layout";
import CreateTeamModal from "../../components/app/CreateTeamModal";

export default function Team() {
  const router = useRouter();
  const teams = api.teams.get.useQuery();
  const user = api.user.get.useQuery();
  const utils = api.useContext();

  const deleteTeamMutation = api.teams.delete.useMutation({
    onSuccess: () => {
      utils.invalidate(undefined, { queryKey: ["teams.get"] });
    },
  });

  useEffect(() => {
    if (user.data && user.data.currentTeam != null) {
      router.push("/settings/members");
    }
  }, [router, user]);

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
          <div className="flex flex-col items-center justify-center gap-y-4 bg-slate-50 px-4 py-24 text-slate-500">
            <p>You do not currently belong to any teams.</p>
            <Button className="flex items-center gap-x-1">
              <PlusIcon />
              Create team
            </Button>
          </div>
        )}
        {teams?.data?.map((t) => {
          return (
            <div
              className="flex justify-between border-b px-4 py-3 last-of-type:border-none"
              key={t.id}
            >
              <div className="flex items-center gap-x-2">
                <Avatar name={t.name} />
                <p className="font-medium">{t.name}</p>
              </div>
              <Button
                variant="outline"
                onClick={() => deleteTeamMutation.mutateAsync({ id: t.id })}
              >
                Delete
              </Button>
            </div>
          );
        })}
      </div>
    </SettingsLayout>
  );
}
