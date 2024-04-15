import React, { useState, useEffect, FunctionComponent, ReactNode } from 'react';
import { ProviderConfig, defaultReactOptions } from './types';
import { Provider } from './context';
import { initClient } from './initClient';
import { getFlattenedFlagsFromChangeset } from './utils';
import { IFeatureFlagChange, IFeatureFlagSet } from '@featbit/js-client-sdk';
import getFlagsProxy from "./getFlagsProxy";

/**
 * This is an async function which initializes feature-flags.co's JS SDK (`@featbit/js-client-sdk`)
 * and awaits it so all flags and the fbClient are ready before the consumer app is rendered.
 *
 * The difference between `withFbProvider` and `asyncWithFbProvider` is that `withFbProvider` initializes
 * `@featbit/js-client-sdk` at componentDidMount. This means your flags and the fbClient are only available after
 * your app has mounted. This can result in a flicker due to flag changes at startup time.
 *
 * `asyncWithFbProvider` initializes `@featbit/js-client-sdk` at the entry point of your app prior to render.
 * This means that your flags and the fbClient are ready at the beginning of your app. This ensures your app does not
 * flicker due to flag changes at startup time.
 *
 * `asyncWithFbProvider` accepts a config object which is used to initialize `@featbit/js-client-sdk`.
 *
 * `asyncWithFbProvider` does not support the `deferInitialization` config option because `asyncWithFbProvider` needs
 * to be initialized at the entry point prior to render to ensure your flags and the fbClient are ready at the beginning
 * of your app.
 *
 * It returns a provider which is a React FunctionComponent which:
 * - saves all flags and the ldClient instance in the context API
 * - subscribes to flag changes and propagate them through the context API
 *
 * @param config - The configuration used to initialize FeatBit's JS SDK
 */
export default async function asyncWithFbProvider(config: ProviderConfig) {
  const {options, reactOptions: userReactOptions} = config;
  const reactOptions = {...defaultReactOptions, ...userReactOptions};
  const { flags: fetchedFlags, fbClient} = await initClient(reactOptions, options);

  const bootstrapFlags = (options?.bootstrap || []).reduce((acc, flag) => {
    acc[flag.id] = flag.variation;
    return acc;
  }, {} as {[key: string]: string});

  const FbProvider = ({children}: { children: ReactNode }) => {
    const [state, setState] = useState(() => ({
      unproxiedFlags: fetchedFlags,
      ...getFlagsProxy(fbClient, bootstrapFlags, fetchedFlags, reactOptions)
    }));

    useEffect(() => {
      fbClient.on('ff_update', (changes: IFeatureFlagChange[]) => {
        const updates: IFeatureFlagSet = getFlattenedFlagsFromChangeset(changes);
        if (Object.keys(updates).length > 0) {
          setState(({ unproxiedFlags }) => {
            const updatedUnproxiedFlags = { ...unproxiedFlags, ...updates };

            return {
              unproxiedFlags: updatedUnproxiedFlags,
              ...getFlagsProxy(fbClient, bootstrapFlags, updatedUnproxiedFlags, reactOptions),
            };
          });
        }
      });
    }, []);

    const { flags, flagKeyMap } = state;
    return <Provider value={{ flags, flagKeyMap, fbClient }}>{ children }</Provider>;
  };

  return FbProvider;
}