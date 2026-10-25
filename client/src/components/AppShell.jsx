import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logoutUser } from '../features/auth/authSlice'

export default function AppShell({ children }) {
  const user = useSelector((state) => state.auth.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isAdmin = user?.role === 'admin'

  async function logout() {
    await dispatch(logoutUser())
    navigate('/', { replace: true })
  }

  return <div className="site-shell">
    <header className="site-header"><nav className="nav container" aria-label="Navigasi utama">
      <Link to={isAdmin ? '/admin' : '/homestays'} className="brand"><span className="brand-mark" aria-hidden="true">⌂</span><span className="brand-text">Pulau Seribu Stay</span></Link>
      <div className="nav-actions">
        {isAdmin ? <><span className="badge">Admin</span><Link to="/admin" className="nav-link">Homestay</Link></> : <><Link to="/homestays" className="nav-link">Homestay</Link><Link to="/bookings" className="nav-link">Booking Saya</Link></>}
        <Link to="/profile" className="nav-link">Profil Saya</Link>
        <button onClick={logout} className="btn btn-secondary btn-sm">Keluar</button>
      </div>
    </nav></header>
    {children}
    <footer className="site-footer"><div className="container footer-inner"><span>© 2026 Pulau Seribu Stay</span><span>Temukan nyaman di setiap pulau.</span></div></footer>
  </div>
}
