import { Link, NavLink } from 'react-router-dom'

const navigationItems = [
  { label: 'Auditoría', path: '/auditoria' },
  { label: 'Catálogo', path: '/catalogo' },
  { label: 'Envíos', path: '/envios' },
  { label: 'Notificaciones', path: '/notificaciones' },
  { label: 'Reportes', path: '/reportes' },
  { label: 'Usuarios', path: '/usuarios' },
]

export const DashboardNav = () => (
  <nav className="dashboard-nav" aria-label="Módulos de RutaExpress">
    <Link className="dashboard-nav-brand" to="/dashboard">RutaExpress</Link>
    <div className="dashboard-nav-links">
      {navigationItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => `dashboard-nav-link ${isActive ? 'active' : ''}`}
        >
          {item.label}
        </NavLink>
      ))}
    </div>
  </nav>
)
