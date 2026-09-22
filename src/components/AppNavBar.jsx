import { Link, NavLink } from 'react-router-dom'
import { useMsal } from '@azure/msal-react'

export const AppNavBar = () => {
  const { instance, accounts } = useMsal()

  const handleLogout = async () => {
    try {
      await instance.logoutRedirect({
        postLogoutRedirectUri: `${window.location.origin}/login`,
      })
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">

        <Link className="navbar-brand fw-bold" to="/dashboard">
          RutaExpress
        </Link>

        <div className="d-flex align-items-center gap-3">

          <NavLink
            to="/dashboard"
            className="nav-link text-white"
          >
            Dashboard
          </NavLink>

          <span className="text-white small d-none d-md-inline">
            {accounts[0]?.name ?? accounts[0]?.username}
          </span>

          <button
            type="button"
            className="btn btn-outline-light btn-sm"
            onClick={handleLogout}
          >
            Cerrar sesión
          </button>

        </div>

      </div>
    </nav>
  )
}