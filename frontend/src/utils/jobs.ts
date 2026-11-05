import type { Job } from '../types'
export function today() {
  const date = new Date()
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 10)
}
export const isExpired = (job: Job) => Boolean(job.expiresAt && job.expiresAt < today())
export function salaryLabel(job: Job) {
  const fmt = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 })
  const min = job.salaryMin, max = job.salaryMax
  if (min != null && max != null) return fmt.format(min) + '–' + fmt.format(max) + ' SAR'
  if (min != null) return 'From ' + fmt.format(min) + ' SAR'
  if (max != null) return 'Up to ' + fmt.format(max) + ' SAR'
  return null
}
export function safeHttpUrl(value?: string | null) {
  try { const url = new URL(value ?? ''); return ['https:', 'http:'].includes(url.protocol) ? url.href : undefined }
  catch { return undefined }
}
