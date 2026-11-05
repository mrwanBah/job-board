import { salaryLabel, safeHttpUrl } from '../utils/jobs'
import { Link } from 'react-router-dom'
import type { Job } from '../types'
import { JOB_TYPE_LABELS } from '../utils/jobTypes'

export default function JobCard({ job }: { job: Job }) {
  return (
    <Link
      to={`/jobs/${job.id}`}
      className="block rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition hover:border-gray-300 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          {safeHttpUrl(job.company.logoUrl) && <img src={safeHttpUrl(job.company.logoUrl)} alt={job.company.name + ' logo'} className="mb-2 h-10 w-10 object-contain" />}
          <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
          <p className="text-sm text-gray-600">{job.company.name}</p>
        </div>
        <span className="shrink-0 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
          {JOB_TYPE_LABELS[job.jobType]}
        </span>
      </div>
      <p className="mt-3 line-clamp-2 text-sm text-gray-600">{job.description}</p>
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
        <span>{job.location || 'Location not specified'}</span>
        {salaryLabel(job) && <span>{salaryLabel(job)}</span>}
      </div>
    </Link>
  )
}
