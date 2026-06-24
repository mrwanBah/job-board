import { useState } from 'react'
import type { JobType } from '../types'
import { JOB_TYPE_LABELS } from '../utils/jobTypes'

// Static for Week 1: holds local state and renders the controls.
// Wiring to the React Query job filters happens in Week 2.
export default function FilterBar() {
  const [search, setSearch] = useState('')
  const [location, setLocation] = useState('')
  const [jobType, setJobType] = useState<JobType | ''>('')

  const inputClass =
    'rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'

  return (
    <div className="grid gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:grid-cols-3">
      <input
        className={inputClass}
        placeholder="Search title or keyword"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <input
        className={inputClass}
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <select
        className={inputClass}
        value={jobType}
        onChange={(e) => setJobType(e.target.value as JobType | '')}
      >
        <option value="">All job types</option>
        {(Object.keys(JOB_TYPE_LABELS) as JobType[]).map((type) => (
          <option key={type} value={type}>
            {JOB_TYPE_LABELS[type]}
          </option>
        ))}
      </select>
    </div>
  )
}
