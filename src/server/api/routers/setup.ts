import { env } from "../../../env/server.mjs";
import _ from "lodash";
import { createTRPCRouter, publicProcedure } from "../trpc";

const setupRouter = createTRPCRouter({
  vars: publicProcedure.query(async () => {
    return _.mapValues(env, (value) =>
      !value || value === "default" ? undefined : "✅"
    );
  }),
});

export default setupRouter;
