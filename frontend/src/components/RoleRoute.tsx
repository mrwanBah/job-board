import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import type { Role } from '../types'

// Gates dashboard children by role. Assumes it sits under ProtectedRoute (token present).
export default function RoleRoute({ allow }: { allow: Role[] }) {
  const token = useAuthStore((s) => s.token)
  const user = useAuthStore((s) => s.user)

  if (!token) return <Navigate to="/login" replace />
  if (user && !allow.includes(user.role)) return <Navigate to="/dashboard" replace />
  return <Outlet />
}
