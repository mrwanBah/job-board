import { usePageTitle } from '../hooks/usePageTitle'
import { Link, useParams } from 'react-router-dom'
import { useJob } from '../hooks/useJobs'
import { useJobApplications, useUpdateApplicationStatus } from '../hooks/useApplications'
import StatusBadge from '../components/StatusBadge'
import Spinner from '../components/Spinner'
import type { ApplicationStatus } from '../types'

const ACTIONS: { status: ApplicationStatus; label: string; className: string }[] = [
  {
    status: 'REVIEWED',
    label: 'Mark reviewed',
    className: 'border-blue-300 text-blue-700 hover:bg-blue-50',
  },
  {
    status: 'ACCEPTED',
    label: 'Accept',
    className: 'border-green-300 text-green-700 hover:bg-green-50',
  },
  {
    status: 'REJECTED',
    label: 'Reject',
    className: 'border-red-300 text-red-700 hover:bg-red-50',
  },
]

export default function ApplicationsPage() {
  usePageTitle('Applicants')
  const { id } = useParams()
  const { data: job } = useJob(id)
  const { data: apps, isPending, isError } = useJobApplications(id)
  const updateStatus = useUpdateApplicationStatus(id)

  return (
    <div>
      <Link to="/dashboard/jobs" className="text-sm font-medium text-indigo-600 hover:underline">
        ← Back to my jobs
      </Link>
      <h1 className="mt-2 text-2xl font-bold text-gray-900">
        Applicants{job ? ` — ${job.title}` : ''}
      </h1>

      <div className="mt-6">
        {isPending ? (
          <Spinner label="Loading applicants…" />
        ) : isError ? (
          <p aria-live="polite" className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
            Couldn’t load applicants. Make sure the API is running.
          </p>
        ) : !apps || apps.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 py-12 text-center text-gray-600">
            No applicants yet.
          </div>
        ) : (
          <ul className="space-y-4">
            {apps.map((app) => (
              <li key={app.id} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-gray-900">{app.applicant.fullName}</p>
                    <p className="text-sm text-gray-500">{app.applicant.email}</p>
                    <p className="mt-1 text-xs text-gray-400">
                      Applied {new Date(app.appliedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <StatusBadge status={app.status} />
                </div>

                {app.coverLetter && (
                  <p className="mt-3 whitespace-pre-line rounded-md bg-gray-50 p-3 text-sm text-gray-700">
                    {app.coverLetter}
                  </p>
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                  {ACTIONS.map((action) => (
                    <button
                      key={action.status}
                      onClick={() => updateStatus.mutate({ id: app.id, status: action.status })}
                      disabled={updateStatus.isPending || app.status === action.status}
                      className={`rounded-md border px-3 py-1.5 text-sm font-medium disabled:opacity-40 ${action.className}`}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
