import React, { useEffect, useState } from 'react'
import { useMsal } from '@azure/msal-react'
import { Navigate } from 'react-router-dom'
import { DashboardNav } from '../components/DashboardNav'
import './Dashboard.css'

const ROLES = {
  ADMIN: 'Administrador',
  DESPACHADOR: 'Despachador',
  CLIENTE: 'Cliente',
  AUDITOR: 'Auditor',
}

const getRole = (account) => {
  const roles = account?.idTokenClaims?.roles ?? []
  return roles.some((role) => ['Admin', 'ADMIN'].includes(role)) ? 'ADMIN' : ''
}

const getErrorMessage = async (response) => {
  try {
    const data = await response.json()
    return data.message || data.error || data.detail || `Error ${response.status}`
  } catch {
    return `Error ${response.status}`
  }
}

export const UsersPage = () => {
  const { instance } = useMsal()
  const account = instance.getAllAccounts?.()[0]
  const role = getRole(account)
  const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:8081'
  const [users, setUsers] = useState([])
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [form, setForm] = useState({ nombre: '', email: '', rol: 'CLIENTE', empresaId: '' })

  useEffect(() => {
    let active = true

    const load = async () => {
      if (!account) return
      try {
        const scopes = [import.meta.env.VITE_AZURE_API_SCOPE].filter(Boolean)
        const token = await instance.acquireTokenSilent({ scopes, account })
        const headers = { Authorization: `Bearer ${token.accessToken}` }
        const [usersResponse, companiesResponse] = await Promise.all([
          fetch(`${apiUrl}/api/usuarios`, { headers }),
          fetch(`${apiUrl}/api/auth/companies`, { headers }),
        ])
        if (!usersResponse.ok) throw new Error(await getErrorMessage(usersResponse))
        if (!companiesResponse.ok) throw new Error(await getErrorMessage(companiesResponse))
        const [usersData, companiesData] = await Promise.all([
          usersResponse.json(),
          companiesResponse.json(),
        ])
        if (active) {
          setUsers(Array.isArray(usersData) ? usersData : [])
          setCompanies(Array.isArray(companiesData) ? companiesData.filter((company) => company.activa !== false) : [])
        }
      } catch (requestError) {
        if (active) setError(requestError.message || 'No fue posible cargar los usuarios.')
      } finally {
        if (active) setLoading(false)
      }
    }

    load()
    return () => { active = false }
  }, [account, apiUrl, instance])

  if (role !== 'ADMIN') return <Navigate to="/dashboard" replace />

  const updateForm = (event) => {
    const { name, value } = event.target
    setForm((current) => ({
      ...current,
      [name]: value,
      ...(name === 'rol' && value === 'ADMIN' ? { empresaId: '' } : {}),
    }))
  }

  const createUser = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (form.rol !== 'ADMIN' && !form.empresaId) {
      setError('Selecciona una empresa para este rol.')
      return
    }

    setSaving(true)
    try {
      const scopes = [import.meta.env.VITE_AZURE_API_SCOPE].filter(Boolean)
      const token = await instance.acquireTokenSilent({ scopes, account })
      const response = await fetch(`${apiUrl}/api/usuarios`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: form.nombre.trim(),
          email: form.email.trim(),
          rol: form.rol,
          empresaId: form.rol === 'ADMIN' ? null : Number(form.empresaId),
        }),
      })
      if (!response.ok) throw new Error(await getErrorMessage(response))
      const created = await response.json()
      setUsers((current) => [...current, created])
      setForm({ nombre: '', email: '', rol: 'CLIENTE', empresaId: '' })
      setSuccess('Usuario creado correctamente.')
    } catch (requestError) {
      setError(requestError.message || 'No fue posible crear el usuario.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-shell">
        <DashboardNav isAdmin />
        <header className="dashboard-header">
          <div>
            <p className="dashboard-eyebrow">Administración</p>
            <h1>Usuarios</h1>
          </div>
        </header>

        {error && <div className="dashboard-alert" role="alert">{error}</div>}
        {success && <div className="user-success" role="status">{success}</div>}

        <section className="dashboard-panel user-create-panel">
          <div className="panel-header">
            <h3>Crear usuario</h3>
            <span>Todos los roles están disponibles</span>
          </div>
          <form className="user-create-form" onSubmit={createUser}>
            <label>
              Nombre
              <input name="nombre" value={form.nombre} onChange={updateForm} required maxLength="150" />
            </label>
            <label>
              Correo
              <input name="email" type="email" value={form.email} onChange={updateForm} required />
            </label>
            <label>
              Rol
              <select name="rol" value={form.rol} onChange={updateForm}>
                {Object.entries(ROLES).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </label>
            {form.rol !== 'ADMIN' && (
              <label>
                Empresa
                <select name="empresaId" value={form.empresaId} onChange={updateForm} required>
                  <option value="">Selecciona una empresa</option>
                  {companies.map((company) => <option key={company.id} value={company.id}>{company.nombre}</option>)}
                </select>
              </label>
            )}
            <button className="user-create-button" type="submit" disabled={saving || loading}>
              {saving ? 'Creando...' : 'Crear usuario'}
            </button>
          </form>
        </section>

        <section className="dashboard-panel">
          <div className="panel-header">
            <h3>Usuarios registrados</h3>
            <span>{users.length} registros</span>
          </div>
          {loading ? (
            <div className="dashboard-loading">Cargando usuarios...</div>
          ) : (
            <div className="recent-table-wrap">
              <table className="recent-table user-table">
                <thead><tr><th>Nombre</th><th>Correo</th><th>Rol</th><th>Empresa</th><th>Estado</th></tr></thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.nombre}</td>
                      <td>{user.email}</td>
                      <td>{ROLES[user.rol] || user.rol}</td>
                      <td>{user.nombreEmpresa || '-'}</td>
                      <td>{user.estado}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
