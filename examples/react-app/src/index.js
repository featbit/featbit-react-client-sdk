
import { createRoot } from 'react-dom/client';
import Game from './game';
import { configWithAnonymousUser } from './config';
import { asyncWithFbProvider, FbProvider } from '@featbit/react-client-sdk';

const root = createRoot(document.getElementById('root'));

// Un comment this block to use asyncWithFbProvider to init the React SDK
// You will need to change the last line in the game.js file
// (async () => {
//     const FbProvider = await asyncWithFbProvider(configWithAnonymousUser);
//     root.render(
//         <FbProvider>
//             <Game />,
//         </FbProvider>
//     );
// })();


// Uncomment this block to use withFbProvider to init the React SDK
// You will need to change the last line in the game.js file
root.render(<Game/>);



