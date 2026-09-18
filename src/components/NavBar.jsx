import React, { useEffect, useState } from 'react'
import '../App.css'
import logo from '../assets/logo.png'
import { Link } from 'react-router-dom'

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

					<ul className={`navbar-nav flex-row gap-4 ${scrolled ? 'navbar-nav-scrolled' : 'ms-auto'}`}>
						<li className="nav-item">
							<Link className="nav-link" to="/">Inicio</Link>
						</li>

						<li className="nav-item">
							<a className="nav-link" href="#about">Sobre Nosotros</a>
						</li>

						<li className="nav-item">
							<a className="nav-link" href="#services">Iniciar Sesión</a>
						</li>
					</ul>

				</div>
			</nav>
		</>
	)
}