import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'

const navItem = ({ isActive }: { isActive: boolean }) =>
  `block rounded-md px-3 py-2 text-sm font-medium ${
    isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
  }`

export default function DashboardLayout() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)

  const onLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="text-lg font-bold text-indigo-600">
            JobBoard
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <span className="hidden text-gray-600 sm:inline">{user?.fullName ?? 'Account'}</span>
            <button
              onClick={onLogout}
              className="rounded-md border border-gray-300 px-3 py-1.5 font-medium text-gray-700 hover:bg-gray-50"
            >
              Log out
            </button>
          </div>
        </div>
      </header>
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-6 md:flex-row">
        <aside className="flex gap-1 overflow-x-auto md:w-48 md:shrink-0 md:flex-col md:gap-1 md:space-y-1 md:overflow-visible">
          <NavLink to="/dashboard" end className={navItem}>
            Overview
          </NavLink>
          {user?.role === 'COMPANY' && (
            <>
              <NavLink to="/dashboard/jobs" className={navItem}>
                My jobs
              </NavLink>
              <NavLink to="/dashboard/jobs/new" className={navItem}>
                Post a job
              </NavLink>
            </>
          )}
          {user?.role === 'APPLICANT' && (
            <NavLink to="/dashboard/applications" className={navItem}>
              My applications
            </NavLink>
          )}
        </aside>
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
