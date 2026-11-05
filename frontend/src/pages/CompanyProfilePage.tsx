import { usePageTitle } from '../hooks/usePageTitle'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import api from '../api/axiosInstance'
import type { Company } from '../types'
import Spinner from '../components/Spinner'
import { setApiFieldErrors } from '../utils/formErrors'
import { apiErrorMessage } from '../utils/apiError'
import { safeHttpUrl } from '../utils/jobs'
type Values = Omit<Company, 'id'>
export default function CompanyProfilePage() {
  usePageTitle('Company profile')
  const client = useQueryClient()
  const query = useQuery({queryKey:['company-me'], queryFn:async () => (await api.get<Company>('/companies/me')).data})
  const { register, reset, handleSubmit, setError, formState:{errors} } = useForm<Values>()
  useEffect(() => { if (query.data) reset(query.data) }, [query.data, reset])
  const save = useMutation({ mutationFn:async (values:Values) => (await api.put<Company>('/companies/me',values)).data, onSuccess:() => { client.invalidateQueries({queryKey:['company-me']}); client.invalidateQueries({queryKey:['jobs']}); client.invalidateQueries({queryKey:['job']}); toast.success('Company profile saved.') }, onError:e => { setApiFieldErrors(e,setError); toast.error(apiErrorMessage(e)) } })
  if(query.isPending) return <Spinner label="Loading company profile…" />
  if(query.isError) return <p role="alert">Could not load your profile. <button onClick={() => query.refetch()}>Retry</button></p>
  return <div className="max-w-2xl"><h1 className="text-2xl font-bold">Company profile</h1><form noValidate onSubmit={handleSubmit(v => save.mutate(v))} className="mt-6 space-y-4 rounded-lg border bg-white p-6">
    {(['name','description','website','logoUrl','location'] as const).map(field => <div key={field}><label htmlFor={field} className="block text-sm font-medium">{{name:'Company name',description:'Description',website:'Website',logoUrl:'Logo URL',location:'Location'}[field]}</label><input id={field} className="mt-1 w-full rounded-md border p-2" {...register(field, {required:field === 'name' ? 'Company name is required' : false, maxLength:{value:field === 'description' ? 5000 : field === 'logoUrl' ? 500 : 255,message:'Value is too long'}, validate:v => !['website','logoUrl'].includes(field) || !v || Boolean(safeHttpUrl(v)) || 'Enter a valid http/https URL'})} /><p aria-live="polite" className="text-sm text-red-700">{errors[field]?.message}</p></div>)}
    <button disabled={save.isPending} className="rounded-md bg-indigo-600 px-4 py-2 text-white disabled:opacity-50">{save.isPending?'Saving…':'Save profile'}</button>
  </form></div>
}
