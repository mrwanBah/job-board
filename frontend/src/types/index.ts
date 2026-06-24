// Core domain types for the Job Board frontend.
// NOTE: API response shapes are provisional and must be reconciled with
// Marwan's backend contract (Spring Boot). Treat anything below the domain
// models as an assumption until the API is finalized. // CONFIRM W/ MARWAN

export type Role = 'APPLICANT' | 'COMPANY'

export type JobType =
  | 'FULL_TIME'
  | 'PART_TIME'
  | 'CONTRACT'
  | 'INTERNSHIP'
  | 'REMOTE'

export interface User {
  id: string
  email: string
  fullName: string
  role: Role
}

export interface Company {
  id: string
  name: string
  description?: string
  location?: string
  website?: string
}

export interface Job {
  id: string
  title: string
  description: string
  company: Company
  location: string
  jobType: JobType
  salaryMin?: number
  salaryMax?: number
  active: boolean
  createdAt: string
}

export interface JobFilters {
  search?: string
  jobType?: JobType
  location?: string
  page?: number
  pageSize?: number
}

// Generic single-resource envelope. // CONFIRM W/ MARWAN
export interface ApiResponse<T> {
  data: T
  message?: string
}

// Paginated list envelope (mirrors a typical Spring Data Page). // CONFIRM W/ MARWAN
export interface PagedResponse<T> {
  content: T[]
  page: number
  pageSize: number
  totalElements: number
  totalPages: number
}
