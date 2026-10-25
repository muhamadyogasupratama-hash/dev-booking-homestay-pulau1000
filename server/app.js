if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET must be configured in production.');
}

const cors = require('cors');
const express = require('express');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const apiRouter = require('./routes/apiRouter');
const errorHandler = require('./middlewares/errorHandler');
const { openapiSpec } = require('./docs/openapi');

const app = express();
const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173,http://127.0.0.1:5173')
  .split(',').map((origin) => origin.trim()).filter(Boolean);

app.disable('x-powered-by');
app.use(cors({ origin: (origin, callback) => callback(null, !origin || allowedOrigins.includes(origin)) }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '1mb' }));
app.get('/api-docs.json', (_req, res) => res.json(openapiSpec));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));
app.use('/api', apiRouter);

const clientDist = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientDist));
app.get(/^(?!\/api(?:\/|$)).*/, (req, res) => {
  if (path.extname(req.path)) return res.status(404).json({ message: 'File tidak ditemukan.' });
  res.sendFile(path.join(clientDist, 'index.html'), (error) => {
    if (error) res.status(404).json({ message: 'Client belum dibuild. Jalankan npm run dev untuk development.' });
  });
});

app.use((_req, _res, next) => next({ name: 'NotFound' }));
app.use(errorHandler);

module.exports = app;
