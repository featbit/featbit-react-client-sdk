# FeatBit Client-Side SDK for ReactJS

## Introduction

This is the React client side SDK for the feature management platform [FeatBit](https://www.featbit.co).

Be aware, this is a client side SDK, it is intended for use in a single-user context, which can be mobile, desktop or embeded applications. This SDK can only be ran in a browser environment, it is not suitable for React Native projects.
If you are looking for React Native SDK, please check this [React Native SDK](https://github.com/featbit/featbit-react-native-sdk).

> The React SDK is based on the JavaScript SDK  
The React SDK builds on FeatBit's JavaScript SDK to provide a better integration for use in React applications. As a result, much of the JavaScript SDK functionality is also available for the React SDK to use. 

> SDK version compatibility  
The React SDK is compatible with React version 16.3.0 and higher.
The React SDK offers two custom hooks. If you want to use these, then you must use React version 16.8.0 or higher. To learn more, read the section [Using Hooks](#using-hooks).

> Using with Next.js 
If you are using this SDK with Next.js project, be aware that the SDK is not compatible with server-side rendering. You should use the SDK in the client side only.
If you want to use the SDK in the server side, you should use [@featbit/node-server-sdk](https://github.com/featbit/featbit-node-server-sdk).


## Getting started
### Install

```
npm install @featbit/react-client-sdk
```

### Prerequisite

Before using the SDK, you need to obtain the environment secret and SDK URLs.

Follow the documentation below to retrieve these values

- [How to get the environment secret](https://docs.featbit.co/sdk/faq#how-to-get-the-environment-secret)
- [How to get the SDK URLs](https://docs.featbit.co/sdk/faq#how-to-get-the-sdk-urls)

### Quick Start

The following code demonstrates:
1. Initialize the SDK
2. Evaluate flag with userFlags hook

```javascript
import { createRoot } from 'react-dom/client';
import { asyncWithFbProvider, useFlags, FbProvider } from '@featbit/react-client-sdk';

function Game() {
  return (
    <div>
      This is a game
    </div>
  );
}

function APP() {
  const flags = useFlags();

  const gameEnabled = flags['game-enabled'];

  return (
    <div>
      <div>{ gameEnabled ? <Game /> : <div>The game is not enabled</div>}</div>
    </div>
  );
}

(async () => {
  const configWithAnonymousUser = {
    options: {
      user: {
        name: 'the user name',
        keyId: 'fb-demo-user-key',
        customizedProperties: []
      },
      sdkKey: 'YOUR ENVIRONMENT SECRET',
      streamingUrl: 'THE STREAMING URL',
      eventsUrl: 'THE EVENTS URL'
    }
  };
  
  const root = createRoot(document.getElementById('root'));
  const Provider = await asyncWithFbProvider(configWithAnonymousUser);
  root.render(
    <Provider>
      <Game />,
    </Provider>
  );
  
  // Use the following code in React < 18.0.0
  // ReactDOM.render(
  //   <FbProvider>
  //     <APP/>
  //   </FbProvider>,
  //   document.getElementById('root')
  // );
})();

```

## Examples
- [React APP](./examples/react-app)
- [Next.js APP](./examples/nextjs-app)

## SDK

### Initializing the SDK
After you install the dependency, initialize the React SDK. You can do this in one of two ways:

- Using the `asyncWithFbProvider` function
- Using the `withFbProvider` function

Both rely on React's Context API which lets you access your flags from any level of your component hierarchy.

#### Initializing using asyncWithFbProvider

The `asyncWithFbProvider` function initializes the React SDK and returns a provider which is a React component. It is an async function. It accepts a `ProviderConfig` object.

`asyncWithFbProvider` cannot be deferred. You must initialize `asyncWithFbProvider` at the app entry point prior to rendering to ensure flags and the client are ready at the beginning of the app.

```javascript
import { createRoot } from 'react-dom/client';
import { asyncWithFbProvider } from '@featbit/react-client-sdk';

(async () => {
  const config = {
    options: {
      sdkKey: 'YOUR ENVIRONMENT SECRET',
      streamingUrl: 'THE STREAMING URL',
      eventsUrl: 'THE EVENTS URL',
      user: {
        userName: 'USER NAME',
        id: 'USER ID',
        customizedProperties: [
          {
            "name": "age",
            "value": '18'
          }
        ]
      }
    }
  }

  const root = createRoot(document.getElementById('root'));
  const FbProvider = await asyncWithFbProvider(config);
  root.render(
    <FbProvider>
      <YourApp />,
    </FbProvider>
  );
})();

```

After initialization is complete, your flags and the client become available at the start of your React app lifecycle. This ensures your app does not flicker due to flag changes at startup time.

> Rendering may be delayed  
Because the asyncWithFbProvider function is asynchronous, the rendering of your React app is delayed until initialization is completed. This can take up to 100 milliseconds, but often completes sooner. Alternatively, you can use the withFbProvider function if you prefer to render your app first and then process flag updates after rendering is complete.

> This function requires React 16.8.0 or later  
The asyncWithFbProvider function uses the Hooks API, which requires React version 16.8.0 or later.

#### Initializing using withFbProvider

The `withFbProvider` function initializes the React SDK and wraps your root component in a **Context.Provider**. It accepts a `ProviderConfig` object used to configure the React SDK.

```javascript
import { withFbProvider } from '@featbit/react-client-sdk';

const config = {
  options: {
    sdkKey: 'YOUR ENVIRONMENT SECRET',
    streamingUrl: 'THE STREAMING URL',
    eventsUrl: 'THE EVENTS URL',
    user: {
      userName: 'USER NAME',
      id: 'USER ID',
      customizedProperties: [
        {
          "name": "age",
          "value": '18'
        }
      ]
    }
  }
};

export default withFbProvider(config)(YourApp);
```

#### Subscribing to flag changes

The React SDK automatically subscribes to flag change events. This is different from the JavaScript SDK, where customers need to opt in to event listening.

### Configuring the React SDK

The `ProviderConfig` object provides configuration to both `withFbProvider` and `asyncWithFbProvider` function.

The only mandatory property is the **options**, it is the config needed to initialize the `@featbit/js-client-sdk`. To know more details about the **options**, please refer to [@featbit/js-client-sdk](https://github.com/featbit/featbit-js-client-sdk). All other properties are React SDK related.

The complete liste of the available properties:

- **options**: the initialization config for `@featbit/js-client-sdk`. **mandatory**

  You can use the **[options.bootstrap](https://github.com/featbit/featbit-js-client-sdk?tab=readme-ov-file#bootstrap)** option to populate the SDK with default values.
- **reactOptions**: You can use this option to enable automatic camel casing of flag keys when using the React SDK. the default value is false  **not mandatory**
- **deferInitialization**: This property allows SDK initialization to be deferred until you define the fbClient property. the default value is false **not mandatory**

  asyncWithFbProvider does not support deferInitialization. You must initialize asyncWithFbProvider at the app entry point prior to rendering to ensure flags and the client are ready at the beginning of your app.

  By deferring SDK initialization, you defer all steps which take place as part of SDK initialization, including reading flag values from local storage and sending the SDK's ready event.

  The one exception to this rule is that the SDK continues to load bootstrapped flag values as long as the bootstrapped values are provided as a map of flag keys and values. If you indicate that the SDK should bootstrap flags from local storage, this will not happen until the SDK initializes.

The following is an example ProviderConfig object including each of the above properties:
```javascript
{
  options: {
    sdkKey: 'YOUR ENVIRONMENT SECRET',
    streamingUrl: 'THE STREAMING URL',
    eventsUrl: 'THE EVENTS URL',
    user: {
      userName: 'USER NAME',
      id: 'USER ID',
      customizedProperties: [
        {
          "name": "age",
          "value": '18'
        }
      ]
    }
    ...
  },
  reactOptions: {
    useCamelCaseFlagKeys: false
  },
  deferInitialization: false
}

```

### Consuming flags

#### Consuming flags in class component

There are two ways to consume the flags.

##### Using contextType property
```javascript
import { context } from '@featbit/react-client-sdk';

class MyComponent extends React.Component {
  static contextType = context;

  constructor(props) {
    super(props);
  }

  render() {
    const { flags } = this.context;

    return (
      <div>{ flags['dev-test-flag'] ? 'Flag on' : 'Flag off' }</div>
    )
  }
}

export default MyComponent;
```

#####  Using withFbConsumer

The return value of withFbConsumer is a wrapper function that takes your component and returns a React component injected with flags & fbClient as props.

```javascript
import { withFbConsumer } from '@featbit/react-client-sdk';

class MyComponent extends React.Component {
  render() {
    const { flags } = this.props;

    return (
      <div>
        <div>{flags.flag1}</div>
      </div>
    );
  }
}

export default withFbConsumer()(Board)
```

#### Consuming flags in function component
There are two ways to consume the flags.

##### Using withFbConsumer
The return value of withFbConsumer is a wrapper function that takes your component and returns a React component injected with flags & fbClient as props.

```javascript
import { withFbConsumer } from '@featbit/react-client-sdk';

const Home = ({ flags, fbClient /*, ...otherProps */ }) => {
  // You can call any of the methods from the JavaScript SDK
  // fbClient.identify({...})

  return flags['dev-test-flag'] ? <div>Flag on</div> : <div>Flag off</div>;
};

export default withFbConsumer()(Home);
```

##### Using Hooks

The React SDK offers two custom hooks which you can use as an alternative to `withFbConsumer`: 
- `useFlags`
- `useFbClient`

> These functions require React 16.8.0 or later  
useFlags and useFbClient use the Hooks API, which requires React version 16.8.0 or later.

useFlags is a custom hook which returns all feature flags. It uses the useContext primitive to access the FeatBit context set up by asyncWithFbProvider or withFbProvider. You still must use the asyncWithFbProvider or the withFbProvider higher-order component at the root of your application to initialize the React SDK and populate the context with fbClient and your flags.

useFbClient is the second custom hook which returns the underlying FeatBit's JavaScript SDK client object. Like the useFlags custom hook, useFbClient also uses the useContext primitive to access the context set up by asyncWithFbProvider or withFbProvider. You still must use the asyncWithFbProvider or the withFbProvider higher-order component to initialize the React SDK to use this custom hook.

Here is an example of how to use those two hooks:

```javascript
import { useFlags, useFbClient } from '@featbit/react-client-sdk';

const MyComponent = props => {
  const fbClient = useFbClient();

  const { flag1, flag2 } = useFlags();
  // or use
  const flags = useFlags();
  // then use flags.flag1 or flags['flag1'] to reference the flag1 feature flag
  
  return (
    <div>
      <div>1: {flag1}</div>
      <div>2: {flag2}</div>
    </div>
  );
};


export default MyComponent;

```
### Switch user after initialization

If the user is not available during the initialization, you can call the **identity()** method on **fbClient** to set the user after initialization.

#### Switch user in class component

```javascript
import { withFbConsumer, useFbClient } from '@featbit/react-client-sdk';

class LoginComponent extends React.Component {
    
  handleLogin = async () => {
    const { fbClient } = this.props;
    const user = {}; // use your user object
    await fbClient.identify(user);
  }
    
  render() {
    return (
      <div>
        <button onClick={this.handleLogin}>Login</button>
      </div>
    );
  }
}

export default withFbConsumer()(LoginComponent)
````

#### Switch user in function component

```javascript
import { useFbClient } from '@featbit/react-client-sdk';

const LoginComponent = () => {
  const fbClient = useFbClient();

  handleLogin = async () => {
    const user = {}; // use your user object
    await fbClient.identify(user);
  }
    
  return (
    <div>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

````

### Populating the SDK with fallback flag values

As mentioned above, you can use the **options.bootstrap** option to populate the SDK with default values for your flags. This option is useful when you want to provide default values for your flags before the SDK initializes.
If a flag is not available from the SDK, the SDK uses the default value you provide in the bootstrap object.

```javascript
options: {
  bootstrap: [
    { 
        "id": "my-flag",
        "variation": "on"
    },
    {
      "id": "second-flag",
      "variation": "AlphaGo"
    }
  ]
}
```

## Flag keys
FeatBit primarily identifies feature flags by a key which must contain only alphanumeric characters, dots (.), underscores (_), and dashes (-). These keys are used across all of our APIs as well as in the SDKs to identify flags.

However, JavaScript and React cannot access keys with a dot notation, so the React SDK can change all flag keys to camel case (you need to activate this with the **reactOptions.useCamelCaseFlagKeys** parameter). A flag with key `dev-flag-test` is accessible as `flags.devFlagTest`. This notation **flags['dev-flag-test']** should be used if useCamelCaseFlagKeys is disabled, which is by default.

Be aware, by activating useCamelCaseFlagKeys, you would see following problems:

- It is possible to induce a key collision if there are multiple flag keys which resolve to the same camel-case key. For example, `dev-flag-test` and `dev.flag.test` are unique keys, but the React SDK changes them to the same camel-case key.
- If a flag key contains three or more capital letters in a row, the SDK automatically converts all letters between the first and last capital letter to lower case. For example, the SDK converts a flag with the key `devQAFlagTest` to `devQaFlagTest`. If you use devQAFlagTest with the useFlags() hook, the SDK does not find the flag.
- Because the camel-case functionality is implemented in the React SDK instead of in the underlying JavaScript SDK, the underlying client object and functionality provided by the JavaScript SDK reflect flag keys in their original format. Only React-specific contexts such as your injected props use camel case.

> If you've enabled the useCamelCaseFlagKeys option to true, attempting to access a flag using its original key will trigger a warning message in the console:
> **You're attempting to access a flag with its original keyId: xxx, even though useCamelCaseFlagKeys is set to true.**
## Importing types

In addition to its own bundled types, the React SDK uses types from `@featbit/js-client-sdk`, these types are re-exported by the React SDK. You can import these types directly from the React SDK
