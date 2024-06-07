import React, { useState, useEffect, ReactNode } from 'react';
import { ProviderConfig, defaultReactOptions, IFlagSet } from './types';
import { Provider } from './context';
import { initClient } from './initClient';
import getFlagsProxy from "./getFlagsProxy";
import { FbClientBuilder } from "@featbit/js-client-sdk";
import { fetchFlags } from "./utils";

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
  const {options, reactOptions: userReactOptions, platform} = config;
  const reactOptions = {...defaultReactOptions, ...userReactOptions};
  let error: Error;
  let fetchedFlags: IFlagSet = {};

  const fbClient = new FbClientBuilder({...options})
    .platform(platform)
    .build();

  try {
    await fbClient.waitForInitialization();
    fetchedFlags = await fetchFlags(fbClient);
  } catch (e) {
    error = e as Error;
  }

  const bootstrapFlags = (options?.bootstrap || []).reduce((acc: {[key: string]: string}, flag: any) => {
    acc[flag.id] = flag.variation;
    return acc;
  }, {} as {[key: string]: string});

  const FbProvider = ({children}: { children: ReactNode }) => {
    const [state, setState] = useState(() => ({
      unproxiedFlags: fetchedFlags,
      ...getFlagsProxy(fbClient, bootstrapFlags, fetchedFlags, reactOptions),
      fbClient,
      error,
    }));

    useEffect(() => {
      async function onReady() {
        const unproxiedFlags = await fetchFlags(fbClient);
        setState((prevState) => ({
          ...prevState,
          unproxiedFlags,
          ...getFlagsProxy(fbClient, bootstrapFlags, unproxiedFlags, reactOptions)}));
      }

      function onFailed(e: Error) {
        setState((prevState) => ({ ...prevState, error: e }));
      }

      function onUpdate(changedKeys: string[]) {
        const updates: IFlagSet = changedKeys.reduce(async (acc, key) => {
          acc[key] = await fbClient.variation(key, '');
          return acc;
        }, {} as IFlagSet);

        if (Object.keys(updates).length > 0) {
          setState((prevState) => {
            const updatedUnproxiedFlags = { ...prevState.unproxiedFlags, ...updates };

            return {
              ...prevState,
              unproxiedFlags: updatedUnproxiedFlags,
              ...getFlagsProxy(fbClient, bootstrapFlags, updatedUnproxiedFlags, reactOptions),
            };
          });
        }
      }

      fbClient.on('update', onUpdate);

      // Only subscribe to ready and failed if waitForInitialization timed out
      // because we want the introduction of init timeout to be as minimal and backwards
      // compatible as possible.
      if (error?.name.toLowerCase().includes('timeout')) {
        fbClient.on('failed', onFailed);
        fbClient.on('ready', onReady);
      }

      return function cleanup() {
        fbClient.off('update', onUpdate);
        fbClient.off('failed', onFailed);
        fbClient.off('ready', onReady);
      };

    }, []);

    const { unproxiedFlags: _, ...rest }  = state;
    return <Provider value={rest}>{ children }</Provider>;
  };

  return FbProvider;
}