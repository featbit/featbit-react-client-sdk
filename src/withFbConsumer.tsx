import * as React from 'react';
import { Consumer, FbContext } from './context';
import { FB, IFeatureFlagSet } from 'featbit-js-client-sdk';

/**
 * Controls the props the wrapped component receives from the `FbConsumer` HOC.
 */
export interface ConsumerOptions {
  /**
   * If true then the wrapped component only receives the `fbClient` instance
   * and nothing else.
   */
  clientOnly: boolean;
}

/**
 * The possible props the wrapped component can receive from the `FbConsumer` HOC.
 */
export interface FbProps {
  /**
   * A map of feature flags from their keys to their values.
   * Keys are camelCased using `lodash.camelcase`.
   */
  flags?: IFeatureFlagSet;

  /**
   * An instance of `FB` from the feature-flags.co JS SDK (`featbit-js-client-sdk`)
   */
  fbClient?: FB;
}

/**
 * withFbConsumer is a function which accepts an optional options object and returns a function
 * which accepts your React component. This function returns a HOC with flags
 * and the FB instance injected via props.
 *
 * @param options - If you need only the `fbClient` instance and not flags, then set `{ clientOnly: true }`
 * to only pass the fbClient prop to your component. Defaults to `{ clientOnly: false }`.
 * @return A HOC with flags and the `fbClient` instance injected via props
 */
function withFbConsumer(options: ConsumerOptions = { clientOnly: false }) {
  return function withFbConsumerHoc<P>(WrappedComponent: React.ComponentType<P & FbProps>) {
    return (props: P) => (
      <Consumer>
        {({ flags, fbClient }: FbContext) => {
          if (options.clientOnly) {
            return <WrappedComponent fbClient={fbClient} {...props} />;
          }

          return <WrappedComponent flags={flags} fbClient={fbClient} {...props} />;
        }}
      </Consumer>
    );
  };
}

export default withFbConsumer;