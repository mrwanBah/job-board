import axios from 'axios'
import { useAuthStore } from '../stores/authStore'

const baseURL = `${(import.meta.env.VITE_API_URL ?? 'http://localhost:8080').replace(/\/+$/, '')}/api`

const api = axios.create({ baseURL })

// Attach the JWT from the auth store to every request.
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// On 401, clear auth (auto-logout). Components/routes react to the empty store.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
    }
    return Promise.reject(error)
  },
)

export default api
