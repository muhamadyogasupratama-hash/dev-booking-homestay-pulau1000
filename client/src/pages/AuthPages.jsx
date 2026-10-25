import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser, registerUser } from '../features/auth/authSlice'

function AuthFrame({ eyebrow, title, description, children }) {
  return <main className="auth-page">
    <section className="auth-visual" aria-label="Tentang Pulau Seribu Stay">
      <Link to="/" className="brand auth-brand"><span className="brand-mark" aria-hidden="true">⌂</span><span>Pulau Seribu Stay</span></Link>
      <div className="auth-message"><p className="eyebrow eyebrow--light">Temukan tempat terbaik</p><h1>Liburan pulau dimulai dari sini.</h1><p>Pilih homestay yang nyaman dan rencanakan waktu istirahatmu dengan lebih mudah.</p></div>
    </section>
    <section className="auth-panel"><div className="auth-card"><div className="form-header"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{description}</p></div>{children}</div></section>
  </main>
}

export function LoginPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { user, error, loading, token } = useSelector((state) => state.auth)
  const [form, setForm] = useState({ email: '', password: '' })
  if (token && user) return <Navigate to={user.role === 'admin' ? '/admin' : '/homestays'} replace />
  if (token && loading && !user) return <main className="auth-page"><section className="auth-panel"><p>Memuat akun…</p></section></main>

  async function submit(event) {
    event.preventDefault()
    const result = await dispatch(loginUser(form))
    if (loginUser.fulfilled.match(result)) {
      const role = result.payload.user.role
      navigate(location.state?.from || (role === 'admin' ? '/admin' : '/homestays'), { replace: true })
    }
  }

  return <AuthFrame eyebrow="Selamat datang" title="Masuk ke akunmu" description="Gunakan email dan password yang telah terdaftar.">
    {error && <div className="alert" role="alert">{error}</div>}
    {location.state?.registered && <div className="alert success-alert" role="status">Akun berhasil dibuat. Silakan masuk.</div>}
    <form onSubmit={submit}>
      <div className="form-group"><label htmlFor="email">Email</label><input id="email" type="email" autoComplete="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
      <div className="form-group"><label htmlFor="password">Password</label><input id="password" type="password" autoComplete="current-password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
      <button className="btn btn-primary btn-block" disabled={loading}>{loading ? 'Memproses…' : 'Masuk'}</button>
    </form>
    <p className="auth-footer">Belum punya akun? <Link to="/users/register">Daftar sekarang</Link></p>
  </AuthFrame>
}

export function RegisterPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)
    const result = await dispatch(registerUser(form))
    if (registerUser.fulfilled.match(result)) {
      navigate('/', { replace: true, state: { registered: true } })
    } else {
      setError(result.payload || 'Registrasi gagal.')
    }
    setLoading(false)
  }

  return <AuthFrame eyebrow="Bergabung" title="Buat akun baru" description="Lengkapi data singkat berikut untuk mulai mencari homestay.">
    {error && <div className="alert" role="alert">{error}</div>}
    <form onSubmit={submit}>
      <div className="form-group"><label htmlFor="name">Nama lengkap</label><input id="name" autoComplete="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
      <div className="form-group"><label htmlFor="email">Email</label><input id="email" type="email" autoComplete="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
      <div className="form-group"><label htmlFor="password">Password</label><input id="password" type="password" autoComplete="new-password" minLength="6" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
      <button className="btn btn-primary btn-block" disabled={loading}>{loading ? 'Memproses…' : 'Buat akun'}</button>
    </form>
    <p className="auth-footer">Sudah punya akun? <Link to="/">Masuk di sini</Link></p>
  </AuthFrame>
}
