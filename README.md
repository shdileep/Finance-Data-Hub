# FinanceDataHub

A role-based finance dashboard system with a **Node.js + Express** backend, **SQLite** persistence, and a **React + TypeScript** frontend.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Node.js, Express, TypeScript |
| Database | SQLite via `better-sqlite3` |
| Validation | Zod |
| Frontend | React 19, TypeScript, Recharts |
| Styling | Tailwind CSS v4 |
| Dev Server | Vite + tsx |

---

## Quick Start

```bash
# Install dependencies
npm install

# Start the development server (backend + frontend together)
npm run dev
```

Open **http://localhost:3000** in your browser.

---

## Mock Authentication

Authentication is simulated via the `x-user-id` request header.

| Header Value | User | Role |
|---|---|---|
| `x-user-id: 1` | Admin User | Admin |
| `x-user-id: 2` | Analyst User | Analyst |
| `x-user-id: 3` | Viewer User | Viewer |

On the frontend, select a role from the login screen. Internally this sets `localStorage.userId` which is sent with every API request.

---

## Role Permissions

| Action | Admin | Analyst | Viewer |
|--------|:-----:|:-------:|:------:|
| View dashboard summary | ✅ | ✅ | ✅ |
| View transactions | ✅ | ✅ | ✅ |
| Create transactions | ✅ | ❌ | ❌ |
| Update transactions | ✅ | ❌ | ❌ |
| Delete transactions (soft) | ✅ | ❌ | ❌ |
| View users list | ✅ | ❌ | ❌ |
| Create/Edit/Delete users | ✅ | ❌ | ❌ |

---

## API Reference

### Health
```
GET /api/health
```
No auth required. Returns server + DB status.

---

### Auth / Me
```
GET /api/me
Headers: x-user-id: <id>
```
Returns the authenticated user object.

---

### Users _(Admin only)_

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/users` | List all users |
| `POST` | `/api/users` | Create a user |
| `PUT` | `/api/users/:id` | Update a user |
| `DELETE` | `/api/users/:id` | Delete a user |

**POST/PUT body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "role": "Analyst",
  "status": "active"
}
```

---

### Transactions _(Read: all roles | Write: Admin only)_

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/transactions` | List transactions (filtered, paginated) |
| `POST` | `/api/transactions` | Create a transaction |
| `PUT` | `/api/transactions/:id` | Update a transaction |
| `DELETE` | `/api/transactions/:id` | Soft-delete a transaction |

**Query parameters for GET:**
| Param | Type | Description |
|-------|------|-------------|
| `type` | `income\|expense` | Filter by type |
| `category` | string | Filter by category (partial match) |
| `search` | string | Search category + description |
| `startDate` | `YYYY-MM-DD` | Start of date range |
| `endDate` | `YYYY-MM-DD` | End of date range |
| `limit` | number | Records per page (max 100, default 20) |
| `offset` | number | Pagination offset (default 0) |

**POST/PUT body:**
```json
{
  "amount": 2500.00,
  "type": "income",
  "category": "Freelance",
  "date": "2026-04-06",
  "description": "Project payment"
}
```

---

### Dashboard Summary _(All roles)_

```
GET /api/summary
Headers: x-user-id: <id>
```

**Response:**
```json
{
  "totalIncome": 8000,
  "totalExpense": 1550,
  "netBalance": 6450,
  "categoryWise": [{ "category": "Salary", "type": "income", "total": 5000 }],
  "recentActivity": [...],
  "weeklyTrends": [{ "date": "2026-04-01", "income": 5000, "expense": 1200 }],
  "monthlyTrends": [{ "month": "2026-04", "income": 8000, "expense": 1550 }]
}
```

---

## Error Responses

All API errors return structured JSON:

```json
{
  "error": "Forbidden",
  "message": "This action requires one of: [Admin]. Your role: Viewer"
}
```

| Status | Meaning |
|--------|---------|
| `400` | Validation error (bad request body) |
| `401` | Missing or invalid `x-user-id` |
| `403` | Insufficient role permissions |
| `404` | Resource not found |
| `409` | Conflict (e.g. duplicate email) |
| `500` | Internal server error |

---

## Data Model

### Users table
```sql
id, name, email (unique), role (Admin|Analyst|Viewer), status (active|inactive), created_at
```

### Transactions table
```sql
id, amount, type (income|expense), category, date (YYYY-MM-DD),
description, userId (FK), is_deleted (soft delete), created_at
```

---

## Project Architecture

```
d:\financedatahub\
├── server.ts                    ← Thin route definitions (delegates to layers)
├── src/
│   ├── middleware/
│   │   └── auth.ts              ← Authentication + RBAC middleware
│   ├── validators/
│   │   └── index.ts             ← Zod input schemas (shared types)
│   ├── services/
│   │   └── index.ts             ← Business logic layer
│   ├── models/
│   │   └── index.ts             ← Database query wrappers (SQLite)
│   ├── db.ts                    ← DB connection, schema, seed data
│   ├── types.ts                 ← Shared TypeScript interfaces
│   └── components/              ← React frontend components
├── tests/
│   └── integration.test.ts      ← 35+ integration tests
└── FinanceDataHub.postman_collection.json
```

**Request flow:** `Client → Rate Limiter → Auth Middleware → RBAC Check → Route Handler → Service → Model → SQLite`

---

## Design Decisions & Tradeoffs

- **Layered architecture** — Routes, middleware, validators, services, and models are each in their own module. This separation makes individual layers testable and replaceable.
- **SQLite** was chosen for zero-setup simplicity. The Model layer can be swapped to PostgreSQL/MongoDB without changing services or routes.
- **Mock auth** via header is intentional for local development. In production, replace `src/middleware/auth.ts` with JWT verification.
- **Soft delete** on transactions preserves audit history while hiding deleted records from normal queries.
- **Zod schemas** serve as both runtime validators and living documentation of accepted request shapes.
- **Two-tier rate limiting** — loose global limit for reads, strict limit for writes — balances usability with abuse prevention.

---

## Optional Enhancements Implemented

- ✅ Pagination (`limit` / `offset`) on transactions
- ✅ Full-text search on transactions
- ✅ Soft delete (`is_deleted` flag — preserves audit history)
- ✅ Monthly + weekly trend aggregations
- ✅ Structured error responses with HTTP status codes
- ✅ Postman collection (`FinanceDataHub.postman_collection.json`)
- ✅ **Rate Limiting** — Global 100 req/15 min per IP; write operations limited to 20 req/15 min
- ✅ **Integration Tests** — 35+ test cases covering auth, RBAC, CRUD, filtering, validation, summary

---

## Rate Limiting

| Scope | Limit | Window |
|-------|-------|--------|
| All `/api/*` routes | 100 requests | 15 minutes per IP |
| Write routes (POST/PUT/DELETE) | 20 requests | 15 minutes per IP |

Exceeded limits return `429 Too Many Requests`:
```json
{ "error": "Too Many Requests", "message": "Rate limit exceeded. Try again in 15 minutes." }
```

---

## Running Integration Tests

> **Server must be running first:** `npm run dev`

In a second terminal:
```bash
npm test
```

Tests cover:
- ✅ Health check
- ✅ Authentication (missing header, invalid user)
- ✅ RBAC enforcement (Viewer/Analyst blocked from write ops)
- ✅ Full transaction CRUD (create, read, update, soft-delete)
- ✅ Transaction filtering (type, date range, search, pagination)
- ✅ Input validation (negative amount, bad date format, invalid role)
- ✅ User management (create, update, deactivate, delete)
- ✅ Inactive user blocked at auth
- ✅ Dashboard summary fields + math assertions
- ✅ Unknown route 404 handling

---

## Postman Collection

Import `FinanceDataHub.postman_collection.json` into Postman.  
Set the `base_url` variable to `http://localhost:3000` and `user_id` to `1`, `2`, or `3`.
