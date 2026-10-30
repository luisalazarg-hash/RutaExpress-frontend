import { Outlet } from 'react-router-dom'
import { DashboardNav } from '../components/DashboardNav'

export const AppLayout = () => {
  return (
    <div className="min-vh-100 d-flex flex-column">

      <main className="flex-grow-1">
        <DashboardNav />
        <Outlet />
      </main>

    </div>
  )
}