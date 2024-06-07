import { IFbClient } from '@featbit/js-client-sdk';
import { createContext } from 'react';
import { FlagKeyMap, IFlagSet } from "./types";

interface FbContext {
  flags: IFlagSet;

  /**
   * Map of camelized flag keys to their original unmodified form. Empty if useCamelCaseFlagKeys option is false.
   */
  flagKeyMap: FlagKeyMap;

  fbClient?: IFbClient,

  /**
   * FeatBit client initialization error, if there was one.
   */
  error?: Error,
}

const context = createContext<FbContext>({flags: {}, flagKeyMap: {}, fbClient: undefined});

const {
  Provider,
  Consumer,
} = context;

export { Provider, Consumer, FbContext };
export default context;