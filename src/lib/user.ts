import { useMutation, useQuery, useQueryClient } from "react-query";
import type { Database } from "../../databaseTypes";
import { supabase } from "../utils/supabase-client";
import { useAuth } from "./auth";
import { USER_KEY } from "./query-keys";

export type User = Database["public"]["Tables"]["users"]["Row"];

export const useUser = () => {
  const { user: authUser } = useAuth();

  const { data: user } = useQuery(
    USER_KEY,
    async () => {
      if (!authUser) return null;

      const resp = await supabase
        .from("users")
        .select("*")
        .eq("id", authUser.id)
        .single();

      return resp.data;
    },
    { enabled: !!authUser }
  );

  if (user) {
    return { ...user, email: authUser?.email };
  }

  return null;
};

export const useUpdateUser = () => {
  const { user: authUser } = useAuth();
  const queryClient = useQueryClient();

  return useMutation(
    async (update: Partial<User>) => {
      if (!authUser) return;

      const { error } = await supabase
        .from("users")
        .update(update)
        .eq("id", authUser.id);

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
