import { DashboardNav } from '../components/DashboardNav'

export const ModulePage = ({ title, description }) => (
  <main className="dashboard-page">
    <div className="dashboard-shell">
      <DashboardNav />
      <section className="module-page-content">
        <p className="dashboard-eyebrow">Módulo RutaExpress</p>
        <h1>{title}</h1>
        <p>{description}</p>
        <span className="module-page-status">Disponible próximamente</span>
      </section>
    </div>
  </main>
)
