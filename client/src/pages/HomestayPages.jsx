import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axiosInstance from '../api/axiosInstance'
import { fetchHomestays, removeHomestay } from '../features/homestays/homestaysSlice'

const rupiah = (amount) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(amount || 0))

function StateMessage({ error, loading }) {
  if (loading) return <section className="card empty-state"><p>Memuat data…</p></section>
  if (error) return <div className="alert" role="alert">{error}</div>
  return null
}

export function HomestayListPage({ admin = false }) {
  const dispatch = useDispatch()
  const { data: items, loading, error } = useSelector((state) => state.homestays)
  const navigate = useNavigate()
  useEffect(() => {
    dispatch(fetchHomestays())
  }, [dispatch])

  async function remove(id) {
    if (!window.confirm('Yakin ingin menghapus data homestay ini?')) return
    try {
      await axiosInstance.delete(`/homestays/${id}`)
      dispatch(removeHomestay(id))
    } catch (e) { window.alert(e.response?.data?.message || 'Homestay gagal dihapus.') }
  }

  return <main className="main-content"><div className="container">
    <header className="page-header"><div><p className="eyebrow">{admin ? 'Dashboard admin' : 'Pilihan menginap'}</p><h1>{admin ? 'Kelola homestay' : 'Temukan homestay yang tepat'}</h1><p className="page-description">{admin ? 'Lihat ketersediaan dan perbarui informasi seluruh homestay.' : 'Jelajahi pilihan homestay nyaman untuk perjalananmu di Pulau Seribu.'}</p></div>{admin && <Link to="/admin/homestays/add" className="btn btn-primary">+ Tambah homestay</Link>}</header>
    <StateMessage loading={loading} error={error} />
    {!loading && !error && !items.length && <section className="card empty-state"><div className="empty-state-icon" aria-hidden="true">⌂</div><h2>{admin ? 'Belum ada data homestay' : 'Belum ada homestay tersedia'}</h2><p>{admin ? 'Tambahkan homestay pertama untuk mulai mengelola daftar.' : 'Silakan kembali lagi nanti untuk melihat pilihan terbaru.'}</p>{admin && <Link to="/admin/homestays/add" className="btn btn-primary">Tambah homestay</Link>}</section>}
    {!loading && !error && admin && Boolean(items.length) && <section className="card table-card table-card-bleed"><div className="table-responsive"><table><thead><tr><th>No.</th><th>Nama homestay</th><th>Harga / malam</th><th>Ketersediaan</th><th>Aksi</th></tr></thead><tbody>{items.map((item, index) => <tr key={item.id}><td>{index + 1}</td><td className="table-primary">{item.name}</td><td>{rupiah(item.pricePerNight)}</td><td><span className="badge">{item.roomAvailable} kamar</span></td><td><div className="table-actions"><button className="btn btn-edit btn-sm" onClick={() => navigate(`/admin/homestays/${item.id}/edit`)}>Edit</button><button className="btn btn-danger btn-sm" onClick={() => remove(item.id)}>Hapus</button></div></td></tr>)}</tbody></table></div></section>}
    {!loading && !error && !admin && Boolean(items.length) && <section className="homestay-grid" aria-label="Daftar homestay tersedia">{items.map((item) => <article className="card stay-card" key={item.id}><img className="stay-card-image" src={item.imageUrl} alt={item.name} loading="lazy" /><div className="stay-card-content"><h2 className="stay-card-title">{item.name}</h2><p className="stay-card-meta">Mulai dari <span className="stay-card-price">{rupiah(item.pricePerNight)}</span> / malam</p><Link to={`/homestays/${item.id}`} className="btn btn-primary btn-block">Lihat detail</Link></div></article>)}</section>}
  </div></main>
}

export function HomestayDetailPage() {
  const { id } = useParams()
  const user = useSelector((state) => state.auth.user)
  const [item, setItem] = useState(null)
  const [error, setError] = useState('')
  useEffect(() => { axiosInstance.get(`/homestays/${id}`).then(({ data }) => setItem(data.data)).catch((e) => setError(e.response?.data?.message || 'Homestay tidak ditemukan.')) }, [id])
  if (error) return <main className="main-content"><div className="container"><div className="alert">{error}</div><Link to="/homestays" className="btn btn-secondary">Kembali ke daftar</Link></div></main>
  if (!item) return <main className="main-content"><div className="container">Memuat homestay…</div></main>
  return <main className="main-content"><div className="container"><article className="card detail-card"><img className="detail-image" src={item.imageUrl} alt={`Foto ${item.name}`} /><div className="detail-content"><p className="eyebrow">Detail homestay</p><h1>{item.name}</h1><p className="detail-lead">Informasi penting sebelum melanjutkan.</p><dl className="detail-list"><div className="detail-row"><dt>Harga per malam</dt><dd className="detail-price">{rupiah(item.pricePerNight)}</dd></div><div className="detail-row"><dt>Kamar tersedia</dt><dd>{item.roomAvailable} kamar</dd></div><div className="detail-row"><dt>Kontak PIC</dt><dd>{item.contactPIC}</dd></div></dl><div className="detail-actions"><Link to={user.role === 'admin' ? '/admin' : '/homestays'} className="btn btn-secondary">Kembali ke daftar</Link>{user.role === 'admin' ? <Link to={`/admin/homestays/${id}/edit`} className="btn btn-edit">Edit homestay</Link> : <Link to={`/homestays/${id}/booking`} className="btn btn-primary">Booking sekarang</Link>}</div></div></article></div></main>
}

export function HomestayFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const editing = Boolean(id)
  const [form, setForm] = useState({ name: '', imageUrl: '', pricePerNight: '', roomAvailable: '', contactPIC: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(editing)
  useEffect(() => {
    if (!editing) return
    axiosInstance.get(`/homestays/${id}`).then(({ data }) => setForm(data.data)).catch((e) => setError(e.response?.data?.message || 'Homestay tidak ditemukan.')).finally(() => setLoading(false))
  }, [editing, id])

  async function submit(event) {
    event.preventDefault()
    setError('')
    try {
      const payload = { ...form, pricePerNight: Number(form.pricePerNight), roomAvailable: Number(form.roomAvailable) }
      if (editing) await axiosInstance.put(`/homestays/${id}`, payload)
      else await axiosInstance.post('/homestays', payload)
      navigate('/admin')
    } catch (e) { setError(e.response?.data?.message || 'Data homestay gagal disimpan.') }
  }

  const field = (key, label, type = 'text', required = true) => <div className={`form-group ${key === 'name' || key === 'imageUrl' || key === 'contactPIC' ? 'form-group--full' : ''}`} key={key}><label htmlFor={key}>{label}{required && <> <span className="required" aria-hidden="true">*</span></>}</label><input id={key} type={type} name={key} min={type === 'number' ? 0 : undefined} required={required} value={form[key] ?? ''} onChange={(e) => setForm({ ...form, [key]: e.target.value })} /></div>
  return <main className="main-content"><div className="container--narrow"><section className="card form-card"><header className="form-header"><p className="eyebrow">{editing ? 'Perbarui data' : 'Data baru'}</p><h1>{editing ? 'Edit homestay' : 'Tambah homestay'}</h1><p>Isi informasi homestay dengan lengkap.</p></header>{error && <div className="alert" role="alert">{error}</div>}{loading ? <p>Memuat homestay…</p> : <form onSubmit={submit}><div className="form-grid">{field('name', 'Nama homestay')}{field('imageUrl', 'URL gambar', 'url')}{field('pricePerNight', 'Harga per malam', 'number')}{field('roomAvailable', 'Kamar tersedia', 'number')}{field('contactPIC', 'Kontak PIC')}</div><div className="form-actions"><Link to="/admin" className="btn btn-secondary">Batal</Link><button type="submit" className="btn btn-primary">{editing ? 'Simpan perubahan' : 'Tambah homestay'}</button></div></form>}</section></div></main>
}

export function BookingPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [homestay, setHomestay] = useState(null)
  const [amenities, setAmenities] = useState([])
  const [form, setForm] = useState({ checkInDate: '', checkOutDate: '', amenityId: '' })
  const [error, setError] = useState('')
  useEffect(() => {
    Promise.all([axiosInstance.get(`/homestays/${id}`), axiosInstance.get('/amenities')]).then(([home, extras]) => { setHomestay(home.data.data); setAmenities(extras.data.data) }).catch((e) => setError(e.response?.data?.message || 'Data booking gagal dimuat.'))
  }, [id])
  async function submit(event) {
    event.preventDefault()
    try { await axiosInstance.post('/bookings', { ...form, HomeStayId: id }); navigate('/homestays') }
    catch (e) { setError(e.response?.data?.message || 'Booking gagal dibuat.') }
  }
  if (error && !homestay) return <main className="main-content"><div className="container"><div className="alert">{error}</div><Link to={`/homestays/${id}`} className="btn btn-secondary">Kembali ke homestay</Link></div></main>
  return <main className="main-content"><div className="container--narrow"><section className="card form-card"><header className="form-header"><p className="eyebrow">Reservasi homestay</p><h1>Atur jadwal menginap</h1><p>Lengkapi booking untuk <strong>{homestay?.name || 'homestay'}</strong>.</p></header>{error && <div className="alert">{error}</div>}<form onSubmit={submit}><div className="form-grid"><div className="form-group"><label htmlFor="checkInDate">Tanggal check-in <span className="required">*</span></label><input id="checkInDate" type="date" required value={form.checkInDate} onChange={(e) => setForm({ ...form, checkInDate: e.target.value })} /></div><div className="form-group"><label htmlFor="checkOutDate">Tanggal check-out <span className="required">*</span></label><input id="checkOutDate" type="date" required value={form.checkOutDate} onChange={(e) => setForm({ ...form, checkOutDate: e.target.value })} /></div><div className="form-group form-group--full"><label htmlFor="amenityId">Amenity</label><select id="amenityId" value={form.amenityId} onChange={(e) => setForm({ ...form, amenityId: e.target.value })}><option value="">Pilih amenity</option>{amenities.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></div></div><div className="form-actions"><Link to={`/homestays/${id}`} className="btn btn-secondary">Batal</Link><button type="submit" className="btn btn-primary">Konfirmasi booking</button></div></form></section></div></main>
}
