import Head from "next/head";
import { Toaster } from "react-hot-toast";
import { Inter } from "@next/font/google";
import type { AppType } from "next/app";
import "../styles/globals.css";
import { api } from "../utils/api";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const App: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <>
      <style jsx global>
        {`
          :root {
            --inter-font: ${inter.style.fontFamily};
          }
        `}
      </style>
      <SessionProvider session={session}>
        <Head>
          <title>Boiler</title>
          <meta name="description" content="The best product ever built." />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className={"h-full"}>
          <Component {...pageProps} className={""} />
          <Toaster />
        </main>
      </SessionProvider>
    </>
  );
};

export default api.withTRPC(App);
