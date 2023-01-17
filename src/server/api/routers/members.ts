import { z } from "zod";
import type { Database } from "../../../../databaseTypes";
import { supabase } from "../../db";

import { createTRPCRouter, protectedProcedure } from "../trpc";

const membersRouter = createTRPCRouter({
  get: protectedProcedure
    .input(z.object({ teamId: z.number().or(z.undefined()) }))
    .query(async ({ ctx, input }) => {
      if (input.teamId == null) {
        return null;
      }

      // fetch team to make sure you're a member
      const { data: team, error } = await ctx.supabase
        .from("teams")
        .select(
          `*,
          users:teams_users(id:user_id)
        `
        )
        .eq("teams_users.user_id", ctx.session.user.id)
        .eq("id", input.teamId)
        .single();

      if (!team || error) {
        console.error(error);
        throw new Error("Could not get team");
      }

      // console.log(
      //   await ctx.supabase
      //     .from("teams_users")
      //     .select(
      //       `
      //       team_id,
      //       user_id,
      //       users (
      //         id,
      //         full_name,
      //         job_title,
      //         avatar_url
      //       )
      //       `
      //     )
      //     .eq("team_id", input.teamId)
      // );

      const { data: membersRaw, error: membersError } = await ctx.supabase
        .from("teams_users")
        .select(
          `
          users (
            id,
            full_name,
            job_title,
            avatar_url
          )
          `
        )
        .eq("team_id", input.teamId);

      if (membersError || !membersRaw) {
        console.error(membersError);
        throw new Error("Could not get members");
      }

      // need this type because supabase interprets the users
      // as potentially null even though its enforced as "not null"
      // by postgres
      const members = membersRaw.map((m) => m.users) as Pick<
        Database["public"]["Tables"]["users"]["Row"],
        "avatar_url" | "full_name" | "id" | "job_title"
      >[];
      return members;
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      //
    }),
  create: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      //
    }),
  update: protectedProcedure
    .input(
      z.object({
        full_name: z.string().optional(),
        job_title: z.string().optional(),
        interests: z.array(z.string()).optional(),
        avatar_url: z.string().optional(),
        billing_address: z.string().optional(),
        has_onboarded: z.boolean().optional(),
        payment_method: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      //
    }),
});

export default membersRouter;
