import { defaultReactOptions, FbReactOptions, FlagKeyMap, IFlagSet } from "./types";
import { IConvertResult, IFbClient, IFlagBase, ValueConverters, VariationDataType } from "@featbit/js-client-sdk";
import camelCase from "lodash.camelcase";

export default function getFlagsProxy(
  fetchedFlags: IFlagSet,
  bootstrapFlags?: IFlagBase[],
  fbClient?: IFbClient,
  reactOptions: FbReactOptions = defaultReactOptions
): { flags: IFlagSet; flagKeyMap: FlagKeyMap } {
  const { useCamelCaseFlagKeys = false } = reactOptions;
  const [flags, flagKeyMap = {}] = useCamelCaseFlagKeys ? getCamelizedKeysAndFlagMap(fetchedFlags) : [fetchedFlags];

  return {
    flags: toFlagsProxy(flags, flagKeyMap, fetchedFlags, useCamelCaseFlagKeys, bootstrapFlags, fbClient),
    flagKeyMap,
  };
}

function getCamelizedKeysAndFlagMap(rawFlags: IFlagSet) {
  const flags: IFlagSet = {};
  const flagKeyMap: FlagKeyMap = {};
  for (const rawFlagKey in rawFlags) {
    // Exclude system keys
    if (rawFlagKey.indexOf('$') === 0) {
      continue;
    }
    const camelKey = camelCase(rawFlagKey);
    flags[camelKey] = rawFlags[rawFlagKey];
    flagKeyMap[camelKey] = rawFlagKey;
  }

  return [flags, flagKeyMap];
}

function toFlagsProxy(
  flags: IFlagSet,
  flagKeyMap: FlagKeyMap,
  flagsWithRawFlagKeys: IFlagSet,
  useCamelCaseFlagKeys: boolean,
  bootstrapFlags?: IFlagBase[],
  fbClient?: IFbClient,
): IFlagSet {
  const bootstrapFlagDict = (bootstrapFlags || []).reduce((acc: {[key: string]: IFlagBase}, flag: any) => {
    acc[flag.id] = flag;
    return acc;
  }, {} as {[key: string]: IFlagBase});

  return new Proxy(flags, {
    get: (target, prop, receiver) => {
      const currentValue = Reflect.get(target, prop, receiver) || flagsWithRawFlagKeys[prop as string]

      // only process flag keys and ignore symbols and native Object functions
      if (typeof prop === 'symbol') {
        return undefined;
      }

      if (fbClient && useCamelCaseFlagKeys && prop !== camelCase(prop as string)) {
        fbClient.logger?.warn(`You're attempting to access a flag with its original keyId: ${prop as string}, even though useCamelCaseFlagKeys is set to true.`);
      }

      const pristineFlagKey = useCamelCaseFlagKeys ? (flagKeyMap[prop] || prop) : prop;
      if (fbClient) {
        return fbClient.variation(pristineFlagKey, currentValue);
      }

      if (!currentValue) {
        return undefined;
      }

      let converter: (value: string) => IConvertResult<any>;
      switch (bootstrapFlagDict[pristineFlagKey]?.variationType) {
        case VariationDataType.boolean:
          converter = ValueConverters.bool;
          break;
        case VariationDataType.number:
          converter = ValueConverters.number;
          break;
        case VariationDataType.json:
          converter = ValueConverters.json;
          break;
        case VariationDataType.string:
          converter = ValueConverters.string;
          break;
        default:
          converter = ValueConverters.string;
      }

      return converter(currentValue)?.value;
    },
  });
}