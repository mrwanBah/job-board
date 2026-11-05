import { useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { authApi } from '../api/authApi'
import { useAuthStore } from '../stores/authStore'
import Spinner from './Spinner'
export default function AuthGate({ children }: { children: React.ReactNode }) {
  const token = useAuthStore(s => s.token)
  const client = useQueryClient()
  const result = useQuery({ queryKey: ['session', token], queryFn: authApi.getMe, enabled: Boolean(token), retry: false, staleTime: Infinity })
  useEffect(() => {
    if (result.data && token) useAuthStore.getState().setAuth(token, result.data)
  }, [result.data, token])
  useEffect(() => { client.removeQueries({ predicate: q => ['my-jobs', 'my-applications', 'job-applications', 'my-application', 'company-me'].includes(String(q.queryKey[0])) }) }, [token, client])
  if (token && result.isPending) return <Spinner label="Checking your session…" />
  if (token && result.isError) return <div role="alert" className="p-8 text-center">Could not validate your session. <button onClick={() => result.refetch()}>Retry</button> <button onClick={() => useAuthStore.getState().logout()}>Log out</button></div>
  return children
}
