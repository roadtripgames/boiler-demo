import { CheckIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import Header from "../../../components/app/Header";
import { Button } from "../../../components/design-system/Button";
import getStripe from "../../../lib/stripe-client";
import { useTeam } from "../../../lib/useTeam";
import { api } from "../../../utils/api";
import SettingsLayout from "./layout";

type Plan = {
  name: string;
  price: string;
  targetCustomer: string;
  featureHighlights: string[];
};

const PLANS: Plan[] = [
  {
    name: "Plus",
    price: "$29.00",
    targetCustomer: "For growing teams",
    featureHighlights: [
      "Enhanced email sending",
      "Permission settings",
      "Upgraded contact analysis",
    ],
  },
  {
    name: "Pro",
    price: "$59.00",
    targetCustomer: "For scaling businesses",
    featureHighlights: [
      "Full access permissions",
      "Advanced data enrichment",
      "Priority support",
    ],
  },
  {
    name: "Enterprise",
    price: "$119.00",
    targetCustomer: "For large organizations",
    featureHighlights: [
      "Unlimited reporting",
      "SAML and SSO",
      "Custom billing",
    ],
  },
];

export function Plan({ name, price, targetCustomer, featureHighlights }: Plan) {
  const createSessionMutation = api.stripe.createCheckoutSession.useMutation();

  return (
    <div className="flex flex-1 flex-col rounded-md border bg-white px-6 py-4">
      <h4 className="mb-2 text-lg font-medium">{name}</h4>
      <h5 className="text-3xl font-semibold">{price}</h5>
      <p className="mb-4 text-slate-500">per user, per month, billed monthly</p>
      <Button
        className="self-center"
        onClick={async () => {
          const { sessionId } = await createSessionMutation.mutateAsync({
            slug: "test",
            priceId: `price_1MUCrKFAIsJhnRXbT9BJ0MeV`,
          });

          const stripe = await getStripe();
          stripe?.redirectToCheckout({ sessionId });
        }}
      >
        Upgrade to {name}
      </Button>
      <div className="mt-4 flex flex-col gap-y-1 text-slate-500">
        <p className="mb-2 font-medium">{targetCustomer}</p>
        {featureHighlights.map((f, i) => (
          <div key={i} className="flex items-center gap-x-1">
            <CheckIcon />
            <span className="">{f}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function General() {
  const { slug } = useTeam();
  const router = useRouter();
  const createStripePortalLinkMutation =
    api.stripe.createPortalLink.useMutation();

  return (
    <SettingsLayout
      title="Billing"
      description="View and manage your plans and invoices"
    >
      <h3 className="mb-4 text-xl font-medium">Plans</h3>
      <Button
        className="mb-4"
        onClick={async () => {
          const { portalUrl } =
            await createStripePortalLinkMutation.mutateAsync({
              slug,
            });
          router.push(portalUrl);
        }}
      >
        manage your billing with stripe
      </Button>
      <div className="flex justify-between gap-x-2">
        {PLANS.map((p) => (
          <Plan key={p.name} {...p} />
        ))}
      </div>
    </SettingsLayout>
  );
}
