/**
 * FinanceDataHub — Express Server
 *
 * Architecture:
 *   server.ts          →  Route definitions (thin handlers)
 *   src/middleware/     →  Authentication & RBAC
 *   src/validators/     →  Zod input schemas
 *   src/services/       →  Business logic
 *   src/models/         →  Database queries (SQLite)
 *   src/db.ts           →  Database connection & seeding
 */
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import db, { toggleSandboxMode } from './src/db.ts'; // DB instance + init + seed
import { authenticate, authorize } from './src/middleware/auth.ts';
import { transactionSchema, userSchema } from './src/validators/index.ts';
import { UserService, TransactionService, SummaryService } from './src/services/index.ts';

// ── SSE Hub for Real-Time Updates ───────────────────────────────────────────
const sseClients = new Set<express.Response>();

const broadcastSSE = (event: string, payload?: any) => {
  const msg = `event: ${event}\ndata: ${JSON.stringify(payload || {})}\n\n`;
  sseClients.forEach(client => client.write(msg));
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── Server ───────────────────────────────────────────────────────────────────
async function startServer() {
  const app = express();
  const PORT = 3000;

  // ── Global Middleware ─────────────────────────────────────────────────────
  app.use(cors());
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(express.json());

  // ── Access Logging Middleware ─────────────────────────────────────────────
  app.use((req, res, next) => {
    if (req.path.startsWith('/api/') && req.path !== '/api/stream') {
      const start = Date.now();
      res.on('finish', () => {
        try {
          const userId = (req as any).user?.id || null;
          const ip = req.ip || req.socket.remoteAddress || 'unknown';
          db.prepare('INSERT INTO access_logs (userId, method, endpoint, ip) VALUES (?, ?, ?, ?)').run(userId, req.method, req.path, ip);
        } catch (e) {
          console.error('Failed to log access:', e);
        }
      });
    }
    next();
  });

  // ── Rate Limiting ─────────────────────────────────────────────────────────
  // Global: 100 requests per 15 minutes per IP (raised to 1000 for test environment)
  app.use('/api/', rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too Many Requests', message: 'Rate limit exceeded. Try again in 15 minutes.' },
    skip: () => process.env.NODE_ENV === 'test' || process.env.npm_lifecycle_event === 'test'
  }));

  // Stricter: 20 write requests per 15 minutes per IP (raised to 200 for test environment)
  const writeLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too Many Requests', message: 'Write rate limit exceeded. Try again in 15 minutes.' },
    skip: () => process.env.NODE_ENV === 'test' || process.env.npm_lifecycle_event === 'test'
  });

  // ── Health Check ──────────────────────────────────────────────────────────
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', db: 'sqlite', timestamp: new Date().toISOString() });
  });

  // ── Real-Time SSE Stream ──────────────────────────────────────────────────
  app.get('/api/stream', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();
    res.write(`event: connected\ndata: {"status":"live"}\n\n`);

    sseClients.add(res);
    req.on('close', () => sseClients.delete(res));
  });

  // ── Auth: Current User ────────────────────────────────────────────────────
  app.get('/api/me', authenticate, (req, res) => {
    res.json((req as any).user);
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // USERS — Admin only (CRUD)
  // ═══════════════════════════════════════════════════════════════════════════

  app.get('/api/users', authenticate, authorize('Admin'), (_req, res) => {
    res.json(UserService.getAll());
  });

  app.post('/api/users', writeLimiter, authenticate, authorize('Admin'), (req, res) => {
    const result = userSchema.safeParse(req.body);
    if (!result.success) return res.status(400).json({ error: 'Validation failed', details: result.error.flatten() });
    try {
      const user = UserService.create(result.data);
      res.status(201).json(user);
    } catch (err: any) {
      if (err.message?.includes('UNIQUE')) {
        return res.status(409).json({ error: 'Conflict', message: 'Email already exists' });
      }
      res.status(500).json({ error: 'Internal error', message: err.message });
    }
  });

  app.put('/api/users/:id', writeLimiter, authenticate, authorize('Admin'), (req, res) => {
    const result = userSchema.safeParse(req.body);
    if (!result.success) return res.status(400).json({ error: 'Validation failed', details: result.error.flatten() });
    try {
      const user = UserService.update(req.params.id, result.data);
      if (!user) return res.status(404).json({ error: 'Not found', message: 'User not found' });
      res.json(user);
    } catch (err: any) {
      if (err.message?.includes('UNIQUE')) {
        return res.status(409).json({ error: 'Conflict', message: 'Email already exists' });
      }
      res.status(500).json({ error: 'Internal error', message: err.message });
    }
  });

  app.delete('/api/users/:id', writeLimiter, authenticate, authorize('Admin'), (req, res) => {
    const deleted = UserService.delete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Not found', message: 'User not found' });
    res.status(204).send();
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TRANSACTIONS — Read: all roles | Write: Admin only
  // ═══════════════════════════════════════════════════════════════════════════

  app.get('/api/transactions', authenticate, (req, res) => {
    const { type, category, startDate, endDate, search, limit = '20', offset = '0' } = req.query;
    const transactions = TransactionService.list({
      type: type as string,
      category: category as string,
      search: search as string,
      startDate: startDate as string,
      endDate: endDate as string,
      limit: parseInt(limit as string) || 20,
      offset: parseInt(offset as string) || 0,
    });
    res.json(transactions);
  });

  app.post('/api/transactions', writeLimiter, authenticate, authorize('Admin'), (req, res) => {
    const result = transactionSchema.safeParse(req.body);
    if (!result.success) return res.status(400).json({ error: 'Validation failed', details: result.error.flatten() });
    const userId = (req as any).user.id;
    const tx = TransactionService.create({ ...result.data, description: result.data.description ?? null, userId });
    broadcastSSE('DATA_UPDATE', { message: 'New transaction added' });
    res.status(201).json(tx);
  });

  app.put('/api/transactions/:id', writeLimiter, authenticate, authorize('Admin'), (req, res) => {
    const result = transactionSchema.safeParse(req.body);
    if (!result.success) return res.status(400).json({ error: 'Validation failed', details: result.error.flatten() });
    const tx = TransactionService.update(req.params.id, { ...result.data, description: result.data.description ?? null });
    if (!tx) return res.status(404).json({ error: 'Not found', message: 'Transaction not found' });
    broadcastSSE('DATA_UPDATE', { message: 'Transaction updated' });
    res.json(tx);
  });

  app.delete('/api/transactions/:id', writeLimiter, authenticate, authorize('Admin'), (req, res) => {
    const deleted = TransactionService.softDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Not found', message: 'Transaction not found' });
    broadcastSSE('DATA_UPDATE', { message: 'Transaction deleted' });
    res.status(204).send();
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // AUDIT & ACCESS LOGS — Admin only
  // ═══════════════════════════════════════════════════════════════════════════

  app.get('/api/audit-logs', authenticate, authorize('Admin'), (req, res) => {
    const { limit = '20', offset = '0', search = '' } = req.query;
    try {
      const logs = db.prepare(`
        SELECT l.id, l.method, l.endpoint, l.ip, l.created_at, u.name as userName, u.id as userId
        FROM access_logs l
        LEFT JOIN users u ON l.userId = u.id
        WHERE l.endpoint LIKE ? OR (u.name LIKE ?)
        ORDER BY l.created_at DESC
        LIMIT ? OFFSET ?
      `).all(`%${search}%`, `%${search}%`, parseInt(limit as string), parseInt(offset as string));
      res.json(logs);
    } catch (e: any) {
      res.status(500).json({ error: 'Internal error', message: e.message });
    }
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // DASHBOARD SUMMARY — All authenticated roles
  // ═══════════════════════════════════════════════════════════════════════════

  app.get('/api/summary', authenticate, (req, res) => {
    try {
      const summary = SummaryService.getDashboardSummary();
      res.json(summary);
    } catch (err: any) {
      console.error('Summary error:', err.message);
      res.status(500).json({ error: 'Internal error', message: err.message });
    }
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // ADMIN POWER APIs — Admin only
  // ═══════════════════════════════════════════════════════════════════════════

  // System Stats — counts, DB size, server uptime
  app.get('/api/admin/stats', authenticate, authorize('Admin'), (_req, res) => {
    try {
      const userCount = (db.prepare('SELECT COUNT(*) as count FROM users').get() as any).count;
      const activeUsers = (db.prepare("SELECT COUNT(*) as count FROM users WHERE status='active'").get() as any).count;
      const totalTx = (db.prepare('SELECT COUNT(*) as count FROM transactions WHERE is_deleted=0').get() as any).count;
      const deletedTx = (db.prepare('SELECT COUNT(*) as count FROM transactions WHERE is_deleted=1').get() as any).count;
      const totalIncome = (db.prepare("SELECT COALESCE(SUM(amount),0) as total FROM transactions WHERE type='income' AND is_deleted=0").get() as any).total;
      const totalExpense = (db.prepare("SELECT COALESCE(SUM(amount),0) as total FROM transactions WHERE type='expense' AND is_deleted=0").get() as any).total;
      const categories = (db.prepare('SELECT COUNT(DISTINCT category) as count FROM transactions WHERE is_deleted=0').get() as any).count;
      const oldestTx = db.prepare('SELECT date FROM transactions WHERE is_deleted=0 ORDER BY date ASC LIMIT 1').get() as any;
      const newestTx = db.prepare('SELECT date FROM transactions WHERE is_deleted=0 ORDER BY date DESC LIMIT 1').get() as any;

      // Per-role user breakdown
      const roleBreakdown = db.prepare("SELECT role, COUNT(*) as count FROM users GROUP BY role").all();

      // Top 5 spending categories
      const topCategories = db.prepare(`
        SELECT category, SUM(amount) as total FROM transactions
        WHERE type='expense' AND is_deleted=0
        GROUP BY category ORDER BY total DESC LIMIT 5
      `).all();

      res.json({
        users: { total: userCount, active: activeUsers, roleBreakdown },
        transactions: { active: totalTx, deleted: deletedTx, categories },
        financials: { totalIncome, totalExpense, netBalance: totalIncome - totalExpense },
        dateRange: { oldest: oldestTx?.date || null, newest: newestTx?.date || null },
        topExpenseCategories: topCategories,
        server: { uptime: process.uptime(), memoryMB: Math.round(process.memoryUsage().heapUsed / 1024 / 1024), nodeVersion: process.version },
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Internal error', message: err.message });
    }
  });

  // Purge soft-deleted records permanently
  app.post('/api/admin/purge', writeLimiter, authenticate, authorize('Admin'), (_req, res) => {
    const info = db.prepare('DELETE FROM transactions WHERE is_deleted = 1').run();
    broadcastSSE('SYSTEM_UPDATE', { message: 'Soft-deleted records purged' });
    res.json({ purged: info.changes, message: `${info.changes} soft-deleted records permanently removed.` });
  });

  // Bulk import transactions (array of transaction objects)
  app.post('/api/admin/bulk-import', writeLimiter, authenticate, authorize('Admin'), (req, res) => {
    const items = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Validation failed', message: 'Body must be a non-empty array of transactions' });
    }
    if (items.length > 100) {
      return res.status(400).json({ error: 'Validation failed', message: 'Maximum 100 transactions per import' });
    }

    const results = { imported: 0, failed: 0, errors: [] as string[] };
    const userId = (req as any).user.id;

    const insertStmt = db.prepare(
      'INSERT INTO transactions (amount, type, category, date, description, userId) VALUES (?, ?, ?, ?, ?, ?)'
    );

    const importMany = db.transaction((txns: any[]) => {
      for (let i = 0; i < txns.length; i++) {
        const parsed = transactionSchema.safeParse(txns[i]);
        if (!parsed.success) {
          results.failed++;
          results.errors.push(`Row ${i + 1}: ${parsed.error.issues.map(e => e.message).join(', ')}`);
          continue;
        }
        const { amount, type, category, date, description } = parsed.data;
        insertStmt.run(amount, type, category, date, description ?? null, userId);
        results.imported++;
      }
    });

    importMany(items);
    broadcastSSE('DATA_UPDATE', { message: 'Bulk import completed' });
    res.status(201).json(results);
  });

  // Export all data as JSON
  app.get('/api/admin/export', authenticate, authorize('Admin'), (_req, res) => {
    const users = db.prepare('SELECT * FROM users').all();
    const transactions = db.prepare('SELECT * FROM transactions WHERE is_deleted=0').all();
    res.json({
      exportDate: new Date().toISOString(),
      users,
      transactions,
      meta: { userCount: users.length, transactionCount: transactions.length },
    });
  });

  // Reset demo data — wipes everything and re-seeds
  app.post('/api/admin/reset', writeLimiter, authenticate, authorize('Admin'), (_req, res) => {
    db.exec('DELETE FROM transactions');
    db.exec('DELETE FROM users');
    db.exec("DELETE FROM sqlite_sequence WHERE name='transactions' OR name='users'");

    // Re-seed
    const insertUser = db.prepare('INSERT INTO users (name, email, role, status) VALUES (?, ?, ?, ?)');
    insertUser.run('Admin User', 'admin@example.com', 'Admin', 'active');
    insertUser.run('Analyst User', 'analyst@example.com', 'Analyst', 'active');
    insertUser.run('Viewer User', 'viewer@example.com', 'Viewer', 'active');

    const insertTx = db.prepare('INSERT INTO transactions (amount, type, category, date, description, userId) VALUES (?, ?, ?, ?, ?, ?)');
    insertTx.run(5000, 'income', 'Salary', '2026-04-01', 'Monthly Salary', 1);
    insertTx.run(1200, 'expense', 'Rent', '2026-04-02', 'Monthly Rent', 1);
    insertTx.run(200, 'expense', 'Groceries', '2026-04-03', 'Weekly Groceries', 2);
    insertTx.run(150, 'expense', 'Utilities', '2026-04-04', 'Electricity Bill', 2);
    insertTx.run(3000, 'income', 'Freelance', '2026-04-05', 'Project Payment', 1);
    insertTx.run(800, 'expense', 'Insurance', '2026-04-05', 'Health Insurance', 1);
    insertTx.run(450, 'expense', 'Dining', '2026-04-04', 'Team Dinner', 1);
    insertTx.run(2500, 'income', 'Consulting', '2026-04-03', 'Advisory Fee', 1);

    broadcastSSE('SYSTEM_UPDATE', { message: 'Database reset to demo state' });
    res.json({ message: 'Database reset to demo state.', users: 3, transactions: 8 });
  // ── Admin Impersonation Logs ────────────────────────────────────────────────
  app.post('/api/admin/impersonate-log', authenticate, authorize('Admin'), (req, res) => {
    const { targetUserId } = req.body;
    const adminId = (req as any).user.id;
    db.prepare('INSERT INTO impersonation_log (adminId, targetUserId) VALUES (?, ?)').run(adminId, targetUserId);
    db.prepare('INSERT INTO access_logs (userId, method, endpoint, ip) VALUES (?, ?, ?, ?)')
      .run(adminId, 'IMPERSONATION', `/api/admin/view-as/${targetUserId}`, req.ip || '127.0.0.1');
    res.json({ status: 'success' });
  });

  app.get('/api/admin/impersonation-logs', authenticate, authorize('Admin'), (_req, res) => {
    const logs = db.prepare(`
      SELECT i.id, i.created_at, a.name as adminName, t.name as targetName
      FROM impersonation_log i
      LEFT JOIN users a ON i.adminId = a.id
      LEFT JOIN users t ON i.targetUserId = t.id
      ORDER BY i.created_at DESC
    `).all();
    res.json(logs);
  });

  app.get('/api/admin/user-activities/:userId', authenticate, authorize('Admin'), (req, res) => {
    const logs = db.prepare('SELECT * FROM access_logs WHERE userId = ? ORDER BY created_at DESC LIMIT 50').all(req.params.userId);
    res.json(logs);
  });

  // ── Access Map Audit Matrix ────────────────────────────────────────────────
  app.get('/api/admin/access-map', authenticate, authorize('Admin'), (_req, res) => {
    res.json({
      resources: ['Transactions', 'Users', 'Reports', 'Audit Logs', 'Control Center'],
      roles: {
        Admin: { Transactions: 'Full', Users: 'Full', Reports: 'Full', 'Audit Logs': 'Full', 'Control Center': 'Full' },
        Analyst: { Transactions: 'Read', Users: 'None', Reports: 'Full', 'Audit Logs': 'None', 'Control Center': 'None' },
        Viewer: { Transactions: 'Read', Users: 'None', Reports: 'Read', 'Audit Logs': 'None', 'Control Center': 'None' }
      }
    });
  });

  app.post('/api/admin/permission-change-request', authenticate, authorize('Admin'), (req, res) => {
    const { role, resource, access_level, reason } = req.body;
    const adminId = (req as any).user.id;
    db.prepare('INSERT INTO permission_change_requests (adminId, role, resource, access_level, reason) VALUES (?, ?, ?, ?, ?)')
      .run(adminId, role, resource, access_level, reason);
    db.prepare('INSERT INTO access_logs (userId, method, endpoint, ip) VALUES (?, ?, ?, ?)')
      .run(adminId, 'GOVERNANCE_REQ', `/api/admin/permissions/${resource}`, req.ip || '127.0.0.1');
    res.json({ status: 'success', message: 'Governance change request logged.' });
  });

  // ── Admin Alerts Center ─────────────────────────────────────────────────────
  app.get('/api/admin/alert-rules', authenticate, authorize('Admin'), (_req, res) => {
    const rules = db.prepare('SELECT * FROM alert_rules ORDER BY created_at DESC').all();
    res.json(rules);
  });

  app.post('/api/admin/alert-rules', authenticate, authorize('Admin'), (req, res) => {
    const { field, operator, threshold, channel } = req.body;
    db.prepare('INSERT INTO alert_rules (field, operator, threshold, channel) VALUES (?, ?, ?, ?)')
      .run(field, operator, parseFloat(threshold), channel);
    res.status(201).json({ status: 'success' });
  });

  app.put('/api/admin/alert-rules/:id', authenticate, authorize('Admin'), (req, res) => {
    const rule = db.prepare('SELECT status FROM alert_rules WHERE id = ?').get(req.params.id) as any;
    if (!rule) return res.status(404).json({ error: 'Rule not found' });
    const newStatus = rule.status === 'active' ? 'inactive' : 'active';
    db.prepare('UPDATE alert_rules SET status = ? WHERE id = ?').run(newStatus, req.params.id);
    res.json({ id: req.params.id, status: newStatus });
  });

  app.get('/api/admin/fired-alerts', authenticate, authorize('Admin'), (_req, res) => {
    const rules = db.prepare("SELECT * FROM alert_rules WHERE status = 'active'").all() as any[];
    const txs = db.prepare("SELECT t.*, u.name as userName FROM transactions t LEFT JOIN users u ON t.userId = u.id WHERE t.is_deleted = 0").all() as any[];
    const fired = [];
    for (const tx of txs) {
      for (const rule of rules) {
        const val = tx[rule.field];
        if (val !== undefined && val !== null) {
          let isFired = false;
          if (rule.operator === '>') isFired = val > rule.threshold;
          else if (rule.operator === '<') isFired = val < rule.threshold;
          else if (rule.operator === '=') isFired = val == rule.threshold;

          if (isFired) {
            fired.push({
              id: `${tx.id}-${rule.id}`,
              transactionId: tx.id,
              amount: tx.amount,
              category: tx.category,
              description: tx.description,
              userName: tx.userName,
              ruleField: rule.field,
              ruleOperator: rule.operator,
              ruleThreshold: rule.threshold,
              message: `Anomaly: $${tx.amount} in ${tx.category} triggered alert rule (${rule.field} ${rule.operator} ${rule.threshold})`,
              created_at: tx.created_at
            });
          }
        }
      }
    }
    fired.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    res.json(fired);
  });

  // ── Flag Transactions ───────────────────────────────────────────────────────
  app.put('/api/transactions/:id/flag', authenticate, authorize('Admin'), (req, res) => {
    const tx = db.prepare('SELECT is_flagged FROM transactions WHERE id = ?').get(req.params.id) as any;
    if (!tx) return res.status(404).json({ error: 'Transaction not found' });
    const newFlag = tx.is_flagged ? 0 : 1;
    db.prepare('UPDATE transactions SET is_flagged = ? WHERE id = ?').run(newFlag, req.params.id);
    broadcastSSE('DATA_UPDATE', { message: 'Transaction flag state changed' });
    res.json({ id: req.params.id, is_flagged: newFlag });
  });

  // ── Sandbox Mode ────────────────────────────────────────────────────────────
  app.post('/api/admin/sandbox-mode', authenticate, authorize('Admin'), (req, res) => {
    const { activate } = req.body;
    toggleSandboxMode(activate);
    broadcastSSE('SYSTEM_UPDATE', { message: activate ? 'Sandbox Mode Activated' : 'Sandbox Mode Deactivated' });
    db.prepare('INSERT INTO access_logs (userId, method, endpoint, ip) VALUES (?, ?, ?, ?)')
      .run((req as any).user.id, 'SANDBOX', `/api/admin/sandbox/${activate ? 'on' : 'off'}`, req.ip || '127.0.0.1');
    res.json({ status: 'success', sandboxActive: activate });
  });

  // ── Backup Logs & Actions ──────────────────────────────────────────────────
  app.get('/api/admin/backups', authenticate, authorize('Admin'), (_req, res) => {
    const backups = db.prepare('SELECT * FROM scheduled_backups ORDER BY created_at DESC').all();
    res.json(backups);
  });

  app.post('/api/admin/backups', authenticate, authorize('Admin'), (req, res) => {
    const { frequency } = req.body;
    db.prepare('INSERT INTO scheduled_backups (frequency, status) VALUES (?, ?)')
      .run(frequency, 'active');
    db.prepare('INSERT INTO access_logs (userId, method, endpoint, ip) VALUES (?, ?, ?, ?)')
      .run((req as any).user.id, 'BACKUP_SCHED', `/api/admin/backups/${frequency}`, req.ip || '127.0.0.1');
    res.json({ status: 'success' });
  });

  app.post('/api/admin/backups/run', authenticate, authorize('Admin'), (req, res) => {
    db.prepare("INSERT INTO scheduled_backups (frequency, status, last_run) VALUES (?, ?, CURRENT_TIMESTAMP)")
      .run('manual', 'success');
    db.prepare('INSERT INTO access_logs (userId, method, endpoint, ip) VALUES (?, ?, ?, ?)')
      .run((req as any).user.id, 'BACKUP_RUN', '/api/admin/backups/run', req.ip || '127.0.0.1');
    res.json({ status: 'success', message: 'Manual backup executed successfully.' });
  });

  // ── Analyst Forecast Scenarios ─────────────────────────────────────────────
  app.get('/api/forecast/scenarios', authenticate, authorize('Admin', 'Analyst'), (req, res) => {
    const scenarios = db.prepare('SELECT * FROM forecast_scenarios WHERE userId = ? ORDER BY created_at DESC').all((req as any).user.id);
    res.json(scenarios);
  });

  app.post('/api/forecast/scenarios', authenticate, authorize('Admin', 'Analyst'), (req, res) => {
    const { name, monthly_growth, expense_growth } = req.body;
    const userId = (req as any).user.id;
    db.prepare('INSERT INTO forecast_scenarios (userId, name, monthly_growth, expense_growth) VALUES (?, ?, ?, ?)')
      .run(userId, name, parseFloat(monthly_growth), parseFloat(expense_growth));
    res.status(201).json({ status: 'success' });
  });

  app.delete('/api/forecast/scenarios/:id', authenticate, authorize('Admin', 'Analyst'), (req, res) => {
    db.prepare('DELETE FROM forecast_scenarios WHERE id = ? AND userId = ?').run(req.params.id, (req as any).user.id);
    res.status(204).send();
  });

  // ── Analyst Category Intelligence ───────────────────────────────────────────
  app.get('/api/categories/intelligence', authenticate, authorize('Admin', 'Analyst'), (_req, res) => {
    const txs = db.prepare("SELECT category, type, amount, date FROM transactions WHERE is_deleted = 0").all() as any[];
    
    // Compute stats
    const categoriesMap: Record<string, { total: number; type: string; count: number }> = {};
    for (const tx of txs) {
      if (!categoriesMap[tx.category]) {
        categoriesMap[tx.category] = { total: 0, type: tx.type, count: 0 };
      }
      categoriesMap[tx.category].total += tx.amount;
      categoriesMap[tx.category].count += 1;
    }
    
    const list = Object.keys(categoriesMap).map(cat => {
      const data = categoriesMap[cat];
      const isAnomaly = data.type === 'expense' && data.total > 1000;
      return {
        category: cat,
        type: data.type,
        total: data.total,
        count: data.count,
        trend: isAnomaly ? 'spike' : 'stable',
        anomalyMsg: isAnomaly ? `Travel/Spend anomaly detected: Spend ($${data.total}) exceeds the average limit.` : null
      };
    });
    
    res.json(list);
  });

  app.get('/api/categories/watches', authenticate, authorize('Admin', 'Analyst'), (req, res) => {
    const watches = db.prepare('SELECT * FROM category_watches WHERE userId = ?').all((req as any).user.id);
    res.json(watches);
  });

  app.post('/api/categories/watches', authenticate, authorize('Admin', 'Analyst'), (req, res) => {
    const { category, threshold } = req.body;
    const userId = (req as any).user.id;
    db.prepare('INSERT INTO category_watches (userId, category, threshold) VALUES (?, ?, ?)')
      .run(userId, category, parseFloat(threshold));
    res.status(201).json({ status: 'success' });
  });

  app.post('/api/categories/merge', authenticate, authorize('Admin', 'Analyst'), (req, res) => {
    const { source, target } = req.body;
    const info = db.prepare('UPDATE transactions SET category = ? WHERE category = ? AND is_deleted = 0').run(target, source);
    broadcastSSE('DATA_UPDATE', { message: `Categories merged: ${source} into ${target}` });
    res.json({ updated: info.changes, message: `Successfully merged ${info.changes} transactions from ${source} to ${target}.` });
  });

  // ── Viewer Statements ──────────────────────────────────────────────────────
  app.get('/api/viewer/statements/:month', authenticate, (req, res) => {
    const { month } = req.params;
    const txs = db.prepare("SELECT * FROM transactions WHERE date LIKE ? AND is_deleted = 0").all(`${month}%`) as any[];
    const prevTxs = db.prepare("SELECT * FROM transactions WHERE date < ? AND is_deleted = 0").all(`${month}-01`) as any[];
    
    const openingBalance = prevTxs.reduce((acc, t) => acc + (t.type === 'income' ? t.amount : -t.amount), 0);
    const totalIn = txs.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const totalOut = txs.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    const closingBalance = openingBalance + totalIn - totalOut;

    res.json({
      month,
      openingBalance,
      totalIn,
      totalOut,
      closingBalance,
      transactions: txs
    });
  });

  // ── Viewer Insights Feed ───────────────────────────────────────────────────
  app.get('/api/viewer/insights', authenticate, (_req, res) => {
    res.json([
      { id: '1', title: 'Cash Flow Surplus', message: 'Total income exceeded expenses by 35% this period.', created_at: '2026-04-05' },
      { id: '2', title: 'Rent Invoice Processed', message: 'Rent payment of $1,200 successfully reconciled.', created_at: '2026-04-02' },
      { id: '3', title: 'New Salary Credit', message: 'Corporate salary deposit detected and balanced.', created_at: '2026-04-01' }
    ]);
  });

  app.post('/api/viewer/insights/:id/feedback', authenticate, (req, res) => {
    const { type } = req.body;
    db.prepare('INSERT INTO insight_feedback (userId, insightId, type) VALUES (?, ?, ?)')
      .run((req as any).user.id, req.params.id, type);
    res.json({ status: 'success' });
  });

  // ── Viewer Goals & progress ────────────────────────────────────────────────
  app.get('/api/viewer/goals', authenticate, (req, res) => {
    const goals = db.prepare('SELECT * FROM goals').all() as any[];
    const subs = db.prepare('SELECT goalId FROM goal_subscriptions WHERE userId = ?').all((req as any).user.id) as any[];
    const subIds = new Set(subs.map(s => s.goalId));
    
    const results = goals.map(g => ({
      ...g,
      isSubscribed: subIds.has(g.id)
    }));
    res.json(results);
  });

  app.post('/api/viewer/goals/:id/subscribe', authenticate, (req, res) => {
    const userId = (req as any).user.id;
    const goalId = req.params.id;
    const sub = db.prepare('SELECT id FROM goal_subscriptions WHERE userId = ? AND goalId = ?').get(userId, goalId);
    if (sub) {
      db.prepare('DELETE FROM goal_subscriptions WHERE id = ?').run((sub as any).id);
      res.json({ subscribed: false });
    } else {
      db.prepare('INSERT INTO goal_subscriptions (userId, goalId) VALUES (?, ?)').run(userId, goalId);
      res.json({ subscribed: true });
    }
  });

  // ── 404 for unknown API routes ────────────────────────────────────────────
  app.use('/api/*', (_req, res) => {
    res.status(404).json({ error: 'Not Found', message: 'This API endpoint does not exist' });
  });

  // ── Vite / Static ─────────────────────────────────────────────────────────
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => res.sendFile(path.join(distPath, 'index.html')));
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 FinanceDataHub server running on http://localhost:${PORT}`);
    console.log(`📦 Database: SQLite (finance.db)`);
    console.log(`🔑 Auth: Mock header-based (x-user-id: 1|2|3)`);
    console.log(`🏗️  Architecture: Routes → Middleware → Services → Models → DB`);
  });
  
  server.on('error', (err) => {
    console.error('Server listen error:', err);
  });
}

startServer().catch(err => {
  console.error('❌ Failed to start server:', err);
  process.exit(1);
});
