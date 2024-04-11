import React from "react";
import { EnhancedComponent, ProviderConfig, defaultReactOptions } from './types';
import { Provider, FbContext as HocState } from './context';
import { camelCaseKeys, fetchFlags, getFlattenedFlagsFromChangeset } from "./utils";
import { initClient } from './initClient';
import { fbClient, FB, IFeatureFlagChange, IFeatureFlagSet } from 'featbit-js-client-sdk';

/**
 * The `FbProvider` is a component which accepts a config object which is used to
 * initialize `featbit-js-client-sdk`.
 *
 * This Provider does three things:
 * - It initializes the FeatBit instance by calling `featbit-js-client-sdk` init on `componentDidMount`
 * - It saves all flags and the FeatBit instance in the context API
 * - It subscribes to flag changes and propagate them through the context API
 *
 * Because the `featbit-js-client-sdk` is only initialized on `componentDidMount`, your flags and the
 * FeatBit are only available after your app has mounted. This can result in a flicker due to flag changes at
 * startup time.
 *
 * This component can be used as a standalone provider. However, be mindful to only include the component once
 * within your application. This provider is used inside the `withFbProviderHOC` and can be used instead to initialize
 * the `featbit-js-client-sdk`. For async initialization, check out the `asyncWithFbProvider` function
 */
class FbProvider extends React.Component<ProviderConfig, HocState> implements EnhancedComponent {
  readonly state: Readonly<HocState>;

  constructor(props: ProviderConfig) {
    super(props);

    const {options} = props;

    this.state = {
      flags: {},
      fbClient: fbClient,
    };

    if (options) {
      const {bootstrap} = options;
      if (bootstrap && bootstrap.length > 0) {
        const {useCamelCaseFlagKeys} = this.getReactOptions();
        const flags = useCamelCaseFlagKeys ? camelCaseKeys(bootstrap) : bootstrap;
        this.state = {
          flags,
          fbClient: fbClient,
        };
      }
    }
  }

  getReactOptions = () => ({...defaultReactOptions, ...this.props.reactOptions});

  subscribeToChanges = (fbClient: FB) => {
    fbClient.on('ff_update', (changes: IFeatureFlagChange[]) => {
      const flattened: IFeatureFlagSet = getFlattenedFlagsFromChangeset(changes, this.getReactOptions());
      if (Object.keys(flattened).length > 0) {
        const flags = Object.keys(flattened).reduce((acc, curr) => {
          acc[curr] = flattened[curr];
          return acc;
        }, this.state.flags);

        this.setState({
          flags: new Proxy(flags, {
            get(target, prop, receiver) {
              const ret = Reflect.get(target, prop, receiver);
              fbClient.sendFeatureFlagInsight(prop as string, ret);
              return ret;
            }
          })
        })
      }
    });
  };

  init = async () => {
    const {options} = this.props;
    let client: FB = this.props.fbClient!;
    const reactOptions = this.getReactOptions();
    let fetchedFlags;
    if (client) {
      fetchedFlags = fetchFlags(client, reactOptions);
    } else {
      client = fbClient;
      const initialisedOutput = await initClient(reactOptions, options);
      fetchedFlags = initialisedOutput.flags;
      client = initialisedOutput.fbClient;
    }

    this.setState({
      flags: new Proxy(fetchedFlags, {
        get(target, prop, receiver) {
          const ret = Reflect.get(target, prop, receiver);
          client.sendFeatureFlagInsight(prop as string, ret);
          return ret;
        }
      }),
      fbClient: client
    });

    this.subscribeToChanges(client);
  };

  async componentDidMount() {
    const {options, deferInitialization} = this.props;
    if (deferInitialization && !options) {
      return;
    }

    await this.init();
  }

  async componentDidUpdate(prevProps: ProviderConfig) {
    const {options, deferInitialization} = this.props;
    const userJustLoaded = !prevProps.options?.user && options?.user;
    if (deferInitialization && userJustLoaded) {
      await this.init();
    }
  }

  render() {
    const {flags, fbClient} = this.state;

    return <Provider value={ {flags, fbClient} }>{ this.props.children }</Provider>;
  }
}

export default FbProvider;