import { FB, fbClient, IFeatureFlagSet } from 'featbit-js-client-sdk';
import { createContext } from 'react';

interface FbContext {
  flags: IFeatureFlagSet;
  fbClient: FB
}

const context = createContext<FbContext>({ flags: {}, fbClient: fbClient});

const {
  Provider,
  Consumer,
} = context;

export { Provider, Consumer, FbContext };
export default context;