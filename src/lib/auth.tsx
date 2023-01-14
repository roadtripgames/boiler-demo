import { useUser } from "@supabase/auth-helpers-react";
import type { User } from "@supabase/supabase-js";
import React, { createContext, useCallback } from "react";
import { supabase } from "../utils/supabase-client";

type AuthContextType = {
  user: User | null;
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
  const user = useUser();

  const signUpWithEmail = useCallback(
    async ({ email, password }: { email: string; password: string }) => {
      await supabase.auth.signUp({ email, password });
    },
    []
  );

  const signInWithPassword = useCallback(
    async ({ email, password }: { email: string; password: string }) => {
      await supabase.auth.signInWithPassword({ email, password });
    },
    []
  );

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  return {
    user,
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
