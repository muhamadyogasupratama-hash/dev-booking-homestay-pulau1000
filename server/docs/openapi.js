const openapiSpec = {
  openapi: '3.0.3',
  info: { title: 'Pulau Seribu Stay API', version: '1.0.0', description: 'REST API untuk booking dan pengelolaan homestay.' },
  servers: [{ url: '/api' }],
  components: {
    securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } },
    schemas: {
      Homestay: { type: 'object', properties: { id: { type: 'integer' }, name: { type: 'string' }, imageUrl: { type: 'string' }, pricePerNight: { type: 'integer' }, roomAvailable: { type: 'integer' }, contactPIC: { type: 'string' } } },
      BookingInput: { type: 'object', required: ['HomeStayId', 'checkInDate', 'checkOutDate'], properties: { HomeStayId: { type: 'integer' }, checkInDate: { type: 'string', format: 'date' }, checkOutDate: { type: 'string', format: 'date' }, amenityId: { type: 'integer', nullable: true } } },
      Error: { type: 'object', properties: { message: { type: 'string' } } },
    },
  },
  paths: {
    '/health': { get: { summary: 'Status API', responses: { 200: { description: 'API aktif' } } } },
    '/users/register': { post: { summary: 'Registrasi', responses: { 201: { description: 'Akun dibuat' }, 400: { description: 'Input tidak valid' }, 409: { description: 'Email sudah terdaftar' } } } },
    '/users/login': { post: { summary: 'Login dan memperoleh JWT', responses: { 200: { description: 'Login berhasil' }, 401: { description: 'Kredensial tidak valid' } } } },
    '/users/me': { get: { security: [{ bearerAuth: [] }], summary: 'Akun aktif', responses: { 200: { description: 'Data akun' } } } },
    '/users/logout': { post: { security: [{ bearerAuth: [] }], summary: 'Logout dan mencabut token', responses: { 200: { description: 'Logout berhasil' } } } },
    '/homestays': {
      get: { security: [{ bearerAuth: [] }], summary: 'Daftar homestay', responses: { 200: { description: 'Daftar homestay' } } },
      post: { security: [{ bearerAuth: [] }], summary: 'Tambah homestay (admin)', responses: { 201: { description: 'Homestay dibuat' } } },
    },
    '/homestays/{id}': {
      get: { security: [{ bearerAuth: [] }], summary: 'Detail homestay', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Detail homestay' }, 404: { description: 'Tidak ditemukan' } } },
      put: { security: [{ bearerAuth: [] }], summary: 'Ubah homestay (admin)', responses: { 200: { description: 'Homestay diperbarui' } } },
      delete: { security: [{ bearerAuth: [] }], summary: 'Hapus homestay (admin)', responses: { 204: { description: 'Homestay dihapus' } } },
    },
    '/amenities': { get: { security: [{ bearerAuth: [] }], summary: 'Daftar amenity', responses: { 200: { description: 'Daftar amenity' } } } },
    '/bookings': {
      get: { security: [{ bearerAuth: [] }], summary: 'Riwayat booking akun aktif', responses: { 200: { description: 'Daftar booking' } } },
      post: { security: [{ bearerAuth: [] }], summary: 'Buat booking', requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/BookingInput' } } } }, responses: { 201: { description: 'Booking dibuat' }, 400: { description: 'Input tidak valid' }, 409: { description: 'Kamar penuh pada tanggal tersebut' } } },
    },
    '/profile': {
      get: { security: [{ bearerAuth: [] }], summary: 'Profil akun aktif', responses: { 200: { description: 'Data profil' } } },
      put: { security: [{ bearerAuth: [] }], summary: 'Ubah profil akun aktif', responses: { 200: { description: 'Profil diperbarui' } } },
    },
  },
};

module.exports = { openapiSpec };
