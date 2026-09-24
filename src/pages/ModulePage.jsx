import { useEffect, useState } from 'react'
import { useMsal } from '@azure/msal-react'
import { DashboardNav } from '../components/DashboardNav'
import { createApiClient } from '../api/apiClient'

const MODULES = {
  Auditoría: { path: '/api/audit/events', empty: 'No hay eventos de auditoría.' },
  Catálogo: { path: '/api/catalog', empty: 'No hay productos en el catálogo.' },
  Envíos: { path: '/api/shipments', empty: 'No hay envíos registrados.' },
  Notificaciones: { path: '/api/notifications', empty: 'No hay notificaciones para los envíos registrados.' },
  Reportes: { path: '/api/reports', empty: 'No hay reportes disponibles.' },
}

const COLUMN_LABELS = {
  id: 'ID',
  productId: 'Producto',
  recipientName: 'Destinatario',
  originAddress: 'Dirección de origen',
  destinationAddress: 'Dirección de destino',
  status: 'Estado',
  createdAt: 'Creado',
  updatedAt: 'Actualizado',
  nombre: 'Nombre',
  descripcion: 'Descripción',
  precio: 'Precio',
  stock: 'Stock',
  activo: 'Activo',
  generadoEn: 'Fecha',
}

const displayColumn = (column) => COLUMN_LABELS[column] ?? column.charAt(0).toUpperCase() + column.slice(1)

const displayValue = (value, column) => {
  if (value === null || value === undefined) return '-'
  if (column === 'generadoEn') return String(value).slice(0, 10)
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

export const ModulePage = ({ title, description }) => {
  const { instance, accounts } = useMsal()
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const module = MODULES[title]
  const isReportes = title === 'Reportes'
  const isShipments = title === 'Envíos'
  const isCatalog = title === 'Catálogo'

  useEffect(() => {
    let active = true
    async function loadModule() {
      setLoading(true)
      setError('')
      setRecords([])
      try {
        const account = instance.getActiveAccount() ?? accounts[0]
        const request = createApiClient(instance, account)
        let data
        if (title === 'Notificaciones') {
          const shipments = await request('/api/shipments')
          const notifications = await Promise.all(
            shipments.map((shipment) => request(`${module.path}/shipment/${shipment.id}`))
          )
          data = notifications.flat()
        } else {
          data = await request(module.path)
        }
        if (active) setRecords(Array.isArray(data) ? data : [])
      } catch (requestError) {
        if (active) setError('No fue posible cargar los datos del módulo.')
        console.error(`Error cargando ${title}:`, requestError)
      } finally {
        if (active) setLoading(false)
      }
    }
    loadModule()
    return () => { active = false }
  }, [accounts, instance, module.path, title])

  const columns = records.length ? Object.keys(records[0]).slice(0, 5) : []

  return (
    <main className="dashboard-page">
      <div className="dashboard-shell">
        <section className={`module-page-content${isReportes || isShipments || isCatalog ? ' module-page-content-wide' : ''}`}>
          <p className="dashboard-eyebrow">Módulo RutaExpress</p>
          <h1>{title}</h1>
          <p>{description}</p>
          {error && <div className="dashboard-alert" role="alert">{error}</div>}
          {loading && <div className="dashboard-loading">Cargando datos...</div>}
          {!loading && !error && !records.length && <div className="dashboard-panel">{module.empty}</div>}
          {!loading && !error && records.length > 0 && (
            <div className={isReportes ? '' : 'dashboard-panel'}>
              <div className="table-responsive">
                <table className="table table-striped align-middle">
                <thead><tr>
                  {columns.map((column) => <th key={column}>{displayColumn(column)}</th>)}
                </tr></thead>
                <tbody>{records.map((record, index) => (
                  <tr key={record.id ?? index}>{columns.map((column) => (
                    <td key={column}>{column === 'id' ? index + 1 : displayValue(record[column], column)}</td>
                  ))}</tr>
                ))}</tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
