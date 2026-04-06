/**
 * FinanceDataHub — Integration Test Suite
 * Uses Node.js built-in test runner (node:test) + fetch API (Node 18+)
 *
 * Prerequisites: Server must be running on http://localhost:3000
 *   npm run dev
 *
 * Run tests:
 *   npm test
 */

import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';

const BASE = 'http://localhost:3000';

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function api(
  method: string,
  path: string,
  userId?: number,
  body?: object
): Promise<{ status: number; data: any }> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (userId) headers['x-user-id'] = userId.toString();

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data: any = null;
  try { data = await res.json(); } catch { /* 204 No Content */ }
  return { status: res.status, data };
}

// ─── Test Data ────────────────────────────────────────────────────────────────

const validTransaction = {
  amount: 999.99,
  type: 'income',
  category: 'TestSuite',
  date: '2026-04-06',
  description: 'Integration test transaction',
};

let createdTxId: number;
let createdUserId: number;

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('Health Check', () => {
  it('GET /api/health returns 200 with ok status and sqlite db', async () => {
    const { status, data } = await api('GET', '/api/health');
    assert.equal(status, 200);
    assert.equal(data.status, 'ok');
    assert.equal(data.db, 'sqlite');
    assert.ok(data.timestamp, 'Should include timestamp');
  });
});

describe('Authentication', () => {
  it('Returns 401 when x-user-id header is missing', async () => {
    const { status, data } = await api('GET', '/api/me');
    assert.equal(status, 401);
    assert.equal(data.error, 'Unauthorized');
  });

  it('Returns 401 when x-user-id does not match any user', async () => {
    const { status, data } = await api('GET', '/api/me', 9999);
    assert.equal(status, 401);
    assert.equal(data.error, 'Unauthorized');
  });

  it('GET /api/me returns authenticated user for Admin (id=1)', async () => {
    const { status, data } = await api('GET', '/api/me', 1);
    assert.equal(status, 200);
    assert.equal(data.role, 'Admin');
    assert.ok(data.id, 'Should have id');
    assert.ok(data.email, 'Should have email');
  });

  it('GET /api/me returns Analyst user (id=2)', async () => {
    const { status, data } = await api('GET', '/api/me', 2);
    assert.equal(status, 200);
    assert.equal(data.role, 'Analyst');
  });

  it('GET /api/me returns Viewer user (id=3)', async () => {
    const { status, data } = await api('GET', '/api/me', 3);
    assert.equal(status, 200);
    assert.equal(data.role, 'Viewer');
  });
});

describe('Role-Based Access Control (RBAC)', () => {
  // Transactions — write restricted to Admin only
  it('Viewer cannot POST /api/transactions (403)', async () => {
    const { status, data } = await api('POST', '/api/transactions', 3, validTransaction);
    assert.equal(status, 403);
    assert.equal(data.error, 'Forbidden');
  });

  it('Analyst cannot POST /api/transactions (403)', async () => {
    const { status, data } = await api('POST', '/api/transactions', 2, validTransaction);
    assert.equal(status, 403);
    assert.equal(data.error, 'Forbidden');
  });

  it('Viewer cannot GET /api/users (403)', async () => {
    const { status, data } = await api('GET', '/api/users', 3);
    assert.equal(status, 403);
    assert.equal(data.error, 'Forbidden');
  });

  it('Analyst cannot GET /api/users (403)', async () => {
    const { status, data } = await api('GET', '/api/users', 2);
    assert.equal(status, 403);
  });

  it('Viewer cannot POST /api/users (403)', async () => {
    const { status } = await api('POST', '/api/users', 3, { name: 'X', email: 'x@x.com', role: 'Viewer' });
    assert.equal(status, 403);
  });

  // Read operations allowed for all roles
  it('Viewer can GET /api/transactions (200)', async () => {
    const { status, data } = await api('GET', '/api/transactions', 3);
    assert.equal(status, 200);
    assert.ok(Array.isArray(data), 'Response should be an array');
  });

  it('Analyst can GET /api/transactions (200)', async () => {
    const { status, data } = await api('GET', '/api/transactions', 2);
    assert.equal(status, 200);
    assert.ok(Array.isArray(data));
  });

  it('All roles can GET /api/summary', async () => {
    for (const uid of [1, 2, 3]) {
      const { status, data } = await api('GET', '/api/summary', uid);
      assert.equal(status, 200, `Role uid=${uid} should read summary`);
      assert.ok('totalIncome' in data);
      assert.ok('netBalance' in data);
    }
  });
});

describe('Transaction CRUD (Admin)', () => {
  it('Admin can create a transaction (201)', async () => {
    const { status, data } = await api('POST', '/api/transactions', 1, validTransaction);
    assert.equal(status, 201);
    assert.ok(data.id, 'Should return new id');
    assert.equal(data.amount, validTransaction.amount);
    assert.equal(data.category, validTransaction.category);
    createdTxId = data.id;
  });

  it('Can GET /api/transactions and result is array', async () => {
    const { status, data } = await api('GET', '/api/transactions', 1);
    assert.equal(status, 200);
    assert.ok(Array.isArray(data));
    assert.ok(data.length > 0);
  });

  it('Admin can update a transaction (200)', async () => {
    const update = { ...validTransaction, amount: 1234.56, description: 'Updated by test' };
    const { status, data } = await api('PUT', `/api/transactions/${createdTxId}`, 1, update);
    assert.equal(status, 200);
    assert.equal(data.amount, 1234.56);
    assert.equal(data.description, 'Updated by test');
  });

  it('PUT on non-existent transaction returns 404', async () => {
    const { status, data } = await api('PUT', '/api/transactions/999999', 1, validTransaction);
    assert.equal(status, 404);
    assert.equal(data.error, 'Not found');
  });

  it('Admin can soft-delete a transaction (204)', async () => {
    const { status } = await api('DELETE', `/api/transactions/${createdTxId}`, 1);
    assert.equal(status, 204);
  });

  it('Deleted transaction no longer appears in list', async () => {
    const { status, data } = await api('GET', `/api/transactions?search=TestSuite`, 1);
    assert.equal(status, 200);
    const found = data.find((t: any) => t.id === createdTxId);
    assert.equal(found, undefined, 'Soft-deleted tx should not appear');
  });

  it('DELETE on already-deleted tx returns 404', async () => {
    const { status } = await api('DELETE', `/api/transactions/${createdTxId}`, 1);
    assert.equal(status, 404);
  });
});

describe('Transaction Filtering', () => {
  it('Filter by type=income returns only income', async () => {
    const { status, data } = await api('GET', '/api/transactions?type=income', 1);
    assert.equal(status, 200);
    data.forEach((t: any) => assert.equal(t.type, 'income'));
  });

  it('Filter by type=expense returns only expense', async () => {
    const { status, data } = await api('GET', '/api/transactions?type=expense', 1);
    assert.equal(status, 200);
    data.forEach((t: any) => assert.equal(t.type, 'expense'));
  });

  it('Pagination: limit=2 returns max 2 records', async () => {
    const { status, data } = await api('GET', '/api/transactions?limit=2', 1);
    assert.equal(status, 200);
    assert.ok(data.length <= 2);
  });

  it('Search returns matching records', async () => {
    const { status, data } = await api('GET', '/api/transactions?search=Salary', 1);
    assert.equal(status, 200);
    if (data.length > 0) {
      const allMatch = data.every((t: any) =>
        t.category?.toLowerCase().includes('salary') ||
        t.description?.toLowerCase().includes('salary')
      );
      assert.ok(allMatch, 'All results should match search term');
    }
  });

  it('Date range filter works', async () => {
    const { status, data } = await api(
      'GET', '/api/transactions?startDate=2026-04-01&endDate=2026-04-30', 1
    );
    assert.equal(status, 200);
    data.forEach((t: any) => {
      assert.ok(t.date >= '2026-04-01');
      assert.ok(t.date <= '2026-04-30');
    });
  });
});

describe('Input Validation', () => {
  it('POST transaction with negative amount returns 400', async () => {
    const { status, data } = await api('POST', '/api/transactions', 1, { ...validTransaction, amount: -100 });
    assert.equal(status, 400);
    assert.equal(data.error, 'Validation failed');
  });

  it('POST transaction with missing category returns 400', async () => {
    const { status, data } = await api('POST', '/api/transactions', 1, { ...validTransaction, category: '' });
    assert.equal(status, 400);
    assert.equal(data.error, 'Validation failed');
  });

  it('POST transaction with invalid date format returns 400', async () => {
    const { status, data } = await api('POST', '/api/transactions', 1, { ...validTransaction, date: '06/04/2026' });
    assert.equal(status, 400);
    assert.equal(data.error, 'Validation failed');
  });

  it('POST transaction with invalid type returns 400', async () => {
    const { status, data } = await api('POST', '/api/transactions', 1, { ...validTransaction, type: 'savings' });
    assert.equal(status, 400);
    assert.equal(data.error, 'Validation failed');
  });

  it('POST user with invalid email returns 400', async () => {
    const { status, data } = await api('POST', '/api/users', 1, { name: 'X', email: 'not-an-email', role: 'Viewer' });
    assert.equal(status, 400);
    assert.equal(data.error, 'Validation failed');
  });

  it('POST user with invalid role returns 400', async () => {
    const { status, data } = await api('POST', '/api/users', 1, { name: 'X', email: 'x@x.com', role: 'SuperAdmin' });
    assert.equal(status, 400);
    assert.equal(data.error, 'Validation failed');
  });
});

describe('User Management (Admin)', () => {
  it('Admin can create a user (201)', async () => {
    const { status, data } = await api('POST', '/api/users', 1, {
      name: 'Test User',
      email: `test.${Date.now()}@example.com`,
      role: 'Viewer',
      status: 'active',
    });
    assert.equal(status, 201);
    assert.ok(data.id);
    assert.equal(data.role, 'Viewer');
    createdUserId = data.id;
  });

  it('Duplicate email returns 409', async () => {
    const { status, data } = await api('POST', '/api/users', 1, {
      name: 'Admin Dupe', email: 'admin@example.com', role: 'Admin'
    });
    assert.equal(status, 409);
    assert.equal(data.error, 'Conflict');
  });

  it('Admin can update a user (200)', async () => {
    const { status, data } = await api('PUT', `/api/users/${createdUserId}`, 1, {
      name: 'Updated User', email: `test.${Date.now()}@example.com`, role: 'Analyst', status: 'inactive'
    });
    assert.equal(status, 200);
    assert.equal(data.role, 'Analyst');
    assert.equal(data.status, 'inactive');
  });

  it('Inactive user cannot authenticate (401)', async () => {
    // createdUserId is now inactive — try using them as x-user-id
    const { status } = await api('GET', '/api/me', createdUserId);
    assert.equal(status, 401);
  });

  it('Admin can delete a user (204)', async () => {
    const { status } = await api('DELETE', `/api/users/${createdUserId}`, 1);
    assert.equal(status, 204);
  });

  it('DELETE on non-existent user returns 404', async () => {
    const { status } = await api('DELETE', '/api/users/999999', 1);
    assert.equal(status, 404);
  });
});

describe('Dashboard Summary', () => {
  it('GET /api/summary returns all required fields', async () => {
    const { status, data } = await api('GET', '/api/summary', 1);
    assert.equal(status, 200);
    assert.ok('totalIncome'   in data, 'Missing totalIncome');
    assert.ok('totalExpense'  in data, 'Missing totalExpense');
    assert.ok('netBalance'    in data, 'Missing netBalance');
    assert.ok('categoryWise'  in data, 'Missing categoryWise');
    assert.ok('recentActivity' in data, 'Missing recentActivity');
    assert.ok('weeklyTrends'  in data, 'Missing weeklyTrends');
    assert.ok('monthlyTrends' in data, 'Missing monthlyTrends');
  });

  it('netBalance equals totalIncome minus totalExpense', async () => {
    const { data } = await api('GET', '/api/summary', 1);
    const expected = parseFloat((data.totalIncome - data.totalExpense).toFixed(10));
    assert.equal(data.netBalance, expected);
  });

  it('categoryWise is an array', async () => {
    const { data } = await api('GET', '/api/summary', 1);
    assert.ok(Array.isArray(data.categoryWise));
  });

  it('recentActivity contains at most 5 items', async () => {
    const { data } = await api('GET', '/api/summary', 1);
    assert.ok(data.recentActivity.length <= 5);
  });
});

describe('404 on unknown API routes', () => {
  it('Unknown /api/* routes return 404', async () => {
    const { status, data } = await api('GET', '/api/nonexistent', 1);
    assert.equal(status, 404);
    assert.equal(data.error, 'Not Found');
  });
});
