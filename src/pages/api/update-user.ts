import { z } from "zod";
import type { AuthenticatedHandler } from "./withAuth";
import withAuth from "./withAuth";

const Request = z.object({
  id: z.string(),
  full_name: z.string().optional(),
  job_title: z.string().optional(),
  interests: z.array(z.string()).optional(),
  avatar_url: z.string().optional(),
  billing_address: z.string().optional(),
  has_onboarded: z.boolean().optional(),
  payment_method: z.string().optional(),
});

type Response = void;

const handler: AuthenticatedHandler<Response> = async (
  req,
  res,
  { supabase, session: { user } }
) => {
  const update = Request.parse(req.body);
  await supabase.from("users").update(update).eq("id", user.id);

  res.status(200).send();
};

export default withAuth(handler);
