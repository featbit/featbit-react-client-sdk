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

In the current example we used local data, the synchronization with evaluation server is disabled.

If you want to play with real data, you need to create an account and the following feature flags on FeatBit

```javascript
const flags = [
    {
        "id": "robot",
        "variation": "阿尔法猫",
        "timestamp": 1646688885330,
        "variationOptions": [{
            "id": 1,
            "value": "深蓝"
        }, {
            "id": 2,
            "value": "阿尔法猫"
        }],
        "sendToExperiment": true
    },
    {
        "id": "用户信息模块",
        "variation": "v1.0.0",
        "timestamp": 1646380582151,
        "variationOptions": [{
            "id": 1,
            "value": "v1.0.0"
        }, {
            "id": 2,
            "value": "v1.1.0"
        }],
        "sendToExperiment": true
    },
    {
        "id": "user_info_db_migration",
        "variation": "azure",
        "timestamp": 1646267387598,
        "variationOptions": [{
            "id": 1,
            "value": "azure"
        }, {
            "id": 2,
            "value": "aws"
        }],
        "sendToExperiment": true
    }
];
```
then update the two variables in the [config.js](./src/board.js) file with the following values:

```javascript
const secret = 'use your environment secret';
const enableDataSync = true;
```

the same feature flags are passed to the SDK during initialization, check [config.js](./src/board.js)
