## FinanceHub

FinanceHub is a role-based financial ledger and analytics platform that gives organizations a single, governed system for recording transactions, analyzing cash flow, and reporting financial health — with access tailored to who is looking at it.

### Technology Stack

**Node.js & Express** powers the backend for a lightweight, fast, and widely-supported REST API layer with a mature middleware ecosystem — ideal for layering authentication, RBAC, and rate limiting cleanly.

**SQLite** serves as the database for its zero-configuration setup, file-based portability, and sufficient performance for a single-organization ledger, while still using standard SQL constraints (e.g., unique email enforcement) for data integrity.

**React with Vite** drives the frontend for fast development iteration, component reusability across role-specific views, and a modern hot-reload workflow.

**Tailwind CSS** handles styling for consistent, utility-first design that scales across many pages and roles without bloating a separate stylesheet per view.

**Framer Motion** adds the interface's motion layer — animated transitions, live-updating counters, and micro-interactions — so real-time data changes are felt, not just displayed.

**Server-Sent Events (SSE)** keep dashboards and activity feeds synchronized in real time without the overhead of a full WebSocket implementation, suited to one-directional server-to-client updates like transaction and system alerts.

**Zod** validates all incoming data at the API boundary, ensuring malformed or malicious payloads are rejected before reaching business logic or the database.

### Admin

The Admin operates with full visibility and control across the system: managing users, editing or removing any transaction, reviewing the audit trail, and overseeing server health from the Control Center. Admin access also extends to reviewing what Analysts and Viewers see and do, supporting governance and accountability across every role.

### Analyst

The Analyst is equipped for financial interpretation rather than data entry: full access to transaction history, analytics, and reporting tools, with the ability to model forecasts and surface category-level trends — but without permission to alter the underlying ledger.

### Viewer

The Viewer represents a stakeholder perspective: a clear, read-only view of financial performance through dashboards, statements, and summarized insights, designed for transparency without any risk of accidental data modification.# Finance-Data-Hub
