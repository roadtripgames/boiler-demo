import type { Stripe } from "@stripe/stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { env } from "../env/client.mjs";

let stripePromise: Promise<Stripe | null> | null = null;

const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
  }

  return stripePromise;
};

export default getStripe;
