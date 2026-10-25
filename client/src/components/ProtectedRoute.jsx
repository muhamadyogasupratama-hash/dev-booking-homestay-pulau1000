import { Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import AppShell from './AppShell'

export default function ProtectedRoute({ children, admin = false }) {
  const { token, user, loading } = useSelector((state) => state.auth)
  const location = useLocation()
  if (loading) return <main className="main-content"><div className="container">Memuat akun…</div></main>
  if (!token || !user) return <Navigate to="/" replace state={{ from: location.pathname }} />
  if (admin && user.role !== 'admin') return <Navigate to="/homestays" replace />
  return <AppShell>{children}</AppShell>
}
