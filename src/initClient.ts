import { AllFlagsFbClient, defaultReactOptions, FbReactOptions } from './types';
import { FbClientBuilder, IOptions } from '@featbit/js-client-sdk';
import { fetchFlags } from "./utils";

/**
 * Internal function to initialize the `@featbit/js-client-sdk`.
 *
 * @param reactOptions Initialization options for the FeatBit React SDK
 * @param options @featbit/js-client-sdk initialization options
 *
 * @see `ProviderConfig` for more details about the parameters
 * @return An initialized client and flags
 */
export const initClient = async (
  reactOptions: FbReactOptions = defaultReactOptions,
  options: IOptions = {}
): Promise<AllFlagsFbClient> => {
  const fbClient = new FbClientBuilder({...options}).build();

  return new Promise<AllFlagsFbClient>((resolve) => {
    fbClient.on('ready', async () => {
      const flags = await fetchFlags(fbClient);
      resolve({flags, fbClient});
    });
  });
};