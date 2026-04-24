import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './app/App.css'
import App from './app/App.jsx'
import RouterSetup from './app/App.router.jsx';

createRoot(document.getElementById('root')).render(

  
  <StrictMode>
    <RouterSetup>
    <App />
    </RouterSetup>
  </StrictMode>,
)
