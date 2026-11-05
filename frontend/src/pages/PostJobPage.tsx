import { usePageTitle } from '../hooks/usePageTitle'
import { useQuery } from '@tanstack/react-query'
import api from '../api/axiosInstance'
import type { Company } from '../types'
import { today } from '../utils/jobs'
import { setApiFieldErrors } from '../utils/formErrors'
import Spinner from '../components/Spinner'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useCreateJob, useJob, useUpdateJob } from '../hooks/useJobs'
import { JOB_TYPE_LABELS } from '../utils/jobTypes'
import type { JobRequest, JobType } from '../types'

interface JobFormValues {
  title: string
  description: string
  location: string
  jobType: JobType
  salaryMin?: number
  salaryMax?: number
  expiresAt?: string
}

const inputClass =
  'mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'

export default function PostJobPage() {
  usePageTitle('Manage job')
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const { data: job, isPending: jobPending, isError: jobError } = useJob(isEdit ? id : undefined)
  const company = useQuery({ queryKey: ['company-me'], queryFn: async () => (await api.get<Company>('/companies/me')).data, enabled: isEdit })
  const createJob = useCreateJob()
  const updateJob = useUpdateJob(id ?? '')

  const {
    register,
    setError,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<JobFormValues>({ defaultValues: { jobType: 'FULL_TIME' } })

  useEffect(() => {
    if (job) {
      reset({
        title: job.title,
        description: job.description,
        location: job.location ?? '',
        jobType: job.jobType,
        salaryMin: job.salaryMin ?? undefined,
        salaryMax: job.salaryMax ?? undefined,
        expiresAt: job.expiresAt?.slice(0, 10) ?? '',
      })
    }
  }, [job, reset])

  const onSubmit = (values: JobFormValues) => {
    const payload: JobRequest = {
      title: values.title,
      description: values.description,
      location: values.location || undefined,
      jobType: values.jobType,
      salaryMin: Number.isFinite(values.salaryMin) ? values.salaryMin : null,
      salaryMax: Number.isFinite(values.salaryMax) ? values.salaryMax : null,
      expiresAt: values.expiresAt || null,
    }
    const onSuccess = () => {
      toast.success(isEdit ? 'Job updated.' : 'Job posted.')
      navigate('/dashboard/jobs')
    }
    if (isEdit) updateJob.mutate(payload, { onSuccess, onError: e => setApiFieldErrors(e, setError) })
    else createJob.mutate(payload, { onSuccess, onError: e => setApiFieldErrors(e, setError) })
  }

  if (isEdit && (jobPending || company.isPending)) return <Spinner label="Loading job…" />
  if (isEdit && (jobError || company.isError || !job || job.company.id !== company.data?.id)) return <p role="alert">This job is unavailable or you do not have permission to edit it.</p>
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'Edit job' : 'Post a job'}</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-6 space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
        noValidate
      >
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
          <input id="title" className={inputClass} {...register('title', { required: 'Title is required', maxLength: { value: 255, message: 'At most 255 characters' }, validate: v => Boolean(v.trim()) || 'Title is required' })} />
          {errors.title && <p aria-live="polite" className="mt-1 text-xs text-red-600">{errors.title.message}</p>}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea id="description"
            rows={6}
            className={inputClass}
            {...register('description', { required: 'Description is required', maxLength: { value: 10000, message: 'At most 10000 characters' }, validate: v => Boolean(v.trim()) || 'Description is required' })}
          />
          {errors.description && (
            <p aria-live="polite" className="mt-1 text-xs text-red-600">{errors.description.message}</p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
            <input id="location" className={inputClass} {...register('location', { maxLength: { value: 255, message: 'At most 255 characters' } })} />
          </div>
          <div>
            <label htmlFor="jobType" className="block text-sm font-medium text-gray-700">Job type</label>
            <select id="jobType" className={inputClass} {...register('jobType', { required: true })}>
              {(Object.keys(JOB_TYPE_LABELS) as JobType[]).map((t) => (
                <option key={t} value={t}>
                  {JOB_TYPE_LABELS[t]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="salaryMin" className="block text-sm font-medium text-gray-700">Salary min</label>
            <input id="salaryMin"
              type="number"
              className={inputClass}
              {...register('salaryMin', { valueAsNumber: true, validate: v => v == null || Number.isNaN(v) || (v >= 0 && v <= 99999999.99 && Math.abs(v * 100 - Math.round(v * 100)) < 0.00001) || 'Use a nonnegative amount with at most two decimals' })}
            />
          </div>
          <div>
            <label htmlFor="salaryMax" className="block text-sm font-medium text-gray-700">Salary max</label>
            <input id="salaryMax"
              type="number"
              className={inputClass}
              {...register('salaryMax', { valueAsNumber: true, validate: (v, values) => v == null || Number.isNaN(v) || (v >= 0 && v <= 99999999.99 && Math.abs(v * 100 - Math.round(v * 100)) < 0.00001 && (!Number.isFinite(values.salaryMin) || v >= values.salaryMin!)) || 'Maximum must be at least minimum, nonnegative and have at most two decimals' })}
            />
          </div>
          <div>
            <label htmlFor="expiresAt" className="block text-sm font-medium text-gray-700">Expires</label>
            <input id="expiresAt" type="date" className={inputClass} {...register('expiresAt', { validate: v => !v || (isEdit && v === job?.expiresAt) || v >= today() || 'Expiry date must not be in the past' })} />
          </div>
        </div>

        <div aria-live="polite" className="text-sm text-red-700">{Object.entries(errors).filter(([key]) => !['title', 'description'].includes(key)).map(([key, value]) => <p key={key}>{value?.message}</p>)}</div>
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={createJob.isPending || updateJob.isPending}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {isEdit ? 'Save changes' : 'Post job'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard/jobs')}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
