
// You can use this object to set the default values of the feature flags
import { IFlagBase } from "@featbit/js-client-sdk";
import { DataSyncModeEnum, VariationDataType } from "@featbit/react-client-sdk";

const bootstrapFlags = [
  {
    "id": "robot",
    "variation": "AlphaGo",
    "variationType": VariationDataType.string
  },
  {
    "id": "用户信息模块",
    "variation": "v2.0.0",
    "variationType": VariationDataType.string
  },
  {
    "id": "user_info_db_migration",
    "variation": "azure",
    "variationType": VariationDataType.string
  }
] as IFlagBase[];

// export const fbConfig = {
//   options: {
//     user: {
//       name: 'thename',
//       keyId: 'thekey',
//       customizedProperties: []
//     },
//     streamingUri: 'wss://app-eval.featbit.co',
//     eventsUri: 'https://app-eval.featbit.co',
//     sdkKey: 'Obg68EqYZk27JTxphPgy7At1aJ8GaAtEaIA1fb3IpuEA',
//     bootstrap: bootstrapFlags,
//   },
//   reactOptions: {
//     useCamelCaseFlagKeys: true, // default is false
//     sendEventsOnFlagRead: true // default is true
//   }
// };

export const fbConfig = {
  options: {
    user: {
      name: 'thename',
      keyId: 'thekey',
      customizedProperties: []
    },
    streamingUri: 'ws://localhost:5100',
    eventsUri: 'http://localhost:5100',
    pollingUri: 'http://localhost:5100',
    //dataSyncMode: DataSyncModeEnum.POLLING,
    sdkKey: 'x5-p4nMlW0aLyzE5TpTtmwwvvdZpVB4Ey-aNea3wffFw',
    bootstrap: bootstrapFlags,
  },
  reactOptions: {
    useCamelCaseFlagKeys: true, // default is false
    sendEventsOnFlagRead: true // default is true
  }
};