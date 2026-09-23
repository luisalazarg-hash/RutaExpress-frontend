import { useState } from 'react'
import { useMsal } from '@azure/msal-react'
import { InteractionRequiredAuthError } from '@azure/msal-browser'

import { apiTokenRequest } from '../auth/authRequest'

export const AuthTestPage = () => {

  const { instance, accounts } = useMsal()

  const [resultado, setResultado] = useState('')
  const [cargando, setCargando] = useState(false)

  const probarToken = async () => {

    setCargando(true)
    setResultado('')

    try {

      const account = instance.getActiveAccount() ?? accounts[0]

      if (!account) {
        setResultado('No existe una cuenta autenticada.')
        return
      }

      const request = {
        ...apiTokenRequest,
        account,
      }

      let response

      try {

        response = await instance.acquireTokenSilent(request)

      } catch (error) {

        if (error instanceof InteractionRequiredAuthError) {

          await instance.acquireTokenRedirect(request)
          return

        }

        throw error
      }

      if (response.accessToken) {

        setResultado(
          'Access token obtenido correctamente para RutaExpress-API.'
        )

      } else {

        setResultado('Microsoft no devolvió un access token.')

      }

    } catch (error) {

      console.error('Error al obtener access token:', error)

      setResultado(
        `Error: ${error.message}`
      )

    } finally {

      setCargando(false)

    }
  }

  return (
    <div className="container py-5">

      <h1>Prueba de autenticación API</h1>

      <p>
        Comprobaremos si Microsoft entrega un access token
        para RutaExpress-API.
      </p>

      <button
        className="btn btn-primary"
        onClick={probarToken}
        disabled={cargando}
      >
        {cargando ? 'Solicitando token...' : 'Obtener access token'}
      </button>

      {resultado && (
        <div className="alert alert-info mt-4">
          {resultado}
        </div>
      )}

    </div>
  )
}