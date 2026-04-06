import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(process.cwd(), 'finance.db'));

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('Admin', 'Analyst', 'Viewer')),
    status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'inactive')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    amount REAL NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
    category TEXT NOT NULL,
    date TEXT NOT NULL,
    description TEXT,
    userId INTEGER,
    is_deleted BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS access_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    method TEXT NOT NULL,
    endpoint TEXT NOT NULL,
    ip TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id)
  );
`);

// Seed initial data if empty
const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
if (userCount.count === 0) {
  const insertUser = db.prepare('INSERT INTO users (name, email, role, status) VALUES (?, ?, ?, ?)');
  insertUser.run('Admin User', 'admin@example.com', 'Admin', 'active');
  insertUser.run('Analyst User', 'analyst@example.com', 'Analyst', 'active');
  insertUser.run('Viewer User', 'viewer@example.com', 'Viewer', 'active');

  const insertTransaction = db.prepare('INSERT INTO transactions (amount, type, category, date, description, userId) VALUES (?, ?, ?, ?, ?, ?)');
  insertTransaction.run(5000, 'income', 'Salary', '2026-04-01', 'Monthly Salary', 1);
  insertTransaction.run(1200, 'expense', 'Rent', '2026-04-02', 'Monthly Rent', 1);
  insertTransaction.run(200, 'expense', 'Groceries', '2026-04-03', 'Weekly Groceries', 2);
  insertTransaction.run(150, 'expense', 'Utilities', '2026-04-04', 'Electricity Bill', 2);
  insertTransaction.run(3000, 'income', 'Freelance', '2026-04-05', 'Project Payment', 1);

  const insertLog = db.prepare('INSERT INTO access_logs (userId, method, endpoint, ip) VALUES (?, ?, ?, ?)');
  insertLog.run(1, 'GET', '/api/mock', '127.0.0.1');
}

export default db;
