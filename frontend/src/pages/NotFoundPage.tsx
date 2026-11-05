import { usePageTitle } from '../hooks/usePageTitle'
import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  usePageTitle('Page not found')
  return (
    <div className="mx-auto max-w-md px-4 py-16 text-center">
      <h1 className="text-3xl font-bold text-gray-900">404</h1>
      <p className="mt-2 text-gray-600">This page doesn’t exist.</p>
      <Link
        to="/"
        className="mt-4 inline-block text-sm font-medium text-indigo-600 hover:underline"
      >
        Back to jobs
      </Link>
    </div>
  )
}
