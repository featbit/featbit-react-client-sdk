import {BasicLogger, VariationDataType} from "@featbit/js-client-sdk";

export const userName = 'The user 01';

const sdkKey = '3QFLBQibTE6i1duL1WAK2A227SK-9N8k-9VqurJDE_Qw';
const streamingUri = 'wss://app-eval.featbit.co';
const eventsUri = 'https://app-eval.featbit.co';

const flags = [
    {
        "id": "robot",
        "variation": "AlphaGo",
        // variation data type, string will be used if not specified
        variationType: VariationDataType.string
    },
    {
        "id": "user-info",
        "variation": "v2.0.0",
        // variation data type, string will be used if not specified
        variationType: VariationDataType.string
    }
];

const myLogger = new BasicLogger({
    level: "debug",
    destination: console.log
});


const configBase = {
    options: {
        sdkKey,
        streamingUri,
        eventsUri,
        bootstrap: flags,
        logLevel: 'debug',
        //logger: myLogger,
    },
    reactOptions: {
        useCamelCaseFlagKeys: true,
        sendEventsOnFlagRead: true
    }
}

export const configWithUser = {
    options: {
        user: {
            name: userName,
            keyId: 'fb-demo-' + userName.replace(/\s/g, '-'),
            customizedProperties: []
        },
        ...configBase.options
    },
    reactOptions: configBase.reactOptions
}