import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import HomePage from '../pages/HomePage'
import PostJobPage from '../pages/PostJobPage'
import JobDetailPage from '../pages/JobDetailPage'
import { authApi } from '../api/authApi'
import { jobsApi } from '../api/jobsApi'
import { applicationsApi } from '../api/applicationsApi'
import api from '../api/axiosInstance'
import { useAuthStore } from '../stores/authStore'
import type { Job, User } from '../types'

const applicant: User = { id: 1, email: 'user@example.com', fullName: 'Test Applicant', role: 'APPLICANT' }
const job: Job = { id: 7, title: 'Java Developer', description: 'Build APIs', location: null, jobType: 'FULL_TIME', salaryMin: 100, salaryMax: null, isActive: true, expiresAt: '2099-12-31', createdAt: '2026-01-01', company: { id: 2, name: 'Acme' } }

function show(component: React.ReactNode, route = '/') {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
  return render(<QueryClientProvider client={client}><MemoryRouter initialEntries={[route]}><Routes><Route path="*" element={component} /><Route path="/dashboard" element={<p>Dashboard loaded</p>} /><Route path="/dashboard/jobs" element={<p>My listings</p>} /><Route path="/jobs/:id" element={component} /><Route path="/edit/:id" element={component} /></Routes></MemoryRouter></QueryClientProvider>)
}

beforeEach(() => { vi.restoreAllMocks(); useAuthStore.getState().logout() })

describe('authentication forms', () => {
  it('logs in and opens the dashboard', async () => {
    const login = vi.spyOn(authApi, 'login').mockResolvedValue({ token: 'test-token', user: applicant })
    const user = userEvent.setup()
    show(<LoginPage />)
    await user.type(screen.getByLabelText('Email'), applicant.email)
    await user.type(screen.getByLabelText('Password'), 'password123')
    await user.click(screen.getByRole('button', { name: 'Log in' }))
    expect(await screen.findByText('Dashboard loaded')).toBeInTheDocument()
    expect(login).toHaveBeenCalledWith({ email: applicant.email, password: 'password123' })
  })

  it('registers a company and enforces password validation', async () => {
    const register = vi.spyOn(authApi, 'register').mockResolvedValue({ token: 'test-token', user: { ...applicant, role: 'COMPANY' } })
    const user = userEvent.setup()
    show(<RegisterPage />)
    await user.selectOptions(screen.getByLabelText('I am a'), 'COMPANY')
    await user.type(screen.getByLabelText('Company name'), 'Acme')
    await user.type(screen.getByLabelText('Email'), applicant.email)
    await user.type(screen.getByLabelText('Password'), 'short')
    await user.click(screen.getByRole('button', { name: 'Create account' }))
    expect(await screen.findByText('At least 8 characters')).toBeInTheDocument()
    expect(register).not.toHaveBeenCalled()
    await user.clear(screen.getByLabelText('Password'))
    await user.type(screen.getByLabelText('Password'), 'password123')
    await user.click(screen.getByRole('button', { name: 'Create account' }))
    expect(await screen.findByText('Dashboard loaded')).toBeInTheDocument()
    expect(register).toHaveBeenCalledWith(expect.objectContaining({ role: 'COMPANY' }))
  })
})

it('restores URL filters and debounces job search', async () => {
  const getAll = vi.spyOn(jobsApi, 'getAll').mockResolvedValue({ content: [job], page: 0, size: 10, totalElements: 1, totalPages: 1 })
  const user = userEvent.setup()
  show(<HomePage />, '/?search=java&jobType=FULL_TIME')
  expect(await screen.findByText('Java Developer')).toBeInTheDocument()
  expect(screen.getByLabelText('Search jobs')).toHaveValue('java')
  expect(screen.getByLabelText('Job type')).toHaveValue('FULL_TIME')
  await user.clear(screen.getByLabelText('Search jobs'))
  await user.type(screen.getByLabelText('Search jobs'), 'react')
  await waitFor(() => expect(getAll).toHaveBeenLastCalledWith(expect.objectContaining({ search: 'react', jobType: 'FULL_TIME', page: 0 })))
  expect(screen.getByText('1 results')).toBeInTheDocument()
})

it('rejects an invalid salary range before posting', async () => {
  const create = vi.spyOn(jobsApi, 'create').mockResolvedValue(job)
  const user = userEvent.setup()
  show(<PostJobPage />)
  await user.type(screen.getByLabelText('Title'), 'Java Developer')
  await user.type(screen.getByLabelText('Description'), 'Build APIs')
  await user.type(screen.getByLabelText('Salary min'), '200')
  await user.type(screen.getByLabelText('Salary max'), '100')
  await user.click(screen.getByRole('button', { name: 'Post job' }))
  expect(await screen.findByText(/Maximum must be at least minimum/)).toBeInTheDocument()
  expect(create).not.toHaveBeenCalled()
})

it('preserves the expiry date on edit and prevents double submission', async () => {
  vi.spyOn(jobsApi, 'getById').mockResolvedValue(job)
  vi.spyOn(api, 'get').mockResolvedValue({ data: job.company })
  const update = vi.spyOn(jobsApi, 'update').mockImplementation(() => new Promise(() => {}))
  const user = userEvent.setup()
  show(<PostJobPage />, '/edit/7')
  expect(await screen.findByLabelText('Expires')).toHaveValue('2099-12-31')
  await user.click(screen.getByRole('button', { name: 'Save changes' }))
  await waitFor(() => expect(update).toHaveBeenCalledWith('7', expect.objectContaining({ expiresAt: '2099-12-31' })))
  expect(screen.getByRole('button', { name: 'Save changes' })).toBeDisabled()
})

it('submits a cover letter and shows the success state', async () => {
  useAuthStore.getState().setAuth('test-token', applicant)
  vi.spyOn(jobsApi, 'getById').mockResolvedValue(job)
  vi.spyOn(api, 'get').mockResolvedValue({ data: [] })
  const apply = vi.spyOn(applicationsApi, 'apply').mockResolvedValue({ id: 3, job, applicant, status: 'PENDING', appliedAt: '2026-01-01' })
  const user = userEvent.setup()
  show(<JobDetailPage />, '/jobs/7')
  await user.type(await screen.findByLabelText('Cover letter (optional)'), 'I build APIs')
  expect(screen.getByText('12/5000 characters')).toBeInTheDocument()
  await user.click(screen.getByRole('button', { name: 'Apply' }))
  expect(await screen.findByText(/Application submitted/)).toBeInTheDocument()
  expect(apply).toHaveBeenCalledWith('7', 'I build APIs')
  expect(screen.getByText('From 100 SAR')).toBeInTheDocument()
})

it('hides the form for expired jobs and existing applications', async () => {
  useAuthStore.getState().setAuth('test-token', applicant)
  vi.spyOn(jobsApi, 'getById').mockResolvedValue({ ...job, expiresAt: '2000-01-01' })
  show(<JobDetailPage />, '/jobs/7')
  expect(await screen.findByText('No longer accepting applications')).toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'Apply' })).not.toBeInTheDocument()
})

it('shows existing application status instead of another apply form', async () => {
  useAuthStore.getState().setAuth('test-token', applicant)
  vi.spyOn(jobsApi, 'getById').mockResolvedValue(job)
  vi.spyOn(api, 'get').mockResolvedValue({ data: [{ job, status: 'ACCEPTED' }] })
  show(<JobDetailPage />, '/jobs/7')
  expect(await screen.findByText('Application status: ACCEPTED')).toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'Apply' })).not.toBeInTheDocument()
})
