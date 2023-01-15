import clsx from "clsx";
import Head from "next/head";
import { Toaster } from "react-hot-toast";
import { Inter } from "@next/font/google";
import type { AppProps } from "next/app";
import { SessionContextProvider } from "@supabase/auth-helpers-react";

import "../styles/globals.css";
import { useState } from "react";
import { supabase } from "../utils/supabase-client";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

import { AuthProvider } from "../lib/auth";

if (
  typeof window !== "undefined" &&
  process.env.NODE_ENV === "development"
  // && /VIVID_ENABLED=true/.test(document.cookie)
) {
  import("vivid-studio").then((v) => v.run());
  import("vivid-studio/style.css");
}

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});
const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  const [supabaseClient] = useState(() => supabase);

  return (
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider
        supabaseClient={supabaseClient}
        initialSession={pageProps.initialSession}
      >
        <AuthProvider>
          <Head>
            <title>Boiler</title>
            <meta name="description" content="The best product ever built." />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <main className={clsx(inter.className, "h-full text-slate-900")}>
            <Component {...pageProps} className={""} />
            <Toaster />
          </main>
          <ReactQueryDevtools
            initialIsOpen={false}
            toggleButtonProps={{ style: { left: "unset", right: 0 } }}
          />
        </AuthProvider>
      </SessionContextProvider>
    </QueryClientProvider>
  );
}
