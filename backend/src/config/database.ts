import Database from 'better-sqlite3';
import path from 'path';

const db = new Database(path.join(__dirname, '../../data.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS monitors (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    user_id TEXT DEFAULT 'default',
    status TEXT DEFAULT 'pending',
    last_check TEXT,
    last_status TEXT,
    response_time INTEGER,
    uptime_count INTEGER DEFAULT 0,
    downtime_count INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    telegram_chat_id TEXT
  );

  CREATE TABLE IF NOT EXISTS incidents (
    id TEXT PRIMARY KEY,
    monitor_id TEXT NOT NULL,
    type TEXT NOT NULL,
    message TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    resolved_at TEXT,
    FOREIGN KEY (monitor_id) REFERENCES monitors(id)
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );
`);

export default db;