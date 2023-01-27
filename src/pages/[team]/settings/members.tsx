import {
  DotsHorizontalIcon,
  EnvelopeClosedIcon,
  PlusIcon,
} from "@radix-ui/react-icons";
import clsx from "clsx";
import type { GetServerSideProps } from "next";
import React, { useCallback, useState } from "react";
import { toast } from "react-hot-toast";
import { Avatar } from "../../../components/design-system/Avatar";
import { Button } from "../../../components/design-system/Button";
import { DropdownMenu } from "../../../components/design-system/Dropdown";
import {
  DropdownSimple,
  DropdownSimpleItem,
} from "../../../components/design-system/DropdownSimple";
import { TabbedContainer } from "../../../components/design-system/TabbedContainer";
import { TextInput } from "../../../components/design-system/TextInput";
import type { Role } from "../../../lib/roles";
import { ROLE_MEMBER, ROLES } from "../../../lib/roles";
import { TeamRouteQueryType, useTeam } from "../../../lib/useTeam";
import { api } from "../../../utils/api";
import { createSSG } from "../../../utils/ssg";
import SettingsLayout from "./layout";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, res } = context;

  const ssg = await createSSG({ req, res });
  const slug = TeamRouteQueryType.parse(context.query).team;

  await ssg.teams.get.prefetch({ slug });
  await ssg.teams.getMembers.prefetch({ slug });

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
  };
};

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
            <div envKey={i} className="grid grid-cols-4 gap-x-3">
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
                  onSelect={(value) => handleChangeRole(i, value as Role)}
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
  const { data: user } = api.user.get.useQuery();
  const { data: team, slug } = useTeam();

  const utils = api.useContext();
  const members = api.teams.getMembers.useQuery(
    {
      slug,
    },
    { enabled: !!slug }
  );
  const { data: invites } = api.teams.invites.useQuery(
    { slug },
    { enabled: !!slug }
  );
  const inviteMutation = api.teams.inviteMembers.useMutation({
    onSuccess() {
      utils.invalidate(undefined, {
        queryKey: [api.teams.getMembers.getQueryKey({ slug })],
      });
    },
  });
  const updateRoleMutation = api.teams.updateRole.useMutation({
    onSuccess() {
      utils.invalidate(undefined, {
        queryKey: [api.teams.getMembers.getQueryKey({ slug })],
      });
    },
  });
  const resendInviteEmailMutation = api.teams.resendInviteEmail.useMutation();
  const deleteInviteMutation = api.teams.deleteInvite.useMutation({
    onSuccess() {
      utils.invalidate(undefined, {
        queryKey: [api.teams.invites.getQueryKey({ slug })],
      });
    },
  });

  if (!user) return null;
  if (!team) return null;

  return (
    <SettingsLayout
      title="Members"
      description={`Manage and invite team members`}
    >
      <div className="flex flex-col gap-y-8">
        <InviteSection teamId={team.id} inviteMutation={inviteMutation} />
        <div className="flex flex-col rounded-lg">
          <TabbedContainer
            tabs={[
              {
                title: "Members",
                content: members?.data?.map((m) => {
                  const role = m.roles[0]?.name ?? "Member";
                  return (
                    <div
                      className="flex justify-between border-b py-3 px-4 last-of-type:border-none"
                      envKey={m.id}
                    >
                      <div className="flex items-center gap-x-2">
                        <Avatar name={m.name ?? m.email} src={m.image} />
                        <div className="flex flex-col">
                          <p className="font-medium">
                            {m.name ?? m.email ?? "Unknown"}
                          </p>
                          <p className="text-slate-500">{m.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-x-6">
                        <p className="">
                          {user.id === m.id ? (
                            <span className="text-slate-500">{role}</span>
                          ) : (
                            <DropdownMenu
                              values={ROLES}
                              value={role}
                              disabled={updateRoleMutation.isLoading}
                              onSelect={async (v) => {
                                await updateRoleMutation.mutateAsync({
                                  teamId: team.id,
                                  userId: m.id,
                                  role: v,
                                });

                                toast.success(`${m.name} set to ${v}`);
                              }}
                            >
                              {role}
                            </DropdownMenu>
                          )}
                        </p>
                        <Button variant="link">
                          <DotsHorizontalIcon />
                        </Button>
                      </div>
                    </div>
                  );
                }),
              },
              {
                title: "Pending invites",
                content: (
                  <div className="flex flex-col">
                    {invites?.map((i) => {
                      return (
                        <div
                          className="flex justify-between border-b py-3 last-of-type:border-none"
                          envKey={i.id}
                        >
                          <div className="flex items-center gap-x-2">
                            <div className="flex flex-col gap-y-1">
                              <p className="">{i.email}</p>
                              <p className="font-medium text-slate-500">
                                {i.role}
                              </p>
                            </div>
                          </div>
                          <DropdownSimple
                            align="end"
                            trigger={
                              <DotsHorizontalIcon className="h-8 w-8 px-2" />
                            }
                          >
                            <DropdownSimpleItem
                              onSelect={async () => {
                                await resendInviteEmailMutation.mutateAsync({
                                  teamId: team.id,
                                  inviteId: i.id,
                                });
                                toast.success(`Invite resent to ${i.email}`);
                              }}
                            >
                              Resend invite
                            </DropdownSimpleItem>
                            <DropdownSimpleItem
                              className="text-red-500"
                              onSelect={async () => {
                                await deleteInviteMutation.mutateAsync({
                                  slug,
                                  inviteId: i.id,
                                });
                                toast.success(`Invite to ${i.email} deleted`);
                              }}
                            >
                              Delete invite
                            </DropdownSimpleItem>
                          </DropdownSimple>
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
