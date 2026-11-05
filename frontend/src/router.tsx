import CompanyProfilePage from './pages/CompanyProfilePage'
import { createBrowserRouter } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import RoleRoute from './components/RoleRoute'
import DashboardLayout from './components/DashboardLayout'
import HomePage from './pages/HomePage'
import JobDetailPage from './pages/JobDetailPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import MyJobsPage from './pages/MyJobsPage'
import PostJobPage from './pages/PostJobPage'
import ApplicationsPage from './pages/ApplicationsPage'
import MyApplicationsPage from './pages/MyApplicationsPage'
import NotFoundPage from './pages/NotFoundPage'

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/jobs/:id', element: <JobDetailPage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: '/dashboard', element: <DashboardPage /> },
          {
            element: <RoleRoute allow={['COMPANY']} />,
            children: [
              { path: '/dashboard/company', element: <CompanyProfilePage /> },
              { path: '/dashboard/jobs', element: <MyJobsPage /> },
              { path: '/dashboard/jobs/new', element: <PostJobPage /> },
              { path: '/dashboard/jobs/:id/edit', element: <PostJobPage /> },
              { path: '/dashboard/jobs/:id/applications', element: <ApplicationsPage /> },
            ],
          },
          {
            element: <RoleRoute allow={['APPLICANT']} />,
            children: [{ path: '/dashboard/applications', element: <MyApplicationsPage /> }],
          },
        ],
      },
    ],
  },
])
