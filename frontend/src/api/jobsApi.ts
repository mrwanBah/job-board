import api from './axiosInstance'
import type { Job, JobFilters, PageResponse } from '../types'

export const jobsApi = {
  getAll: async (filters: JobFilters = {}): Promise<PageResponse<Job>> => {
    const { data } = await api.get<PageResponse<Job>>('/jobs', {
      params: {
        search: filters.search || undefined,
        jobType: filters.jobType || undefined,
        page: filters.page ?? 0,
        size: filters.size ?? 10,
      },
    })
    return data
  },
  getById: async (id: number | string): Promise<Job> => {
    const { data } = await api.get<Job>(`/jobs/${id}`)
    return data
  },
}
