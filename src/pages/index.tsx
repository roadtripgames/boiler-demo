import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { Database } from "../../databaseTypes";
import Onboarding from "../components/app/Onboarding";
import { useAuth } from "../lib/auth";
import { useUser } from "../lib/user";
import { supabase } from "../utils/supabase-client";

export default function Home() {
  const { user: authUser } = useAuth();
  const router = useRouter();

  const user = useUser();

  if (!user) {
    return <div className="bg-red-500">LOADING</div>;
  }

  if (user && !user.has_onboarded) {
    return <Onboarding />;
  }

  return (
    <>
      <div className="flex h-full min-h-screen flex-col bg-slate-50">
        <div className="flex h-full w-full items-center justify-center">
          <div className="max-w-1/2 text-5xl transition">
            welcome to the app
          </div>
          <pre>
            <code>{JSON.stringify(authUser, null, 2)}</code>
          </pre>
        </div>
      </div>
    </>
  );
}
