import { IEvalDetail, IFbClient } from '@featbit/js-client-sdk';
import camelCase from 'lodash.camelcase';
import { IFlagSet } from "./types";

/**
 * Transforms a set of flags so that their keys are camelCased. This function ignores
 * flag keys which start with `$`.
 *
 * @param rawFlags A mapping of flag keys and their values
 * @return A transformed `IFeatureFlagSet` with camelCased flag keys
 */
export const camelCaseKeys = (rawFlags: IFlagSet) => {
  const flags: IFlagSet = {};
  for (const rawFlag in rawFlags) {
    // Exclude system keys
    if (rawFlag.indexOf('$') !== 0) {
      flags[camelCase(rawFlag)] = rawFlags[rawFlag]; // tslint:disable-line:no-unsafe-any
    }
  }

  return flags;
};

/**
 * Retrieves flag values.
 *
 * @param fbClient FeatBit client
 *
 * @returns an `IFeatureFlagSet` with the current flag values from FeatBit
 */
export const fetchFlags = async (
  fbClient: IFbClient
) => {
  const evalDetails: IEvalDetail<string>[] = await fbClient.getAllVariations();
  return evalDetails.reduce((acc, {flagKey, value}) => {
    acc[flagKey] = value;
    return acc;
  }, {} as IFlagSet);
};

export default {camelCaseKeys, fetchFlags};
