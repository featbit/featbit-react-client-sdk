import { defaultReactOptions, FbReactOptions, FlagKeyMap, IFlagSet } from "./types";
import { IFbClient } from "@featbit/js-client-sdk";
import camelCase from "lodash.camelcase";

export default function getFlagsProxy(
  fbClient: IFbClient,
  bootstrapFlags: IFlagSet,
  fetchedFlags: IFlagSet,
  reactOptions: FbReactOptions = defaultReactOptions
): { flags: IFlagSet; flagKeyMap: FlagKeyMap } {
  const { useCamelCaseFlagKeys = false, sendEventsOnFlagRead = true } = reactOptions;
  const [flags, flagKeyMap = {}] = useCamelCaseFlagKeys ? getCamelizedKeysAndFlagMap(fetchedFlags) : [fetchedFlags];

  return {
    flags: toFlagsProxy(fbClient, bootstrapFlags, flags, flagKeyMap, fetchedFlags, useCamelCaseFlagKeys, sendEventsOnFlagRead),
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

function hasFlag(flags: IFlagSet, flagKey: string) {
  return Object.prototype.hasOwnProperty.call(flags, flagKey);
}

function toFlagsProxy(
  fbClient: IFbClient,
  bootstrapFlags: IFlagSet,
  flags: IFlagSet,
  flagKeyMap: FlagKeyMap,
  flagsWithRawFlagKeys: IFlagSet,
  useCamelCaseFlagKeys: boolean,
  sendEventsOnFlagRead: boolean
): IFlagSet {
  return new Proxy(flags, {
    get: (target, prop, receiver) => {
      const currentValue = Reflect.get(target, prop, receiver) || flagsWithRawFlagKeys[prop as string]

      // check if flag key exists as camelCase or original case
      const validFlagKey =
        hasFlag(flagKeyMap, prop as string) || hasFlag(target, prop as string) || hasFlag(flagsWithRawFlagKeys, prop as string);

      if (!validFlagKey && hasFlag(bootstrapFlags, prop as string)) {
        return bootstrapFlags[prop as string];
      }

      // only process flag keys and ignore symbols and native Object functions
      if (typeof prop === 'symbol' || !validFlagKey) {
        return currentValue;
      }

      if (useCamelCaseFlagKeys && prop !== camelCase(prop as string)) {
        console.warn(`You're attempting to access a flag with its original keyId: ${prop as string}, even though useCamelCaseFlagKeys is set to true.`);
      }

      if (currentValue === undefined) {
        return undefined;
      }

      if (!sendEventsOnFlagRead) {
        return currentValue;
      }

      const pristineFlagKey = useCamelCaseFlagKeys ? (flagKeyMap[prop] || prop) : prop;
      return fbClient.variation(pristineFlagKey, currentValue);
    },
  });
}