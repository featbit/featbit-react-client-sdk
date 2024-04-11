import { defaultReactOptions, FbReactOptions } from './types';
import { fbClient, IOption } from 'featbit-js-client-sdk';
import { fetchFlags } from "./utils";
import { FbContext } from "./context";

/**
 * Internal function to initialize the `featbit-js-client-sdk`.
 *
 * @param reactOptions Initialization options for the FeatBit React SDK
 * @param options featbit-js-client-sdk initialization options
 *
 * @see `ProviderConfig` for more details about the parameters
 * @return An initialized client and flags
 */
 export const initClient = async (
    reactOptions: FbReactOptions = defaultReactOptions,
    options: IOption = { secret: '', anonymous: true }
  ): Promise<FbContext> => {
    return new Promise<FbContext>(resolve => {
      fbClient.on('ready', () => {
        const flags = fetchFlags(fbClient, reactOptions);
        resolve({ flags, fbClient });
      });
      
      fbClient.init({...options});
    });
  };