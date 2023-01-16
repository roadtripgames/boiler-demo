import type { AuthenticatedHandler } from "./withAuth";
import withAuth from "./withAuth";

type Response = {
  name: string;
};

const handler: AuthenticatedHandler<Response> = (req, res, supabase) => {
  res.status(200).json({ name: "Jon Doe" });
};

export default withAuth(handler);
