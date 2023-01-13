import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../../databaseTypes";

export const supabase = createBrowserSupabaseClient<Database>();
