# FeatBit React client SDK example

This project is an example of how to use the [featbit-react-client-sdk](https://github.com/featbit/featbit-react-client-sdk).
It is built based on the [React official tutorial](https://reactjs.org/tutorial/tutorial.html) tic tac toe game

You can use one of the two ways to initialize the featbit-react-client-sdk:

- Using the asyncWithFfcProvider function
- Using the withFfcProvider function

Both rely on React's Context API which lets you access your flags from any level of your component hierarchy. **withFfcProvider is used by default in this example**.

To switching between the two ways, you need to modify two files:

- game.js
- index.js

Go to the bottom of each file and follow the instructions there to switch between the two ways.  
To learn the difference between the two initialization methods, please read [Initializing the SDK](https://github.com/featbit/featbit-react-client-sdk#initializing-the-sdk)

# Run the example
Run the following commands, then the App should be available at http://localhost:3000

```bash
npm install
npm run start
```

Note: if you see the following error in the navigator console: 
> Hooks can only be called inside the body of a function component. 

Then run the following command in the root folder of the SDK and then rerun the example: 
```
npm link ../examples/react-app/node_modules/react
```

# Explications

- userinfo.js: use **useFlags** and **useFbClient** in a function component
- square.js: use **withFbConsumer** in a **function component**
- board.js: use **withFbConsumer** in a class component

In the current example we used an environment created on FeatBit demo site, you can change the environment by updating the following variables in the [config.js](./src/config.js) file:

```javascript
const secret = 'YOUR ENVIRONMENT SECRET';
const streamingUri = 'THE_STREAMING_URL';
const eventsUri = 'THE_EVENTS_URL';
````

If you want to play with real data, you need to create your own environment and the following feature flags on FeatBit

```javascript
const flags = [
    {
        "id": "robot",
        "variation": "AlphaGo"
    },
    {
        "id": "用户信息模块",
        "variation": "v1.0.0"
    },
    {
        "id": "user_info_db_migration",
        "variation": "azure"
    }
];
```
then update the two variables in the [config.js](./src/board.js) file with the following values:

```javascript
const secret = 'use your environment secret';
const streamingUri = 'use your environment streaming url';
const eventsUri = 'use your environment events url';
const enableDataSync = true;
```

the same feature flags are passed to the SDK during initialization, check [config.js](./src/board.js)
