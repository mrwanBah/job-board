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
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const { data: job } = useJob(isEdit ? id : undefined)
  const createJob = useCreateJob()
  const updateJob = useUpdateJob(id ?? '')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
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
        expiresAt: '',
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
    if (isEdit) updateJob.mutate(payload, { onSuccess })
    else createJob.mutate(payload, { onSuccess })
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'Edit job' : 'Post a job'}</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-6 space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
        noValidate
      >
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input className={inputClass} {...register('title', { required: 'Title is required' })} />
          {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            rows={6}
            className={inputClass}
            {...register('description', { required: 'Description is required' })}
          />
          {errors.description && (
            <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input className={inputClass} {...register('location')} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Job type</label>
            <select className={inputClass} {...register('jobType', { required: true })}>
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
            <label className="block text-sm font-medium text-gray-700">Salary min</label>
            <input
              type="number"
              className={inputClass}
              {...register('salaryMin', { valueAsNumber: true })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Salary max</label>
            <input
              type="number"
              className={inputClass}
              {...register('salaryMax', { valueAsNumber: true })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Expires</label>
            <input type="date" className={inputClass} {...register('expiresAt')} />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
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
