"use client"

import { withFbProvider } from "@featbit/react-client-sdk";
import { fbConfig } from "@/app/fbConfig";

function FeatBitProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{ children }</>;
}

export default withFbProvider(fbConfig)(FeatBitProvider as any);