import { usePageTitle } from '../hooks/usePageTitle'
import { useQuery } from '@tanstack/react-query'
import api from '../api/axiosInstance'
import type { Application } from '../types'
import { isExpired, salaryLabel, safeHttpUrl } from '../utils/jobs'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useJob } from '../hooks/useJobs'
import { useApplyToJob } from '../hooks/useApplications'
import { useAuthStore } from '../stores/authStore'
import { JOB_TYPE_LABELS } from '../utils/jobTypes'
import Spinner from '../components/Spinner'

function ApplySection({ jobId }: { jobId: string }) {
  const token = useAuthStore((s) => s.token)
  const user = useAuthStore((s) => s.user)
  const apply = useApplyToJob(jobId)
  const [coverLetter, setCoverLetter] = useState('')
  const existing = useQuery({ queryKey: ['my-application', jobId], enabled: Boolean(token && user?.role === 'APPLICANT'), retry: false, queryFn: async () => (await api.get<Application[]>('/applications/mine')).data.find(application => String(application.job.id) === jobId) ?? null })

  if (!token) {
    return (
      <div className="mt-6 rounded-md bg-gray-50 p-4 text-sm text-gray-600">
        <Link to="/login" state={{ from: `/jobs/${jobId}` }} className="font-medium text-indigo-600 hover:underline">
          Log in
        </Link>{' '}
        as an applicant to apply for this job.
      </div>
    )
  }

  if (user && user.role !== 'APPLICANT') {
    return (
      <p className="mt-6 text-sm text-gray-400">Only applicant accounts can apply to jobs.</p>
    )
  }

  if (existing.isFetching) return <Spinner label="Checking application…" />
  if (existing.isError) return <p role="alert">Could not check your application. <button onClick={() => existing.refetch()}>Retry</button></p>
  if (existing.data) return <p className="mt-6 rounded-md bg-indigo-50 p-4" role="status">Application status: {existing.data.status}</p>
  if (apply.isSuccess) {
    return (
      <p className="mt-6 rounded-md bg-green-50 p-3 text-sm text-green-700">
        Application submitted. Track it in{' '}
        <Link to="/dashboard/applications" className="font-medium underline">
          My applications
        </Link>
        .
      </p>
    )
  }

  return (
    <div className="mt-6">
      <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700">Cover letter (optional)</label>
      <textarea
        id="coverLetter"
        maxLength={5000}
        rows={4}
        value={coverLetter}
        onChange={(e) => setCoverLetter(e.target.value)}
        placeholder="Tell the company why you’re a great fit…"
        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      />
      <p className="text-xs text-gray-500">{coverLetter.length}/5000 characters</p>
      <button
        onClick={() => apply.mutate(coverLetter || undefined)}
        disabled={apply.isPending}
        className="mt-3 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
      >
        {apply.isPending ? 'Submitting…' : 'Apply'}
      </button>
    </div>
  )
}

export default function JobDetailPage() {
  usePageTitle('Job details')
  const { id } = useParams()
  const { data: job, isPending, isError } = useJob(id)

  if (isPending) {
    return <Spinner label="Loading…" />
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

  const salary = salaryLabel(job)

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link to="/" className="text-sm font-medium text-indigo-600 hover:underline">
        ← Back to jobs
      </Link>

      <div className="mt-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            {safeHttpUrl(job.company.logoUrl) && <img src={safeHttpUrl(job.company.logoUrl)} alt={job.company.name + ' logo'} className="mb-3 h-12 w-12 object-contain" />}
            <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
            <p className="mt-1 text-gray-600">{job.company.name}</p>
          </div>
          <span className="shrink-0 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
            {JOB_TYPE_LABELS[job.jobType]}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-500">
          <span>{job.location || 'Location not specified'}</span>
          {salary && <span>{salary}</span>}
          {job.expiresAt && <span>Expires {job.expiresAt}</span>}
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
          {safeHttpUrl(job.company.website) && (
            <p>
              Website:{' '}
              <a
                href={safeHttpUrl(job.company.website)}
                target="_blank"
                rel="noreferrer"
                className="text-indigo-600 hover:underline"
              >
                {job.company.website}
              </a>
            </p>
          )}
        </div>

        {!job.isActive || isExpired(job) ? <p role="status" className="mt-6 rounded-md bg-gray-100 p-4">No longer accepting applications</p> : <ApplySection jobId={String(job.id)} />}
      </div>
    </div>
  )
}
