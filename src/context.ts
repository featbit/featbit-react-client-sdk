import { fbClient } from 'featbit-js-client-sdk';
import { createContext } from 'react';
import { FbContext } from './types';

const context = createContext<FbContext>({ flags: {}, fbClient: fbClient});

const {
  Provider,
  Consumer,
} = context;

export { Provider, Consumer, FbContext };
export default context;