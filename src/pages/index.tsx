import { useSession } from "next-auth/react";
import Header from "../components/app/Header";
import Onboarding from "../components/app/Onboarding";
import { api } from "../utils/api";

export default function Home() {
  const { data: session } = useSession();
  const user = api.user.get.useQuery(undefined, { enabled: !!session });

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
      </div>
    </>
  );
}
