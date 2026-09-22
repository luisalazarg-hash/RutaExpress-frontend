import { Route, Routes } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { Dashboard } from './pages/Dashboard'
import { ModulePage } from './pages/ModulePage'
import { ProtectedRoute } from './routes/ProtectedRoute'

const protectedModule = (title, description) => (
  <ProtectedRoute>
    <ModulePage title={title} description={description} />
  </ProtectedRoute>
)

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/auditoria" element={protectedModule('Auditoría', 'Consulta el historial de eventos y cambios de los envíos.')} />
      <Route path="/catalogo" element={protectedModule('Catálogo', 'Administra los servicios disponibles para tus envíos.')} />
      <Route path="/envios" element={protectedModule('Envíos', 'Consulta y gestiona el estado de los envíos.')} />
      <Route path="/notificaciones" element={protectedModule('Notificaciones', 'Revisa las comunicaciones generadas por la operación.')} />
      <Route path="/reportes" element={protectedModule('Reportes', 'Accede a los informes operativos de RutaExpress.')} />
    </Routes>
  )
}

export default App