import type { Job } from '../types'

// Temporary mock data for Week 1 static UI. Replaced by the real API in Week 2.
export const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Frontend Developer',
    description:
      'Build modern, responsive interfaces in React + TypeScript with Tailwind CSS. Work closely with backend and design.',
    company: { id: 'c1', name: 'Acme Corp', location: 'Riyadh' },
    location: 'Riyadh',
    jobType: 'FULL_TIME',
    salaryMin: 8000,
    salaryMax: 14000,
    active: true,
    createdAt: '2026-06-01T09:00:00Z',
  },
  {
    id: '2',
    title: 'Backend Engineer (Java/Spring)',
    description:
      'Design and ship REST APIs with Spring Boot and MySQL. Own services end to end including testing and deployment.',
    company: { id: 'c2', name: 'Cloudline', location: 'Remote' },
    location: 'Remote',
    jobType: 'REMOTE',
    salaryMin: 12000,
    salaryMax: 20000,
    active: true,
    createdAt: '2026-06-03T12:30:00Z',
  },
  {
    id: '3',
    title: 'UI/UX Design Intern',
    description:
      'Support the product team with wireframes, prototypes, and design-system work. Great for students.',
    company: { id: 'c3', name: 'Pixela Studio', location: 'Jeddah' },
    location: 'Jeddah',
    jobType: 'INTERNSHIP',
    salaryMin: 3000,
    salaryMax: 4500,
    active: true,
    createdAt: '2026-06-05T08:00:00Z',
  },
  {
    id: '4',
    title: 'DevOps Engineer (Contract)',
    description:
      'Containerize services with Docker, manage CI/CD, and keep the deployment pipeline healthy.',
    company: { id: 'c4', name: 'Nimbus Tech', location: 'Dammam' },
    location: 'Dammam',
    jobType: 'CONTRACT',
    salaryMin: 15000,
    salaryMax: 22000,
    active: true,
    createdAt: '2026-06-08T15:45:00Z',
  },
]
