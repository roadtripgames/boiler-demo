import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import type { DropdownMenuItemProps } from "@radix-ui/react-dropdown-menu";
import { PlusIcon, CheckIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import { useRouter } from "next/router";
import React, { useCallback, useState } from "react";
import { useTeam } from "../../lib/useTeam";
import { api } from "../../utils/api";
import { Avatar } from "../design-system/Avatar";
import Spinner from "../design-system/Spinner";
import CreateTeamModal from "./CreateTeamModal";
import type { Team } from "@prisma/client";

const MenuItem = React.forwardRef<
  HTMLDivElement,
  {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    selected?: boolean;
  } & DropdownMenuItemProps
>(({ children, selected, onClick, className, ...props }, forwardedRef) => {
  return (
    <DropdownMenu.Item
      {...props}
      ref={forwardedRef}
      onClick={onClick}
      className={clsx(
        "flex w-full items-center gap-x-2 px-3 py-2",
        "cursor-pointer outline-none transition data-[disabled]:cursor-default data-[highlighted]:bg-slate-100",
        className,
        {
          "hover:bg-slate-50": !selected,
          "bg-slate-100": selected,
        }
      )}
    >
      {children}
      {selected && <CheckIcon />}
    </DropdownMenu.Item>
  );
});

MenuItem.displayName = "MenuItem";

export default function TeamSelector() {
  const router = useRouter();
  const user = api.user.get.useQuery();
  const teams = api.teams.getAllTeams.useQuery();

  const handleSelectPersonalAccount = useCallback(() => {
    router.push(`/`);
  }, [router]);

  const handleSelectTeam = useCallback(
    (team: Team) => {
      router.push(`/${team.slug}`);
    },
    [router]
  );

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const { data: team, slug } = useTeam();

  if (!user) return null;

  const loading = teams.isLoading || user.isLoading;

  return (
    <>
      <CreateTeamModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
      />
      <DropdownMenu.Root>
        {loading ? (
          <Spinner size="small" />
        ) : (
          <DropdownMenu.Trigger asChild>
            <button className="flex select-none items-center gap-x-2 py-1">
              <Avatar size="sm" name={team?.name ?? user.data?.name} />
              <p className="font-medium">{team?.name ?? user.data?.name}</p>
            </button>
          </DropdownMenu.Trigger>
        )}
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className="animate-slideDownAndFadeIn rounded-md border bg-white text-sm text-slate-900 shadow-lg transition"
            align="start"
            sideOffset={4}
          >
            <p className="select-none px-4 pt-2 pb-1 text-xs text-slate-500">
              Personal account
            </p>
            <MenuItem
              selected={slug === ""}
              className="pr-12"
              onClick={async () => {
                handleSelectPersonalAccount();

                // toast.success(`Switched to your personal account`);
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
                      selected={t.slug === slug}
                      envKey={t.id}
                      onClick={async () => {
                        if (!t.id || t.slug === slug) return;

                        handleSelectTeam(t);

                        // toast.success(`Switched to ${t.name}`);
                      }}
                    >
                      <Avatar size="sm" name={t.name} />
                      <p className="">{t.name}</p>
                    </MenuItem>
                  );
                })}
              </div>
            )}
            <MenuItem
              className="rounded-b border-t text-slate-500"
              onClick={() => {
                setCreateModalOpen(true);
              }}
            >
              <PlusIcon />
              Create team
            </MenuItem>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </>
  );
}
