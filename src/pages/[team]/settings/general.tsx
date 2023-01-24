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
      utils.invalidate(undefined, { queryKey: ["teams.get"] });
    },
  });
  const deleteMutation = api.teams.delete.useMutation({
    onSuccess() {
      router.push("/");
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
        <>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                await updateMutation.mutateAsync({
                  teamId: team.id,
                  name,
                  slug,
                });
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
                <p className="mb-2 font-medium">URL Slug</p>
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

          <div className="mt-4 flex flex-col items-start justify-end gap-y-2 rounded border bg-white px-4 py-3">
            <div className="text-xl font-medium">Delete {team?.name}</div>
            <p className="">
              Permanently delete your team and all of its contents from the
              Selene platform. This action is not reversible, so please continue
              with caution.
            </p>
            <Button
              className="self-end"
              onClick={() => deleteMutation.mutateAsync({ teamId: team.id })}
              loading={deleteMutation.isLoading}
            >
              Delete team
            </Button>
          </div>
        </>
      )}
    </SettingsLayout>
  );
}
