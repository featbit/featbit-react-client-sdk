import { VariationDataType } from "@featbit/js-client-sdk";

export const userName = 'The user 01';

const sdkKey = 'DzYExXybMEiBU7IfzA7tpgR7O1YG7QP02zTZSbO7EWiA';
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

const configBase = {
    options: {
        sdkKey,
        streamingUri,
        eventsUri,
        bootstrap: flags
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
            keyId: 'fb-demo-' + userName,
            customizedProperties: []
        },
        ...configBase.options
    },
    reactOptions: configBase.reactOptions
}