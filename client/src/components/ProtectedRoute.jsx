import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'

function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) return <main className="page-shell"><div className="state">Restoring your session...</div></main>
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />

  return children
}

export default ProtectedRoute