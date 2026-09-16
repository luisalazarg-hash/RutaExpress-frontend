import React from 'react'
import '../App.css'

export const NavBar = () => {
	return (
		<>
			<nav className="navbar navbar-expand-lg navbar-dark p-4">
				<div className="container-fluid d-flex justify-content-between">
					<h1 className="navbar-brand mb-0 fs-2" href="#">Ruta <span className='text-danger'>Express</span></h1>
					<button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
						<span className="navbar-toggler-icon"></span>
					</button>
					<div className="collapse navbar-collapse" id="navbarSupportedContent">
						<ul className="navbar-nav ms-auto mb-2 mb-lg-0">
							<li className="nav-item">
								<a className="nav-link active" aria-current="page" href="#">Inicio</a>
							</li>
							<li className="nav-item">
								<a className="nav-link" href="#">Ver Pedidos</a>
							</li>
							<li className="nav-item">
								<a className="nav-link" href="#">Iniciar Sesion</a>
							</li>
							
						</ul>
					</div>
				</div>
			</nav>
		</>
	)
}