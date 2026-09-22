import { Outlet } from 'react-router-dom'
import { AppNavBar } from '../components/AppNavBar'

export const AppLayout = () => {
  return (
    <div className="min-vh-100 d-flex flex-column">

      <AppNavBar />

      <main className="flex-grow-1">
        <Outlet />
      </main>

    </div>
  )
}