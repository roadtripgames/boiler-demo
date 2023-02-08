import { TRPCClientError } from "@trpc/client";
import type { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/design-system/AlertDialog";
import { Button } from "@/components/design-system/Button";
import { Input } from "@/components/design-system/Input";
import { TeamRouteQueryType, useTeam } from "@/lib/useTeam";
import { api } from "@/utils/api";
import { createSSG } from "@/utils/ssg";
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
      utils.invalidate(undefined, {
        queryKey: api.user.getQueryKey(),
      });
      utils.invalidate(undefined, {
        queryKey: api.teams.get.getQueryKey({ slug: team.slug }),
      });
      router.push("/");
    } catch (e) {
      if (e instanceof TRPCClientError) {
        toast.error(e.message);
      }
    }
  }, [deleteMutation, router, team, utils]);

  const handleLeaveTeam = useCallback(async () => {
    if (!team) return;

    try {
      await leaveMutation.mutateAsync({ teamId: team.id });
      utils.invalidate(undefined, { queryKey: [api.user.getQueryKey()] });
      utils.invalidate(undefined, {
        queryKey: api.teams.get.getQueryKey({ slug: team.slug }),
      });
      router.push("/");
    } catch (e) {
      if (e instanceof TRPCClientError) {
        toast.error(e.message);
      }
    }
  }, [leaveMutation, router, team, utils]);

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
              Neorepo platform. This action is not reversible, so please
              continue with caution.
            </p>
            <AlertDialog>
              <AlertDialogTrigger asChild className="self-end">
                <Button variant={"destructive"}>Delete team</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you sure absolutely sure?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your team and remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <Button
                    onClick={handleDeleteTeam}
                    variant="destructive"
                    loading={deleteMutation.isLoading}
                  >
                    Delete Team
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          <div className="mt-4 flex flex-col items-start justify-end gap-y-2 rounded border bg-white px-4 py-3">
            <div className="text-xl font-medium">Leave Team</div>
            <p className="">
              Revoke your access to this Team. Any resources you&apos;ve added
              to this team will remain.
            </p>
            <AlertDialog>
              <AlertDialogTrigger asChild className="self-end">
                <Button>Leave team</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you sure absolutely sure?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    If you leave your team, you will have to be invited back in.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <Button
                    onClick={handleLeaveTeam}
                    loading={leaveMutation.isLoading}
                  >
                    Leave Team
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </>
      )}
    </SettingsLayout>
  );
}
