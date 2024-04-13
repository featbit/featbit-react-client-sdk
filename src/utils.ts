import { FB, IFeatureFlagSet, IFeatureFlagChange } from 'featbit-js-client-sdk';
import camelCase from 'lodash.camelcase';

/**
 * Transforms a set of flags so that their keys are camelCased. This function ignores
 * flag keys which start with `$`.
 *
 * @param rawFlags A mapping of flag keys and their values
 * @return A transformed `IFeatureFlagSet` with camelCased flag keys
 */
export const camelCaseKeys = (rawFlags: IFeatureFlagSet) => {
  const flags: IFeatureFlagSet = {};
  for (const rawFlag in rawFlags) {
    // Exclude system keys
    if (rawFlag.indexOf('$') !== 0) {
      flags[camelCase(rawFlag)] = rawFlags[rawFlag]; // tslint:disable-line:no-unsafe-any
    }
  }

  return flags;
};

/**
 * Gets the flags to pass to the provider from the changeset.
 *
 * @param changes the `LDFlagChangeset` from the ldClient onchange handler.
 * @return an `IFeatureFlagSet` with the current flag values from the IFeatureFlagChange[]. The returned
 * object may be empty `{}` if none of the targetFlags were changed.
 */
export const getFlattenedFlagsFromChangeset = (
  changes: IFeatureFlagChange[]
): IFeatureFlagSet => {
  const flattened: IFeatureFlagSet = {};
  changes.forEach((c: IFeatureFlagChange) => {
    flattened[c.id] = c.newValue;
  })

  return flattened;
};

/**
 * Retrieves flag values.
 *
 * @param fbClient FeatBit client
 *
 * @returns an `IFeatureFlagSet` with the current flag values from FeatBit
 */
export const fetchFlags = (
  fbClient: FB
) => {
  let rawFlags: IFeatureFlagSet = fbClient.getAllFeatureFlags();

  return rawFlags;
};

export default {camelCaseKeys, getFlattenedFlagsFromChangeset, fetchFlags};
