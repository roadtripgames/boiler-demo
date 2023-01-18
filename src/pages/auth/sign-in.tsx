import Link from "next/link";
import Image from "next/image";
import {
  getCsrfToken,
  getProviders,
  signIn,
  useSession,
} from "next-auth/react";

import googleIcon from "../../../public/icons/google.svg";
import companyLogo from "../../../public/logo.svg";
import type { FormEvent } from "react";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { TextInput } from "../../components/design-system/TextInput";
import { Button } from "../../components/design-system/Button";
import type { InferGetServerSidePropsType } from "next";
import type { GetServerSideProps } from "next";

type Providers = Awaited<ReturnType<typeof getProviders>>;
type CSRFToken = Awaited<ReturnType<typeof getCsrfToken>>;

export const getServerSideProps: GetServerSideProps<{
  providers: Providers;
  csrfToken: CSRFToken;
}> = async (context) => {
  const providers = await getProviders();
  const csrfToken = await getCsrfToken(context);
  return {
    props: { providers, csrfToken },
  };
};

export default function SignInPage({
  providers,
  csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data: session } = useSession();
  const signInWithPassword = () => {
    //
  };
  const router = useRouter();
  const [email, setEmail] = useState("");

  const handleSignInWithPassword = useCallback(async (e: FormEvent) => {
    e.preventDefault();

    // await signInWithPassword({ email, password });

    // router.push("/");
  }, []);

  return (
    <div className="flex h-full flex-col">
      session: {JSON.stringify(session, null, 2)}
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
                  onClick={() => signIn(providers?.google.id)}
                >
                  <Image priority src={googleIcon} alt={"google icon"} />
                  <span>Sign in with Google</span>
                </Button>
              </div>
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
