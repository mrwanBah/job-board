import { useParams } from 'react-router-dom'

export default function JobDetailPage() {
  const { id } = useParams()
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900">Job #{id}</h1>
      <p className="mt-2 text-gray-600">
        Full job details and the Apply flow arrive in Week 2.
      </p>
    </div>
  )
}
