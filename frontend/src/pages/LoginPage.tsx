import { usePageTitle } from '../hooks/usePageTitle'
import { setApiFieldErrors } from '../utils/formErrors'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { authApi } from '../api/authApi'
import { useAuthStore } from '../stores/authStore'
import { apiErrorMessage } from '../utils/apiError'
import type { LoginRequest } from '../types'

const inputClass =
  'mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'

export default function LoginPage() {
  usePageTitle('Log in')
  const navigate = useNavigate()
  const location = useLocation()
  const token = useAuthStore(s => s.token)
  const setAuth = useAuthStore((s) => s.setAuth)
  const [serverError, setServerError] = useState<string | null>(null)
  const {
    register,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginRequest>()

  const onSubmit = async (values: LoginRequest) => {
    setServerError(null)
    try {
      const { token, user } = await authApi.login(values)
      setAuth(token, user)
      navigate(typeof location.state?.from === 'string' && location.state.from.startsWith('/') && !location.state.from.startsWith('//') ? location.state.from : '/dashboard', { replace: true })
    } catch (e) {
      setApiFieldErrors(e, setError)
      setServerError(apiErrorMessage(e, 'Invalid email or password.'))
    }
  }

  if (token) return <Navigate to="/dashboard" replace />

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900">Log in</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-6 space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
        noValidate
      >
        {serverError && (
          <p aria-live="polite" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{serverError}</p>
        )}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input id="email"
            type="email"
            className={inputClass}
            {...register('email', {
              required: 'Email is required',
              maxLength: { value: 255, message: 'At most 255 characters' },
              setValueAs: (v: string) => v.trim(),
              pattern: { value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/, message: 'Enter a valid email' },
            })}
          />
          {errors.email && <p aria-live="polite" className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
          <input id="password"
            type="password"
            className={inputClass}
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 8, message: 'At least 8 characters' },
              maxLength: { value: 72, message: 'At most 72 characters' },
            })}
          />
          {errors.password && (
            <p aria-live="polite" className="mt-1 text-xs text-red-600">{errors.password.message}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {isSubmitting ? 'Logging in…' : 'Log in'}
        </button>
        <p className="text-center text-sm text-gray-600">
          No account?{' '}
          <Link to="/register" className="text-indigo-600 hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  )
}
