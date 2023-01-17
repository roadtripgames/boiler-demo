import { useUser } from "@supabase/auth-helpers-react";
import type { User as Auth } from "@supabase/supabase-js";
import React, { createContext, useCallback, useEffect, useState } from "react";
import { supabase } from "../utils/supabase-client";

type AuthContextType = {
  auth: Auth | null;
  loading: boolean;
  signUpWithEmail: (params: {
    email: string;
    password: string;
  }) => Promise<void>;
  signInWithPassword: (params: {
    email: string;
    password: string;
  }) => Promise<void>;
  signOut: () => Promise<void>;
};

export const useAuth = (): AuthContextType => {
  // const queryClient = useQueryClient();
  const [loading, setLoading] = useState(true);
  const auth = useUser();

  useEffect(() => {
    setLoading(false);
  }, [auth]);

  const signUpWithEmail = useCallback(
    async ({ email, password }: { email: string; password: string }) => {
      setLoading(true);
      const { error } = await supabase.auth.signUp({ email, password });

      if (error?.message === "User already registered") {
        await supabase.auth.signInWithPassword({ email, password });
      }

      setLoading(false);
    },
    []
  );

  const signInWithPassword = useCallback(
    async ({ email, password }: { email: string; password: string }) => {
      setLoading(true);
      await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
    },
    []
  );

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    // queryClient.resetQueries(USER_KEY);
    // }, [queryClient]);
  }, []);

  return {
    auth,
    loading,
    signUpWithEmail,
    signInWithPassword,
    signOut,
  };
};

const AuthContext = createContext<AuthContextType>({
  auth: null,
  loading: false,
  signUpWithEmail: async () => {
    return;
  },
  signInWithPassword: async () => {
    return;
  },
  signOut: async () => {
    return;
  },
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const auth = useAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};
