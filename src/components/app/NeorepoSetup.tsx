import { CheckCircledIcon, CircleIcon } from "@radix-ui/react-icons";
import _ from "lodash";
import NextLink from "next/link";
import type { env } from "process";
import React, { useEffect, useState } from "react";
import {
  clientEnv,
  DEFAULT_VALUE_DO_NOT_USE_IN_PRODUCTION,
} from "../../env/schema.mjs";
import { api } from "../../utils/api";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../design-system/Accordion";
import { Button } from "../design-system/Button";
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

const Code = ({ children }: { children: React.ReactNode }) => (
  <code className="rounded bg-slate-100 p-[2px] text-slate-900">
    {children}
  </code>
);

const Var = ({
  envKey,
  value,
}: {
  envKey: keyof typeof env;
  value: string | undefined;
}) => {
  const valueStr =
    value && value.length > 7 ? value.slice(0, 7) + "..." : "not set";
  const displayValue = !isValidValue(value) ? "not set" : valueStr;

  return (
    <div className="my-1 flex items-center justify-between border bg-slate-50 px-3 py-2 font-mono">
      <span>{envKey}</span>
      <span>{displayValue}</span>
    </div>
  );
};

const isValidValue = (value: string | undefined) =>
  !!value && value !== DEFAULT_VALUE_DO_NOT_USE_IN_PRODUCTION;

type SetupStep = {
  name: string;
  content: React.ReactNode;
  isOptional: boolean;
  isComplete: boolean;
};

export function Setup() {
  const backendVars = api.setup.vars.useQuery();
  const hasUsers = api.setup.hasUsers.useQuery();
  const env = {
    ...backendVars.data,
    ..._.mapValues(clientEnv, (x) =>
      x === "" || x === DEFAULT_VALUE_DO_NOT_USE_IN_PRODUCTION ? undefined : x
    ),
  };

  const STEPS: SetupStep[] = [
    {
      name: "Connect your database",
      content: (
        <div>
          The first step is setting <Code>DATABASE_URL</Code> environment
          variable to a database. We recommend using{" "}
          <Link href="https://neorepo.com/docs/planetscale">Planetscale</Link>
          , but any Postgres or MySQL database will work.
          <Var envKey="DATABASE_URL" value={env.DATABASE_URL} />
        </div>
      ),
      isOptional: false,
      isComplete: isValidValue(env.DATABASE_URL),
    },
    {
      name: "Setup NextAuth",
      content: (
        <div>
          We need this secret for NextAuth to encrypt your JWT tokens. The
          NextAuth{" "}
          <Link href="https://next-auth.js.org/configuration/options#secret">
            docs
          </Link>{" "}
          go into more detail on how and why this is used. Neorepo has set this
          to a default value to get builds to pass, but you should set this to
          your own value. You can generate one by running{" "}
          <Code>openssl rand -base64 32</Code> in your terminal or generating a
          secret <Link href="https://generate-secret.vercel.app/32">here</Link>.
          <Var envKey="NEXTAUTH_SECRET" value={env.NEXTAUTH_SECRET} />
        </div>
      ),
      isOptional: false,
      isComplete: isValidValue(env.NEXTAUTH_SECRET),
    },
    {
      name: "Test authentication",
      content: (
        <div>
          <p className="mb-2">
            If auth and your DB have been successfully setup, sign up for an
            account and follow the rest of the steps after logging in.
          </p>
          <NextLink href="/auth/sign-up">
            <Button>Sign up</Button>
          </NextLink>
        </div>
      ),
      isOptional: false,
      isComplete: hasUsers.data ?? false,
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
  ];

  const [openAccordionItems, setOpenAccordionItems] = useState<
    string[] | undefined
  >(undefined);

  useEffect(() => {
    const firstIncompleteStepIdx = STEPS.findIndex((s) => !s.isComplete);
    const step = STEPS[firstIncompleteStepIdx];
    if (step) {
      setOpenAccordionItems([step.name]);
    }
  }, [backendVars.data, hasUsers.data]);

  if (backendVars.isLoading) return <Spinner />;

  return (
    <div className="w-[640px] py-4 ">
      <h1 className="text-xl font-medium">Setup</h1>
      <p className="italic text-slate-500">
        Note that you might have to re-run `yarn dev` after changing an
        environment variable.
      </p>
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
        {/* {Item("Connect to Sendgrid", <div>env</div>, {
          isOptional: true,
          isComplete: false,
        })}
        {Item("Connect to Stripe", <div>env</div>, {
          isOptional: true,
          isComplete: false,
        })}
        {Item("Connect to 3rd party providers", <div>env</div>, {
          isOptional: true,
          isComplete: false,
        })} */}
      </Accordion>
    </div>
  );
}

export default Setup;
