# Pulau Seribu Stay

Aplikasi booking homestay dengan React client dan REST API Express/Sequelize. Struktur kode mengikuti pemisahan `client/` dan `server/`: antarmuka memakai React, Redux, dan Axios; API server memakai JWT Bearer, middleware otorisasi, PostgreSQL, dan Sequelize.

## Menjalankan aplikasi

1. Salin [`server/.env.example`](./server/.env.example) menjadi `server/.env`, lalu sesuaikan kredensial PostgreSQL dan `JWT_SECRET`.
2. Instal dependency: `npm install`, `npm --prefix server install`, dan `npm --prefix client install`.
3. Migrasikan database dengan `npm run db:migrate`. Untuk database baru, isi data awal dengan `npm run db:seed`.
4. Jalankan `npm run dev` untuk memulai API di `http://localhost:5767` dan client Vite di `http://localhost:5173`.
5. Untuk production, jalankan `npm run build`, lalu `npm start`.

Dokumentasi OpenAPI tersedia di `/api-docs` dan JSON spesifikasinya di `/api-docs.json`. Atur `VITE_API_URL` di client bila API tidak berada pada proxy Vite default.

## Endpoint REST

Selain registrasi, login, dan health check, endpoint memerlukan header `Authorization: Bearer <access_token>`. Mutasi homestay hanya tersedia untuk admin. JWT dicabut saat logout melalui `tokenVersion` pengguna.

Saat membuat booking, server menghitung booking yang tanggalnya bertabrakan secara transaksional berdasarkan kapasitas `roomAvailable`. Booking yang melewati kapasitas akan ditolak dengan `409`; tanggal yang bersinggungan tepat di hari check-in/check-out berikutnya tetap diperbolehkan. Jika dipilih, amenity disimpan pada booking.

| Method | Endpoint | Fungsi | Otorisasi |
|---|---|---|---|
| `GET` | `/api/health` | Status API | Publik |
| `POST` | `/api/users/register` | Registrasi dan membuat profil | Publik |
| `POST` | `/api/users/login` | Login dan menerima JWT | Publik |
| `GET` | `/api/users/me` | Identitas pengguna aktif | Login |
| `POST` | `/api/users/logout` | Logout dan mencabut token | Login |
| `GET` | `/api/homestays` | Daftar homestay | Login |
| `GET` | `/api/homestays/:id` | Detail homestay | Login |
| `POST` | `/api/homestays` | Membuat homestay | Admin |
| `PUT` / `PATCH` | `/api/homestays/:id` | Memperbarui homestay | Admin |
| `DELETE` | `/api/homestays/:id` | Menghapus homestay | Admin |
| `GET` | `/api/amenities` | Daftar amenity booking | Login |
| `GET` | `/api/bookings` | Riwayat booking (milik sendiri untuk customer) | Login |
| `POST` | `/api/bookings` | Membuat booking | Login |
| `GET` / `PUT` | `/api/profile` | Membaca dan memperbarui profil | Login |

Dataset JSON dan dokumentasi semua record berada di [`server/data/homestays.json`](./server/data/homestays.json) dan [`server/data/homestays.md`](./server/data/homestays.md).
