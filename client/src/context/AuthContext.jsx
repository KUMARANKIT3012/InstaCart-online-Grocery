import { useState } from 'react'
import { AuthContext } from './auth-context.js'

const guestUser = {
  id: 1,
  first_name: 'Shopper',
  last_name: '',
  email: 'shopper@instacart.local',
  role: 'user',
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(guestUser)

  async function login() {
    setUser(guestUser)
  }

  async function register() {
    setUser(guestUser)
  }

  function logout() {
    setUser(guestUser)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading: false, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
