import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

const navigationItems = [
  {
    label: 'Auditoría',
    path: '/auditoria',
    roles: ['ADMIN', 'AUDITOR'],
  },
  {
    label: 'Catálogo',
    path: '/catalogo',
    roles: ['ADMIN', 'DESPACHADOR'],
  },
  {
    label: 'Envíos',
    path: '/envios',
    roles: ['ADMIN', 'DESPACHADOR', 'CLIENTE'],
  },
  {
    label: 'Notificaciones',
    path: '/notificaciones',
    roles: ['ADMIN', 'DESPACHADOR', 'CLIENTE'],
  },
  {
    label: 'Reportes',
    path: '/reportes',
    roles: ['ADMIN'],
  },
  {
    label: 'Usuarios',
    path: '/usuarios',
    roles: ['ADMIN'],
  },
]

export const DashboardNav = () => {
  const { rol } = useAuth()

  const visibleItems = navigationItems.filter((item) =>
    item.roles.includes(rol)
  )

  return (
    <nav className="dashboard-nav" aria-label="Módulos de RutaExpress">
      <Link className="dashboard-nav-brand" to="/dashboard">
        RutaExpress
      </Link>

      <div className="dashboard-nav-links">
        <Link className="dashboard-nav-link" to="/dashboard">Inicio</Link>
        {visibleItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `dashboard-nav-link ${isActive ? 'active' : ''}`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}