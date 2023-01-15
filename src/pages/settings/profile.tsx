import { useState } from "react";
import { toast } from "react-hot-toast";
import { Avatar } from "../../components/design-system/Avatar";
import { Button } from "../../components/design-system/Button";
import { TextInput } from "../../components/design-system/TextInput";
import type { User } from "../../lib/user";
import { useUser, useUpdateUser } from "../../lib/user";
import SettingsLayout from "./layout";

type UserProfileFormProps = {
  user: User;
  onUpdate?: ReturnType<typeof useUpdateUser>;
};

function UserProfileForm({ user, onUpdate }: UserProfileFormProps) {
  const [name, setName] = useState(user.full_name ?? "");
  const [title, setTitle] = useState(user.job_title ?? "");

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        try {
          await onUpdate?.mutateAsync({ full_name: name, job_title: title });
          toast.success("Profile updated.");
        } catch (e) {
          toast.error(`Issue updating profile.`);
        }
      }}
    >
      <div className="flex flex-col gap-y-5">
        <div>
          <p className="mb-2 font-medium">Profile picture</p>
          <Avatar src={user.avatar_url} name={name} size="lg" />
        </div>
        <div>
          <p className="mb-2 font-medium">Full name</p>
          <TextInput value={name} onValueChange={(e) => setName(e)} />
        </div>
        <div>
          <p className="mb-2 font-medium">Title</p>
          <TextInput value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
      </div>
      <Button className="mt-8" disabled={onUpdate?.isLoading}>
        Update
      </Button>
    </form>
  );
}

export default function Profile() {
  const user = useUser();
  const updateUserMutation = useUpdateUser();

  return (
    <SettingsLayout title="Profile" description="Manage your Selene profile">
      {user && <UserProfileForm user={user} onUpdate={updateUserMutation} />}
    </SettingsLayout>
  );
}
