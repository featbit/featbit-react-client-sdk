import { VariationDataType } from "@featbit/js-client-sdk";

export const userName = 'The user 01';

const secret = 'Obg68EqYZk27JTxphPgy7At1aJ8GaAtEaIA1fb3IpuEA';
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
        secret,
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
        anonymous: false,
        user: {
            name: userName,
            keyId: 'fb-demo-' + userName,
            customizedProperties: []
        },
        ...configBase.options
    },
    reactOptions: configBase.reactOptions
}

export const configWithAnonymousUser = {
    options: {
        anonymous: true,
        ...configBase.options
    },
    reactOptions: configBase.reactOptions
}