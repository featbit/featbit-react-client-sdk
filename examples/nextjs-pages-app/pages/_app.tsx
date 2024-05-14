import "@/styles/globals.css";
import type { AppProps } from "next/app";
import FeatBitProvider from "@/pages/FeatBitProvider";

export default function App({ Component, pageProps }: AppProps) {
  return <FeatBitProvider><Component {...pageProps} /></FeatBitProvider>;
}
