import { usePageTitle } from '../hooks/usePageTitle'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import FilterBar from '../components/FilterBar'
import JobCard from '../components/JobCard'
import Spinner from '../components/Spinner'
import { useJobs } from '../hooks/useJobs'
import type { JobType } from '../types'

export default function HomePage() {
  usePageTitle('Find jobs')
  const [params, setParams] = useSearchParams()
  const search = params.get('search') ?? ''
  const rawType = params.get('jobType') ?? ''
  const jobType = (['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP'].includes(rawType) ? rawType : '') as JobType | ''
  const rawPage = Number(params.get('page') ?? 0)
  const page = Number.isSafeInteger(rawPage) && rawPage >= 0 ? rawPage : 0
  const [debounced, setDebounced] = useState(search)
  useEffect(() => { const timer = setTimeout(() => setDebounced(search), 300); return () => clearTimeout(timer) }, [search])
  const setPage = (update: (page: number) => number) => setParams(p => { p.set('page', String(update(page))); return p })

  const { data, isPending, isError, isFetching } = useJobs({
    search: debounced || undefined,
    jobType: jobType || undefined,
    page,
    size: 10,
  })

  const onSearchChange = (value: string) => {
    setParams(p => { if (value) p.set('search', value); else p.delete('search'); p.delete('page'); return p }, { replace: true })
  }
  const onJobTypeChange = (value: JobType | '') => {
    setParams(p => { if (value) p.set('jobType', value); else p.delete('jobType'); p.delete('page'); return p })
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

      <p aria-live="polite" className="mt-4 text-sm text-gray-600">{data ? `${data.totalElements} results` : 'Searching…'}</p>
      <div className="mt-6">
        {isPending ? (
          <Spinner label="Loading jobs…" />
        ) : isError ? (
          <p aria-live="polite" className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
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
