import { useSession, useUser } from "@supabase/auth-helpers-react";
import type { User } from "@supabase/supabase-js";
import React, { createContext, useCallback, useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { supabase } from "../utils/supabase-client";
import { USER_KEY } from "./query-keys";

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isLoaded: boolean;
  isSignedIn: boolean;
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
  const [isLoading, setIsLoading] = useState(true);
  const user = useUser();
  const queryClient = useQueryClient();

  useEffect(() => {
    setIsLoading(false);
  }, [user]);

  const signUpWithEmail = useCallback(
    async ({ email, password }: { email: string; password: string }) => {
      setIsLoading(true);
      await supabase.auth.signUp({ email, password });
      setIsLoading(false);
    },
    []
  );

  const signInWithPassword = useCallback(
    async ({ email, password }: { email: string; password: string }) => {
      setIsLoading(true);
      await supabase.auth.signInWithPassword({ email, password });
      setIsLoading(false);
    },
    []
  );

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    queryClient.resetQueries(USER_KEY);
  }, [queryClient]);

  return {
    user,
    isLoading,
    isLoaded: user != undefined,
    isSignedIn: user?.aud === "authenticated", // TODO: might be different
    signUpWithEmail,
    signInWithPassword,
    signOut,
  };
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoaded: false,
  isLoading: false,
  isSignedIn: false,
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
