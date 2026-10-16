import axios from 'axios'

const apiClient = axios.create({
  // In dev the Vite proxy forwards /api to localhost:5000, so a relative path works.
  // Set VITE_API_URL in client/.env for production deploys.
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 8000,
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('instacart_token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export default apiClient