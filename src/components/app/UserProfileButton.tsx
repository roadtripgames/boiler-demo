import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  ActivityLogIcon,
  ExitIcon,
  GearIcon,
  ReaderIcon,
} from "@radix-ui/react-icons";
import clsx from "clsx";
import { useRouter } from "next/router";
import React, { useCallback } from "react";
import { api } from "../../utils/api";
// import { useUser } from "../../lib/user";
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
        "flex w-full cursor-pointer items-center gap-x-2 px-4 py-2 outline-none transition hover:bg-slate-50 data-[highlighted]:bg-slate-100",
        className
      )}
    >
      {children}
    </DropdownMenu.DropdownMenuItem>
  );
}

export default function UserProfileButton() {
  const router = useRouter();
  // const auth = useAuth();
  const user = api.user.get.useQuery()?.data;

  const handleSignOut = useCallback(async () => {
    //
  }, []);
  // const handleSignOut = useCallback(async () => {
  //   await auth.signOut();
  //   router.push("/auth/sign-in");
  // }, [auth, router]);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button>
          <Avatar name={user?.name} src={user?.image} />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="animate-slideDownAndFade rounded-md border bg-white text-sm shadow-lg transition"
          align="end"
          sideOffset={4}
        >
          <div className="flex items-center gap-x-2 border-b p-4">
            <Avatar name={user?.name} src={user?.image} />
            <div className="">
              <p className="font-medium">{user?.name}</p>
              <p className="text-slate-500">{user?.email}</p>
            </div>
          </div>
          <MenuItem onClick={() => router.push("/settings/profile")}>
            <GearIcon />
            Settings
          </MenuItem>
          <MenuItem onClick={() => router.push("/docs")}>
            <ReaderIcon />
            Documentation
          </MenuItem>
          <MenuItem onClick={() => router.push("/docs")}>
            <ActivityLogIcon />
            Changelog
          </MenuItem>
          <div className="border-b" />
          <MenuItem onClick={handleSignOut} className="text-slate-500">
            <ExitIcon />
            Sign out
          </MenuItem>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
