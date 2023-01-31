import Image from "next/image";
import { getProviders, signIn } from "next-auth/react";

import googleIcon from "../../../public/icons/google.svg";
import companyLogo from "../../../public/logo.svg";
import { useState } from "react";
import { useRouter } from "next/router";
import { Input } from "../../components/design-system/Input";
import { Button } from "../../components/design-system/Button";
import type { InferGetServerSidePropsType } from "next";
import type { GetServerSideProps } from "next";
import BoilerAlert from "../../components/design-system/BoilerAlert";
import Link from "next/link";
import { toast } from "react-hot-toast";

type Providers = Awaited<ReturnType<typeof getProviders>>;

export const getServerSideProps: GetServerSideProps<{
  providers: Providers;
}> = async () => {
  const providers = await getProviders();

  return {
    props: {
      providers,
    },
  };
};

export default function SignInPage({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex h-full flex-col">
      <BoilerAlert className="absolute bottom-4 right-4">
        Only Google sign in has been implemented
      </BoilerAlert>
      <div className="flex flex-auto overflow-y-auto">
        <div className="flex flex-1 flex-col overflow-y-auto">
          <div className="ml-8 mt-8">
            <Image src={companyLogo} alt={"company logo"} />
          </div>
          <div className="my-8 flex flex-auto items-center">
            <div className="mx-auto w-full max-w-sm">
              <h1 className="text-3xl font-semibold">Sign in</h1>
              <div className="mt-4 flex flex-col gap-y-6">
                <Button
                  variant="outline"
                  className="flex w-full items-center justify-center gap-x-2 rounded-lg py-2"
                  onClick={async () => {
                    await signIn(providers?.google.id, {
                      redirect: false,
                      callbackUrl: "/",
                    });
                  }}
                >
                  <Image priority src={googleIcon} alt={"google icon"} />
                  <span>Sign in with Google</span>
                </Button>
              </div>

              <div className="relative my-4 flex items-center">
                <div className="w-full border-b" />
                <span className="z-10 mx-4 bg-white text-center text-xs font-medium text-slate-500">
                  OR
                </span>
                <div className="w-full border-b" />
              </div>
              <form
                className="flex flex-col gap-y-6"
                onSubmit={async (e) => {
                  e.preventDefault();
                  setLoading(true);
                  const resp = await signIn(providers?.credentials.id, {
                    email,
                    password,
                    callbackUrl: `/`,
                    redirect: false,
                  });

                  if (resp?.ok) {
                    router.push("/");
                  } else {
                    toast.error("Invalid email or password", {
                      duration: 1000,
                    });
                    setPassword("");
                  }
                }}
              >
                <div className="flex flex-col">
                  <label className="mb-2 font-medium" htmlFor="email">
                    Email
                  </label>
                  <Input
                    className=""
                    autoComplete="email"
                    type="text"
                    name="email"
                    placeholder="jane@company.com"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="password" className="mb-2 font-medium">
                    Password
                  </label>
                  <Input
                    autoComplete="current-password"
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button className="w-full" loading={loading}>
                  Sign in
                </Button>
              </form>
              <p className="my-2 text-center text-slate-500">
                Don&apos;t have an account?{" "}
                <Link href="/auth/sign-up" className="text-primary-500">
                  Sign up
                </Link>{" "}
                instead
              </p>
            </div>
          </div>
        </div>
        <div className="hidden flex-1 items-center justify-center border-l bg-slate-50 lg:flex">
          <div className="mx-8 flex flex-col gap-y-4">
            <h2 className="max-w-lg text-3xl">
              &ldquo;Selene has been the greatest help to our operations since
              we started our business.&rdquo;
            </h2>
            <div>
              <p className="text-xl">Jeremy Allen White</p>
              <p className="text-slate-500">Head of Operations, RouterWalk</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
