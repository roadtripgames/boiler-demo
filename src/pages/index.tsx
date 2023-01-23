import Image from "next/image";
import { useSession } from "next-auth/react";
import Header from "../components/app/Header";
import Onboarding from "../components/app/Onboarding";
import { api } from "../utils/api";
import BoilerAlert from "../components/design-system/BoilerAlert";
import { Button } from "../components/design-system/Button";
import Link from "next/link";

export default function Home() {
  const { data: session, status } = useSession();
  const user = api.user.get.useQuery(undefined, { enabled: !!session });

  if (status === "unauthenticated") {
    return (
      <div className="flex h-full min-h-screen flex-col">
        <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-center">
          <div className="flex flex-col items-center gap-y-4">
            <div className="flex h-fit items-center rounded-xl border p-8 shadow">
              <div className="text-xl font-medium">Welcome to</div>
              <div className="ml-4">
                <Image
                  src="/logo.svg"
                  width={100}
                  height={100}
                  alt={""}
                  priority
                />
              </div>
            </div>
            <Link href="/auth/sign-in">
              <Button className="w-fit">Sign in</Button>
            </Link>
          </div>
          <BoilerAlert className="absolute bottom-4 right-4">
            This is your un-authenticated page
          </BoilerAlert>
        </div>
      </div>
    );
  }

  if (!session || !user.data) {
    return null;
  }

  if (!user.data.hasOnboarded) {
    return (
      <>
        <Onboarding />;
      </>
    );
  }

  return (
    <>
      {/* <pre>{JSON.stringify(user.data, null, 2)}</pre> */}
      <div className="flex h-full min-h-screen flex-col">
        <Header />
        <div className="mx-auto flex h-full w-full max-w-7xl p-4">
          <div className="text-xl font-medium">
            Welcome {user?.data?.name ?? "Unknown user"}!
          </div>
        </div>
        <BoilerAlert className="absolute bottom-4 right-4">
          This is a user&apos;s personal page
        </BoilerAlert>
      </div>
    </>
  );
}
