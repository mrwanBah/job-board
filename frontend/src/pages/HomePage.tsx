import FilterBar from '../components/FilterBar'
import JobCard from '../components/JobCard'
import { mockJobs } from '../utils/mockJobs'

export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900">Find your next role</h1>
      <p className="mt-1 text-gray-600">
        Browse open positions from companies hiring now.
      </p>

      <div className="mt-6">
        <FilterBar />
      </div>

      <div className="mt-6 grid gap-4">
        {mockJobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  )
}
