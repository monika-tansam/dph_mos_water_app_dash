// db.js
import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',
  host: '192.168.1.206',
  database: 'db_dphd',
  password: 'dphdb@123',
  port: 5432
});

export default pool;
