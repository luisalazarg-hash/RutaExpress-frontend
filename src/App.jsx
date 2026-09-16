import './App.css'
import Footer from './components/Footer'

function App() {
  return (
    <div className="app-shell">
      <main className="app-main container py-5">
        <p className="text-uppercase text-muted small fw-semibold mb-2">Vista previa</p>
        <h1 className="display-5 fw-bold">RutaExpress</h1>
        <p className="lead text-secondary mb-0">
          Contenido principal de ejemplo para visualizar el footer.
        </p>
      </main>
      <Footer />
    </div>
  )
}

export default App
