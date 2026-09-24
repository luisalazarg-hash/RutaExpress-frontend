import { useEffect, useState } from 'react'
import { useMsal } from '@azure/msal-react'
import { createApiClient } from '../api/apiClient'

export function UsuariosPage() {
    const { instance, accounts } = useMsal()

    const [usuarios, setUsuarios] = useState([])
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState(null)

    const [mostrarFormulario, setMostrarFormulario] = useState(false)
    const [nuevoUsuario, setNuevoUsuario] = useState({ nombre: '', email: '', rol: 'ADMIN', empresaId: null })

    async function cargarUsuarios() {
        try {
            setCargando(true)
            setError(null)

            const account = instance.getActiveAccount() ?? accounts[0]
            const data = await createApiClient(instance, account)('/api/usuarios')
            setUsuarios(data)
        } catch (error) {
            console.error(error)
            setError(error.message)
        } finally {
            setCargando(false)
        }
    }

    async function cambiarRol(id, rol) {
        try {
            const account = instance.getActiveAccount() ?? accounts[0]
            await createApiClient(instance, account)(`/api/usuarios/${id}/rol`, {
                method: 'PATCH',
                body: JSON.stringify({ rol, empresaId: null }),
            })

            await cargarUsuarios()
        } catch (error) {
            console.error(error)
            alert(error.message)
        }
    }

    useEffect(() => {
        cargarUsuarios()
    }, [])

    if (cargando) {
        return <div className="container py-5">Cargando usuarios...</div>
    }

    if (error) {
        return (
            <div className="container py-5">
                <div className="alert alert-danger">
                    {error}
                </div>
            </div>
        )
    }

    async function crearUsuario(e) {
        e.preventDefault()
        try {
            const account = instance.getActiveAccount() ?? accounts[0]
            await createApiClient(instance, account)('/api/usuarios', {
                method: 'POST',
                body: JSON.stringify(nuevoUsuario),
            })
            setNuevoUsuario({ nombre: '', email: '', rol: 'ADMIN', empresaId: null })
            setMostrarFormulario(false)
            await cargarUsuarios()
        } catch (error) {
            alert(error.message)
        }
    }

    return (
        <div className="container py-5">
            <h2 className="mb-4">Gestión de Usuarios</h2>

            <button className="btn btn-primary mb-3" onClick={() => setMostrarFormulario(!mostrarFormulario)}>
                Crear usuario
            </button>

            {mostrarFormulario && (
                <form onSubmit={crearUsuario} className="card card-body mb-4">
                    <input className="form-control mb-2" placeholder="Nombre" value={nuevoUsuario.nombre}
                        onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, nombre: e.target.value })} required />

                    <input className="form-control mb-2" type="email" placeholder="Correo" value={nuevoUsuario.email}
                        onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, email: e.target.value })} required />

                    <select className="form-select mb-3" value={nuevoUsuario.rol}
                        onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, rol: e.target.value })}>
                        <option value="ADMIN">ADMIN</option>
                    </select>

                    <button className="btn btn-success" type="submit">Guardar usuario</button>
                </form>
            )}

            <div className="table-responsive">
                <table className="table table-striped align-middle">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Correo</th>
                            <th>Rol</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {usuarios.map((usuario) => (
                            <tr key={usuario.id}>
                                <td>{usuario.nombre}</td>
                                <td>{usuario.email}</td>
                                <td>{usuario.rol}</td>
                                <td>{usuario.estado}</td>

                                <td>
                                    {usuario.rol !== 'ADMIN' && (
                                        <button
                                            className="btn btn-sm btn-primary"
                                            onClick={() =>
                                                cambiarRol(usuario.id, 'ADMIN')
                                            }
                                        >
                                            Hacer ADMIN
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}