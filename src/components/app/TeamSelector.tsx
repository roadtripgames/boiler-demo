import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { PlusIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import React from "react";
import { api } from "../../utils/api";
import { Avatar } from "../design-system/Avatar";

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
  const user = api.user.get.useQuery()?.data;
  const teams = api.teams.get.useQuery();
  const currentTeam = teams.data?.find((t) => t.id === user?.current_team_id);
  const context = api.useContext();
  const selectTeamMutation = api.user.selectTeam.useMutation({
    onSuccess: () => context.invalidate(undefined, { queryKey: ["user"] }),
  });

  if (!user) return null;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="flex select-none items-center gap-x-2 py-1">
          <Avatar size="sm" name={currentTeam?.name ?? user.full_name} />
          <p className="font-medium">{currentTeam?.name ?? user.full_name}</p>
        </button>
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
            className=""
            onClick={() => selectTeamMutation.mutateAsync({ teamId: null })}
          >
            <Avatar size="sm" name={user.full_name} src={user.avatar_url} />
            {user.full_name}
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
                    onClick={() =>
                      selectTeamMutation.mutateAsync({ teamId: t.id })
                    }
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
