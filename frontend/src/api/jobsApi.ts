import api from './axiosInstance'
import type { Job, JobFilters, JobRequest, PageResponse } from '../types'

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
  getMy: async (params: { page?: number; size?: number } = {}): Promise<PageResponse<Job>> => {
    const { data } = await api.get<PageResponse<Job>>('/jobs/my', {
      params: { page: params.page ?? 0, size: params.size ?? 10 },
    })
    return data
  },
  create: async (payload: JobRequest): Promise<Job> => {
    const { data } = await api.post<Job>('/jobs', payload)
    return data
  },
  update: async (id: number | string, payload: JobRequest): Promise<Job> => {
    const { data } = await api.put<Job>(`/jobs/${id}`, payload)
    return data
  },
  deactivate: async (id: number | string): Promise<void> => {
    await api.delete(`/jobs/${id}`)
  },
}
