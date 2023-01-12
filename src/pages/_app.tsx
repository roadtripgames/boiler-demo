import Head from "next/head";
import { Inter } from "@next/font/google";
import type { AppProps } from "next/app";
import "../styles/globals.css";
import clsx from "clsx";

// if (
//   typeof window !== "undefined" &&
//   process.env.NODE_ENV === "development"
//   // && /VIVID_ENABLED=true/.test(document.cookie)
// ) {
//   import("vivid-studio").then((v) => v.run());
//   import("vivid-studio/style.css");
// }

const inter = Inter({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Boiler</title>
        <meta name="description" content="The best product ever built." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={clsx(inter.className, "h-full")}>
        <Component {...pageProps} className={""} />
      </main>
    </>
  );
}
