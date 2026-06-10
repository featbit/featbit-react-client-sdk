import {BasicLogger, VariationDataType} from "@featbit/js-client-sdk";
import {UserBuilder} from "@featbit/react-client-sdk";

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
    },
    {
        "id": "JACKPOT_SC",
        "variation": "true",
        variationType: VariationDataType.boolean
    },
    {
        "id": "asdf",
        "variation": "true",
        variationType: VariationDataType.boolean
    },
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
        logLevel: 'error',
        //logger: myLogger,
    },
    reactOptions: {
        useCamelCaseFlagKeys: true
    }
}

const user = new UserBuilder("fb-demo-user-key")
    .name("the user name")
    .custom("loggedIn", "true")
    .custom("variationId", "203:b:exclusive")
    .build();

export const configWithUser = {
    options: {
        user,
        ...configBase.options
    },
    reactOptions: configBase.reactOptions
}