import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { jobsApi } from '../api/jobsApi'
import { apiErrorMessage } from '../utils/apiError'
import type { JobFilters, JobRequest } from '../types'

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

export function useMyJobs(params: { page?: number; size?: number } = {}) {
  return useQuery({
    queryKey: ['my-jobs', params],
    queryFn: () => jobsApi.getMy(params),
    placeholderData: keepPreviousData,
  })
}

export function useCreateJob() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: JobRequest) => jobsApi.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-jobs'] })
      qc.invalidateQueries({ queryKey: ['jobs'] })
    },
    onError: (e) => toast.error(apiErrorMessage(e)),
  })
}

export function useUpdateJob(id: number | string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: JobRequest) => jobsApi.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-jobs'] })
      qc.invalidateQueries({ queryKey: ['job'] })
      qc.invalidateQueries({ queryKey: ['jobs'] })
    },
    onError: (e) => toast.error(apiErrorMessage(e)),
  })
}

export function useDeactivateJob() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number | string) => jobsApi.deactivate(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-jobs'] })
      qc.invalidateQueries({ queryKey: ['jobs'] })
      toast.success('Job deactivated.')
    },
    onError: (e) => toast.error(apiErrorMessage(e)),
  })
}

export function useActivateJob() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: jobsApi.activate, onSuccess: () => { qc.invalidateQueries({queryKey:['my-jobs']}); qc.invalidateQueries({queryKey:['jobs']}); toast.success('Job reactivated.') }, onError: e => toast.error(apiErrorMessage(e)) })
}
