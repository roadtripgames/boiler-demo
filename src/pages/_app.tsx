import Head from "next/head";
import { Toaster } from "react-hot-toast";
import { Inter } from "@next/font/google";
import type { AppProps } from "next/app";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { useState } from "react";
import { supabase } from "../utils/supabase-client";
import { AuthProvider } from "../lib/auth";
import "../styles/globals.css";
import { api } from "../utils/api";
import clsx from "clsx";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

function App({ Component, pageProps }: AppProps) {
  const [supabaseClient] = useState(() => supabase);

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <AuthProvider>
        <Head>
          <title>Boiler</title>
          <meta name="description" content="The best product ever built." />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className={clsx(inter.className, "h-full")}>
          <Component {...pageProps} className={""} />
          <Toaster />
        </main>
      </AuthProvider>
    </SessionContextProvider>
  );
}

export default api.withTRPC(App);
