import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "../../databaseTypes";

export const supabase = createBrowserSupabaseClient<Database>();
