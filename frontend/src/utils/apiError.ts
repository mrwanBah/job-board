import axios from 'axios'

// Extract a human-readable message from a failed API call (backend ErrorResponse
// or an Axios/network error), for use in toasts and inline error UI.
export function apiErrorMessage(
  error: unknown,
  fallback = 'Something went wrong. Please try again.',
): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string; error?: string; errors?: Record<string, string> } | undefined
    if (data?.errors && Object.keys(data.errors).length) return Object.values(data.errors).join(' · ')
    if (data?.message) return data.message
    if (data?.error) return data.error
    if (error.response?.status === 403) return 'You do not have permission to do that.'
    if (error.response?.status === 401) return 'Please log in to continue.'
    if (!error.response) return 'Cannot reach the server. Is the API running?'
  }
  return fallback
}
