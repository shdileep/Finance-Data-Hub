/**
 * Database Models — Type-safe query wrappers for SQLite
 * Separates raw DB queries from route handlers for clean architecture.
 */
import db from '../db.ts';

// ─── User Model ──────────────────────────────────────────────────────────────

export interface IUser {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'Analyst' | 'Viewer';
  status: 'active' | 'inactive';
  created_at: string;
}

export const UserModel = {
  findById(id: number | string): IUser | undefined {
    return db.prepare('SELECT * FROM users WHERE id = ?').get(id) as IUser | undefined;
  },

  findActiveById(id: number | string): IUser | undefined {
    return db.prepare('SELECT * FROM users WHERE id = ? AND status = ?').get(id, 'active') as IUser | undefined;
  },

  findAll(): IUser[] {
    return db.prepare('SELECT * FROM users ORDER BY created_at DESC').all() as IUser[];
  },

  create(data: { name: string; email: string; role: string; status: string }) {
    const info = db.prepare(
      'INSERT INTO users (name, email, role, status) VALUES (?, ?, ?, ?)'
    ).run(data.name, data.email, data.role, data.status);
    return { id: info.lastInsertRowid, ...data };
  },

  update(id: number | string, data: { name: string; email: string; role: string; status: string }) {
    const info = db.prepare(
      'UPDATE users SET name=?, email=?, role=?, status=? WHERE id=?'
    ).run(data.name, data.email, data.role, data.status, id);
    return info.changes;
  },

  delete(id: number | string) {
    const info = db.prepare('DELETE FROM users WHERE id = ?').run(id);
    return info.changes;
  },
};

// ─── Transaction Model ───────────────────────────────────────────────────────

export interface ITransaction {
  id: number;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  description: string | null;
  userId: number;
  is_deleted: number;
  created_at: string;
}

export interface TransactionFilter {
  type?: string;
  category?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}

export const TransactionModel = {
  findFiltered(filters: TransactionFilter): ITransaction[] {
    let query = 'SELECT * FROM transactions WHERE is_deleted = 0';
    const params: any[] = [];

    if (filters.type)      { query += ' AND type = ?';                                params.push(filters.type); }
    if (filters.category)  { query += ' AND category LIKE ?';                         params.push(`%${filters.category}%`); }
    if (filters.search)    { query += ' AND (category LIKE ? OR description LIKE ?)'; params.push(`%${filters.search}%`, `%${filters.search}%`); }
    if (filters.startDate) { query += ' AND date >= ?';                               params.push(filters.startDate); }
    if (filters.endDate)   { query += ' AND date <= ?';                               params.push(filters.endDate); }

    const limit = Math.min(filters.limit || 20, 100);
    const offset = Math.max(filters.offset || 0, 0);
    query += ' ORDER BY date DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    return db.prepare(query).all(...params) as ITransaction[];
  },

  create(data: { amount: number; type: string; category: string; date: string; description?: string | null; userId: number }) {
    const info = db.prepare(
      'INSERT INTO transactions (amount, type, category, date, description, userId) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(data.amount, data.type, data.category, data.date, data.description ?? null, data.userId);
    return { id: info.lastInsertRowid, ...data };
  },

  update(id: number | string, data: { amount: number; type: string; category: string; date: string; description?: string | null }) {
    const info = db.prepare(
      'UPDATE transactions SET amount=?, type=?, category=?, date=?, description=? WHERE id=? AND is_deleted=0'
    ).run(data.amount, data.type, data.category, data.date, data.description ?? null, id);
    return info.changes;
  },

  softDelete(id: number | string) {
    const info = db.prepare('UPDATE transactions SET is_deleted = 1 WHERE id = ? AND is_deleted = 0').run(id);
    return info.changes;
  },
};

// ─── Summary Model (aggregation queries) ─────────────────────────────────────

export const SummaryModel = {
  getTotalIncome(): number {
    const row = db.prepare("SELECT COALESCE(SUM(amount),0) as total FROM transactions WHERE type='income' AND is_deleted=0").get() as any;
    return row.total;
  },

  getTotalExpense(): number {
    const row = db.prepare("SELECT COALESCE(SUM(amount),0) as total FROM transactions WHERE type='expense' AND is_deleted=0").get() as any;
    return row.total;
  },

  getCategoryWise() {
    return db.prepare(`
      SELECT category, type, SUM(amount) as total
      FROM transactions WHERE is_deleted=0
      GROUP BY category, type ORDER BY total DESC
    `).all();
  },

  getRecentActivity(limit = 5) {
    return db.prepare(`
      SELECT * FROM transactions WHERE is_deleted=0
      ORDER BY date DESC, created_at DESC LIMIT ?
    `).all(limit);
  },

  getWeeklyTrends() {
    return db.prepare(`
      SELECT date,
        SUM(CASE WHEN type='income'  THEN amount ELSE 0 END) as income,
        SUM(CASE WHEN type='expense' THEN amount ELSE 0 END) as expense
      FROM transactions
      WHERE date >= date('now', '-7 days') AND is_deleted=0
      GROUP BY date ORDER BY date ASC
    `).all();
  },

  getMonthlyTrends(limit = 12) {
    return db.prepare(`
      SELECT strftime('%Y-%m', date) as month,
        SUM(CASE WHEN type='income'  THEN amount ELSE 0 END) as income,
        SUM(CASE WHEN type='expense' THEN amount ELSE 0 END) as expense
      FROM transactions WHERE is_deleted=0
      GROUP BY strftime('%Y-%m', date) ORDER BY month ASC LIMIT ?
    `).all(limit);
  },
};
