import { TRPCClientError } from "@trpc/client";
import type { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../../../components/design-system/Button";
import { Input } from "../../../components/design-system/Input";
import { TeamRouteQueryType, useTeam } from "../../../lib/useTeam";
import { api } from "../../../utils/api";
import { createSSG } from "../../../utils/ssg";
import SettingsLayout from "./layout";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const ssg = await createSSG(ctx);

  const slug = TeamRouteQueryType.parse(ctx.query).team;
  await ssg.teams.get.prefetch({ slug });

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
  };
};

export default function General() {
  const router = useRouter();
  const utils = api.useContext();
  const { data: team } = useTeam();
  const updateMutation = api.teams.update.useMutation({
    onSuccess() {
      utils.invalidate(undefined, {
        queryKey: [api.teams.get.getQueryKey({ slug: team?.slug ?? "" })],
      });
    },
  });
  const deleteMutation = api.teams.delete.useMutation();
  const leaveMutation = api.teams.leave.useMutation();

  const handleDeleteTeam = useCallback(async () => {
    if (!team) return;

    try {
      await deleteMutation.mutateAsync({ teamId: team.id });
    } catch (e) {
      if (e instanceof TRPCClientError) {
        toast.error(e.message);
      }
    }

    router.push("/");
  }, [deleteMutation, router, team]);

  const handleLeaveTeam = useCallback(async () => {
    if (!team) return;

    try {
      await leaveMutation.mutateAsync({ teamId: team.id });
    } catch (e) {
      if (e instanceof TRPCClientError) {
        toast.error(e.message);
      }
    }

    router.push("/");
  }, [leaveMutation, router, team]);

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
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-96"
                />
              </div>
              <div>
                <p className="mb-2 font-medium">URL Slug</p>
                <Input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-96"
                />
              </div>
            </div>
            <Button className="mt-8" loading={updateMutation.isLoading}>
              Update
            </Button>
          </form>
          <div className="mt-4 flex flex-col items-start justify-end gap-y-2 rounded border bg-white px-4 py-3">
            <div className="text-xl font-medium">Delete Team</div>
            <p className="">
              Permanently delete your team and all of its contents from the
              Selene platform. This action is not reversible, so please continue
              with caution.
            </p>
            <Button
              className="self-end"
              onClick={handleDeleteTeam}
              loading={deleteMutation.isLoading}
            >
              Delete team
            </Button>
          </div>
          <div className="mt-4 flex flex-col items-start justify-end gap-y-2 rounded border bg-white px-4 py-3">
            <div className="text-xl font-medium">Leave Team</div>
            <p className="">
              Revoke your access to this Team. Any resources you&apos;ve added
              to this team will remain.
            </p>
            <Button
              className="self-end"
              onClick={handleLeaveTeam}
              loading={leaveMutation.isLoading}
            >
              Leave team
            </Button>
          </div>
        </>
      )}
    </SettingsLayout>
  );
}
