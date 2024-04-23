import { VariationDataType } from "@featbit/js-client-sdk";

export const userName = 'The user 01';

// const sdkKey = 'Obg68EqYZk27JTxphPgy7At1aJ8GaAtEaIA1fb3IpuEA';
// const streamingUri = 'wss://app-eval.featbit.co';
// const eventsUri = 'https://app-eval.featbit.co';

const sdkKey = 'x5-p4nMlW0aLyzE5TpTtmwwvvdZpVB4Ey-aNea3wffFw';
const streamingUri = 'ws://localhost:5100';
const eventsUri = 'http://localhost:5100';

const flags = [
    {
        "id": "robot",
        "variation": "AlphaGo",
        // variation data type, string will be used if not specified
        variationType: VariationDataType.string
    },
    {
        "id": "用户信息模块",
        "variation": "v2.0.0",
        // variation data type, string will be used if not specified
        variationType: VariationDataType.string
    },
    {
        "id": "user_info_db_migration",
        "variation": "azure",
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