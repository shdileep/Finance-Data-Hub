import React, { useState, useEffect, useCallback } from 'react';
import { Clock, Search, RefreshCw } from 'lucide-react';
import { User, Transaction } from '../types';
import { PageLoading, PageError } from './Analytics';

interface AccessLog {
  id: number;
  method: string;
  endpoint: string;
  ip: string;
  created_at: string;
  userName: string | null;
  userId: number | null;
}

export default function AuditLog({ user }: { user: User }) {
  const [logs, setLogs] = useState<AccessLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const LIMIT = 15;

  const fetchData = useCallback(() => {
    setLoading(true); setError(null);
    const params = new URLSearchParams({ limit: LIMIT.toString(), offset: (page * LIMIT).toString() });
    if (search) params.append('search', search);
    fetch(`/api/audit-logs?${params}`, { headers: { 'x-user-id': user.id.toString() } })
      .then(res => { if (!res.ok) return res.json().then(b => { throw new Error(b.message || `Error ${res.status}`); }); return res.json(); })
      .then(data => setLogs(Array.isArray(data) ? data : []))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [user.id, search, page]);

  useEffect(() => { setPage(0); }, [search]);
  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) return <PageLoading label="Loading audit log..." />;
  if (error) return <PageError error={error} onRetry={fetchData} />;

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-display font-bold text-text-primary mb-2">Access & Audit Log</h2>
          <p className="text-text-secondary">System-wide log of every user request and action.</p>
        </div>
        <button onClick={fetchData}
          className="flex items-center gap-2 px-5 py-2.5 bg-bg-secondary border border-border-primary text-text-secondary hover:text-text-primary rounded-xl font-medium transition-all shrink-0">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </header>

      {/* Search */}
      <div className="glass-card p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input type="text" placeholder="Search by endpoint or user name..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 p-2.5 glass-input" />
        </div>
      </div>

      {/* Audit Table */}
      <div className="glass-card overflow-hidden">
        <div className="p-5 border-b border-border-primary/50 bg-bg-secondary/30 flex items-center gap-2">
          <Clock className="w-5 h-5 text-brand-500" />
          <h3 className="text-base font-semibold text-text-primary">System Access Records</h3>
          <span className="ml-auto text-xs px-2.5 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 font-bold">
            Page {page + 1}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-bg-primary/50">
              <tr>
                <th className="px-5 py-3 text-xs font-bold text-text-secondary uppercase tracking-wider">Time</th>
                <th className="px-5 py-3 text-xs font-bold text-text-secondary uppercase tracking-wider">User</th>
                <th className="px-5 py-3 text-xs font-bold text-text-secondary uppercase tracking-wider">Method</th>
                <th className="px-5 py-3 text-xs font-bold text-text-secondary uppercase tracking-wider">Endpoint</th>
                <th className="px-5 py-3 text-xs font-bold text-text-secondary uppercase tracking-wider text-right">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-primary/30 font-mono text-xs">
              {logs.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-text-secondary font-sans">No access records found.</td></tr>
              ) : (
                logs.map(log => (
                  <tr key={log.id} className="hover:bg-bg-primary/40 transition-colors">
                    <td className="px-5 py-3 text-text-secondary">{new Date(log.created_at).toLocaleString()}</td>
                    <td className="px-5 py-3 font-bold text-brand-400">{log.userName || <span className="text-slate-500 font-normal">Anonymous</span>}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded font-bold border text-[10px] ${
                        log.method === 'GET' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                        log.method === 'DELETE' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' :
                        'bg-amber-500/10 border-amber-500/20 text-amber-400'
                      }`}>
                        {log.method}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-bold text-text-primary truncate max-w-[200px]" title={log.endpoint}>{log.endpoint}</td>
                    <td className="px-5 py-3 text-text-secondary text-right">{log.ip}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 bg-bg-secondary/30 border-t border-border-primary/50 flex items-center justify-between">
          <p className="text-xs text-text-secondary">Showing {logs.length} records</p>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
              className="px-3 py-1.5 text-xs font-bold text-text-secondary bg-bg-secondary border border-border-primary hover:bg-bg-primary disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-all">← Prev</button>
            <button onClick={() => setPage(p => p + 1)} disabled={logs.length < LIMIT}
              className="px-3 py-1.5 text-xs font-bold text-text-secondary bg-bg-secondary border border-border-primary hover:bg-bg-primary disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-all">Next →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
