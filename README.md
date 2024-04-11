## Introduction
This is the react client side SDK for the feature management platform [FeatBit](https://www.featbit.co). We will document all the methods available in this SDK, and detail how they work.

> Be aware, this is a client side SDK, it is intended for use in a single-user context, which can be mobile, desktop or embeded applications. This SDK can only be ran in a browser environment, it is not suitable for React Native projects, React Native SDK will be available in our other repo.

The React SDK is based on the JavaScript SDK  
The React SDK builds on FeatBit's JavaScript SDK to provide a better integration for use in React applications. As a result, much of the JavaScript SDK functionality is also available for the React SDK to use. 

The **fbClient** in the current doc is the same object as **fbClient** in the featbit-js-client-sdk.
To learn more about our JavaScript client SDK, please go to this repository [featbit-js-client-sdk](https://github.com/featbit/featbit-js-client-sdk)

> SDK version compatibility  
The React SDK is compatible with React version 16.3.0 and higher.
The React SDK offers two custom hooks. If you want to use these, then you must use React version 16.8.0 or higher. To learn more, read the section [Using Hooks](#using-hooks).

## Getting started
### Install
npm
```
npm install featbit-react-client-sdk
```

yarn
```
yarn add featbit-react-client-sdk
```

### Initializing the SDK
After you install the dependency, initialize the React SDK. You can do this in one of two ways:

- Using the asyncWithFbProvider function
- Using the withFbProvider function

Both rely on React's Context API which lets you access your flags from any level of your component hierarchy.

#### Initializing using asyncWithFbProvider

The **asyncWithFbProvider** function initializes the React SDK and returns a provider which is a React component. It is an async function. It accepts a **ProviderConfig** object.

**asyncWithFbProvider** cannot be deferred. You must initialize **asyncWithFbProvider** at the app entry point prior to rendering to ensure flags and the client are ready at the beginning of the app.

```javascript
import { asyncWithFbProvider } from 'featbit-react-client-sdk';

(async () => {
  const config = {
    options: {
      secret: 'YOUR ENVIRONMENT SECRET',
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

  const FbProvider = await asyncWithFbProvider(config);
  render(
    <FbProvider>
      <YourApp />
    </FbProvider>,
    document.getElementById('reactDiv'),
  );
})();

```

After initialization is complete, your flags and the client become available at the start of your React app lifecycle. This ensures your app does not flicker due to flag changes at startup time.

> Rendering may be delayed  
Because the asyncWithFbProvider function is asynchronous, the rendering of your React app is delayed until initialization is completed. This can take up to 100 milliseconds, but often completes sooner. Alternatively, you can use the withFbProvider function if you prefer to render your app first and then process flag updates after rendering is complete.

> This function requires React 16.8.0 or later  
The asyncWithFbProvider function uses the Hooks API, which requires React version 16.8.0 or later.

#### Initializing using withFbProvider

The **withFbProvider** function initializes the React SDK and wraps your root component in a **Context.Provider**. It accepts a **ProviderConfig** object used to configure the React SDK.

```javascript
import { withFbProvider } from 'featbit-react-client-sdk';

const config = {
  options: {
    secret: 'YOUR ENVIRONMENT SECRET',
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

The React SDK automatically subscribes to flag change events. This is different from the JavaScript SDK, where customers need to opt in to event listening.

### Consuming flags

#### Consuming flags in class component

There are two ways to consume the flags.

##### Using contextType property
```javascript
import { context } from 'featbit-react-client-sdk';

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
import { withFbConsumer } from 'featbit-react-client-sdk';

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
import { withFbConsumer } from 'featbit-react-client-sdk';

const Home = ({ flags, fbClient /*, ...otherProps */ }) => {
  // You can call any of the methods from the JavaScript SDK
  // fbClient.identify({...})

  return flags['dev-test-flag'] ? <div>Flag on</div> : <div>Flag off</div>;
};

export default withFbConsumer()(Home);
```

##### Using Hooks
The React SDK offers two custom hooks which you can use as an alternative to **withFbConsumer**: 
- useFlags
- useFbClient.

> These functions require React 16.8.0 or later  
useFlags and useFbClient use the Hooks API, which requires React version 16.8.0 or later.

useFlags is a custom hook which returns all feature flags. It uses the useContext primitive to access the FeatBit context set up by asyncWithFbProvider or withFbProvider. You still must use the asyncWithFbProvider or the withFbProvider higher-order component at the root of your application to initialize the React SDK and populate the context with FbClient and your flags.

useFbClient is the second custom hook which returns the underlying FeatBit's JavaScript SDK client object. Like the useFlags custom hook, useFbClient also uses the useContext primitive to access the context set up by asyncWithFbProvider or withFbProvider. You still must use the asyncWithFbProvider or the withFbProvider higher-order component to initialize the React SDK to use this custom hook.

Here is an example of how to use those two hooks:

```javascript
import { useFlags, useFbClient } from 'featbit-react-client-sdk';

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

### Configuring the React SDK
The **ProviderConfig** object provides configuration to both **withFbProvider** and **asyncWithFbProvider** function.

The only mandatory property is the **options**, it is the config needed to initialize the featbit-js-client-sdk. To know more details about the **options**, please refer to [featbit-js-client-sdk](https://github.com/featbit/featbit-js-client-sdk). All other properties are React SDK related.

The complete liste of the available properties:

- **options**: the initialization config for featbit-js-client-sdk. **mandatory**

    You can use the **options.bootstrap** option to populate the SDK with default values.
- **reactOptions**: You can use this option to enable automatic camel casing of flag keys when using the React SDK. the default value is false  **not mandatory**
- **deferInitialization**: This property allows SDK initialization to be deferred until you define the fbClient property. the default value is false **not mandatory**
  
    asyncWithFbProvider does not support deferInitialization. You must initialize asyncWithFbProvider at the app entry point prior to rendering to ensure flags and the client are ready at the beginning of your app.

    By deferring SDK initialization, you defer all steps which take place as part of SDK initialization, including reading flag values from local storage and sending the SDK's ready event.

    The one exception to this rule is that the SDK continues to load bootstrapped flag values as long as the bootstrapped values are provided as a map of flag keys and values. If you indicate that the SDK should bootstrap flags from local storage, this will not happen until the SDK initializes.

The following is an example ProviderConfig object including each of the above properties:
```javascript
{
  options: {
    secret: 'YOUR ENVIRONMENT SECRET',
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

## Flag keys
FeatBit primarily identifies feature flags by a key which must contain only alphanumeric characters, dots (.), underscores (_), and dashes (-). These keys are used across all of our APIs as well as in the SDKs to identify flags.

However, JavaScript and React cannot access keys with a dot notation, so the React SDK can change all flag keys to camel case (you need to activate this with the **reactOptions.useCamelCaseFlagKeys** parameter). A flag with key dev-flag-test is accessible as flags.devFlagTest. This notation **flags['dev-flag-test']** should be used if useCamelCaseFlagKeys is disabled, which is by default.

Be aware, by activating useCamelCaseFlagKeys, you would see following problems:

- It is possible to induce a key collision if there are multiple flag keys which resolve to the same camel-case key. For example, dev-flag-test and dev.flag.test are unique keys, but the React SDK changes them to the same camel-case key.
- If a flag key contains three or more capital letters in a row, the SDK automatically converts all letters between the first and last capital letter to lower case. For example, the SDK converts a flag with the key devQAFlagTest to devQaFlagTest. If you use devQAFlagTest with the useFlags() hook, the SDK does not find the flag.
- Because the camel-case functionality is implemented in the React SDK instead of in the underlying JavaScript SDK, the underlying client object and functionality provided by the JavaScript SDK reflect flag keys in their original format. Only React-specific contexts such as your injected props use camel case.

## Importing types

In addition to its own bundled types, the React SDK uses types from featbit-js-client-sdk. If you use Typescript and you need to use featbit-js-client-sdk types, you can install the featbit-js-client-sdk package as a dev dependency. You can then import the types you want directly from featbit-js-client-sdk.

If you use eslint, the SDK requires that you add featbit-js-client-sdk as a dev dependency. Otherwise, eslint will report a no-extraneous-dependencies error.


