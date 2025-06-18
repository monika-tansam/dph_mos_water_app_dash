// utils/db.js
import Database from 'better-sqlite3';

const db = new Database('data.db');

// Create tables if they do not exist
db.exec(`
  CREATE TABLE IF NOT EXISTS district_table (
    district_code TEXT PRIMARY KEY,
    district_name TEXT UNIQUE
  );

  CREATE TABLE IF NOT EXISTS district_officer_table (
    user_id TEXT PRIMARY KEY,
    username TEXT,
    password TEXT,
    district_code TEXT,
    phone_number TEXT,
    address TEXT,
    aadhar_number TEXT,
    status TEXT,
    FOREIGN KEY (district_code) REFERENCES district_table(district_code)
  );

  CREATE TABLE IF NOT EXISTS datacollection (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT,
    username TEXT,
    district_name TEXT,
    geolocation TEXT,
    areaType TEXT,
    date TEXT,
    time TEXT,
    user_geolocation TEXT,
    image_base64 TEXT
  );
`);

export default db;
