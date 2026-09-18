import React, { useEffect, useState } from 'react'
import '../App.css'
import logo from '../assets/logo.png'

export const NavBar = () => {

	const [scrolled, setScrolled] = useState(false)

	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 50)
		}

		window.addEventListener('scroll', handleScroll)

		return () => {
			window.removeEventListener('scroll', handleScroll)
		}
	}, [])

	return (
		<>
			<nav className={`navbar fixed-top ${scrolled ? 'navbar-scrolled' : 'navbar-hero'}`}>
				<div className="container">

					{!scrolled && (
						<div className='logo'>
							<a className="navbar-brand" href="#up">
								<img src={logo} alt="RutaExpress" className="logo" />
							</a>
						</div>
					)}

					<ul className="navbar-nav ms-auto flex-row gap-4">
						<li className="nav-item">
							<a className="nav-link" href="#up">Inicio</a>
						</li>

						<li className="nav-item">
							<a className="nav-link" href="#about">Nosotros</a>
						</li>

						<li className="nav-item">
							<a className="nav-link" href="#services">Servicios</a>
						</li>

						<li className="nav-item">
							<a className="nav-link" href="#contact">Contacto</a>
						</li>
					</ul>

				</div>
			</nav>
		</>
	)
}