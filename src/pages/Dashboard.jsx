import React, { useState } from 'react'
import { useMsal } from '@azure/msal-react'

const ROLE_LABELS = {
  ADMIN: 'Administrador',
  OPERADOR: 'Despachador',
  CLIENTE: 'Cliente',
}

const dashboardData = {
  ADMIN: {
    kpis: [
      { label: 'Envíos totales', value: '1.248', delta: '+12,4%' },
      { label: 'Entregados hoy', value: '386', delta: '+8,1%' },
      { label: 'En ruta', value: '214', delta: '+5,6%' },
      { label: 'Incidencias', value: '19', delta: '-2,3%' },
    ],
    hourlyVolume: [
      { hour: '06h', value: 42 },
      { hour: '07h', value: 58 },
      { hour: '08h', value: 76 },
      { hour: '09h', value: 90 },
      { hour: '10h', value: 110 },
      { hour: '11h', value: 96 },
      { hour: '12h', value: 120 },
      { hour: '13h', value: 103 },
    ],
    leadTime: '18h 40m',
    states: [
      { label: 'CREADO', value: 132, color: '#6c757d' },
      { label: 'ACEPTADO', value: 210, color: '#0d6efd' },
      { label: 'EN_BODEGA', value: 184, color: '#198754' },
      { label: 'EN_RUTA', value: 214, color: '#fd7e14' },
      { label: 'ENTREGADO', value: 386, color: '#20c997' },
      { label: 'CANCELADO', value: 19, color: '#dc3545' },
    ],
  },
  OPERADOR: {
    warehouse: [
      { id: 'RT-1042', city: 'Bogotá', destination: 'Medellín', priority: 'Alta', time: '09:45' },
      { id: 'RT-1048', city: 'Cali', destination: 'Pereira', priority: 'Media', time: '10:10' },
      { id: 'RT-1051', city: 'Barranquilla', destination: 'Cartagena', priority: 'Alta', time: '11:25' },
    ],
    inRoute: [
      { id: 'RT-1023', driver: 'Mateo R.', city: 'Medellín', eta: '14 min' },
      { id: 'RT-1034', driver: 'Laura P.', city: 'Bucaramanga', eta: '38 min' },
      { id: 'RT-1045', driver: 'Carlos M.', city: 'Pereira', eta: '51 min' },
    ],
  },
  CLIENTE: {
    shipments: [
      { id: 'CL-9102', route: 'Bogotá → Medellín', status: 'ENTREGADO', date: '18 sep' },
      { id: 'CL-9108', route: 'Cali → Pereira', status: 'EN_RUTA', date: '20 sep' },
      { id: 'CL-9114', route: 'Barranquilla → Cartagena', status: 'EN_BODEGA', date: '21 sep' },
      { id: 'CL-9121', route: 'Bogotá → Tunja', status: 'ACEPTADO', date: '22 sep' },
    ],
    currentStatus: [
      { label: 'Creado', value: 1, color: '#6c757d' },
      { label: 'Aceptado', value: 1, color: '#0d6efd' },
      { label: 'En bodega', value: 1, color: '#198754' },
      { label: 'En ruta', value: 1, color: '#fd7e14' },
      { label: 'Entregado', value: 1, color: '#20c997' },
    ],
  },
}

export const Dashboard = () => {
  const { instance } = useMsal()
  const account = instance.getAllAccounts?.()[0]
  const [selectedRole, setSelectedRole] = useState(() => {
    const claims = account?.idTokenClaims ?? {}
    const roles = claims.roles ?? []

    if (roles.includes('Admin') || roles.includes('ADMIN')) return 'ADMIN'
    if (roles.includes('Operador') || roles.includes('OPERADOR')) return 'OPERADOR'
    if (roles.includes('Cliente') || roles.includes('CLIENTE')) return 'CLIENTE'

    return 'ADMIN'
  })

  const handleLogout = async () => {
    try {
      await instance.logoutRedirect({
        postLogoutRedirectUri: `${window.location.origin}/login`,
      })
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  const currentRoleData = dashboardData[selectedRole] ?? dashboardData.ADMIN
  const userName = account?.name || account?.username || 'Usuario RutaExpress'
  const roleOptions = [
    { value: 'ADMIN', label: 'Admin' },
    { value: 'OPERADOR', label: 'Operador' },
    { value: 'CLIENTE', label: 'Cliente' },
  ]

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

        <div className="role-switcher" role="tablist" aria-label="Seleccionar vista por rol">
          {roleOptions.map((role) => (
            <button
              key={role.value}
              type="button"
              className={`role-tab ${selectedRole === role.value ? 'active' : ''}`}
              onClick={() => setSelectedRole(role.value)}
            >
              {role.label}
            </button>
          ))}
        </div>

        {selectedRole === 'ADMIN' && (
          <section className="dashboard-section">
            <div className="section-heading">
              <div>
                <p className="dashboard-eyebrow">Vista Administrador</p>
                <h2>Red en tiempo real</h2>
              </div>
              <span className="section-tag">{ROLE_LABELS.ADMIN}</span>
            </div>

            <div className="kpi-grid">
              {currentRoleData.kpis.map((item) => (
                <div className="kpi-card" key={item.label}>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                  <small>{item.delta}</small>
                </div>
              ))}
            </div>

            <div className="panel-row">
              <div className="dashboard-panel chart-panel">
                <div className="panel-header">
                  <h3>Envíos por hora</h3>
                  <span>Últimas 8 horas</span>
                </div>

                <div className="hourly-chart" aria-label="Volumen de envíos por hora">
                  {currentRoleData.hourlyVolume.map((point) => {
                    const maxValue = Math.max(...currentRoleData.hourlyVolume.map((item) => item.value))
                    const height = `${(point.value / maxValue) * 100}%`

                    return (
                      <div className="bar-group" key={point.hour}>
                        <div className="bar-track">
                          <span className="bar-fill" style={{ height }} />
                        </div>
                        <small>{point.hour}</small>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="dashboard-panel lead-panel">
                <div className="panel-header">
                  <h3>Lead time</h3>
                  <span>Promedio</span>
                </div>
                <div className="lead-time-value">{currentRoleData.leadTime}</div>
                <p>
                  El ciclo de vida promedio de los envíos se mantiene dentro del estándar operativo de la red.
                </p>
              </div>
            </div>

            <div className="dashboard-panel status-panel">
              <div className="panel-header">
                <h3>Estados activos</h3>
                <span>Desglose por estado</span>
              </div>

              <div className="status-grid">
                {currentRoleData.states.map((state) => (
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

        {selectedRole === 'OPERADOR' && (
          <section className="dashboard-section">
            <div className="section-heading">
              <div>
                <p className="dashboard-eyebrow">Vista Despachador</p>
                <h2>Operación diaria</h2>
              </div>
              <span className="section-tag">{ROLE_LABELS.OPERADOR}</span>
            </div>

            <div className="panel-row">
              <div className="dashboard-panel">
                <div className="panel-header">
                  <h3>Envíos en bodega</h3>
                  <span>{currentRoleData.warehouse.length} paquetes</span>
                </div>

                <div className="list-stack">
                  {currentRoleData.warehouse.map((shipment) => (
                    <div className="list-item" key={shipment.id}>
                      <div>
                        <strong>{shipment.id}</strong>
                        <p>{shipment.city} → {shipment.destination}</p>
                      </div>
                      <div className="list-item-meta">
                        <span className="priority-badge priority-high">{shipment.priority}</span>
                        <small>{shipment.time}</small>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="dashboard-panel">
                <div className="panel-header">
                  <h3>Envíos en ruta</h3>
                  <span>{currentRoleData.inRoute.length} activos</span>
                </div>

                <div className="list-stack">
                  {currentRoleData.inRoute.map((shipment) => (
                    <div className="list-item" key={shipment.id}>
                      <div>
                        <strong>{shipment.id}</strong>
                        <p>{shipment.driver}</p>
                      </div>
                      <div className="list-item-meta">
                        <span>{shipment.city}</span>
                        <small>{shipment.eta}</small>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {selectedRole === 'CLIENTE' && (
          <section className="dashboard-section">
            <div className="section-heading">
              <div>
                <p className="dashboard-eyebrow">Vista Cliente</p>
                <h2>Seguimiento de envíos</h2>
              </div>
              <span className="section-tag">{ROLE_LABELS.CLIENTE}</span>
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
                      {currentRoleData.shipments.map((shipment) => (
                        <tr key={shipment.id}>
                          <td>{shipment.id}</td>
                          <td>{shipment.route}</td>
                          <td>
                            <span className={`status-pill status-${shipment.status.toLowerCase()}`}>
                              {shipment.status}
                            </span>
                          </td>
                          <td>{shipment.date}</td>
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
                  {currentRoleData.currentStatus.map((state) => (
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

