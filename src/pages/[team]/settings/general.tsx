import { TRPCClientError } from "@trpc/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../../../components/design-system/Button";
import { TextInput } from "../../../components/design-system/TextInput";
import { useTeam } from "../../../lib/useTeam";
import { api } from "../../../utils/api";
import SettingsLayout from "./layout";

export default function General() {
  const router = useRouter();
  const utils = api.useContext();

  const { data: team } = useTeam();
  const updateMutation = api.teams.update.useMutation({
    onSuccess() {
      utils.invalidate(undefined, { queryKey: ["teams.getBySlug"] });
    },
  });
  const [name, setName] = useState(team?.name ?? "");
  const [slug, setSlug] = useState(team?.slug ?? "");

  useEffect(() => {
    if (team && !name && !slug) {
      setName(team.name);
      setSlug(team.slug);
    }
  }, [name, slug, team]);

  return (
    <SettingsLayout title="General" description="Your team settings">
      {team && (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              await updateMutation.mutateAsync({ teamId: team.id, name, slug });
              // if slug was different, refresh the page
              if (slug !== team.slug) {
                router.push(`/${slug}/settings/general`);
              }
            } catch (e) {
              if (e instanceof TRPCClientError) {
                toast.error(e.message);
              } else {
                toast.error(`Issue updating profile.`);
              }
            }
          }}
        >
          <div className="flex flex-col gap-y-5">
            <div>
              <p className="mb-2 font-medium">Team name</p>
              <TextInput
                value={name}
                onValueChange={(e) => setName(e)}
                className="w-96"
              />
            </div>
            <div>
              <p className="mb-2 font-medium">URL slug</p>
              <TextInput
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-96"
              />
            </div>
          </div>
          <Button className="mt-8" disabled={updateMutation.isLoading}>
            Update
          </Button>
        </form>
      )}
    </SettingsLayout>
  );
}
