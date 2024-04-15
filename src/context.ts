import { FB, IFeatureFlagSet } from '@featbit/js-client-sdk';
import { createContext } from 'react';
import { FlagKeyMap } from "./types";

interface FbContext {
  flags: IFeatureFlagSet;

  /**
   * Map of camelized flag keys to their original unmodified form. Empty if useCamelCaseFlagKeys option is false.
   */
  flagKeyMap: FlagKeyMap;

  fbClient?: FB
}

const context = createContext<FbContext>({flags: {}, flagKeyMap: {}, fbClient: undefined});

const {
  Provider,
  Consumer,
} = context;

export { Provider, Consumer, FbContext };
export default context;