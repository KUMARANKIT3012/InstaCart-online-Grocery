import { useEffect, useState } from 'react'
import apiClient from '../api/client.js'
import { AuthContext, tokenKey } from './auth-context.js'

function saveSession({ token, user }) {
  localStorage.setItem(tokenKey, token)
  return user
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(() => Boolean(localStorage.getItem(tokenKey)))

  useEffect(() => {
    const token = localStorage.getItem(tokenKey)

    if (!token) return

    apiClient.get('/auth/me')
      .then((response) => setUser(response.data.user))
      .catch(() => localStorage.removeItem(tokenKey))
      .finally(() => setIsLoading(false))
  }, [])

  async function login(credentials) {
    const response = await apiClient.post('/auth/login', credentials)
    setUser(saveSession(response.data))
  }

  async function register(details) {
    const response = await apiClient.post('/auth/register', details)
    setUser(saveSession(response.data))
  }

  function logout() {
    localStorage.removeItem(tokenKey)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}