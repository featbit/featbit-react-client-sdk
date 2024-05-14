"use client"

import { withFbProvider } from "@featbit/react-client-sdk";

function FeatBitProvider({children}: Readonly<{
    children: React.ReactNode;
}>) {
    return <>{children}</>;
}

export default withFbProvider({
    options: {
        user: {
            name: 'thename',
            keyId: 'thekey',
            customizedProperties: []
        },
        streamingUri: 'wss://app-eval.featbit.co',
        eventsUri: 'https://app-eval.featbit.co',
        sdkKey: 'Obg68EqYZk27JTxphPgy7At1aJ8GaAtEaIA1fb3IpuEA'
    },
    reactOptions: {
        useCamelCaseFlagKeys: true, // default is false
        sendEventsOnFlagRead: true // default is true
    }
})(FeatBitProvider as any);