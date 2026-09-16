import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from 'react-oidc-context';

// Esto habria que leerlo de config
const oidcConfig = {
  authority: "keycloak",
  client_id: "",
  redirect_uri: "http://localhost:8080",
  onSigninCallback:
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);
