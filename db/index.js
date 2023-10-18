require('dotenv').config();
const { Pool } = require('pg');

if (process.env.NODE_ENV === 'test') {
  process.env.PGDATABASE = process.env.PGDATABASE + '_test';
}

const db = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT
});

module.exports = db;