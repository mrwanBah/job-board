import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'

const navLink = ({ isActive }: { isActive: boolean }) =>
  `block px-2 py-2 text-sm font-medium sm:px-0 sm:py-0 ${
    isActive ? 'text-indigo-600' : 'text-gray-600 hover:text-gray-900'
  }`

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const token = useAuthStore((s) => s.token)
  const logout = useAuthStore((s) => s.logout)

  const closeMenu = () => setOpen(false)
  const onLogout = () => {
    logout()
    closeMenu()
    navigate('/')
  }

  return (
    <header className="border-b border-gray-200 bg-white">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-lg font-bold text-indigo-600" onClick={closeMenu}>
          JobBoard
        </Link>

        <div className="hidden items-center gap-5 sm:flex">
          <NavLink to="/" end className={navLink}>
            Jobs
          </NavLink>
          {token ? (
            <>
              <NavLink to="/dashboard" className={navLink}>
                Dashboard
              </NavLink>
              <button
                onClick={onLogout}
                className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navLink}>
                Login
              </NavLink>
              <NavLink
                to="/register"
                className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-indigo-700"
              >
                Sign up
              </NavLink>
            </>
          )}
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-md text-gray-600 hover:bg-gray-100 sm:hidden"
          aria-label="Toggle menu"
        >
          {open ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </nav>

      {open && (
        <div className="space-y-1 border-t border-gray-200 px-4 py-3 sm:hidden">
          <NavLink to="/" end className={navLink} onClick={closeMenu}>
            Jobs
          </NavLink>
          {token ? (
            <>
              <NavLink to="/dashboard" className={navLink} onClick={closeMenu}>
                Dashboard
              </NavLink>
              <button
                onClick={onLogout}
                className="block w-full rounded-md px-2 py-2 text-left text-sm font-medium text-gray-600 hover:bg-gray-100"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navLink} onClick={closeMenu}>
                Login
              </NavLink>
              <NavLink to="/register" className={navLink} onClick={closeMenu}>
                Sign up
              </NavLink>
            </>
          )}
        </div>
      )}
    </header>
  )
}
