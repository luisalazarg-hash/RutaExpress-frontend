import React, { useEffect, useState } from 'react'
import { useMsal } from '@azure/msal-react'
import './Dashboard.css'

const STATUS_COLORS = { CREADO: '#6c757d', ACEPTADO: '#0d6efd', EN_BODEGA: '#198754', EN_RUTA: '#fd7e14', ENTREGADO: '#20c997', CANCELADO: '#dc3545' }
const ROLE_LABELS = { ADMIN: 'Administrador', OPERADOR: 'Despachador', CLIENTE: 'Cliente' }
const getRole = (account) => {
  const roles = account?.idTokenClaims?.roles ?? []
  if (roles.some((role) => ['Admin', 'ADMIN'].includes(role))) return 'ADMIN'
  if (roles.some((role) => ['Operador', 'OPERADOR'].includes(role))) return 'OPERADOR'
  return 'CLIENTE'
}
const formatDate = (value) => value ? new Intl.DateTimeFormat('es-CL', { dateStyle: 'medium' }).format(new Date(value)) : '-'
const countStatuses = (shipments) => Object.keys(STATUS_COLORS).map((label) => ({ label, value: shipments.filter((shipment) => shipment.status === label).length, color: STATUS_COLORS[label] }))

export const Dashboard = () => {
  const { instance } = useMsal()
  const account = instance.getAllAccounts?.()[0]
  const role = getRole(account)
  const [shipments, setShipments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  useEffect(() => {
    let active = true
    const loadShipments = async () => {
      try {
        const scopes = [import.meta.env.VITE_AZURE_API_SCOPE].filter(Boolean)
        const token = await instance.acquireTokenSilent({ scopes, account })
        const response = await fetch(`${import.meta.env.VITE_API_URL ?? 'http://localhost:8081'}/api/shipments`, { headers: { Authorization: `Bearer ${token.accessToken}` } })
        if (!response.ok) throw new Error(`La API respondió ${response.status}`)
        const data = await response.json()
        if (active) setShipments(Array.isArray(data) ? data : [])
      } catch (requestError) {
        if (active) setError('No fue posible cargar los envíos desde la API.')
        console.error('Error cargando envíos:', requestError)
      } finally {
        if (active) setLoading(false)
      }
    }
    loadShipments()
    return () => { active = false }
  }, [account, instance])

  const handleLogout = async () => {
    try {
      await instance.logoutRedirect({
        postLogoutRedirectUri: `${window.location.origin}/login`,
      })
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  const userName = account?.name || account?.username || 'Usuario RutaExpress'
  const statusData = countStatuses(shipments)
  const activeShipments = shipments.filter((shipment) => ['ACEPTADO', 'EN_BODEGA', 'EN_RUTA'].includes(shipment.status))
  const deliveredShipments = shipments.filter((shipment) => shipment.status === 'ENTREGADO')
  const pendingShipments = shipments.filter((shipment) => ['CREADO', 'ACEPTADO', 'EN_BODEGA'].includes(shipment.status))

  return (
    <div className="dashboard-page">
      <div className="dashboard-shell">
        <header className="dashboard-header">
          <div>
            <p className="dashboard-eyebrow">Panel de control</p>
            <h1>RutaExpress</h1>
          </div>

          <div className="dashboard-user-wrap">
            <div className="dashboard-user">
              <span className="dashboard-label">Usuario</span>
              <strong>{userName}</strong>
            </div>
            <button
              type="button"
              className="btn btn-outline-danger dashboard-logout"
              onClick={handleLogout}
            >
              Cerrar sesión
            </button>
          </div>
        </header>

        {error && <div className="dashboard-alert" role="alert">{error}</div>}
        {loading && <div className="dashboard-loading">Cargando envíos...</div>}
        {!loading && role === 'ADMIN' && (
          <section className="dashboard-section">
            <div className="section-heading">
              <div>
                <p className="dashboard-eyebrow">Vista Administrador</p>
                <h2>Red en tiempo real</h2>
              </div>
              <span className="section-tag">{ROLE_LABELS[role]}</span>
            </div>

            <div className="kpi-grid">
              {[
                { label: 'Envíos totales', value: shipments.length },
                { label: 'Entregados', value: deliveredShipments.length },
                { label: 'Activos', value: activeShipments.length },
                { label: 'Pendientes', value: pendingShipments.length },
              ].map((item) => (
                <div className="kpi-card" key={item.label}>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                  <small>Datos de la API</small>
                </div>
              ))}
            </div>

            <div className="panel-row">
              <div className="dashboard-panel chart-panel">
                <div className="panel-header">
                  <h3>Envíos por hora</h3>
                  <span>Últimas 8 horas</span>
                </div>

                <div className="api-summary">
                  <strong>{shipments.length}</strong>
                  <span>registros devueltos por `/api/shipments`</span>
                </div>
              </div>

              <div className="dashboard-panel lead-panel">
                <div className="panel-header">
                  <h3>Lead time</h3>
                  <span>Promedio</span>
                </div>
                <div className="lead-time-value">{activeShipments.length}</div>
                <p>
                  Envíos actualmente en proceso operativo según su estado real.
                </p>
              </div>
            </div>

            <div className="dashboard-panel status-panel">
              <div className="panel-header">
                <h3>Estados activos</h3>
                <span>Desglose por estado</span>
              </div>

              <div className="status-grid">
                {statusData.map((state) => (
                  <div className="status-card" key={state.label}>
                    <div className="status-card-top">
                      <span
                        className="status-dot"
                        style={{ backgroundColor: state.color }}
                        aria-hidden="true"
                      />
                      <span>{state.label}</span>
                    </div>
                    <strong>{state.value}</strong>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {!loading && role === 'OPERADOR' && (
          <section className="dashboard-section">
            <div className="section-heading">
              <div>
                <p className="dashboard-eyebrow">Vista Despachador</p>
                <h2>Operación diaria</h2>
              </div>
              <span className="section-tag">{ROLE_LABELS[role]}</span>
            </div>

            <div className="panel-row">
              <div className="dashboard-panel">
                <div className="panel-header">
                  <h3>Envíos en bodega</h3>
                  <span>{pendingShipments.length} paquetes</span>
                </div>

                <div className="list-stack">
                  {pendingShipments.map((shipment) => (
                    <div className="list-item" key={shipment.id}>
                      <div>
                        <strong>{shipment.id}</strong>
                        <p>{shipment.recipientName}</p>
                      </div>
                      <div className="list-item-meta">
                        <span className="priority-badge priority-high">{shipment.status}</span>
                        <small>{formatDate(shipment.createdAt)}</small>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="dashboard-panel">
                <div className="panel-header">
                  <h3>Envíos en ruta</h3>
                  <span>{activeShipments.length} activos</span>
                </div>

                <div className="list-stack">
                  {activeShipments.map((shipment) => (
                    <div className="list-item" key={shipment.id}>
                      <div>
                        <strong>{shipment.id}</strong>
                        <p>{shipment.recipientName}</p>
                      </div>
                      <div className="list-item-meta">
                        <span>{shipment.serviceCode}</span>
                        <small>{formatDate(shipment.updatedAt)}</small>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {!loading && role === 'CLIENTE' && (
          <section className="dashboard-section">
            <div className="section-heading">
              <div>
                <p className="dashboard-eyebrow">Vista Cliente</p>
                <h2>Seguimiento de envíos</h2>
              </div>
              <span className="section-tag">{ROLE_LABELS[role]}</span>
            </div>

            <div className="panel-row">
              <div className="dashboard-panel">
                <div className="panel-header">
                  <h3>Últimos envíos</h3>
                  <span>Historial reciente</span>
                </div>

                <div className="recent-table-wrap">
                  <table className="recent-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Ruta</th>
                        <th>Estado</th>
                        <th>Fecha</th>
                      </tr>
                    </thead>
                    <tbody>
                      {shipments.map((shipment) => (
                        <tr key={shipment.id}>
                          <td>{shipment.id}</td>
                          <td>{shipment.recipientName}</td>
                          <td>
                            <span className={`status-pill status-${shipment.status.toLowerCase()}`}>
                              {shipment.status}
                            </span>
                          </td>
                          <td>{formatDate(shipment.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="dashboard-panel">
                <div className="panel-header">
                  <h3>Estado actual</h3>
                  <span>En tiempo real</span>
                </div>

                <div className="status-grid compact">
                  {statusData.map((state) => (
                    <div className="status-card compact" key={state.label}>
                      <div className="status-card-top">
                        <span
                          className="status-dot"
                          style={{ backgroundColor: state.color }}
                          aria-hidden="true"
                        />
                        <span>{state.label}</span>
                      </div>
                      <strong>{state.value}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

