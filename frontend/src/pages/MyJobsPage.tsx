import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDeactivateJob, useMyJobs } from '../hooks/useJobs'
import { JOB_TYPE_LABELS } from '../utils/jobTypes'
import Spinner from '../components/Spinner'

export default function MyJobsPage() {
  const [page, setPage] = useState(0)
  const { data, isPending, isError } = useMyJobs({ page, size: 10 })
  const deactivate = useDeactivateJob()

  const jobs = data?.content ?? []
  const totalPages = data?.totalPages ?? 0

  const onDeactivate = (id: number, title: string) => {
    if (window.confirm(`Deactivate "${title}"? It will no longer appear in search.`)) {
      deactivate.mutate(id)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My jobs</h1>
        <Link
          to="/dashboard/jobs/new"
          className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Post a job
        </Link>
      </div>

      <div className="mt-6">
        {isPending ? (
          <Spinner label="Loading your jobs…" />
        ) : isError ? (
          <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
            Couldn’t load your jobs. Make sure the API is running.
          </p>
        ) : jobs.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 py-12 text-center">
            <p className="text-gray-600">You haven’t posted any jobs yet.</p>
            <Link
              to="/dashboard/jobs/new"
              className="mt-3 inline-block text-sm font-medium text-indigo-600 hover:underline"
            >
              Post your first job
            </Link>
          </div>
        ) : (
          <>
            <ul className="space-y-3">
              {jobs.map((job) => (
                <li
                  key={job.id}
                  className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{job.title}</h3>
                      {!job.isActive && (
                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                          Inactive
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      {JOB_TYPE_LABELS[job.jobType]} · {job.location || 'No location'}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 text-sm">
                    <Link
                      to={`/dashboard/jobs/${job.id}/applications`}
                      className="rounded-md border border-gray-300 px-3 py-1.5 font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Applicants
                    </Link>
                    <Link
                      to={`/dashboard/jobs/${job.id}/edit`}
                      className="rounded-md border border-gray-300 px-3 py-1.5 font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Edit
                    </Link>
                    {job.isActive && (
                      <button
                        onClick={() => onDeactivate(job.id, job.title)}
                        disabled={deactivate.isPending}
                        className="rounded-md border border-red-300 px-3 py-1.5 font-medium text-red-700 hover:bg-red-50 disabled:opacity-60"
                      >
                        Deactivate
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-center gap-4">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  Page {page + 1} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => (p + 1 < totalPages ? p + 1 : p))}
                  disabled={page + 1 >= totalPages}
                  className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
