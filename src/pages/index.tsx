import { useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { supabase } from "../utils/supabase-client";

export default function Home() {
  const user = useUser();
  const router = useRouter();

  const handleSignOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error(error);
      return;
    }

    router.push("/auth/sign-in");
  }, []);

  return (
    <>
      <div className="flex flex-col">
        <button onClick={handleSignOut}>Sign out</button>
        <pre className="m-4 rounded border p-4 shadow">
          <code>{JSON.stringify(user, null, 2)}</code>
        </pre>
      </div>
    </>
  );
}
