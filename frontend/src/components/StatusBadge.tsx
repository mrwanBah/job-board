import type { ApplicationStatus } from '../types'

const STYLES: Record<ApplicationStatus, string> = {
  PENDING: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  REVIEWED: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  ACCEPTED: 'bg-green-50 text-green-700 ring-green-600/20',
  REJECTED: 'bg-red-50 text-red-700 ring-red-600/20',
}

const LABELS: Record<ApplicationStatus, string> = {
  PENDING: 'Pending',
  REVIEWED: 'Reviewed',
  ACCEPTED: 'Accepted',
  REJECTED: 'Rejected',
}

export default function StatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${STYLES[status]}`}
    >
      {LABELS[status]}
    </span>
  )
}
