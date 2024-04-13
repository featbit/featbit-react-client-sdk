export const userName = 'The user 01';

const secret = 'Obg68EqYZk27JTxphPgy7At1aJ8GaAtEaIA1fb3IpuEA';
const api = 'https://app-eval.featbit.co';

const flags = [
    {
        "id": "robot",
        "variation": "AlphaGo"
    },
    {
        "id": "用户信息模块",
        "variation": "v2.0.0"
    },
    {
        "id": "user_info_db_migration",
        "variation": "azure"
    }
];

const configBase = {
    options: {
        secret,
        api: api,
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