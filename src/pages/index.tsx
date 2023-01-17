import Header from "../components/app/Header";
import Onboarding from "../components/app/Onboarding";
import { useAuth } from "../lib/auth";
import { api } from "../utils/api";

export default function Home() {
  const { loading: isLoading } = useAuth();
  const user = api.user.get.useQuery()?.data;

  if (isLoading) {
    return null;
  }

  if (user && !user.has_onboarded) {
    return (
      <>
        <Onboarding />;
      </>
    );
  }

  return (
    <>
      <div className="flex h-full min-h-screen flex-col bg-white">
        <Header />
        <div className="mx-auto flex h-full w-full max-w-7xl p-4">
          <div className="text-xl font-medium">Welcome {user?.full_name}!</div>
        </div>
      </div>
    </>
  );
}
