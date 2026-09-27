import { Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

export function RoleRoute({ allowedRoles, children }) {
  const { rol, cargandoUsuario } = useAuth()

  if (cargandoUsuario) {
    return <div>Cargando...</div>
  }

  if (!rol || !allowedRoles.includes(rol)) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}