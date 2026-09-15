import "../styles/globals.css";
import { CrowdFundingProvider } from "../Context/CrowdFunding";
import { NotificationToast } from "../Components";
import Head from "next/head";

export default function App({ Component, pageProps }) {
  return (
    <CrowdFundingProvider>
      <Head>
        <title>CryptoFund — Decentralized Web3 Crowdfunding Protocol</title>
        <meta
          name="description"
          content="Raise funds and back innovative projects directly on the blockchain with zero intermediaries and instant P2P settlement."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
      <NotificationToast />
    </CrowdFundingProvider>
  );
}
