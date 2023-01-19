import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { PlusIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import React from "react";
import { toast } from "react-hot-toast";
import { api } from "../../utils/api";
import { Avatar } from "../design-system/Avatar";
import Spinner from "../design-system/Spinner";

function MenuItem({
  children,
  onClick,
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <DropdownMenu.DropdownMenuItem
      onClick={onClick}
      className={clsx(
        "flex w-full cursor-pointer items-center gap-x-2 px-3 py-2 outline-none transition hover:bg-slate-50 data-[highlighted]:bg-slate-100",
        className
      )}
    >
      {children}
    </DropdownMenu.DropdownMenuItem>
  );
}

export default function TeamSelector() {
  const user = api.user.get.useQuery();
  const teams = api.teams.get.useQuery();
  const currentTeam = teams.data?.find(
    (t) => t.id === user.data?.currentTeamId
  );
  const context = api.useContext();
  const selectTeamMutation = api.user.selectTeam.useMutation({
    onSuccess: () => context.invalidate(undefined, { queryKey: ["user"] }),
  });

  if (!user) return null;

  const loading =
    teams.isLoading || user.isLoading || selectTeamMutation.isLoading;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        {loading ? (
          <Spinner size="small" />
        ) : (
          <button className="flex select-none items-center gap-x-2 py-1">
            <Avatar size="sm" name={currentTeam?.name ?? user.data?.name} />
            <p className="font-medium">
              {currentTeam?.name ?? user.data?.name}
            </p>
          </button>
        )}
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="animate-slideDownAndFade rounded-md border bg-white text-sm text-slate-900 shadow-lg transition"
          align="start"
          sideOffset={4}
        >
          <p className="select-none px-4 pt-2 pb-1 text-xs text-slate-500">
            Personal account
          </p>
          <MenuItem
            className="pr-12"
            onClick={async () => {
              await selectTeamMutation.mutateAsync({ teamId: null });

              toast.success(`Switched to your personal account`);
            }}
          >
            <Avatar size="sm" name={user.data?.name} src={user.data?.image} />
            {user.data?.name}
          </MenuItem>
          {(teams.data?.length ?? 0) > 0 && (
            <div className="flex flex-col">
              <p className="select-none px-4 pt-2 pb-1 text-xs text-slate-500">
                Teams
              </p>
              {teams.data?.map((t) => {
                return (
                  <MenuItem
                    key={t.id}
                    onClick={async () => {
                      if (t.id === user.data?.currentTeamId) return;

                      await selectTeamMutation.mutateAsync({ teamId: t.id });
                      toast.success(`Switched to ${t.name}`);
                    }}
                  >
                    <Avatar size="sm" name={t.name} />
                    <p className="">{t.name}</p>
                  </MenuItem>
                );
              })}
            </div>
          )}
          <MenuItem className="rounded-b text-slate-500">
            <PlusIcon />
            Create team
          </MenuItem>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
