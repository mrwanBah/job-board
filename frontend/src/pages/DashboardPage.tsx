import { usePageTitle } from '../hooks/usePageTitle'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'

const cardClass =
  'rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition hover:border-indigo-300 hover:shadow-md'

export default function DashboardPage() {
  usePageTitle('Dashboard')
  const user = useAuthStore((s) => s.user)
  const isCompany = user?.role === 'COMPANY'

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">
        Welcome{user?.fullName ? `, ${user.fullName}` : ''}
      </h1>
      <p className="mt-1 text-gray-600">
        {isCompany
          ? 'Post jobs and review applicants.'
          : 'Browse jobs and track your applications.'}
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {isCompany ? (
          <>
            <Link to="/dashboard/jobs/new" className={cardClass}>
              <h2 className="font-semibold text-gray-900">Post a job →</h2>
              <p className="mt-1 text-sm text-gray-600">Create a new listing.</p>
            </Link>
            <Link to="/dashboard/jobs" className={cardClass}>
              <h2 className="font-semibold text-gray-900">My jobs →</h2>
              <p className="mt-1 text-sm text-gray-600">Edit, deactivate, and review applicants.</p>
            </Link>
          </>
        ) : (
          <>
            <Link to="/" className={cardClass}>
              <h2 className="font-semibold text-gray-900">Browse jobs →</h2>
              <p className="mt-1 text-sm text-gray-600">Find and apply to open roles.</p>
            </Link>
            <Link to="/dashboard/applications" className={cardClass}>
              <h2 className="font-semibold text-gray-900">My applications →</h2>
              <p className="mt-1 text-sm text-gray-600">Track the status of your applications.</p>
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
