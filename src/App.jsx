import { Route, Routes } from 'react-router-dom'

import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { Dashboard } from './pages/Dashboard'

import { ProtectedRoute } from './routes/ProtectedRoute'

import { PublicLayout } from './layouts/PublicLayout'
import { AppLayout } from './layouts/AppLayout'

function App() {
  return (
    <Routes>

      {/* Rutas públicas */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* Rutas privadas */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>

    </Routes>
  )
}

export default App