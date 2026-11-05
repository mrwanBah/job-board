import axios from 'axios'
import type { FieldValues, Path, UseFormSetError } from 'react-hook-form'
export function setApiFieldErrors<T extends FieldValues>(error: unknown, setError: UseFormSetError<T>) {
  if (!axios.isAxiosError(error)) return
  const errors = error.response?.data?.errors as Record<string, string> | undefined
  Object.entries(errors ?? {}).forEach(([field, message]) => setError(field as Path<T>, { type: 'server', message }))
}
