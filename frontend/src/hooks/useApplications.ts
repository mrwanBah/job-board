import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { applicationsApi } from '../api/applicationsApi'
import { apiErrorMessage } from '../utils/apiError'
import type { ApplicationStatus } from '../types'

export function useMyApplications() {
  return useQuery({
    queryKey: ['my-applications'],
    queryFn: () => applicationsApi.getMine(),
  })
}

export function useJobApplications(jobId: string | number | undefined) {
  return useQuery({
    queryKey: ['job-applications', jobId],
    queryFn: () => applicationsApi.getForJob(jobId!),
    enabled: jobId != null && jobId !== '',
  })
}

export function useApplyToJob(jobId: string | number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (coverLetter?: string) => applicationsApi.apply(jobId, coverLetter),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-applications'] })
      qc.invalidateQueries({ queryKey: ['my-application'] })
      toast.success('Application submitted!')
    },
    onError: (e) => toast.error(apiErrorMessage(e)),
  })
}

export function useUpdateApplicationStatus(jobId?: string | number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: number | string; status: ApplicationStatus }) =>
      applicationsApi.updateStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['job-applications', jobId] })
      qc.invalidateQueries({ queryKey: ['job-applications'] })
      toast.success('Status updated.')
    },
    onError: (e) => toast.error(apiErrorMessage(e)),
  })
}
