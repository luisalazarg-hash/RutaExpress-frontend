import './Footer.css'

const navigationLinks = [
  { label: 'Inicio', href: '#' },
  { label: 'Cómo funciona', href: '#como-funciona' },
  { label: 'Servicios', href: '#servicios' },
  { label: 'Preguntas frecuentes', href: '#preguntas' },
]

const companyLinks = [
  { label: 'Sobre RutaExpress', href: '#nosotros' },
  { label: 'Trabaja con nosotros', href: '#empleo' },
  { label: 'Contacto', href: '#contacto' },
]

function Footer() {
  return (
    <footer className="site-footer bg-danger">
      <div className="container py-5">
        <div className="row gy-4">
          <div className="col-12 col-lg-4">
            <a className="footer-brand" href="#" aria-label="RutaExpress, inicio">
              Ruta<span>Express</span>
            </a>
            <p className="footer-description">
              Conectamos tus destinos con soluciones de transporte simples,
              rápidas y confiables.
            </p>
            <a className="footer-email" href="mailto:hola@rutaexpress.com">
              hola@rutaexpress.com
            </a>
          </div>

          <div className="col-6 col-md-4 col-lg-2">
            <h2 className="footer-title">Explora</h2>
            <ul className="footer-links">
              {navigationLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-6 col-md-4 col-lg-2">
            <h2 className="footer-title">Compañía</h2>
            <ul className="footer-links">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer-bottom row align-items-center gy-3 mt-5 pt-4">
          <div className="col-12 col-md-6">
            <p className="copyright mb-0">© 2026 RutaExpress. Todos los derechos reservados.</p>
          </div>
          <div className="col-12 col-md-6">
            <div className="footer-legal">
              <a href="#privacidad">Política de privacidad</a>
              <a href="#terminos">Términos y condiciones</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer