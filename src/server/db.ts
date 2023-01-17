import { createClient } from "@supabase/supabase-js";
import type { Database } from "../../databaseTypes";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseKey = process.env.NEXT_PUBLIC_SERVICE_ROLE_KEY ?? "";

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
