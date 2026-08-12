import api from './axiosInstance'
import type { Application, ApplicationStatus } from '../types'

export const applicationsApi = {
  apply: async (jobId: number | string, coverLetter?: string): Promise<Application> => {
    const { data } = await api.post<Application>(`/jobs/${jobId}/apply`, { coverLetter })
    return data
  },
  getMine: async (): Promise<Application[]> => {
    const { data } = await api.get<Application[]>('/applications/mine')
    return data
  },
  getForJob: async (jobId: number | string): Promise<Application[]> => {
    const { data } = await api.get<Application[]>(`/jobs/${jobId}/applications`)
    return data
  },
  updateStatus: async (
    applicationId: number | string,
    status: ApplicationStatus,
  ): Promise<Application> => {
    const { data } = await api.put<Application>(`/applications/${applicationId}/status`, { status })
    return data
  },
}
