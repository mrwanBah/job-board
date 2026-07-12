import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { authApi } from '../api/authApi'
import { useAuthStore } from '../stores/authStore'
import { apiErrorMessage } from '../utils/apiError'
import type { RegisterRequest } from '../types'

const inputClass =
  'mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'

export default function RegisterPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [serverError, setServerError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterRequest>({ defaultValues: { role: 'APPLICANT' } })

  const onSubmit = async (values: RegisterRequest) => {
    setServerError(null)
    try {
      const { token, user } = await authApi.register(values)
      setAuth(token, user)
      navigate('/dashboard')
    } catch (e) {
      setServerError(apiErrorMessage(e, 'Could not create account. Try a different email.'))
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-6 space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
        noValidate
      >
        {serverError && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{serverError}</p>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700">Full name</label>
          <input
            className={inputClass}
            {...register('fullName', { required: 'Full name is required' })}
          />
          {errors.fullName && (
            <p className="mt-1 text-xs text-red-600">{errors.fullName.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            className={inputClass}
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/, message: 'Enter a valid email' },
            })}
          />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            className={inputClass}
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 8, message: 'At least 8 characters' },
            })}
          />
          {errors.password && (
            <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">I am a</label>
          <select className={inputClass} {...register('role', { required: true })}>
            <option value="APPLICANT">Applicant — looking for jobs</option>
            <option value="COMPANY">Company — hiring</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {isSubmitting ? 'Creating account…' : 'Create account'}
        </button>
        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  )
}
