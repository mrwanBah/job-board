import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { jobsApi } from '../api/jobsApi'
import type { JobFilters } from '../types'

export function useJobs(filters: JobFilters = {}) {
  return useQuery({
    queryKey: ['jobs', filters],
    queryFn: () => jobsApi.getAll(filters),
    placeholderData: keepPreviousData,
  })
}

export function useJob(id: number | string | undefined) {
  return useQuery({
    queryKey: ['job', id],
    queryFn: () => jobsApi.getById(id!),
    enabled: id != null && id !== '',
  })
}
