import { useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { Database } from "../../databaseTypes";
import Onboarding from "../components/home/Onboarding";
import { supabase } from "../utils/supabase-client";

export default function Home() {
  const authUser = useUser();
  const router = useRouter();

  const [user, setUser] = useState<
    Database["public"]["Tables"]["users"]["Row"] | null
  >(null);

  const handleSignOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error(error);
      return;
    }

    router.push("/auth/sign-in");
  }, []);

  const handleLoadUser = useCallback(async () => {
    if (!authUser) return;

    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", authUser.id)
      .single();

    if (error) {
      console.error(error);
      return;
    }

    setUser(user);
  }, [authUser]);

  useEffect(() => {
    handleLoadUser();
  }, [authUser]);

  if (!user) {
    return <div className="bg-red-500">LOADING</div>;
  }

  if (user && !user.has_onboarded) {
    return <Onboarding onComplete={handleLoadUser} />;
  }

  return (
    <>
      <div className="flex h-full min-h-screen flex-col bg-slate-50">
        <div className="flex h-full w-full items-center justify-center">
          <div className="max-w-1/2 transition">welcome to the app</div>
        </div>
      </div>
    </>
  );
}
