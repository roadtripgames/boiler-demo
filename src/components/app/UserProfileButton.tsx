import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ExitIcon } from "@radix-ui/react-icons";
import { useAuth } from "../../lib/auth";
import { useUser } from "../../lib/user";
import { Avatar } from "../design-system/Avatar";

export default function UserProfileButton() {
  const auth = useAuth();
  const user = useUser();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button>
          <Avatar name={user?.full_name} src={user?.avatar_url} />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="animate-slideDownAndFade rounded-md border bg-white text-sm shadow-lg transition"
          align="end"
          sideOffset={4}
        >
          <div className="flex items-center gap-x-2 border-b p-4">
            <Avatar name={user?.full_name} src={user?.avatar_url} />
            <div className="">
              <p className="font-medium">{user?.full_name}</p>
              <p className="text-slate-500">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={auth.signOut}
            className="flex w-full items-center gap-x-2 px-4 py-2 text-slate-500 transition hover:bg-slate-50"
          >
            <ExitIcon />
            Sign out
          </button>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
