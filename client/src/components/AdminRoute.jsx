import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'

function AdminRoute({ children }) {
  const { user, isLoading } = useAuth()
  if (isLoading) return <main className="page-shell"><div className="state">Checking permissions...</div></main>
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'admin') return <Navigate to="/account" replace />
  return children
}

export default AdminRoute