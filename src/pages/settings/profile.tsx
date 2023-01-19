import { useState } from "react";
import { toast } from "react-hot-toast";
import { Avatar } from "../../components/design-system/Avatar";
import { Button } from "../../components/design-system/Button";
import { TextInput } from "../../components/design-system/TextInput";
import type { RouterOutputs } from "../../utils/api";
import { api } from "../../utils/api";
import SettingsLayout from "./layout";

type UserProfileFormProps = {
  user: NonNullable<RouterOutputs["user"]["get"]>;
  onUpdate?: ReturnType<typeof api.user.update.useMutation>;
};

function UserProfileForm({ user, onUpdate }: UserProfileFormProps) {
  const [name, setName] = useState(user.name ?? "");
  const [title, setTitle] = useState(user.jobTitle ?? "");

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        try {
          await onUpdate?.mutateAsync({ name: name, jobTitle: title });
          toast.success("Profile updated.");
        } catch (e) {
          toast.error(`Issue updating profile.`);
        }
      }}
    >
      <div className="flex flex-col gap-y-5">
        <div>
          <p className="mb-2 font-medium">Profile picture</p>
          <Avatar src={user.image} name={name} size="lg" />
        </div>
        <div>
          <p className="mb-2 font-medium">Full name</p>
          <TextInput
            value={name}
            onValueChange={(e) => setName(e)}
            className="w-96"
          />
        </div>
        <div>
          <p className="mb-2 font-medium">Title</p>
          <TextInput
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-96"
          />
        </div>
      </div>
      <Button className="mt-8" disabled={onUpdate?.isLoading}>
        Update
      </Button>
    </form>
  );
}

export default function Profile() {
  const user = api.user.get.useQuery()?.data;
  const updateUserMutation = api.user.update.useMutation();

  return (
    <SettingsLayout title="Profile" description="Manage your Selene profile">
      {/* <pre>{JSON.stringify(user, null, 2)}</pre> */}
      {user && <UserProfileForm user={user} onUpdate={updateUserMutation} />}
    </SettingsLayout>
  );
}
