import { usePageTitle } from '../hooks/usePageTitle'
import { Link } from 'react-router-dom'
import { useMyApplications } from '../hooks/useApplications'
import StatusBadge from '../components/StatusBadge'
import Spinner from '../components/Spinner'

export default function MyApplicationsPage() {
  usePageTitle('My applications')
  const { data: apps, isPending, isError } = useMyApplications()

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">My applications</h1>

      <div className="mt-6">
        {isPending ? (
          <Spinner label="Loading your applications…" />
        ) : isError ? (
          <p aria-live="polite" className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
            Couldn’t load your applications. Make sure the API is running.
          </p>
        ) : !apps || apps.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 py-12 text-center">
            <p className="text-gray-600">You haven’t applied to any jobs yet.</p>
            <Link
              to="/"
              className="mt-3 inline-block text-sm font-medium text-indigo-600 hover:underline"
            >
              Browse jobs
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {apps.map((app) => (
              <li
                key={app.id}
                className="flex flex-col gap-2 rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <Link
                    to={`/jobs/${app.job.id}`}
                    className="font-semibold text-gray-900 hover:text-indigo-600"
                  >
                    {app.job.title}
                  </Link>
                  <p className="text-sm text-gray-500">
                    {app.job.company.name} · Applied {new Date(app.appliedAt).toLocaleDateString()}
                  </p>
                </div>
                <StatusBadge status={app.status} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
