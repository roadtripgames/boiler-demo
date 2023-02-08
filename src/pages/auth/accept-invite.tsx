import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { z } from "zod";
import Spinner from "@/components/design-system/Spinner";
import { api } from "@/utils/api";

const AcceptInviteParams = z.object({
  email: z.string(),
  code: z.string(),
});

export default function AcceptInvitePage() {
  const router = useRouter();
  const acceptInviteMutation = api.teams.acceptInvite.useMutation();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const resp = AcceptInviteParams.safeParse(router.query);
    if (!resp.success) return;

    const { code, email } = resp.data;

    const fn = async () => {
      const team = await acceptInviteMutation.mutateAsync({ code, email });
      router.push(`/${team.slug}`);
    };

    fn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query]);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      {acceptInviteMutation.isLoading && <Spinner className="" />}
      {error && <div>{error}</div>}
    </div>
  );
}
