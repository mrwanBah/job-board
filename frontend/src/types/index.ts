// Domain types mirroring the backend DTOs (com.jobboard.dto / com.jobboard.model).
// Kept in sync with the Spring Boot contract on `develop`.

export type Role = 'COMPANY' | 'APPLICANT' | 'ADMIN'

export type JobType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP'

export interface User {
  id: number
  email: string
  fullName: string
  role: Role
}

export interface Company {
  id: number
  name: string
  description?: string | null
  website?: string | null
  logoUrl?: string | null
  location?: string | null
}

export interface Job {
  id: number
  title: string
  description: string
  location: string
  jobType: JobType
  salaryMin?: number | null
  salaryMax?: number | null
  isActive: boolean
  createdAt: string
  company: Company
}

// Mirrors dto/PageResponse<T> (page is 0-based).
export interface PageResponse<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

// Query params accepted by GET /api/jobs.
export interface JobFilters {
  search?: string
  jobType?: JobType
  page?: number
  size?: number
}

// Auth payloads (mirror dto/LoginRequest, RegisterRequest, AuthResponse).
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  fullName: string
  role: Role
}

export interface AuthResponse {
  token: string
  user: User
}
