import { CubeIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { api } from "../../utils/api";
import { Button } from "../design-system/Button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "../design-system/Dialog";
import { Input } from "../design-system/Input";

type CreateTeamModalProps = {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export default function CreateTeamModal({
  children,
  open: _open,
  onOpenChange,
}: CreateTeamModalProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [open, setOpen] = useState(_open);
  const utils = api.useContext();
  const createMutation = api.teams.create.useMutation({
    onSuccess: async (team) => {
      await router.push(`/${team.slug}`);
      utils.invalidate(undefined, {
        queryKey: [
          api.teams.get.getQueryKey({ slug: team.slug }),
          api.user.get.getQueryKey(),
        ],
      });
      setName("");
      toast.success(`Created ${team.name}!`);
    },
  });

  const handleOpenChange = useCallback(
    (val: boolean) => {
      setOpen(val);
      onOpenChange?.(val);
    },
    [onOpenChange]
  );

  // this component can either manage itself or allow itself to be managed
  useEffect(() => {
    if (_open != null) {
      setOpen(_open);
    }
  }, [_open]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="">
        <DialogHeader>
          <CubeIcon className="h-12 w-12 rounded-lg border p-3 shadow-sm" />
          <DialogTitle className="text-lg font-medium">Create team</DialogTitle>
          <DialogDescription className="">
            Collaborate with others and manage your tasks together.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await createMutation.mutateAsync({ name });
            handleOpenChange(false);
          }}
          className="flex flex-col gap-y-5"
        >
          <label className="w-full">
            <p className="mb-2 font-medium">Team name</p>
            <Input
              className="w-full"
              placeholder="My Team Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </label>
          <DialogFooter>
            <Button
              className=""
              loading={createMutation.isLoading}
              type="submit"
            >
              {createMutation.isLoading ? "Creating" : "Create team"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
