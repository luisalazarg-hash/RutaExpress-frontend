import React from 'react'
import { useMsal } from '@azure/msal-react'

export const Dashboard = () => {

	const { instance } = useMsal()

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
		<>
			<button
				type="button"
				className="btn btn-outline-danger"
				onClick={handleLogout}
			>
				Cerrar sesión
			</button>
		</>
	)
}
