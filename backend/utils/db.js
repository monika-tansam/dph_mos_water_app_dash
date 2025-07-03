// utils/db.js
import Database from 'better-sqlite3';

const db = new Database('data.db');

// JavaScript comment – okay here
db.exec(`
  CREATE TABLE IF NOT EXISTS district_table (
    district_code TEXT PRIMARY KEY,
    district_name TEXT UNIQUE
  );

-- Fix foreign key reference
  CREATE TABLE IF NOT EXISTS district_officer_table (
    user_id TEXT PRIMARY KEY,
    username TEXT,
    password TEXT,
    district_code TEXT,
    district_name TEXT,
    phone_number TEXT,
    status TEXT,
    FOREIGN KEY (district_code) REFERENCES mosquito_district_master(district_code)
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

  CREATE TABLE IF NOT EXISTS chlorination_hub_users (
    user_id TEXT PRIMARY KEY,
    username TEXT UNIQUE,
    email TEXT,
    hashedPassword TEXT,
    hub_id TEXT,
    hub_name TEXT,           
    phone_number TEXT,
    address TEXT,
    status TEXT,
    role TEXT,
    module TEXT
  );

  CREATE TABLE IF NOT EXISTS chlorination_inspection_testers (
    tester_id TEXT PRIMARY KEY,
    tester_name TEXT,
    hub_id TEXT,
    FOREIGN KEY (hub_id) REFERENCES chlorination_users(hub_id)
  );

  -- Master table for chlorination data (HUB centre and District)
  CREATE TABLE IF NOT EXISTS chlorination_hubs (
    hub_id TEXT PRIMARY KEY,
    hub_name TEXT UNIQUE
  );

  CREATE TABLE IF NOT EXISTS chlorination_districts (
    district_code TEXT PRIMARY KEY,
    district_name TEXT UNIQUE,
    hub_id TEXT,
    FOREIGN KEY (hub_id) REFERENCES chlorination_hubs(hub_id)
  );

  CREATE TABLE IF NOT EXISTS chlorine_data_collection (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ppm REAL NOT NULL,
    image_path TEXT NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    timestamp TEXT NOT NULL,
    hub_id TEXT,
    hub_name TEXT,
    user_id TEXT,
    username TEXT
  );

  CREATE TABLE IF NOT EXISTS mosquito_district_master (
    district_code TEXT PRIMARY KEY,
    district_name TEXT UNIQUE
  );

  CREATE TABLE IF NOT EXISTS corporation_master (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    hub_id TEXT NOT NULL,
    hub_name TEXT NOT NULL,
    district_id TEXT NOT NULL,
    district_name TEXT NOT NULL,
    corporation_name TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS chlorination_municipality_master (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  hub_id TEXT NOT NULL,
  hub_name TEXT NOT NULL,
  district_name TEXT NOT NULL,
  municipality_name TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS chlorination_townpanchayat_master (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  hub_id TEXT NOT NULL,
  hub_name TEXT NOT NULL,
  district_name TEXT NOT NULL,
  townpanchayat_name TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS chlorination_government_hospital_master (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  hub_id TEXT NOT NULL,
  hub_name TEXT NOT NULL,
  district_name TEXT NOT NULL,
  hospital_name TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS chlorination_railway_station_master (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  hub_id TEXT NOT NULL,
  hub_name TEXT NOT NULL,
  district_name TEXT NOT NULL,
  station_name TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS chlorination_approved_home_master (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  hub_id TEXT NOT NULL,
  hub_name TEXT NOT NULL,
  district_name TEXT NOT NULL,
  approvedhome_name TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS chlorination_prison_master (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  hub_id TEXT NOT NULL,
  hub_name TEXT NOT NULL,
  district_name TEXT NOT NULL,
  prison_name TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS chlorination_governmentinstitution_master (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    hub_id TEXT NOT NULL,
    hub_name TEXT NOT NULL,
    district_name TEXT NOT NULL,
    institution_name TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS chlorination_educationalinstitution_master (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  hub_id TEXT NOT NULL,
  hub_name TEXT NOT NULL,
  district_name TEXT NOT NULL,
  institution_name TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS chlorination_pwd_master (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  hub_id TEXT NOT NULL,
  hub_name TEXT NOT NULL,
  district_name TEXT NOT NULL,
  pwd_name TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS chlorination_templefestival_master (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  hub_id TEXT NOT NULL,
  hub_name TEXT NOT NULL,
  district_name TEXT NOT NULL,
  temple_name TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);



`);

export default db; 
