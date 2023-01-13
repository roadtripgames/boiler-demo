import { useUser } from "@supabase/auth-helpers-react";
import { Database } from "../../databaseTypes";
import { supabase } from "../utils/supabase-client";

export type OnboardingResults = Pick<
  Database["public"]["Tables"]["users"]["Row"],
  "full_name" | "job_title" | "interests"
>;

export const useOnOnboardingComplete = () => {
  const authUser = useUser();

  const updateFn = async (results: OnboardingResults) => {
    if (!authUser) return;

    const { data, error } = await supabase
      .from("users")

      .update({ ...results, has_onboarded: true })
      .eq("id", authUser.id);

    if (error) {
      console.error(error);
      return;
    }

    console.log(data);
  };

  return updateFn;
};
