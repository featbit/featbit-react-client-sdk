
import ReactDOM from 'react-dom';
import Game from './game';
import { configWithAnonymousUser, configWithUser} from './config';
import { asyncWithFbProvider, FbProvider } from 'featbit-react-client-sdk';
import fbClient from 'featbit-js-client-sdk';

// Un comment this block to use asyncWithFbProvider to init the React SDK
// You will need to change the last line in the game.js file
// (async () => {
//   const FbProvider = await asyncWithFbProvider(configWithAnonymousUser);
//   ReactDOM.render(
//     <FbProvider>
//       <Game />,
//     </FbProvider>,
//     document.getElementById('root')
//   );
// })();


// Uncomment this block to use withFbProvider to init the React SDK
// You will need to change the last line in the game.js file

ReactDOM.render(
  <Game/>,   
  document.getElementById('root')
);


// init fbClient outside react
// (async () => {
//   console.log(configWithAnonymousUser.options);
//   await fbClient.init(configWithAnonymousUser.options);
//   ReactDOM.render(
//     <Game fbClient={fbClient}/>,
//     document.getElementById('root')
// );
// })()



