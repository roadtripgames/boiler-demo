import { DotsHorizontalIcon, PlusIcon } from "@radix-ui/react-icons";
import { useCallback, useState } from "react";
import { toast } from "react-hot-toast";
import { Avatar } from "../../components/design-system/Avatar";
import { Button } from "../../components/design-system/Button";
import { TextInput } from "../../components/design-system/TextInput";
import { api } from "../../utils/api";
import SettingsLayout from "./layout";

export default function Team() {
  const [name, setName] = useState("");
  const user = api.user.get.useQuery();
  const members = api.members.get.useQuery({
    teamId: user.data?.current_team?.id,
  });

  const utils = api.useContext();

  if (!user.data?.current_team) return null;

  return (
    <SettingsLayout
      title="Members"
      description={`Manage and invite team members`}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className="mb-2 flex items-center gap-x-2"
      >
        <TextInput
          placeholder="Team name"
          value={name}
          onValueChange={setName}
        />
        <Button className="" disabled={false}>
          Inviter
        </Button>
      </form>
      <div className="flex flex-col rounded-lg border">
        {members?.data?.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-y-4 bg-slate-50 px-4 py-24 text-slate-500">
            <p>You do not currently have any members.</p>
            <Button className="flex items-center gap-x-1">
              <PlusIcon />
              Invite someone
            </Button>
          </div>
        )}
        {members?.data?.map((m) => {
          return (
            <div
              className="flex justify-between border-b px-4 py-3 last-of-type:border-none"
              key={m.id}
            >
              <div className="flex items-center gap-x-2">
                <Avatar name={m.full_name} />
                <p className="font-medium">{m.full_name}</p>
              </div>
              <Button variant="outline">
                <DotsHorizontalIcon />
              </Button>
            </div>
          );
        })}
      </div>
    </SettingsLayout>
  );
}
