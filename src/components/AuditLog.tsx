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
  const [selectedMethods, setSelectedMethods] = useState<string[]>([]);
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

  const handleExportCSV = () => {
    let csv = 'ID,Time,User,Method,Endpoint,IP\n';
    logs.forEach(log => {
      csv += `${log.id},"${log.created_at}","${log.userName || 'Anonymous'}",${log.method},"${log.endpoint}",${log.ip}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleMethodFilter = (method: string) => {
    setSelectedMethods(prev => {
      const next = new Set(prev);
      if (next.has(method)) {
        next.delete(method);
      } else {
        next.add(method);
      }
      return Array.from(next);
    });
  };

  const filteredLogs = logs.filter(log => {
    if (selectedMethods.length === 0) return true;
    return selectedMethods.includes(log.method);
  });

  if (loading) return <PageLoading label="Loading audit log..." />;
  if (error) return <PageError error={error} onRetry={fetchData} />;

  return (
    <div className="space-y-6 animate-in fade-in">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-display font-bold text-text-primary mb-2">Access & Audit Log</h2>
          <p className="text-text-secondary">System-wide log of every user request and action.</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button onClick={handleExportCSV}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-350 hover:text-white rounded-xl font-medium transition-all">
            Export CSV
          </button>
          <button onClick={fetchData}
            className="flex items-center gap-2 px-5 py-2.5 bg-bg-secondary border border-border-primary text-text-secondary hover:text-text-primary rounded-xl font-medium transition-all">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>
      </header>

      {/* Search and Chips */}
      <div className="glass-card p-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input type="text" placeholder="Search by endpoint or user name..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 p-2.5 glass-input" />
        </div>

        <div className="flex flex-wrap gap-2 items-center pt-2">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider mr-2">Filter Method:</span>
          {['GET', 'POST', 'PUT', 'DELETE', 'IMPERSONATION', 'SANDBOX', 'GOVERNANCE_REQ'].map(method => {
            const active = selectedMethods.includes(method);
            return (
              <button 
                key={method} 
                onClick={() => toggleMethodFilter(method)}
                className={`px-3 py-1 rounded text-[10px] font-bold border transition-colors ${
                  active 
                    ? 'bg-brand-500/15 border-brand-500/30 text-brand-400 font-bold' 
                    : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                {method}
              </button>
            );
          })}
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
              {filteredLogs.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-text-secondary font-sans">No access records found.</td></tr>
              ) : (
                filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-bg-primary/40 transition-colors">
                    <td className="px-5 py-3 text-text-secondary">{new Date(log.created_at).toLocaleString()}</td>
                    <td className="px-5 py-3 font-bold text-brand-400">{log.userName || <span className="text-slate-500 font-normal font-sans">Anonymous</span>}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded font-bold border text-[10px] ${
                        log.method === 'GET' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                        log.method === 'DELETE' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' :
                        log.method === 'IMPERSONATION' ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' :
                        log.method === 'SANDBOX' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400 font-bold' :
                        'bg-blue-500/10 border-blue-500/20 text-blue-400'
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
          <p className="text-xs text-text-secondary">Showing {filteredLogs.length} records</p>
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
