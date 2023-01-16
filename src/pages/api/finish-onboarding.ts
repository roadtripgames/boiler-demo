import { z } from "zod";
import type { AuthenticatedHandler } from "./withAuth";
import withAuth from "./withAuth";

const Request = z.object({
  full_name: z.string(),
  job_title: z.string(),
});

type Response = void;

const handler: AuthenticatedHandler<Response> = async (
  req,
  res,
  { supabase, session: { user } }
) => {
  const update = Request.parse(req.body);
  await supabase
    .from("users")
    .update({ ...update, has_onboarded: true })
    .eq("id", user.id);

  res.status(200).send();
};

export default withAuth(handler);
