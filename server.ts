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
import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import db from './src/db.ts'; // DB instance + init + seed
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
  // Global: 100 requests per 15 minutes per IP
  app.use('/api/', rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too Many Requests', message: 'Rate limit exceeded. Try again in 15 minutes.' },
  }));

  // Stricter: 20 write requests per 15 minutes per IP
  const writeLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too Many Requests', message: 'Write rate limit exceeded. Try again in 15 minutes.' },
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
