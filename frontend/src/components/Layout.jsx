import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/login') }

  const navClass = ({ isActive }) =>
    `px-4 py-2 rounded-lg font-medium transition-colors ${
      isActive ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'
    }`

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary">SendiPay</span>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
              Bêta
            </span>
          </div>
          <nav className="flex items-center gap-2">
            <NavLink to="/"           className={navClass} end>Dashboard</NavLink>
            <NavLink to="/transfers"  className={navClass}>Mes envois</NavLink>
            <NavLink to="/alerts"     className={navClass}>Alertes</NavLink>
          </nav>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">Bonjour, {user?.name}</span>
            <button onClick={handleLogout}
              className="text-sm text-red-500 hover:text-red-700 transition-colors">
              Déconnexion
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-8">
        <Outlet />
      </main>
      <footer className="text-center text-xs text-gray-400 py-4">
        SendiPay © 2024 — Comparez vos transferts d'argent
      </footer>
    </div>
  )
}
