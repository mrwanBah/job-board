import { Link, NavLink } from 'react-router-dom'

const navLink = ({ isActive }: { isActive: boolean }) =>
  `text-sm font-medium transition ${
    isActive ? 'text-indigo-600' : 'text-gray-600 hover:text-gray-900'
  }`

export default function Navbar() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-lg font-bold text-indigo-600">
          JobBoard
        </Link>
        <div className="flex items-center gap-5">
          <NavLink to="/" end className={navLink}>
            Jobs
          </NavLink>
          <NavLink to="/dashboard" className={navLink}>
            Dashboard
          </NavLink>
          <NavLink to="/login" className={navLink}>
            Login
          </NavLink>
          <NavLink
            to="/register"
            className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-indigo-700"
          >
            Sign up
          </NavLink>
        </div>
      </nav>
    </header>
  )
}
