import { CubeIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { api } from "../../utils/api";
import { Button } from "../design-system/Button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../design-system/Dialog";
import { TextInput } from "../design-system/TextInput";

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
    onSuccess: (team) => {
      utils.invalidate(undefined, { queryKey: ["teams.get"] });
      setName("");
      router.push(`/${team.slug}`);
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
      <DialogContent>
        <CubeIcon className="mb-4 -mt-4 h-12 w-12 rounded-lg border p-3 shadow-sm" />
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await createMutation.mutateAsync({ name });
            handleOpenChange(false);
          }}
          className="flex w-[400px] flex-col gap-y-5"
        >
          <div>
            <DialogTitle className="text-lg font-medium">
              Create team
            </DialogTitle>
            <p className="text-slate-500">
              Collaborate with others and manage your tasks together.
            </p>
          </div>
          <label className="w-full">
            <p className="mb-2 font-medium">Team name</p>
            <TextInput
              className="w-full"
              placeholder=""
              value={name}
              onValueChange={setName}
              autoFocus
            />
          </label>
          <div className="flex justify-between">
            <div />
            <Button
              className=""
              loading={createMutation.isLoading}
              loadingText="Creating"
            >
              Create team
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
