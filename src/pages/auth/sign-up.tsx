import Link from "next/link";
import Image from "next/image";
import googleIcon from "../../../public/icons/google.svg";
import companyLogo from "../../../public/logo.svg";
import type { FormEvent } from "react";
import { useCallback, useState } from "react";
import { useRouter } from "next/router";
import { TextInput } from "../../components/design-system/TextInput";
import { Button } from "../../components/design-system/Button";
import { api } from "../../utils/api";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getProviders, signIn } from "next-auth/react";

type Providers = Awaited<ReturnType<typeof getProviders>>;

export const getServerSideProps: GetServerSideProps<{
  providers: Providers;
}> = async () => {
  const providers = await getProviders();
  return {
    props: { providers },
  };
};

export default function SignUpPage({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const registerMutation = api.user.registerWithEmailAndPassword.useMutation();

  const handleSignUp = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      await registerMutation.mutateAsync({ email, password });

      const signInResp = await signIn(providers?.credentials.id, {
        email,
        password,
        redirect: false,
        callbackUrl: "/",
      });

      if (signInResp?.ok) {
        router.push("/");
      }
    },
    [email, password, providers, registerMutation, router]
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
              <h1 className="text-3xl font-semibold">Create an account</h1>
              <p className="my-2 text-slate-500">
                Start your free 30 day trial. Cancel anytime.
              </p>
              <form
                className="my-4 flex flex-col gap-y-6"
                onSubmit={handleSignUp}
              >
                <Button
                  variant="outline"
                  className="flex w-full items-center justify-center gap-x-2 rounded-lg py-2"
                >
                  <Image priority src={googleIcon} alt={"google icon"} />
                  <span>Sign up with Google</span>
                </Button>
                <div className="relative flex items-center">
                  <div className="w-full border-b" />
                  <span className="z-10 mx-4 bg-white text-center text-xs font-medium text-slate-500">
                    OR
                  </span>
                  <div className="w-full border-b" />
                </div>
                <div className="flex flex-col">
                  <label className="mb-2 font-medium" htmlFor="email">
                    Email
                  </label>
                  <TextInput
                    className=""
                    type="email"
                    name="email"
                    placeholder="jane@company.com"
                    onValueChange={setEmail}
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="password" className="mb-2 font-medium">
                    Password
                  </label>
                  <TextInput
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    onValueChange={setPassword}
                  />
                </div>
                {/* <div className="flex items-center gap-x-2">
                  <input
                    className="h-4 w-4 appearance-none rounded border border-slate-300 bg-[length:130%_130%] bg-[45%_34%] text-white outline-offset-1 outline-primary-500 checked:border-primary-600 checked:bg-primary-500 checked:bg-check"
                    type="checkbox"
                    name="remember"
                    id="remember"
                  />
                  <label htmlFor="remember">Remember me</label>
                </div> */}
                <Button variant="primary" className="w-full">
                  Sign up
                </Button>
              </form>
              <p className="my-2 text-center text-slate-500">
                Already have an account?{" "}
                <Link href="/auth/sign-in" className="text-primary-500">
                  Sign in
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
