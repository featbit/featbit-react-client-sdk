import * as React from 'react';
import { defaultReactOptions, ProviderConfig } from './types';
import FbProvider from './provider';
import hoistNonReactStatics from 'hoist-non-react-statics';

/**
 * `withFbProvider` is a function which accepts a config object which is used to
 * initialize `featbit-js-client-sdk`.
 *
 * This HOC handles passing configuration to the `FbProvider`, which does the following:
 * - It initializes the fbClient instance by calling `featbit-js-client-sdk` init on `componentDidMount`
 * - It saves all flags and the fbClient instance in the context API
 * - It subscribes to flag changes and propagate them through the context API
 *
 * The difference between `withFbProvider` and `asyncWIthFbProvider` is that `withFbProvider` initializes
 * `featbit-js-client-sdk` at `componentDidMount`. This means your flags and the fbClient are only available after
 * your app has mounted. This can result in a flicker due to flag changes at startup time.
 *
 * `asyncWIthFbProvider` initializes `featbit-js-client-sdk` at the entry point of your app prior to render.
 * This means that your flags and the fbClient are ready at the beginning of your app. This ensures your app does not
 * flicker due to flag changes at startup time.
 *
 * @param config - The configuration used to initialize feature-flags.co JS SDK
 * @return A function which accepts your root React component and returns a HOC
 */
export function withFbProvider<T = {}>(
  config: ProviderConfig,
): (WrappedComponent: React.ComponentType<T>) => React.ComponentType<T> {
  return function withFbProviderHoc(WrappedComponent: React.ComponentType<T>): React.ComponentType<T> {
    const { reactOptions: userReactOptions } = config;
    const reactOptions = { ...defaultReactOptions, ...userReactOptions };
    const providerProps = { ...config, reactOptions };

    class HoistedComponent extends React.Component<T> {
      render() {
        return (
          <FbProvider {...providerProps}>
            <WrappedComponent {...this.props} />
          </FbProvider>
        );
      }
    }

    hoistNonReactStatics(HoistedComponent, WrappedComponent);

    return HoistedComponent;
  };
}

export default withFbProvider;