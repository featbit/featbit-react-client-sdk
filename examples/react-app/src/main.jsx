import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {configWithUser} from "./config.js";
import {asyncWithFbProvider} from "@featbit/react-client-sdk";

// Uncomment the following block to use asyncWithFbProvider
const FbProvider = await asyncWithFbProvider(configWithUser);
createRoot(document.getElementById('root')).render(
  <StrictMode>
      <FbProvider>
          <App />
      </FbProvider>
  </StrictMode>,
)

// Uncomment the following block to use withFbProvider
// createRoot(document.getElementById('root')).render(
//     <StrictMode>
//         <App />
//     </StrictMode>,
// )
