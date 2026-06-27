import { useState } from 'react'
import FilterBar from '../components/FilterBar'
import JobCard from '../components/JobCard'
import { useJobs } from '../hooks/useJobs'
import type { JobType } from '../types'

export default function HomePage() {
  const [search, setSearch] = useState('')
  const [jobType, setJobType] = useState<JobType | ''>('')
  const [page, setPage] = useState(0)

  const { data, isPending, isError, isFetching } = useJobs({
    search: search || undefined,
    jobType: jobType || undefined,
    page,
    size: 10,
  })

  const onSearchChange = (value: string) => {
    setSearch(value)
    setPage(0)
  }
  const onJobTypeChange = (value: JobType | '') => {
    setJobType(value)
    setPage(0)
  }

  const jobs = data?.content ?? []
  const totalPages = data?.totalPages ?? 0

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900">Find your next role</h1>
      <p className="mt-1 text-gray-600">Browse open positions from companies hiring now.</p>

      <div className="mt-6">
        <FilterBar
          search={search}
          jobType={jobType}
          onSearchChange={onSearchChange}
          onJobTypeChange={onJobTypeChange}
        />
      </div>

      <div className="mt-6">
        {isPending ? (
          <p className="py-12 text-center text-gray-500">Loading jobs…</p>
        ) : isError ? (
          <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
            Couldn’t load jobs. Make sure the API is running, then try again.
          </p>
        ) : jobs.length === 0 ? (
          <p className="py-12 text-center text-gray-500">No jobs found matching your filters.</p>
        ) : (
          <>
            <div className={`grid gap-4 ${isFetching ? 'opacity-60' : ''}`}>
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>

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
