import {
  DotsHorizontalIcon,
  EnvelopeClosedIcon,
  PlusIcon,
} from "@radix-ui/react-icons";
import clsx from "clsx";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { Avatar } from "../../components/design-system/Avatar";
import { Button } from "../../components/design-system/Button";
import { DropdownMenu } from "../../components/design-system/Dropdown";
import { TabbedContainer } from "../../components/design-system/TabbedContainer";
import { TextInput } from "../../components/design-system/TextInput";
import type { Role } from "../../lib/roles";
import { ROLE_MEMBER, ROLES } from "../../lib/roles";
import { api } from "../../utils/api";
import SettingsLayout from "./layout";

const Section: React.FC<{
  className?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}> = ({ className, title, description, children }) => {
  return (
    <div className={clsx("rounded-lg border bg-white p-6", className)}>
      <div className="mb-2">
        <h3 className="text-xl font-medium">{title}</h3>
        {description && (
          <p className="mb-4 text-sm text-slate-500">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
};

type Invite = { email: string; role: Role };

type InviteSectionProps = {
  teamId: string;
  inviteMutation: ReturnType<typeof api.teams.inviteMembers.useMutation>;
};

const InviteSection: React.FC<InviteSectionProps> = ({
  teamId,
  inviteMutation,
}) => {
  const [invites, setInvites] = useState<Invite[]>([
    { email: "", role: ROLE_MEMBER },
    { email: "", role: ROLE_MEMBER },
  ]);

  const handleAddInvite = useCallback(() => {
    setInvites((invites) => [...invites, { email: "", role: ROLE_MEMBER }]);
  }, []);

  const handleChangeEmail = useCallback((i: number, value: string) => {
    setInvites((invites) => {
      const newInvites = [...invites];
      const row = newInvites[i];
      if (row) {
        row.email = value;
      }
      return newInvites;
    });
  }, []);

  const handleChangeRole = useCallback((i: number, value: Role) => {
    setInvites((invites) => {
      const newInvites = [...invites];
      const row = newInvites[i];
      if (row) {
        row.role = value;
      }
      return newInvites;
    });
  }, []);

  const handleSendInvites = useCallback(async () => {
    const validInvites = invites.filter((invite) => invite.email);
    await inviteMutation.mutateAsync({ teamId, invites: validInvites });
    setInvites([
      { email: "", role: ROLE_MEMBER },
      { email: "", role: ROLE_MEMBER },
    ]);
  }, [inviteMutation, invites, teamId]);

  return (
    <Section
      title="Invite"
      description="You can invite up to 25 members on the Pro plan"
    >
      <div className="mt-4 flex flex-col gap-y-2">
        {invites.map(({ email, role }, i) => {
          return (
            <div key={i} className="grid grid-cols-4 gap-x-3">
              <div className="col-span-3">
                <TextInput
                  value={email}
                  id={`invite-email-${i}`}
                  type="text"
                  // autoComplete="new" prevents the browser from autofilling the field with the same email
                  autoComplete="new"
                  iconLeft={<EnvelopeClosedIcon className="text-slate-400" />}
                  placeholder="Email"
                  className="w-full"
                  onValueChange={(value) => handleChangeEmail(i, value)}
                />
              </div>
              <div className="col-span-1">
                <DropdownMenu
                  value={role}
                  values={ROLES}
                  onChange={(value) => handleChangeRole(i, value as Role)}
                  className="w-full"
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex items-center justify-between">
        <Button
          variant="link"
          className="flex items-center gap-x-2 text-slate-500"
          onClick={handleAddInvite}
        >
          <PlusIcon /> Add another
        </Button>
        <Button
          loading={inviteMutation.isLoading}
          loadingText="Sending invites"
          className="flex items-center gap-x-2"
          onClick={handleSendInvites}
        >
          <EnvelopeClosedIcon />
          Send invites
        </Button>
      </div>
    </Section>
  );
};

export default function Team() {
  const router = useRouter();
  const user = api.user.get.useQuery();
  const members = api.teams.getMembers.useQuery(
    {
      teamId: user.data?.currentTeam?.id ?? "",
    },
    { enabled: !!user.data?.currentTeam?.id }
  );
  const invites = api.teams.invites.useQuery(
    { teamId: user.data?.currentTeam?.id ?? "" },
    { enabled: !!user.data?.currentTeam?.id }
  );

  useEffect(() => {
    if (user.data && user.data.currentTeam == null) {
      router.push("/settings/teams");
    }
  }, [router, user]);

  const utils = api.useContext();
  const inviteMutation = api.teams.inviteMembers.useMutation({
    onSuccess() {
      utils.invalidate(undefined, { queryKey: ["members.get"] });
    },
  });

  if (!user.data?.currentTeam) return null;

  return (
    <SettingsLayout
      title="Members"
      description={`Manage and invite team members`}
    >
      {/* {<pre>{JSON.stringify(members.data, null, 2)}</pre>} */}
      <div className="flex flex-col gap-y-8">
        <InviteSection
          teamId={user.data.currentTeam.id}
          inviteMutation={inviteMutation}
        />
        <div className="flex flex-col rounded-lg">
          <TabbedContainer
            tabs={[
              {
                title: "Members",
                content: members?.data?.map((m) => {
                  return (
                    <div
                      className="flex justify-between border-b py-3 px-4 last-of-type:border-none"
                      key={m.id}
                    >
                      <div className="flex items-center gap-x-2">
                        <Avatar name={m.name ?? m.email} />
                        <div className="flex flex-col">
                          <p className="font-medium">
                            {m.name ?? m.email ?? "Unknown"}
                          </p>
                          <p className="font-medium text-slate-500">
                            {m.roles[0]?.name}
                          </p>
                        </div>
                      </div>
                      <Button variant="link">
                        <DotsHorizontalIcon />
                      </Button>
                    </div>
                  );
                }),
              },
              {
                title: "Pending invites",
                content: (
                  <div className="flex flex-col">
                    {invites.data?.map((i) => {
                      return (
                        <div
                          className="flex justify-between border-b py-3 px-4 last-of-type:border-none"
                          key={i.id}
                        >
                          <div className="flex items-center gap-x-2">
                            <div className="flex flex-col gap-y-1">
                              <p className="font-medium">{i.email}</p>
                              <p className="font-medium text-slate-500">
                                {i.role}
                              </p>
                            </div>
                          </div>
                          <Button variant="link">
                            <DotsHorizontalIcon />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                ),
              },
            ]}
          />
        </div>
      </div>
    </SettingsLayout>
  );
}
