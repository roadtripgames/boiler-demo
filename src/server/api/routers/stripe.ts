import type { Prisma } from "@prisma/client";
import { fromUnixTime } from "date-fns";
import { z } from "zod";
import getBaseUrl from "../../../utils/getBaseUrl";
import stripe from "../stripe-server";
import { adminProcedure, createTRPCRouter, publicProcedure } from "../trpc";


// TODO: consolidate code here

const stripeRouter = createTRPCRouter({
  createCheckoutSession: adminProcedure
    .input(
      z.object({
        priceId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      let customer = await ctx.prisma.customer.findUnique({
        where: { teamId: ctx.team.id },
      });

      // Create customer if not found
      if (!customer) {
        const stripeCustomer = await stripe.customers.create({
          metadata: { userId: ctx.session.user.id },
          email: ctx.session.user.email ?? undefined,
        });

        customer = await ctx.prisma.customer.create({
          data: { id: stripeCustomer.id, teamId: ctx.team.id },
        });
      }

      const billingUrl = `${getBaseUrl()}/${ctx.team.slug}/settings/billing`;
      const quantity = ctx.team.roles.length || 1; // number of teammates

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        billing_address_collection: "required",
        customer: customer.id,
        line_items: [{ price: input.priceId, quantity }],
        mode: "subscription",
        subscription_data: { trial_from_plan: true },
        success_url: billingUrl,
        cancel_url: billingUrl,
      });

      return { sessionId: session.id };
    }),

  createPortalLink: adminProcedure.mutation(async ({ ctx }) => {
    const customer = await ctx.prisma.customer.findUnique({
      where: { teamId: ctx.team.id },
    });

    if (!customer) {
      throw new Error("Customer not found!");
    }

    const { url } = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      return_url: `${getBaseUrl()}/${ctx.team.slug}/settings/billing`,
    });

    return { portalUrl: url };
  }),
  upsertProductRecord: publicProcedure
    .input(z.any())
    .mutation(async ({ ctx, input: product }) => {
      const data: Prisma.ProductCreateInput = {
        id: product.id,
        name: product.name,
        active: product.active,
        description: product.description ?? undefined,
        image: product.images?.[0] ?? undefined,
        metadata: product.metadata,
      };

      await ctx.prisma.product.upsert({
        where: { id: product.id },
        update: data,
        create: data,
      });
    }),
  upsertPriceRecord: publicProcedure
    .input(z.any())
    .mutation(async ({ ctx, input: price }) => {
      const productId = typeof price.product === "string" ? price.product : "";
      const data: Prisma.PriceCreateInput = {
        id: price.id,
        product: { connect: { id: productId } },
        active: price.active,
        currency: price.currency,
        description: price.nickname ?? undefined,
        type: price.type,
        unitAmount: price.unit_amount ?? 0,
        interval: price.recurring?.interval ?? undefined,
        intervalCount: price.recurring?.interval_count ?? undefined,
        trialPeriodDays: price.recurring?.trial_period_days ?? undefined,
        metadata: price.metadata,
      };

      await ctx.prisma.price.upsert({
        where: { id: price.id },
        update: data,
        create: data,
      });
    }),
  manageSubscriptionStatusChange: publicProcedure
    .input(
      z.object({
        subscriptionId: z.string(),
        customerId: z.string(),
        createAction: z.boolean().default(false),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const customer = await ctx.prisma.customer.findUnique({
        where: { id: input.customerId },
      });

      if (!customer) {
        throw new Error("Customer not found!");
      }

      const subscription = await stripe.subscriptions.retrieve(
        input.subscriptionId,
        { expand: ["default_payment_method"] }
      );

      const priceId = subscription.items.data[0]?.price.id;
      if (!priceId) {
        throw new Error(`Price not found for subscription: ${subscription.id}`);
      }

      const subscriptionData: Prisma.SubscriptionCreateInput = {
        id: subscription.id,
        team: { connect: { id: customer.teamId } },
        price: { connect: { id: priceId } },
        metadata: subscription.metadata,
        status: subscription.status,
        quantity: subscription.items.data[0]?.quantity ?? undefined,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        cancelAt: subscription.cancel_at
          ? fromUnixTime(subscription.cancel_at)
          : undefined,
        canceledAt: subscription.canceled_at
          ? fromUnixTime(subscription.canceled_at)
          : undefined,
        currentPeriodStart: fromUnixTime(subscription.current_period_start),
        currentPeriodEnd: fromUnixTime(subscription.current_period_end),
        createdAt: fromUnixTime(subscription.created),
        endedAt: subscription.ended_at
          ? fromUnixTime(subscription.ended_at)
          : undefined,
        trialStart: subscription.trial_start
          ? fromUnixTime(subscription.trial_start)
          : undefined,
        trialEnd: subscription.trial_end
          ? fromUnixTime(subscription.trial_end)
          : undefined,
      };

      await ctx.prisma.subscription.upsert({
        where: { id: subscription.id },
        update: subscriptionData,
        create: subscriptionData,
      });
    }),
  syncProducts: publicProcedure.mutation(async ({ ctx }) => {
    const products = await stripe.products.list();
    for (const product of products.data) {
      const data: Prisma.ProductCreateInput = {
        id: product.id,
        name: product.name,
        active: product.active,
        description: product.description ?? undefined,
        image: product.images?.[0] ?? undefined,
        metadata: product.metadata,
      };

      await ctx.prisma.product.upsert({
        where: { id: product.id },
        update: data,
        create: data,
      });
    }
  }),
  syncPrices: publicProcedure.mutation(async ({ ctx }) => {
    // get all products from prisma,
    // for each product, get the prices from stripe
    // upsert each price to the db
    const products = await ctx.prisma.product.findMany();
    for (const p of products) {
      const prices = await stripe.prices.list({ product: p.id });
      for (const price of prices.data) {
        const productId =
          typeof price.product === "string" ? price.product : "";
        const data: Prisma.PriceCreateInput = {
          id: price.id,
          product: { connect: { id: productId } },
          active: price.active,
          currency: price.currency,
          description: price.nickname ?? undefined,
          type: price.type,
          unitAmount: price.unit_amount ?? 0,
          interval: price.recurring?.interval ?? undefined,
          intervalCount: price.recurring?.interval_count ?? undefined,
          trialPeriodDays: price.recurring?.trial_period_days ?? undefined,
          metadata: price.metadata,
        };

        await ctx.prisma.price.upsert({
          where: { id: price.id },
          update: data,
          create: data,
        });
      }
    }
  }),
});

export default stripeRouter;
