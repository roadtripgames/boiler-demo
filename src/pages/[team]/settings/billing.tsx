import type { Price, Team } from "@prisma/client";
import { PricingPlanInterval } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { Button } from "../../../components/design-system/Button";
import Spinner from "../../../components/design-system/Spinner";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "../../../components/design-system/TabSelector";
import cn from "../../../lib/cn";
import getStripe from "../../../lib/stripe-client";
import { useTeam } from "../../../lib/useTeam";
import type { RouterOutputs } from "../../../utils/api";
import { api } from "../../../utils/api";
import SettingsLayout from "./layout";

export function Product({
  name,
  description,
  image,
  prices,
  selectedInterval,
  team,
  currentPrice,
}: RouterOutputs["billing"]["products"][0] & {
  selectedInterval: PricingPlanInterval;
  team: Team;
  currentPrice: Price | undefined;
}) {
  const router = useRouter();
  const createPortalLinkMutation = api.stripe.createPortalLink.useMutation();
  const createSessionMutation = api.stripe.createCheckoutSession.useMutation();
  const price = prices.find((p) => p.interval === selectedInterval);

  const handleManageSubscription = useCallback(async () => {
    if (!team) return;

    const { portalUrl } = await createPortalLinkMutation.mutateAsync({
      slug: team.slug,
    });
    router.push(portalUrl);
  }, [createPortalLinkMutation, router, team]);

  const handleCreateSubscription = useCallback(async () => {
    if (!price || !team) return;

    const { sessionId } = await createSessionMutation.mutateAsync({
      slug: team.slug,
      priceId: price.id,
    });

    const stripe = await getStripe();
    stripe?.redirectToCheckout({ sessionId });
  }, [createSessionMutation, price, team]);

  if (!price) return null;

  const isCurrentPlan = price.id === currentPrice?.id;

  return (
    <div
      className={cn(
        "flex flex-1 flex-col rounded-md border bg-white px-4 pb-8 text-center",
        {
          "border-primary-600": isCurrentPlan,
        }
      )}
    >
      <h4 className="mt-4 self-center text-lg font-medium">{name}</h4>
      {image && (
        <Image
          src={image}
          alt={name}
          width={64}
          height={64}
          className="self-center rounded-md"
        />
      )}
      <h4 className="text-3xl font-semibold">
        {new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: price.currency,
          minimumFractionDigits: 0,
        }).format((price.unitAmount || 0) / 100)}
      </h4>
      <p className="mb-4 text-slate-500">per user, per month</p>
      <h4 className="mb-2 min-h-[50px] text-sm text-slate-500">
        {description}
      </h4>
      <Button
        className="self-center px-5"
        loading={
          createSessionMutation.isLoading || createPortalLinkMutation.isLoading
        }
        onClick={() => {
          if (isCurrentPlan) {
            handleManageSubscription();
          } else {
            handleCreateSubscription();
          }
        }}
      >
        {isCurrentPlan ? "Manage" : "Upgrade"}
      </Button>
    </div>
  );
}

export default function Billing() {
  const { data: team } = useTeam();
  const [interval, setInterval] = useState<PricingPlanInterval>("month");

  // const syncPricesMutation = api.stripe.syncPrices.useMutation();
  const { data: products } = api.billing.products.useQuery();

  useEffect(() => {
    if (team?.subscription[0]?.price.interval) {
      setInterval(team.subscription[0].price.interval);
    }
  }, [team?.subscription]);

  if (!team) return;

  const currentPrice = team.subscription[0]?.price;
  const currentProduct = currentPrice?.product;

  return (
    <SettingsLayout
      title="Billing"
      description="View and manage your plans and invoices"
    >
      {products ? (
        <>
          <div className="mb-4">
            <h2 className="mb-2 text-xl font-medium">Current plan</h2>
            <div>
              You&apos;re currently on the{" "}
              {currentProduct ? `${currentPrice.interval}ly` : ""}{" "}
              <span className="rounded bg-primary-100 px-2 py-1 text-primary-900">
                {currentProduct?.name || "Free"}
              </span>{" "}
              plan
            </div>
          </div>
          <div className="flex flex-col">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-medium">Plans</h3>
              <Tabs
                onValueChange={(v) => setInterval(v as PricingPlanInterval)}
                value={interval}
                className="self-end"
              >
                <TabsList>
                  <TabsTrigger value={PricingPlanInterval["month"]}>
                    Monthly
                  </TabsTrigger>
                  <TabsTrigger value={PricingPlanInterval["year"]}>
                    Yearly
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div className="flex justify-between gap-x-2">
              {products?.map((p) => (
                <Product
                  key={p.id}
                  team={team}
                  selectedInterval={interval}
                  currentPrice={currentPrice}
                  {...p}
                />
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center">
          <Spinner />
        </div>
      )}
    </SettingsLayout>
  );
}
