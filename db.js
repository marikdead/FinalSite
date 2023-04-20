const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'site_db',
  password: '5666',
  port: 5432,
});

module.exports = pool;