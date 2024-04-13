import React from "react";
import { EnhancedComponent, ProviderConfig, defaultReactOptions } from './types';
import { Provider, FbContext } from './context';
import { camelCaseKeys, fetchFlags, getFlattenedFlagsFromChangeset } from "./utils";
import { initClient } from './initClient';
import { FB, IFeatureFlagChange, IFeatureFlagSet } from 'featbit-js-client-sdk';
import getFlagsProxy from "./getFlagsProxy";

interface FbHocState extends FbContext {
  unproxiedFlags: IFeatureFlagSet;
}

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
class FbProvider extends React.Component<ProviderConfig, FbHocState> implements EnhancedComponent {
  readonly state: Readonly<FbHocState>;
  bootstrapFlags: IFeatureFlagSet;

  constructor(props: ProviderConfig) {
    super(props);

    const {options} = props;
    this.bootstrapFlags = (options?.bootstrap || []).reduce((acc, flag) => {
      acc[flag.id] = flag.variation;
      return acc;
    }, {} as {[key: string]: string});;

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

  subscribeToChanges = (fbClient: FB) => {
    fbClient.on('ff_update', (changes: IFeatureFlagChange[]) => {
      const updates: IFeatureFlagSet = getFlattenedFlagsFromChangeset(changes);
      const unproxiedFlags = {
        ...this.state.unproxiedFlags,
        ...updates,
      };

      if (Object.keys(updates).length > 0) {
        this.setState({
          unproxiedFlags,
          ...getFlagsProxy(fbClient, this.bootstrapFlags, unproxiedFlags, this.getReactOptions())
        })
      }
    });
  };

  init = async () => {
    const {options} = this.props;
    let client: FB = this.props.fbClient!;
    const reactOptions = this.getReactOptions();
    let unproxiedFlags;
    if (client) {
      unproxiedFlags = fetchFlags(client);
    } else {
      const initialisedOutput = await initClient(reactOptions, options);
      unproxiedFlags = initialisedOutput.flags;
      client = initialisedOutput.fbClient!;
    }

    this.setState({
      unproxiedFlags,
      ...getFlagsProxy(client, this.bootstrapFlags, unproxiedFlags, reactOptions),
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
    const {flags, flagKeyMap, fbClient} = this.state;

    return <Provider value={{ flags, flagKeyMap, fbClient }}>{ this.props.children }</Provider>;
  }
}

export default FbProvider;