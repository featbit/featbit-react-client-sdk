'use client';

import { useFbClient, useFlags } from "@featbit/react-client-sdk";

export default function TestComponent() {
  const { robot } = useFlags();
  return (
    <>
      { robot === 'AlphaGo' && (
          <div className="flex items-center justify-center w-full p-8 bg-gradient-to-br from-[#ff0000] via-[#ff00ff] to-[#0000ff] dark:from-[#ff0000] dark:via-[#ff00ff] dark:to-[#0000ff]">
          <h1 className="text-6xl font-bold text-white dark:text-black">
            🤖
          </h1>
          </div>
      )}
    </>);
};