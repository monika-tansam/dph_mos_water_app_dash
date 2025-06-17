// db.js
import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'db_dphd',
  password: 'dphdb@123',
  port: 5432
});

export default pool;
