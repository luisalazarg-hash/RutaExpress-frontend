import React from 'react'
import { NavBar } from '../components/NavBar'

export const HomePage = () => {
  return (
    <>
      <div className='FirstView'>
        <NavBar />
        <header id="up" className="hero-section d-flex align-items-center justify-content-center text-center">
          <div className="mx-2">
            <h1 className="text-white fw-bold display-4">
              <span className="text-danger">Bienvenido</span>, somos
            </h1>
            <h2 className="text-light fw-bold display-6 lh-sm">
              Ruta <span className="text-danger">Express</span> y <span className="text-white">estamos</span> para ayudarte
            </h2>
            <div className="d-inline-flex flex-wrap justify-content-center">
              <button className="btn btn-primary btn-lg fw-bold my-3 mx-2 shadow">
                Ver Pedidos
              </button>
              <a href="#about">
                <button className="btn btn-outline-primary btn-lg fw-bold my-3 mx-2 shadow bg-primary bg-opacity-10">
                  Sobre Nosotros
                </button>
              </a>
            </div>
          </div>
        </header>
      </div>
    </>
  )
}
