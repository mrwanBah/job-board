import type { JobType } from '../types'
import { JOB_TYPE_LABELS } from '../utils/jobTypes'

interface FilterBarProps {
  search: string
  jobType: JobType | ''
  onSearchChange: (value: string) => void
  onJobTypeChange: (value: JobType | '') => void
}

const inputClass =
  'rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'

export default function FilterBar({
  search,
  jobType,
  onSearchChange,
  onJobTypeChange,
}: FilterBarProps) {
  return (
    <div className="grid gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:grid-cols-2">
      <input
        className={inputClass}
        placeholder="Search title or keyword"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <select
        className={inputClass}
        value={jobType}
        onChange={(e) => onJobTypeChange(e.target.value as JobType | '')}
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
