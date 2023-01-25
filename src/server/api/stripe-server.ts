import Stripe from "stripe";
import { env } from "../../env/server.mjs";

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: "2022-11-15",
  // Register this as an official Stripe plugin.
  // https://stripe.com/docs/building-plugins#setappinfo
  appInfo: {
    name: "Boiler Stripe Connector",
    version: "0.0.1",
  },
});

export default stripe;
