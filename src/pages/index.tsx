import Header from "../components/app/Header";
import Onboarding from "../components/app/Onboarding";
import { useAuth } from "../lib/auth";
import { useUser } from "../lib/user";

export default function Home() {
  const { loading: isLoading } = useAuth();
  const user = useUser();

  if (isLoading) {
    return null;
  }

  if (user && !user.has_onboarded) {
    return <Onboarding />;
  }

  return (
    <>
      <div className="flex h-full min-h-screen flex-col border bg-white">
        <Header />
        <div className="mx-auto flex h-full w-full max-w-7xl py-4 px-4">
          <div className="max-w-1/2 text-xl font-medium">
            Welcome {user?.full_name}!
          </div>
        </div>
      </div>
    </>
  );
}
