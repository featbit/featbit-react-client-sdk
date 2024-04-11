import { FB, IFeatureFlagSet, IFeatureFlagChange } from 'featbit-js-client-sdk';
import camelCase from 'lodash.camelcase';
import { defaultReactOptions, FbReactOptions } from './types';

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
 * @param reactOptions reactOptions.useCamelCaseFlagKeys determines whether to change the flag keys to camelCase
 * @return an `LDFlagSet` with the current flag values from the LDFlagChangeset filtered by `targetFlags`. The returned
 * object may be empty `{}` if none of the targetFlags were changed.
 */
export const getFlattenedFlagsFromChangeset = (
    changes: IFeatureFlagChange[],
    reactOptions: FbReactOptions,
  ): IFeatureFlagSet => {
    const flattened: IFeatureFlagSet = {};
    changes.forEach((c: IFeatureFlagChange) => {
      // tslint:disable-next-line:no-unsafe-any
      const flagKey = reactOptions.useCamelCaseFlagKeys ? camelCase(c.id) : c.id;
      flattened[flagKey] = c.newValue;
    })
  
    return flattened;
  };

  /**
 * Retrieves flag values.
 *
 * @param fbClient feature-flags.co client
 * @param reactOptions Initialization options for the React SDK
 *
 * @returns an `IFeatureFlagSet` with the current flag values from feature-flags.co.
 */
export const fetchFlags = (
    fbClient: FB,
    reactOptions: FbReactOptions = defaultReactOptions,
  ) => {
    let rawFlags: IFeatureFlagSet = fbClient.getAllFeatureFlags();
  
    return reactOptions.useCamelCaseFlagKeys ? camelCaseKeys(rawFlags) : rawFlags;
  };
  
  export default { camelCaseKeys, getFlattenedFlagsFromChangeset, fetchFlags };
