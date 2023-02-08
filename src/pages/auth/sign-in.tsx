import Image from "next/image";
import googleIcon from "../../../public/icons/google.svg";
import companyLogo from "../../../public/logo.svg";
import type { FormEvent } from "react";
import { useCallback, useState } from "react";
import { useRouter } from "next/router";
import { Input } from "../../components/design-system/Input";
import { Button } from "../../components/design-system/Button";
import { api } from "../../utils/api";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getProviders, signIn } from "next-auth/react";
import { TRPCClientError } from "@trpc/client";
import { toast } from "react-hot-toast";
import Separator from "../../components/design-system/Separator";
import { z } from "zod";

type Providers = Awaited<ReturnType<typeof getProviders>>;

const AcceptInviteParams = z.object({
  email: z.string(),
  code: z.string(),
});

export const getServerSideProps: GetServerSideProps<{
  providers: Providers;
}> = async () => {
  const providers = await getProviders();
  return {
    props: { providers },
  };
};

export default function SignInPage({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const acceptInviteParams = AcceptInviteParams.safeParse(router.query);
  const callbackUrl = acceptInviteParams.success
    ? `/auth/accept-invite?email=${encodeURIComponent(
        acceptInviteParams.data.email
      )}&code=${encodeURIComponent(acceptInviteParams.data.code)}`
    : "/";

  const registerMutation = api.user.registerWithEmailAndPassword.useMutation();

  const handleSignIn = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      try {
        setIsLoading(true);
        await registerMutation.mutateAsync({ email, password });
      } catch (e) {
        if (!(e instanceof TRPCClientError)) {
          toast.error("Could not sign in. Try again.");
          setIsLoading(false);
          return;
        }

        try {
          const body = JSON.parse(e.message);
          const message = body?.[0].message;
          if (message) {
            toast.error(message);
          }
        } catch (e) {
          toast.error("Could not sign in. Try again.");
        }
      }

      const signInResp = await signIn(providers?.credentials.id, {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      setIsLoading(false);
      if (signInResp?.ok) {
        router.push(callbackUrl);
      }
    },
    [email, password, providers, registerMutation, router, callbackUrl]
  );

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-auto overflow-y-auto">
        <div className="flex flex-1 flex-col overflow-y-auto">
          <div className="ml-8 mt-8">
            <Image src={companyLogo} alt={"company logo"} />
          </div>
          <div className="my-8 flex flex-auto items-center">
            <div className="mx-auto w-full max-w-sm">
              <h1 className="text-3xl font-semibold">Log in or sign up</h1>
              {providers?.google && (
                <Button
                  variant="outline"
                  className="my-4 flex w-full items-center justify-center gap-x-2 rounded-lg py-2"
                  onClick={() => {
                    signIn(providers.google.id, {
                      redirect: false,
                      callbackUrl,
                    });
                  }}
                >
                  <Image priority src={googleIcon} alt={"google icon"} />
                  <span>Continue with Google</span>
                </Button>
              )}
              <form
                className="my-4 flex flex-col space-y-4"
                onSubmit={handleSignIn}
              >
                {Object.keys(providers ?? {}).length >= 2 && (
                  <Separator>OR</Separator>
                )}
                <div className="flex flex-col">
                  <label className="mb-2 font-medium" htmlFor="email">
                    Email
                  </label>
                  <Input
                    className=""
                    type="email"
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
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button className="w-full" loading={isLoading}>
                  Continue
                </Button>
              </form>
            </div>
          </div>
        </div>
        <div className="hidden flex-1 items-center justify-center border-l bg-slate-50 lg:flex">
          <div className="mx-8 flex flex-col gap-y-4">
            <h2 className="max-w-lg text-3xl">
              &ldquo;Neorepo has been the greatest help to our operations since
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
