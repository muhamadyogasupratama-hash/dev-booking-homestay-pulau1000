require('dotenv').config();

const shared = {
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'DBHomestay',
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 5432),
  dialect: 'postgres',
};

module.exports = {
  development: { ...shared },
  test: { ...shared, database: process.env.DB_TEST_NAME || 'DBHomestay_test' },
  production: {
    ...shared,
    ...(process.env.DATABASE_URL ? { use_env_variable: 'DATABASE_URL' } : {}),
  },
};
