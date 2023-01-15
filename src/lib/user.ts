import { useMutation, useQuery, useQueryClient } from "react-query";
import type { Database } from "../../databaseTypes";
import { supabase } from "../utils/supabase-client";
import { useAuth } from "./auth";
import { USER_KEY } from "./query-keys";

export type User = Database["public"]["Tables"]["users"]["Row"];

export const useUser = () => {
  const { auth } = useAuth();

  const { data: user } = useQuery(
    USER_KEY,
    async () => {
      if (!auth) return null;

      const resp = await supabase
        .from("users")
        .select("*")
        .eq("id", auth.id)
        .single();

      return resp.data;
    },
    { enabled: !!auth }
  );

  if (user) {
    return { ...user, email: auth?.email };
  }

  return null;
};

export const useUpdateUser = () => {
  const { auth } = useAuth();
  const queryClient = useQueryClient();

  return useMutation(
    async (update: Partial<User>) => {
      if (!auth) return;

      const { error } = await supabase
        .from("users")
        .update(update)
        .eq("id", auth.id);

      if (error) {
        console.error(error);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(USER_KEY);
      },
    }
  );
};

export type UserOnboardingInformation = Required<
  Pick<User, "full_name" | "job_title" | "interests">
>;

export const useFinishOnboarding = () => {
  const updateMutation = useUpdateUser();

  return useMutation(async (update: UserOnboardingInformation) => {
    await updateMutation.mutateAsync({ ...update, has_onboarded: true });
  });
};
