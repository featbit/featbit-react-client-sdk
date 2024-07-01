import React, { Component, PropsWithChildren }  from "react";
import { EnhancedComponent, ProviderConfig, defaultReactOptions, IFlagSet } from './types';
import { Provider } from './context';
import { camelCaseKeys, fetchFlags } from "./utils";
import { FbClientBuilder, IFbClient } from '@featbit/js-client-sdk';
import getFlagsProxy from "./getFlagsProxy";
import { ProviderState } from "./providerState";


/**
 * The `FbProvider` is a component which accepts a config object which is used to
 * initialize `@featbit/js-client-sdk`.
 *
 * This Provider does three things:
 * - It initializes the FeatBit instance by calling `@featbit/js-client-sdk` init on `componentDidMount`
 * - It saves all flags and the FeatBit instance in the context API
 * - It subscribes to flag changes and propagate them through the context API
 *
 * Because the `@featbit/js-client-sdk` is only initialized on `componentDidMount`, your flags and the
 * FeatBit are only available after your app has mounted. This can result in a flicker due to flag changes at
 * startup time.
 *
 * This component can be used as a standalone provider. However, be mindful to only include the component once
 * within your application. This provider is used inside the `withFbProviderHOC` and can be used instead to initialize
 * the `@featbit/js-client-sdk`. For async initialization, check out the `asyncWithFbProvider` function
 */
class FbProvider extends Component<PropsWithChildren<ProviderConfig>, ProviderState> implements EnhancedComponent {
  readonly state: Readonly<ProviderState>;
  bootstrapFlags: IFlagSet;

  constructor(props: ProviderConfig) {
    super(props);

    const {options} = props;
    this.bootstrapFlags = (options?.bootstrap || []).reduce((acc: {[key: string]: string}, flag: any) => {
      acc[flag.id] = flag.variation;
      return acc;
    }, {} as {[key: string]: string});

    this.state = {
      flags: {},
      unproxiedFlags: {},
      flagKeyMap: {},
      fbClient: undefined,
    };

    if (options?.bootstrap && options?.bootstrap.length > 0) {
      const {useCamelCaseFlagKeys} = this.getReactOptions();
      const flags = useCamelCaseFlagKeys ? camelCaseKeys(this.bootstrapFlags) : this.bootstrapFlags;
      this.state = {
        flags,
        unproxiedFlags: flags,
        flagKeyMap: {},
        fbClient: undefined,
      };
    }
  }

  getReactOptions = () => ({...defaultReactOptions, ...this.props.reactOptions});

  subscribeToChanges = (fbClient: IFbClient) => {
    fbClient.on('update', (changedKeys: string[]) => {
      const updates: IFlagSet = changedKeys.reduce((acc, key) => {
        acc[key] = fbClient.variation(key, '');
        return acc;
      }, {} as IFlagSet);

      const unproxiedFlags = {
        ...this.state.unproxiedFlags,
        ...updates,
      };

      if (Object.keys(updates).length > 0) {
        this.setState((prevState) =>({
          ...prevState,
          unproxiedFlags,
          ...getFlagsProxy(fbClient, this.bootstrapFlags, unproxiedFlags, this.getReactOptions())
        }))
      }
    });
  };

  onFailed = (fbClient: IFbClient, e: Error) => {
    this.setState((prevState) => ({ ...prevState, error: e }));
  };

  onReady = async (fbClient: IFbClient, reactOptions: any) => {
    const unproxiedFlags = await fetchFlags(fbClient);
    this.setState((prevState) => ({
      ...prevState,
      unproxiedFlags,
      ...getFlagsProxy(fbClient, this.bootstrapFlags, unproxiedFlags, reactOptions)}));
  };

  prepareFbClient = async () => {
    const {options, platform} = this.props;
    let client: IFbClient = this.props.fbClient!;
    const reactOptions = this.getReactOptions();
    let unproxiedFlags = this.state.unproxiedFlags;
    let error: Error;

    if (client) {
      unproxiedFlags = await fetchFlags(client);
    } else {
      client = new FbClientBuilder({...options})
        .platform(platform)
        .build();

      try {
        await client.waitForInitialization();
        unproxiedFlags = await fetchFlags(client);
      } catch (e) {
        error = e as Error;

        if (error?.name.toLowerCase().includes('timeout')) {
          client.on('failed', this.onFailed);
          client.on('ready', () => {
            this.onReady(client, reactOptions);
          });
        }
      }
    }

    this.setState((previousState) => ({
      ...previousState,
      unproxiedFlags,
      ...getFlagsProxy(client, this.bootstrapFlags, unproxiedFlags, reactOptions),
      fbClient: client,
      error,
    }));

    this.subscribeToChanges(client);
  };

  async componentDidMount() {
    const {options, deferInitialization} = this.props;
    if (deferInitialization && !options) {
      return;
    }

    await this.prepareFbClient();
  }

  async componentDidUpdate(prevProps: ProviderConfig) {
    const {options, deferInitialization} = this.props;
    const userJustLoaded = !prevProps.options?.user && options?.user;
    if (deferInitialization && userJustLoaded) {
      await this.prepareFbClient();
    }
  }

  render() {
    const {flags, flagKeyMap, fbClient, error} = this.state;

    return <Provider value={{ flags, flagKeyMap, fbClient, error }}>{ this.props.children }</Provider>;
  }
}

export default FbProvider;