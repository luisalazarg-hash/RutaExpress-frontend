import { Route, Routes } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { Dashboard } from './pages/Dashboard'
import { ModulePage } from './pages/ModulePage'
import { ProtectedRoute } from './routes/ProtectedRoute'
import { RoleRoute } from './auth/RoleRoute'
import { AuthTestPage } from './pages/AuthTestPage'
import { UsuariosPage } from './pages/UsuariosPage'
import { AppLayout } from './layouts/AppLayout'

export function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/auth-test" element={<AuthTestPage />} />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />

        <Route
          path="/usuarios"
          element={
            <RoleRoute allowedRoles={['ADMIN']}>
              <UsuariosPage />
            </RoleRoute>
          }
        />

        <Route
          path="/auditoria"
          element={
            <RoleRoute allowedRoles={['ADMIN', 'AUDITOR']}>
              <ModulePage
                title="Auditoría"
                description="Consulta el historial de eventos y cambios de los envíos."
              />
            </RoleRoute>
          }
        />

        <Route
          path="/catalogo"
          element={
            <RoleRoute allowedRoles={['ADMIN', 'DESPACHADOR']}>
              <ModulePage
                title="Catálogo"
                description="Administra los servicios disponibles para tus envíos."
              />
            </RoleRoute>
          }
        />

        <Route
          path="/envios"
          element={
            <RoleRoute allowedRoles={['ADMIN', 'DESPACHADOR', 'CLIENTE']}>
              <ModulePage
                title="Envíos"
                description="Consulta y gestiona el estado de los envíos."
              />
            </RoleRoute>
          }
        />

        <Route
          path="/notificaciones"
          element={
            <RoleRoute allowedRoles={['ADMIN', 'DESPACHADOR', 'CLIENTE']}>
              <ModulePage
                title="Notificaciones"
                description="Revisa las comunicaciones generadas por la operación."
              />
            </RoleRoute>
          }
        />

        <Route
          path="/reportes"
          element={
            <RoleRoute allowedRoles={['ADMIN']}>
              <ModulePage
                title="Reportes"
                description="Accede a los informes operativos de RutaExpress."
              />
            </RoleRoute>
          }
        />
      </Route>
    </Routes>
  )
}

export default App