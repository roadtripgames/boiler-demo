import { useRouter } from "next/router";
import Header from "../components/app/Header";
import Onboarding from "../components/app/Onboarding";
import { useAuth } from "../lib/auth";
import { useUser } from "../lib/user";

export default function Home() {
  const { user: authUser, isLoaded, isLoading } = useAuth();
  const router = useRouter();

  const user = useUser();

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center bg-red-100">
        is loading
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex h-full items-center justify-center bg-red-100">
        No user
      </div>
    );
  }

  console.log(user);

  if (user && !user.has_onboarded) {
    return <Onboarding />;
  }

  return (
    <>
      <div className="flex h-full min-h-screen flex-col border bg-white">
        <Header />
        <div className="mx-auto flex h-full w-full max-w-7xl py-4 px-4">
          <div className="max-w-1/2 text-xl transition">
            Welcome {user?.full_name}!
          </div>
        </div>
      </div>
    </>
  );
}
