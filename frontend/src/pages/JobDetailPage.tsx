import { Link, useParams } from 'react-router-dom'
import { useJob } from '../hooks/useJobs'
import { JOB_TYPE_LABELS } from '../utils/jobTypes'

export default function JobDetailPage() {
  const { id } = useParams()
  const { data: job, isPending, isError } = useJob(id)

  if (isPending) {
    return <p className="mx-auto max-w-3xl px-4 py-12 text-center text-gray-500">Loading…</p>
  }

  if (isError || !job) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 text-center">
        <p className="text-gray-600">This job could not be found.</p>
        <Link to="/" className="mt-3 inline-block text-sm font-medium text-indigo-600 hover:underline">
          Back to jobs
        </Link>
      </div>
    )
  }

  const salary =
    job.salaryMin != null && job.salaryMax != null
      ? `${job.salaryMin.toLocaleString()}–${job.salaryMax.toLocaleString()} SAR`
      : null

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link to="/" className="text-sm font-medium text-indigo-600 hover:underline">
        ← Back to jobs
      </Link>

      <div className="mt-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
            <p className="mt-1 text-gray-600">{job.company.name}</p>
          </div>
          <span className="shrink-0 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
            {JOB_TYPE_LABELS[job.jobType]}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-500">
          <span>{job.location}</span>
          {salary && <span>{salary}</span>}
          <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
        </div>

        <h2 className="mt-6 text-sm font-semibold uppercase tracking-wide text-gray-500">
          Description
        </h2>
        <p className="mt-2 whitespace-pre-line text-gray-700">{job.description}</p>

        <h2 className="mt-6 text-sm font-semibold uppercase tracking-wide text-gray-500">
          About {job.company.name}
        </h2>
        <div className="mt-2 space-y-1 text-sm text-gray-700">
          {job.company.description && <p>{job.company.description}</p>}
          {job.company.location && <p>Location: {job.company.location}</p>}
          {job.company.website && (
            <p>
              Website:{' '}
              <a
                href={job.company.website}
                target="_blank"
                rel="noreferrer"
                className="text-indigo-600 hover:underline"
              >
                {job.company.website}
              </a>
            </p>
          )}
        </div>

        {/* Apply action is added in Week 3 (APPLICANT role, behind auth check). */}
        <button
          disabled
          className="mt-6 cursor-not-allowed rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-500"
          title="Applying becomes available in Week 3"
        >
          Apply (coming soon)
        </button>
      </div>
    </div>
  )
}
