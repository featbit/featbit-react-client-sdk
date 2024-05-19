import { IFbClient, IOptions, FlagValue, IPlatform } from '@featbit/js-client-sdk';

export interface IFlagSet {
  [key: string]: FlagValue;
}

/**
 * Initialization options for the FeatBit React SDK. These are in addition to the options exposed
 * by [[IOption]] which are common to both the JavaScript and React SDKs.
 */
export interface FbReactOptions {
  /**
   * Whether the React SDK should transform flag keys into camel-cased format.
   * Using camel-cased flag keys allow for easier use as prop values, however,
   * these keys won't directly match the flag keys as known to LaunchDarkly.
   * Consequently, flag key collisions may be possible and the Code References feature
   * will not function properly.
   *
   * This is false by default, if set to true, keys will automatically be converted to camel-case.
   */
  useCamelCaseFlagKeys?: boolean;

  /**
   * Whether to send flag evaluation events when a flag is read from the `flags` object
   * returned by the `useFlags` hook. This is true by default, meaning flag evaluation
   * events will be sent by default.
   */
  sendEventsOnFlagRead?: boolean;
}

/**
 * Contains default values for the `reactOptions` object.
 */
export const defaultReactOptions = {useCamelCaseFlagKeys: false, sendEventsOnFlagRead: true};

/**
 * Configuration object used to initialise FeatBit's JS client.
 */
export interface ProviderConfig {
  /**
   * If set to true, the FeatBit will not be initialized until the option prop has been defined.
   */
  deferInitialization?: boolean;

  /**
   * FeatBit initialization options. These options are common between FeatBit's JavaScript and React SDKs.
   */
  options?: IOptions;

  /**
   * Additional initialization options specific to the React SDK.
   *
   * @see options
   */
  reactOptions?: FbReactOptions;

  /**
   * Optionally, the FB can be initialised outside the provider
   * and passed in, instead of being initialised by the provider.
   * Note: it should only be passed in when it has emitted the 'ready'
   * event, to ensure that the flags are properly set.
   */
  fbClient?: IFbClient;

  platform?: IPlatform;
}

/**
 * The return type of withFbProvider HOC. Exported for testing purposes only.
 *
 * @ignore
 */
export interface EnhancedComponent extends React.Component {
  subscribeToChanges(fbClient: IFbClient): void;

  // tslint:disable-next-line:invalid-void
  componentDidMount(): Promise<void>;

  // tslint:disable-next-line:invalid-void
  componentDidUpdate(prevProps: ProviderConfig): Promise<void>;
}

/**
 * Return type of `initClient`.
 */
export interface AllFlagsFbClient {
  /**
   * Contains all flags from FeatBit.
   */
  flags: IFlagSet;

  /**
   * An instance of `FB` from the FeatBit JS SDK.
   */
  fbClient: IFbClient;
}

/**
 * Map of camelized flag keys to original unmodified flag keys.
 */
export interface FlagKeyMap {
  [camelCasedKey: string]: string;
}

export * from '@featbit/js-client-sdk';