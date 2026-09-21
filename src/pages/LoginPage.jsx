import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useMsal, useIsAuthenticated } from '@azure/msal-react'
import { InteractionStatus } from '@azure/msal-browser'

import '../App.css'

export const LoginPage = () => {
  const { instance, inProgress } = useMsal()
  const isAuthenticated = useIsAuthenticated()

  const [error, setError] = useState('')

  const isProcessing = inProgress !== InteractionStatus.None

  const handleLogin = async () => {
    if (isProcessing) return

    setError('')

    try {
      await instance.loginRedirect({
        scopes: ['openid', 'profile'],
      })
    } catch (error) {
      console.error('Error al iniciar sesión:', error)

      setError(
        'No se pudo iniciar sesión con Microsoft. Inténtalo nuevamente.'
      )
    }
  }

  // Si el usuario ya inició sesión, enviarlo al dashboard.
  // Esperamos a que MSAL termine de procesar la autenticación.
  if (isAuthenticated && !isProcessing) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="login-page d-flex justify-content-center align-items-center min-vh-100 bg-light px-3">

      <div className="login-container position-relative w-100">

        {/* Tarjetas inclinadas de fondo */}
        <div className="login-card-bg bg-primary shadow-lg rotate-left"></div>
        <div className="login-card-bg bg-danger shadow-lg rotate-right"></div>

        {/* Tarjeta principal */}
        <div className="login-card position-relative bg-light shadow rounded-4 px-4 py-5">

          <h1 className="text-center fw-bold text-primary mb-3">
            RutaExpress
          </h1>

          <h2 className="text-center fw-semibold fs-5 text-dark">
            Iniciar sesión
          </h2>

          <p className="text-center text-secondary small mt-3">
            Accede a la plataforma utilizando tu cuenta de Microsoft.
          </p>

          {/* Mensaje de error */}
          {error && (
            <div className="alert alert-danger mt-4" role="alert">
              {error}
            </div>
          )}

          {/* Botón de Microsoft */}
          <div className="mt-4 d-grid">

            <button
              type="button"
              className="btn btn-primary btn-lg fw-semibold"
              onClick={handleLogin}
              disabled={isProcessing}
            >
              {isProcessing
                ? 'Procesando autenticación...'
                : 'Iniciar sesión con Microsoft'}
            </button>

          </div>

          {/* Volver al inicio */}
          <div className="text-center mt-4">

            <Link
              to="/"
              className="text-primary text-decoration-none login-link"
            >
              Volver al inicio
            </Link>

          </div>

        </div>

      </div>

    </div>
  )
}