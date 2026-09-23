import { createContext, useContext, useEffect, useState } from 'react'
import { InteractionRequiredAuthError } from '@azure/msal-browser'
import { useIsAuthenticated, useMsal } from '@azure/msal-react'
import { apiTokenRequest } from './authRequest'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const { instance, accounts } = useMsal()
  const isAuthenticated = useIsAuthenticated()

  const [usuario, setUsuario] = useState(null)
  const [cargandoUsuario, setCargandoUsuario] = useState(true)
  const [errorUsuario, setErrorUsuario] = useState(null)

  useEffect(() => {
    async function cargarUsuario() {
      if (!isAuthenticated) {
        setUsuario(null)
        setErrorUsuario(null)
        setCargandoUsuario(false)
        return
      }

      const account = instance.getActiveAccount() ?? accounts[0]

      if (!account) {
        setUsuario(null)
        setCargandoUsuario(false)
        return
      }

      try {
        setCargandoUsuario(true)
        setErrorUsuario(null)

        const tokenResponse = await instance.acquireTokenSilent({
          ...apiTokenRequest,
          account,
        })

        const headers = {
          Authorization: `Bearer ${tokenResponse.accessToken}`,
        }

        let response = await fetch(
          'http://localhost:8088/api/auth/me',
          { method: 'GET', headers }
        )

        let data = await response.json()

        if (response.status === 403) {
          response = await fetch(
            'http://localhost:8088/api/auth/vincular',
            { method: 'POST', headers }
          )

          data = await response.json()
        }

        if (!response.ok) {
          throw new Error(
            data.mensaje ?? `Error HTTP ${response.status}`
          )
        }

        setUsuario(data)
      } catch (error) {
        if (error instanceof InteractionRequiredAuthError) {
          await instance.acquireTokenRedirect({
            ...apiTokenRequest,
            account,
          })
          return
        }

        console.error('Error cargando usuario RutaExpress:', error)
        setUsuario(null)
        setErrorUsuario(error.message)
      } finally {
        setCargandoUsuario(false)
      }
    }

    cargarUsuario()
  }, [isAuthenticated, instance, accounts])

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, usuario, cargandoUsuario, errorUsuario }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth debe utilizarse dentro de AuthProvider')
  }

  return context
}