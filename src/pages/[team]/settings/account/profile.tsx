import { useState } from "react";
import { toast } from "react-hot-toast";
import { Avatar } from "../../../../components/design-system/Avatar";
import { Button } from "../../../../components/design-system/Button";
import { Input } from "../../../../components/design-system/Input";
import type { RouterOutputs } from "../../../../utils/api";
import { api } from "../../../../utils/api";
import SettingsLayout from "../layout";

type UserProfileFormProps = {
  user: NonNullable<RouterOutputs["user"]["get"]>;
  onUpdate?: ReturnType<typeof api.user.update.useMutation>;
};

function UserProfileForm({ user, onUpdate }: UserProfileFormProps) {
  const [name, setName] = useState(user.name ?? "");

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        try {
          await onUpdate?.mutateAsync({ name: name });
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
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-96"
          />
        </div>
      </div>
      <Button className="mt-8" loading={onUpdate?.isLoading}>
        Update
      </Button>
    </form>
  );
}

export default function Profile() {
  const user = api.user.get.useQuery()?.data;
  const utils = api.useContext();
  const updateUserMutation = api.user.update.useMutation({
    onSuccess() {
      utils.invalidate(undefined, { queryKey: [api.user.get.getQueryKey()] });
    },
  });

  return (
    <SettingsLayout title="Profile" description="Manage your Neorepo profile">
      {user && <UserProfileForm user={user} onUpdate={updateUserMutation} />}
    </SettingsLayout>
  );
}
