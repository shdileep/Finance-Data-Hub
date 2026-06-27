import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let activeDb = new Database(path.join(process.cwd(), 'finance.db'));

// Setup tables
export function setupSchema(database: any) {
  database.exec(`
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
      is_flagged BOOLEAN DEFAULT 0,
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

    CREATE TABLE IF NOT EXISTS forecast_scenarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      name TEXT NOT NULL,
      monthly_growth REAL NOT NULL,
      expense_growth REAL NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS category_watches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      category TEXT NOT NULL,
      threshold REAL NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS alert_rules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      field TEXT NOT NULL,
      operator TEXT NOT NULL,
      threshold REAL NOT NULL,
      channel TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS goals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      target REAL NOT NULL,
      current REAL NOT NULL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS goal_subscriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      goalId INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id),
      FOREIGN KEY (goalId) REFERENCES goals(id)
    );

    CREATE TABLE IF NOT EXISTS insight_feedback (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      insightId TEXT NOT NULL,
      type TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS impersonation_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      adminId INTEGER NOT NULL,
      targetUserId INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (adminId) REFERENCES users(id),
      FOREIGN KEY (targetUserId) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS scheduled_backups (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      frequency TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      last_run DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS permission_change_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      adminId INTEGER NOT NULL,
      role TEXT NOT NULL,
      resource TEXT NOT NULL,
      access_level TEXT NOT NULL,
      reason TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (adminId) REFERENCES users(id)
    );
  `);

  try {
    database.exec("ALTER TABLE transactions ADD COLUMN is_flagged BOOLEAN DEFAULT 0;");
  } catch (e) {
    // Column already exists
  }
}

// Seed initial data if empty
export function seedData(database: any) {
  const userCount = database.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
  if (userCount.count === 0) {
    const insertUser = database.prepare('INSERT INTO users (name, email, role, status) VALUES (?, ?, ?, ?)');
    insertUser.run('Admin User', 'admin@example.com', 'Admin', 'active');
    insertUser.run('Analyst User', 'analyst@example.com', 'Analyst', 'active');
    insertUser.run('Viewer User', 'viewer@example.com', 'Viewer', 'active');

    const insertTransaction = database.prepare('INSERT INTO transactions (amount, type, category, date, description, userId) VALUES (?, ?, ?, ?, ?, ?)');
    insertTransaction.run(5000, 'income', 'Salary', '2026-04-01', 'Monthly Salary', 1);
    insertTransaction.run(1200, 'expense', 'Rent', '2026-04-02', 'Monthly Rent', 1);
    insertTransaction.run(200, 'expense', 'Groceries', '2026-04-03', 'Weekly Groceries', 2);
    insertTransaction.run(150, 'expense', 'Utilities', '2026-04-04', 'Electricity Bill', 2);
    insertTransaction.run(3000, 'income', 'Freelance', '2026-04-05', 'Project Payment', 1);

    const insertLog = database.prepare('INSERT INTO access_logs (userId, method, endpoint, ip) VALUES (?, ?, ?, ?)');
    insertLog.run(1, 'GET', '/api/mock', '127.0.0.1');

    // Seed alert rules
    const insertAlert = database.prepare('INSERT INTO alert_rules (field, operator, threshold, channel) VALUES (?, ?, ?, ?)');
    insertAlert.run('amount', '>', 4000, 'email');
    insertAlert.run('amount', '>', 1000, 'sms');

    // Seed goals
    const insertGoal = database.prepare('INSERT INTO goals (name, type, target, current) VALUES (?, ?, ?, ?)');
    insertGoal.run('Maintain 6 Months Runway', 'runway', 6.0, 4.5);
    insertGoal.run('Keep Expense Ratio Under 60%', 'expense_ratio', 0.6, 0.45);
  }
}

// Initial initialization
setupSchema(activeDb);
seedData(activeDb);

// Proxy interface to dynamic db instance
const db = new Proxy({} as any, {
  get(target, prop) {
    const val = (activeDb as any)[prop];
    if (typeof val === 'function') {
      return val.bind(activeDb);
    }
    return val;
  },
  set(target, prop, value) {
    (activeDb as any)[prop] = value;
    return true;
  }
});

// Toggle Sandbox Mode
export function toggleSandboxMode(activate: boolean) {
  if (activate) {
    const memDb = new Database(':memory:');
    setupSchema(memDb);
    seedData(memDb);
    activeDb = memDb;
  } else {
    activeDb = new Database(path.join(process.cwd(), 'finance.db'));
  }
}

export default db;
