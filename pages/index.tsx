import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>Boiler</title>
        <meta name="description" content="The best product ever built." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col">Wow!</main>
    </>
  );
}
