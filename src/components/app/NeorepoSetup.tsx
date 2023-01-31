import { CheckCircledIcon, CircleIcon } from "@radix-ui/react-icons";
import _ from "lodash";
import { useSession } from "next-auth/react";
import NextLink from "next/link";
import type { env } from "process";
import React, { useEffect, useState } from "react";
import {
  clientEnv,
  DEFAULT_VALUE_DO_NOT_USE_IN_PRODUCTION,
} from "../../env/schema.mjs";
import cn from "../../lib/cn";
import useLocalStorage from "../../lib/useLocalStorage";
import { useTeam } from "../../lib/useTeam";
import { api } from "../../utils/api";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../design-system/Accordion";
import { Button } from "../design-system/Button";
import { Checkbox } from "../design-system/Checkbox";
import Spinner from "../design-system/Spinner";

const Link = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <NextLink
    className="text-blue-500 underline hover:text-blue-400"
    href={href}
    target="_blank"
    rel="noopener noreferrer"
  >
    {children}
  </NextLink>
);

const Code = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <code
    className={cn("rounded bg-slate-100 p-[2px] text-slate-900", className)}
  >
    {children}
  </code>
);

type VercelEnvironment = "production" | "preview" | "development";

const Var = ({
  envKey,
  value,
  environments = [],
  description,
}: {
  envKey: keyof typeof env;
  value: string | undefined;
  environments?: VercelEnvironment[];
  description?: React.ReactNode;
}) => {
  const isValid = isValidValue(value);
  let displayValue = value;
  if (value && isValid) {
    if (value.length > 7) displayValue = value.slice(0, 7) + "...";
    else displayValue = value;
  } else {
    displayValue = "not set";
  }

  return (
    <div className="my-1 flex flex-col border bg-slate-50 px-3 py-2">
      <div className="flex items-center justify-between">
        <span className="font-mono font-semibold">{envKey}</span>
        <span
          className={cn({
            "text-green-600": isValid,
            "text-red-600": !isValid,
          })}
        >
          {displayValue}
        </span>
      </div>
      {description}
      {environments.length > 0 && (
        <div className="my-2 flex flex-col gap-y-1">
          {["production", "preview", "development"].map((env) => {
            const includeEnv = environments.includes(env as VercelEnvironment);
            return (
              <div key={env} className="flex items-center space-x-2">
                <Checkbox checked={includeEnv} />
                <label>{_.capitalize(env)}</label>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const isValidValue = (value: string | undefined) => {
  return !!value && !value.includes(DEFAULT_VALUE_DO_NOT_USE_IN_PRODUCTION);
};

type SetupStep = {
  name: string;
  content: React.ReactNode;
  isOptional: boolean;
  isComplete: boolean;
};

export function Setup() {
  const { data: team } = useTeam();
  const { data: session, status } = useSession();
  const backendVars = api.setup.vars.useQuery();
  const hasUsers = api.setup.hasUsers.useQuery(undefined, {
    enabled: status === "authenticated",
  });
  const sendWelcomeEmailMutation = api.setup.sendWelcomeEmail.useMutation();
  const env = {
    ...backendVars.data,
    ..._.mapValues(clientEnv, (x) =>
      x === "" || x === DEFAULT_VALUE_DO_NOT_USE_IN_PRODUCTION ? undefined : x
    ),
  };

  const [isInstallStepComplete, setIsInstallStepComplete] = useLocalStorage(
    "neorepo_isInstallStepComplete",
    ""
  );
  const [isLinkStepComplete, setIsLinkStepComplete] = useLocalStorage(
    "neorepo_isLinkStepComplete",
    ""
  );
  const [isRunPlanetscaleStepComplete, setIsRunPlanetscaleStepComplete] =
    useLocalStorage("neorepo_isRunPlanetscaleStepComplete", "");

  const STEPS: SetupStep[] = [
    {
      name: "Local setup",
      content: (
        <div className="flex flex-col space-y-2">
          <p>
            Let&apos; start by cloning this repo locally and installing some
            required tools.
          </p>
          <div className="flex w-full flex-col rounded border bg-slate-100 px-4 py-3">
            <Code>
              git clone
              https://github.com/your-account/this-repo-you-deployed.git
            </Code>
            <Code>npm i -g vercel</Code>
            <Code>brew install planetscale/tap/pscale</Code>
            <Code>brew install mysql-client</Code>
            <Code>npm run dev</Code>
          </div>
          <Button
            onClick={() => setIsInstallStepComplete("done")}
            className="my-2 self-center"
          >
            Mark done
          </Button>
        </div>
      ),
      isOptional: false,
      isComplete: !!isInstallStepComplete,
    },
    {
      name: "Link to Vercel",
      content: (
        <div className="flex flex-col space-y-2">
          <p>
            We will be adding environment variables to Vercel, and we will need
            to pull them down to your local development environment.
          </p>
          <div className="flex w-full flex-col rounded border bg-slate-100 px-4 py-3">
            <Code>vercel login</Code>
            <Code>vercel link # choose your project</Code>
            <Code>vercel env pull .env.local</Code>
          </div>
          <p>
            Your <Code>.env.local</Code> file should look something like this.
          </p>
          <div className="flex w-full flex-col rounded border bg-slate-100 px-4 py-3">
            <Code># Created by Vercel CLI</Code>
            <Code>VERCEL=&quot;1&quot;</Code>
            <Code>VERCEL_ENV=&quot;development&quot;</Code>
            <Code>... some more lines ...</Code>
          </div>
          <Button
            onClick={() => setIsLinkStepComplete("done")}
            className="my-2 self-center"
          >
            Mark done
          </Button>
        </div>
      ),
      isOptional: false,
      isComplete: !!isLinkStepComplete,
    },
    {
      name: "Setup NextAuth",
      content: (
        <div className="space-y-2">
          <p>
            We need to set two environment variables in Vercel for NextAuth to
            work. <Code>NEXTAUTH_URL</Code> only needs to be set for
            development, and <Code>NEXTAUTH_SECRET</Code> needs to be set for
            all environments. We&apos;ve marked this with checkboxes and will be
            following the same convention for the rest of this setup.
          </p>
          <Var
            envKey="NEXTAUTH_URL"
            value={env.NEXTAUTH_URL}
            environments={["development"]}
            description={
              <div className="">
                Should be set to <Code>http://localhost:3000</Code> for
                &quot;development&quot; only.
              </div>
            }
          />
          <Var
            envKey="NEXTAUTH_SECRET"
            value={env.NEXTAUTH_SECRET}
            environments={["development", "production", "preview"]}
            description={
              <div className="space-y-2">
                <p>
                  We need this secret for NextAuth to encrypt your JWT tokens.
                  The NextAuth{" "}
                  <Link href="https://next-auth.js.org/configuration/options#secret">
                    docs
                  </Link>{" "}
                  go into more detail on how and why this is used.
                </p>
                <p>
                  Neorepo has set this to a default value to get builds to pass,
                  but you should set this to your own value.
                </p>
                <p>
                  You can generate one by running{" "}
                  <Code>openssl rand -base64 32</Code> in your terminal or using
                  this{" "}
                  <Link href="https://generate-secret.vercel.app/32">
                    secret generator
                  </Link>{" "}
                  website.
                </p>
              </div>
            }
          />
          <p>
            Run <Code>vercel env pull .env.local</Code> to pull your changes.
            Restart your dev server.
          </p>
        </div>
      ),
      isOptional: false,
      isComplete:
        isValidValue(env.NEXTAUTH_SECRET) && isValidValue(env.NEXTAUTH_URL),
    },
    {
      name: "Connect your database",
      content: (
        <div className="space-y-2">
          <Code>DATABASE_URL</Code> is a database connection string to a
          Postgres or MySQL database.
          <p>
            We recommend using{" "}
            <Link href="https://neorepo.com/docs/planetscale">Planetscale</Link>
            , but any Postgres or MySQL database will work.
          </p>
          <p>
            Based on your setup, you&apos;ll most likely want separate variables
            for local development and your production environment. We&apos;ve
            provided examples for a Planetscale setup here, but you can check
            the docs for other database examples.
          </p>
          <p>Set these variables in Vercel, and then pull then down.</p>
          <Var
            envKey="DATABASE_URL"
            value={env.DATABASE_URL}
            environments={["development"]}
            description={
              <div>
                <p>Example for Planetscale</p>
                <Code>mysql://root@127.0.0.1:3309/my-neorepo-db</Code>
              </div>
            }
          />
          <Var
            envKey="DATABASE_URL"
            value={env.DATABASE_URL}
            environments={["preview", "production"]}
            description={
              <div>
                <p>Example for Planetscale</p>
                <Code>
                  mysql://alskdjflasdjflaj:pscale_pw_alskdjASDlaksjdflkj@us-east.connect.psdb.cloud/my-planetscale-db?sslaccept=strict
                </Code>
              </div>
            }
          />
          <p>
            Run <Code>vercel env pull .env.local</Code> to pull your changes.
            Restart your dev server.
          </p>
        </div>
      ),
      isOptional: false,
      isComplete: isValidValue(env.DATABASE_URL),
    },
    {
      name: "Run Planetscale locally",
      content: (
        <div className="flex flex-col space-y-2">
          <p>
            If you are using Planetscale, in another terminal, run these
            commands
          </p>
          <div className="flex w-full flex-col rounded border bg-slate-100 px-4 py-3">
            <Code>pscale auth login</Code>
            <Code>pscale org list</Code>
            <Code>pscale org switch your-planetscale-org-name</Code>
          </div>
          <p>Then, push the local database to Planetscale by running</p>
          <div className="flex w-full flex-col rounded border bg-slate-100 px-4 py-3">
            <Code>npm run prisma db push</Code>
          </div>
          <p>
            You also need to tunnel to Planetscale by running this command in a
            separate terminal and keeping it open.
          </p>
          <div className="flex w-full flex-col rounded border bg-slate-100 px-4 py-3">
            <Code>
              pscale connect your-db-name your-db-branch-name --port 3309
            </Code>
            <Code># example: pscale connect kitchbook-db main --port 3309</Code>
          </div>
          <Button
            onClick={() => setIsRunPlanetscaleStepComplete("done")}
            className="my-2 self-center"
          >
            Mark done
          </Button>
        </div>
      ),
      isComplete: !!isRunPlanetscaleStepComplete,
      isOptional: true,
    },
    {
      name: "Test authentication",
      content: (
        <div>
          <p className="mb-2">
            If auth and your DB have been successfully setup, sign up for an
            account and follow the rest of the steps after logging in.
          </p>
          <div className="my-4 flex">
            <NextLink href="/auth/sign-up" className="mx-auto">
              <Button>Sign up</Button>
            </NextLink>
          </div>
        </div>
      ),
      isOptional: false,
      isComplete: hasUsers.data ?? false,
    },
    {
      name: "Connect your email provider",
      content: (
        <div>
          We provide a Sendgrid connector out of the box, but you can use any
          email provider. Go to <Code>email.tsx</Code> to replace{" "}
          <Code>sendgrid.send</Code> with a provider call of your choice.
          <div className="my-4 flex">
            <Button
              className="mx-auto"
              onClick={() => sendWelcomeEmailMutation.mutateAsync()}
              loading={sendWelcomeEmailMutation.isLoading}
            >
              Send welcome email
            </Button>
          </div>
          <Var envKey="SENDGRID_API_KEY" value={env.SENDGRID_API_KEY} />
        </div>
      ),
      isOptional: true,
      isComplete: isValidValue(env.SENDGRID_API_KEY),
    },
    {
      name: "Connect Stripe",
      content: (
        <div>
          <div>
            Once you&apos;ve connected to Stripe, new products and prices you
            create will be synced automatically to the Products table via the
            <Code>/stripe</Code> webhook.
          </div>
          <Var envKey="STRIPE_SECRET_KEY" value={env.STRIPE_SECRET_KEY} />
          <Var
            envKey="STRIPE_WEBHOOK_SECRET"
            value={env.STRIPE_WEBHOOK_SECRET}
          />
          <Var
            envKey="NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
            value={env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}
          />
        </div>
      ),
      isComplete:
        isValidValue(env.STRIPE_SECRET_KEY) &&
        isValidValue(env.STRIPE_WEBHOOK_SECRET) &&
        isValidValue(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY),
      isOptional: true,
    },
    {
      name: "Sync Stripe Products",
      content: (
        <div>
          This button will be enabled when <Code>STRIPE_SECRET_KEY</Code> and{" "}
          <Code>STRIPE_WEBHOOK_SECRET</Code> are set. It will sync all of your
          Stripe products and prices to the Products table in your DB. This is
          useful if you already have products in Stripe and want to sync them to
          your DB.
          <div className="my-4 flex">
            <Button
              className="my-2 mx-auto"
              disabled={
                !isValidValue(env.STRIPE_SECRET_KEY) ||
                !isValidValue(env.STRIPE_WEBHOOK_SECRET)
              }
            >
              Sync Stripe Products and Prices to DB
            </Button>
          </div>
          {team && (
            <div>
              Once your products have been synced, you can view your products in
              the{" "}
              <Link href={`/${team.slug}/settings/billing`}>Billing page</Link>.
            </div>
          )}
        </div>
      ),
      isComplete: false,
      isOptional: true,
    },
    {
      name: "Make environment variables required",
      content: (
        <div>
          To get this repo deployed quickly, Neorepo makes all of its env vars
          optional. As you go through these steps, you should remove the{" "}
          <Code>.optional()</Code> and <Code>.default()</Code> calls from the
          Zod types in <Code>schema.mjs</Code>. Making these variables required
          will help prevent pushing invalid configurations to your users.
        </div>
      ),
      isOptional: true,
      isComplete: false,
    },
    {
      name: "Cleanup",
      content: (
        <div>
          Once you&apos;ve completed the setup steps, you can delete all
          instances of <Code>NeorepoSetup</Code> and start building your app!
        </div>
      ),
      isOptional: true,
      isComplete: false,
    },
  ];

  const [openAccordionItems, setOpenAccordionItems] = useState<
    string[] | undefined
  >(undefined);

  useEffect(() => {
    const firstIncompleteStepIdx = STEPS.findIndex((s) => !s.isComplete);
    const step = STEPS[firstIncompleteStepIdx];
    if (step) {
      setOpenAccordionItems([step.name]);
      // setOpenAccordionItems(["Pull environment variables"]);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    backendVars.data,
    hasUsers.data,
    isLinkStepComplete,
    isInstallStepComplete,
    isRunPlanetscaleStepComplete,
  ]);

  if (backendVars.isLoading) return <Spinner />;

  return (
    <div className="max-h-full w-[640px] overflow-auto">
      <h1 className="text-xl font-medium">Neorepo Setup</h1>
      <Accordion
        type="multiple"
        value={openAccordionItems}
        onValueChange={setOpenAccordionItems}
      >
        {STEPS.map(({ name, content, isOptional, isComplete }) => {
          return (
            <AccordionItem key={name} value={name}>
              <AccordionTrigger>
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-x-2">
                    <div className="w-4">
                      {isComplete ? (
                        <CheckCircledIcon className="text-green-500" />
                      ) : (
                        <CircleIcon className="text-slate-400" />
                      )}
                    </div>
                    <span className="">{name}</span>
                  </div>
                  {isOptional && (
                    <span className="mr-4 font-normal text-slate-400">
                      optional
                    </span>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="w-full">{content}</AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}

export default Setup;
