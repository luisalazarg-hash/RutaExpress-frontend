import { Route, Routes } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { Dashboard } from './pages/Dashboard'
import { ModulePage } from './pages/ModulePage'
import { ProtectedRoute } from './routes/ProtectedRoute'
import { AuthTestPage } from './pages/AuthTestPage'
import { UsuariosPage } from './pages/UsuariosPage'
import { AppLayout } from './layouts/AppLayout'

export function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/auth-test" element={<AuthTestPage />} />

      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/usuarios" element={<UsuariosPage />} />
        <Route path="/auditoria" element={<ModulePage title="Auditoría" description="Consulta el historial de eventos y cambios de los envíos." />} />
        <Route path="/catalogo" element={<ModulePage title="Catálogo" description="Administra los servicios disponibles para tus envíos." />} />
        <Route path="/envios" element={<ModulePage title="Envíos" description="Consulta y gestiona el estado de los envíos." />} />
        <Route path="/notificaciones" element={<ModulePage title="Notificaciones" description="Revisa las comunicaciones generadas por la operación." />} />
        <Route path="/reportes" element={<ModulePage title="Reportes" description="Accede a los informes operativos de RutaExpress." />} />
      </Route>
    </Routes>
  )
}

export default App