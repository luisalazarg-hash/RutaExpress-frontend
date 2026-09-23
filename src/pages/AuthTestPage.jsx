import { useAuth } from '../auth/AuthContext'
import { useMsal } from '@azure/msal-react'
import { apiTokenRequest } from '../auth/authRequest'

export function AuthTestPage() {

  const {
    isAuthenticated,
    usuario,
    cargandoUsuario,
    errorUsuario,
  } = useAuth()

  if (cargandoUsuario) {
    return <p>Cargando usuario...</p>
  }

  const { instance, accounts } = useMsal()

  async function probarUsuarios() {

    try {

      const account =
        instance.getActiveAccount() ?? accounts[0]

      const tokenResponse =
        await instance.acquireTokenSilent({
          ...apiTokenRequest,
          account,
        })

      const response = await fetch(
        'http://localhost:8088/api/usuarios',
        {
          headers: {
            Authorization:
              `Bearer ${tokenResponse.accessToken}`,
          },
        }
      )

      const data = await response.json()

      console.log(
        'GET /api/usuarios:',
        response.status,
        data
      )

    } catch (error) {

      console.error(
        'Error probando /api/usuarios:',
        error
      )
    }
  }

  return (
    <div className="container py-5">

      <h1>Estado de autenticación</h1>

      <p>
        Microsoft:
        {' '}
        {isAuthenticated
          ? 'Autenticado'
          : 'No autenticado'}
      </p>

      {usuario && (
        <>
          <p>Usuario: {usuario.nombre}</p>
          <p>Email: {usuario.email}</p>
          <p>Rol: {usuario.rol}</p>
          <p>Estado: {usuario.estado}</p>
        </>
      )}

      {errorUsuario && (
        <div className="alert alert-danger">
          {errorUsuario}
        </div>
      )}

      <button
        className="btn btn-primary"
        onClick={probarUsuarios}
      >
        Probar GET /api/usuarios
      </button>

    </div>
  )
}