import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { MsalProvider } from '@azure/msal-react'
import { msalInstance } from './auth/msalInstance'
import { AuthProvider } from './auth/AuthContext'

import App from './App.jsx'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './custom.css'

async function initializeApp() {
  await msalInstance.initialize()

  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <MsalProvider instance={msalInstance}>
        <AuthProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AuthProvider>
      </MsalProvider>
    </StrictMode>,
  )
}

initializeApp().catch((error) => {
  console.error('Error al inicializar MSAL:', error)
})