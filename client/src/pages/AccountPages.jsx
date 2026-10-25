import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axiosInstance from '../api/axiosInstance'

export function ProfilePage() {
  const [form, setForm] = useState({ name: '', noHp: '', profilePicture: '' })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  useEffect(() => { axiosInstance.get('/profile').then(({ data }) => setForm({ name: data.data.name || '', noHp: data.data.noHp || '', profilePicture: data.data.profilePicture || '' })).catch((e) => setError(e.response?.data?.message || 'Profil gagal dimuat.')).finally(() => setLoading(false)) }, [])
  async function submit(event) {
    event.preventDefault(); setError(''); setMessage('')
    try { await axiosInstance.put('/profile', form); setMessage('Profil berhasil diperbarui.') }
    catch (e) { setError(e.response?.data?.message || 'Profil gagal diperbarui.') }
  }
  return <main className="main-content"><div className="container--narrow"><section className="card form-card"><header className="form-header"><p className="eyebrow">Akun</p><h1>Profil Saya</h1><p>Perbarui informasi kontak akunmu.</p></header>{loading ? <p>Memuat profil…</p> : <form onSubmit={submit}>{error && <div className="alert" role="alert">{error}</div>}{message && <div className="alert success-alert" role="status">{message}</div>}<div className="form-grid"><div className="form-group form-group--full"><label htmlFor="name">Nama lengkap</label><input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div><div className="form-group form-group--full"><label htmlFor="noHp">Nomor telepon</label><input id="noHp" value={form.noHp} onChange={(e) => setForm({ ...form, noHp: e.target.value })} /></div><div className="form-group form-group--full"><label htmlFor="profilePicture">URL foto profil</label><input id="profilePicture" type="url" value={form.profilePicture} onChange={(e) => setForm({ ...form, profilePicture: e.target.value })} /></div></div><div className="form-actions"><button type="submit" className="btn btn-primary">Simpan profil</button></div></form>}</section></div></main>
}

export function BookingsPage() {
  const [items, setItems] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  useEffect(() => { axiosInstance.get('/bookings').then(({ data }) => setItems(data.data)).catch((e) => setError(e.response?.data?.message || 'Riwayat booking gagal dimuat.')).finally(() => setLoading(false)) }, [])
  const date = (value) => value ? new Date(value).toLocaleDateString('id-ID', { dateStyle: 'medium' }) : '-'
  return <main className="main-content"><div className="container"><header className="page-header"><div><p className="eyebrow">Reservasi</p><h1>Booking Saya</h1><p className="page-description">Riwayat booking homestay milikmu.</p></div></header>{error && <div className="alert">{error}</div>}{loading && <p>Memuat booking…</p>}{!loading && !error && !items.length && <section className="card empty-state"><h2>Belum ada booking</h2><p>Pilih homestay untuk membuat reservasi.</p><Link to="/homestays" className="btn btn-primary">Cari homestay</Link></section>}{!loading && Boolean(items.length) && <section className="card table-card table-card-bleed"><div className="table-responsive"><table><thead><tr><th>Homestay</th><th>Check-in</th><th>Check-out</th><th>Amenity</th><th>Status</th></tr></thead><tbody>{items.map((item) => <tr key={item.id}><td className="table-primary">{item.Homestay?.name || `Homestay #${item.HomeStayId}`}</td><td>{date(item.checkInDate)}</td><td>{date(item.checkOutDate)}</td><td>{item.Amnesty?.name || '—'}</td><td><span className="badge">Tercatat</span></td></tr>)}</tbody></table></div></section>}</div></main>
}
