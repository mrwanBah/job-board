import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'

export default function ProtectedRoute() {
  const location = useLocation()
  const token = useAuthStore((s) => s.token)
  if (!token) {
    return <Navigate to="/login" state={{ from: location.pathname + location.search }} replace />
  }
  return <Outlet />
}
