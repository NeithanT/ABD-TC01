import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from 'react-oidc-context';
import { userManager } from './Config.ts';
import { AuthLayer } from './Components/AuthLayer.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider userManager={userManager}>
      <AuthLayer>
        <App/>
      </AuthLayer>
    </AuthProvider>
  </StrictMode>
);
