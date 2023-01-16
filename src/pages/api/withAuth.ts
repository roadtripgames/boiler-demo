import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import type { Session, SupabaseClient } from "@supabase/supabase-js";
import type { NextApiRequest, NextApiResponse } from "next";
import type { Database } from "../../../databaseTypes";
import type { AppError } from "./types";

function withAuth<T>(fn: AuthenticatedHandler<T>) {
  const handler: AuthenticatedHandler<T> = async (
    req: NextApiRequest,
    res: NextApiResponse<T | AppError>
  ) => {
    const supabase = createServerSupabaseClient<Database>({ req, res });

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return res.status(401).json({
        error: "not_authenticated",
        message:
          "The user does not have an active session or is not authenticated",
      });
    }

    return fn(req, res, { supabase, session });
  };

  return handler;
}

export type AuthenticatedHandler<T> = (
  req: NextApiRequest,
  res: NextApiResponse<T | AppError>,
  context: { supabase: SupabaseClient<Database>; session: Session }
) => void;

export default withAuth;
