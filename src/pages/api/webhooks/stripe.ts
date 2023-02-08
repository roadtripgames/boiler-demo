import type Stripe from "stripe";
import type { NextApiRequest, NextApiResponse } from "next";
import type { Readable } from "node:stream";
import { env } from "@/env/server.mjs";
import { createTRPCContext } from "@/server/api/trpc";
import { appRouter } from "@/server/api/root";
import stripe from "@/server/api/stripe-server";

// Stripe requires the raw body to construct the event.
export const config = {
  api: {
    bodyParser: false,
  },
};

async function buffer(readable: Readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

const relevantEvents = new Set([
  "product.created",
  "product.updated",
  "price.created",
  "price.updated",
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

const webhookHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const buf = await buffer(req);
    const sig = req.headers["stripe-signature"];
    const webhookSecret = env.STRIPE_WEBHOOK_SECRET;

    let event: Stripe.Event;

    try {
      // don't check for signature in dev mode
      if (!sig || !webhookSecret) return;
      event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    } catch (err: any) {
      console.log(`❌ Error message: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    const ctx = await createTRPCContext({ req, res });
    const caller = appRouter.createCaller(ctx);

    if (relevantEvents.has(event.type)) {
      try {
        switch (event.type) {
          case "product.created":
          case "product.updated":
            await caller.stripe.upsertProductRecord(
              event.data.object as Stripe.Product
            );
            break;
          case "price.created":
          case "price.updated":
            await caller.stripe.upsertPriceRecord(
              event.data.object as Stripe.Price
            );
            break;
          case "customer.subscription.created":
          case "customer.subscription.updated":
          case "customer.subscription.deleted":
            const subscription = event.data.object as Stripe.Subscription;

            await caller.stripe.manageSubscriptionStatusChange({
              subscriptionId: subscription.id,
              customerId: subscription.customer as string,
              createAction: event.type === "customer.subscription.created",
            });
            break;
          case "checkout.session.completed":
            const checkoutSession = event.data
              .object as Stripe.Checkout.Session;
            if (checkoutSession.mode === "subscription") {
              const subscriptionId = checkoutSession.subscription;
              await caller.stripe.manageSubscriptionStatusChange({
                subscriptionId: subscriptionId as string,
                customerId: checkoutSession.customer as string,
                createAction: true,
              });
            }
            break;
          default:
            throw new Error("Unhandled relevant event!");
        }
      } catch (error) {
        console.log(error);
        return res
          .status(400)
          .send('Webhook error: "Webhook handler failed. View logs."');
      }
    }

    res.json({ received: true });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};

export default webhookHandler;
