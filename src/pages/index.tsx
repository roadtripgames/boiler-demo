import Image from "next/image";
import { useSession } from "next-auth/react";
import Header from "../components/app/Header";
import Onboarding from "../components/app/Onboarding";
import { api } from "../utils/api";
import BoilerAlert from "../components/design-system/BoilerAlert";
import { Button } from "../components/design-system/Button";
import Link from "next/link";
import { env as clientEnv } from "../env/client.mjs";
import clsx from "clsx";

const filterMap = (obj: Record<string, string | undefined>, keys: string[]) =>
  Object.fromEntries(Object.entries(obj).filter(([key]) => keys.includes(key)));

function Setup() {
  const backendVars = api.setup.vars.useQuery();
  const env = { ...backendVars.data, ...clientEnv };
  const optionalVars = [
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "SENDGRID_API_KEY",
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
  ];
  const requiredVars = ["DATABASE_URL", "NEXTAUTH_SECRET"];

  const Table = ({ obj }: { obj: Record<string, string | undefined> }) => (
    <div className="mb-4 flex flex-col gap-y-1">
      {Object.entries(obj).map(([key, value]) => {
        const displayValue =
          value === undefined
            ? "undefined"
            : value.length <= 7
            ? value
            : value.slice(0, 7) + "...";
        return (
          <div
            key={key}
            className="flex items-center justify-between font-mono text-xs"
          >
            <span className="font-medium">{key}</span>
            <span
              className={clsx({
                "text-slate-500": displayValue === "undefined",
                "text-green-500": displayValue !== "undefined",
              })}
            >
              {displayValue}
            </span>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="max-w-xl rounded-lg border px-8 py-5 shadow-sm">
      <h1 className="mb-2 text-2xl font-medium">Setup</h1>
      <p className="mb-4">
        To finish setup, you need to add some required environment variables.
      </p>
      <p className="mb-4">
        Keys that start with <code>NEXT_PUBLIC_</code> should be set for the
        frontend (<code>clientSchema</code>) and the others should be set for
        the backend (<code>serverSchema</code>) in <code>schema.mjs</code>
      </p>
      <h2 className="text-lg font-medium">Required env vars</h2>
      <p className="mb-2 text-slate-500">
        These variables are required for the app to function
      </p>
      <div className="mb-4 flex flex-col gap-y-1">
        <Table obj={filterMap(env, requiredVars)} />
      </div>
      <h2 className="text-lg font-medium">Optional env vars</h2>
      <p className="mb-2 text-slate-500">
        These variables are optional but enable certain features
      </p>
      <div className="mb-4 flex flex-col gap-y-1">
        <Table obj={filterMap(env, optionalVars)} />
      </div>
    </div>
  );
}

export default function Home() {
  const { data: session, status } = useSession();
  const user = api.user.get.useQuery(undefined, { enabled: !!session });

  if (status === "unauthenticated") {
    return (
      <div className="relative flex h-full min-h-screen flex-col">
        <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-center">
          <div className="flex flex-col items-center gap-y-4">
            <div className="flex h-fit items-center rounded-xl">
              <div className="text-3xl font-medium">Welcome to</div>
              <div className="ml-4">
                <Image
                  src="/logo.svg"
                  width={100}
                  height={100}
                  alt={""}
                  priority
                />
              </div>
            </div>
            <Link href="/auth/sign-in">
              <Button className="w-fit">Sign in</Button>
            </Link>
            <a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Froadtripgames%2Fboiler-template&env=axy,ayc&project-name=boiler&repository-name=boiler">
              <img src="https://vercel.com/button" alt="Deploy with Vercel" />
            </a>

            <Setup />
          </div>
          <BoilerAlert className="absolute bottom-4 right-4">
            This is your un-authenticated page
          </BoilerAlert>
        </div>
      </div>
    );
  }

  if (!session || !user.data) {
    return null;
  }

  if (!user.data.hasOnboarded) {
    return (
      <>
        <Onboarding />;
      </>
    );
  }

  return (
    <>
      <div className="flex h-full min-h-screen flex-col">
        <Header />
        <div className="mx-auto flex h-full w-full max-w-7xl p-4">
          <div className="text-xl font-medium">
            Welcome {user?.data?.name ?? "Unknown user"}!
          </div>
        </div>
        <BoilerAlert className="absolute bottom-4 right-4">
          This is a user&apos;s personal page
        </BoilerAlert>
      </div>
    </>
  );
}
