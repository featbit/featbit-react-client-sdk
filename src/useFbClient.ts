import { useContext } from 'react';
import context from './context';

// tslint:disable:max-line-length
/**
 * `useFbClient` is a custom hook which returns the underlying [FeatBit JavaScript SDK client object](https://github.com/featbit/featbit-js-client-sdk).
 * Like the `useFlags` custom hook, `useFbClient` also uses the `useContext` primitive to access the feature-flags.co
 * context set up by `withFbProvider`. You will still need to use the `withFbProvider` HOC
 * to initialise the react sdk to use this custom hook.
 *
 * @return The `featbit-js-client-sdk` `FB` object
 */
// tslint:enable:max-line-length
const useFbClient = () => {
  const { fbClient } = useContext(context);

  return fbClient;
};

export default useFbClient;