import React, { useState, useEffect, useCallback } from 'react';
import {
  Zap, Server, Users, Receipt, Database, Trash2, Upload, Download, RotateCcw,
  Shield, Activity, HardDrive, Clock, TrendingUp, TrendingDown, AlertTriangle,
  CheckCircle, RefreshCw, ChevronRight, Cpu
} from 'lucide-react';
import { User } from '../types';
import { PageLoading, PageError } from './Analytics';

interface AdminStats {
  users: { total: number; active: number; roleBreakdown: { role: string; count: number }[] };
  transactions: { active: number; deleted: number; categories: number };
  financials: { totalIncome: number; totalExpense: number; netBalance: number };
  dateRange: { oldest: string | null; newest: string | null };
  topExpenseCategories: { category: string; total: number }[];
  server: { uptime: number; memoryMB: number; nodeVersion: string };
}

export default function AdminPanel({ user }: { user: User }) {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [actionResult, setActionResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [bulkJson, setBulkJson] = useState('');
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [liveStatus, setLiveStatus] = useState<'connecting' | 'live' | 'offline'>('connecting');

  const headers = { 'Content-Type': 'application/json', 'x-user-id': user.id.toString() };

  const fetchStats = useCallback(() => {
    setLoading(true); setError(null);
    fetch('/api/admin/stats', { headers })
      .then(res => { if (!res.ok) return res.json().then(b => { throw new Error(b.message); }); return res.json(); })
      .then(setStats)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [user.id]);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  // Real-time SSE Connection
  useEffect(() => {
    const sse = new EventSource('/api/stream');
    
    sse.onopen = () => setLiveStatus('live');
    sse.onerror = () => setLiveStatus('offline');
    sse.addEventListener('connected', () => setLiveStatus('live'));
    
    sse.addEventListener('DATA_UPDATE', () => fetchStats());
    sse.addEventListener('SYSTEM_UPDATE', () => fetchStats());

    return () => sse.close();
  }, [fetchStats]);

  const runAction = async (label: string, url: string, method: string, body?: any) => {
    if (label === 'Reset Database' && !confirm('⚠️ This will DELETE all data and re-seed with demo data. Are you sure?')) return;
    if (label === 'Purge Deleted' && !confirm('Permanently remove all soft-deleted transactions?')) return;

    setActionLoading(label);
    setActionResult(null);
    try {
      const res = await fetch(url, { method, headers, body: body ? JSON.stringify(body) : undefined });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Action failed');
      setActionResult({ type: 'success', message: data.message || `${label} completed successfully.` });
      fetchStats();
    } catch (err: any) {
      setActionResult({ type: 'error', message: err.message });
    } finally {
      setActionLoading(null);
    }
  };

  const handleBulkImport = async () => {
    let parsed: any[];
    try { parsed = JSON.parse(bulkJson); } catch { setActionResult({ type: 'error', message: 'Invalid JSON. Paste a valid JSON array.' }); return; }
    if (!Array.isArray(parsed)) { setActionResult({ type: 'error', message: 'Must be a JSON array of transactions.' }); return; }
    await runAction('Bulk Import', '/api/admin/bulk-import', 'POST', parsed);
    setBulkJson('');
    setShowBulkImport(false);
  };

  const handleExport = async () => {
    setActionLoading('Export Data');
    try {
      const res = await fetch('/api/admin/export', { headers });
      const data = await res.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `financedatahub-export-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setActionResult({ type: 'success', message: `Exported ${data.meta.userCount} users + ${data.meta.transactionCount} transactions.` });
    } catch (err: any) {
      setActionResult({ type: 'error', message: err.message });
    } finally {
      setActionLoading(null);
    }
  };

  const formatUptime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h}h ${m}m ${s}s`;
  };

  if (loading) return <PageLoading label="Loading Admin Control Center..." />;
  if (error) return <PageError error={error} onRetry={fetchStats} />;

  const s = stats!;
  const maxExpense = Math.max(...s.topExpenseCategories.map(c => c.total), 1);

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-display font-bold text-text-primary mb-2 flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg shadow-amber-500/20">
              <Zap className="w-6 h-6 text-white" />
            </div>
            Admin Control Center
            <div className={`ml-2 flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${
              liveStatus === 'live' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
              liveStatus === 'connecting' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
              'bg-slate-500/10 border-slate-500/20 text-slate-400'
            }`}>
              <div className={`w-1.5 h-1.5 rounded-full ${liveStatus === 'live' ? 'bg-emerald-400 animate-pulse' : liveStatus === 'connecting' ? 'bg-amber-400 animate-bounce' : 'bg-slate-400'}`} />
              {liveStatus}
            </div>
          </h2>
          <p className="text-text-secondary">System monitoring, data management, and power actions.</p>
        </div>
        <button onClick={fetchStats}
          className="flex items-center gap-2 px-4 py-2.5 bg-bg-secondary border border-border-primary text-text-secondary hover:text-text-primary rounded-xl font-medium transition-all">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </header>

      {/* Action Result Toast */}
      {actionResult && (
        <div className={`flex items-center gap-3 p-4 rounded-xl border animate-pulse-once ${
          actionResult.type === 'success'
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
        }`}>
          {actionResult.type === 'success' ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertTriangle className="w-5 h-5 shrink-0" />}
          <span className="text-sm font-medium">{actionResult.message}</span>
          <button onClick={() => setActionResult(null)} className="ml-auto text-xs opacity-60 hover:opacity-100">✕</button>
        </div>
      )}

      {/* System Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={<Users className="w-5 h-5" />} label="Total Users" value={s.users.total} sub={`${s.users.active} active`} color="brand" />
        <StatCard icon={<Receipt className="w-5 h-5" />} label="Transactions" value={s.transactions.active} sub={`${s.transactions.deleted} deleted`} color="emerald" />
        <StatCard icon={<TrendingUp className="w-5 h-5" />} label="Total Income" value={`$${s.financials.totalIncome.toLocaleString()}`} sub="all time" color="emerald" />
        <StatCard icon={<TrendingDown className="w-5 h-5" />} label="Total Expense" value={`$${s.financials.totalExpense.toLocaleString()}`} sub="all time" color="rose" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Server Info + Role Breakdown */}
        <div className="space-y-6">
          {/* Server Health */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
              <Server className="w-4 h-4 text-brand-500" /> Server Health
            </h3>
            <div className="space-y-3">
              <InfoRow icon={<Clock className="w-3.5 h-3.5" />} label="Uptime" value={formatUptime(s.server.uptime)} />
              <InfoRow icon={<Cpu className="w-3.5 h-3.5" />} label="Memory" value={`${s.server.memoryMB} MB`} />
              <InfoRow icon={<HardDrive className="w-3.5 h-3.5" />} label="Node.js" value={s.server.nodeVersion} />
              <InfoRow icon={<Database className="w-3.5 h-3.5" />} label="Database" value="SQLite" />
              <InfoRow icon={<Activity className="w-3.5 h-3.5" />} label="Categories" value={s.transactions.categories.toString()} />
            </div>
          </div>

          {/* Role Breakdown */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-brand-500" /> User Roles
            </h3>
            <div className="space-y-3">
              {s.users.roleBreakdown.map(r => {
                const pct = s.users.total > 0 ? (r.count / s.users.total) * 100 : 0;
                const colors: Record<string, string> = {
                  Admin: 'bg-indigo-500', Analyst: 'bg-brand-500', Viewer: 'bg-purple-500'
                };
                return (
                  <div key={r.role}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-bold text-text-primary">{r.role}</span>
                      <span className="text-text-secondary">{r.count} ({pct.toFixed(0)}%)</span>
                    </div>
                    <div className="h-2 bg-bg-primary rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-500 ${colors[r.role] || 'bg-slate-500'}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Center: Power Actions */}
        <div className="space-y-6">
          <div className="glass-card p-5">
            <h3 className="text-sm font-bold text-text-primary mb-5 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" /> Power Actions
            </h3>
            <div className="space-y-3">
              <ActionButton
                icon={<Trash2 className="w-4 h-4" />} label="Purge Deleted"
                desc="Permanently remove soft-deleted records"
                color="rose" loading={actionLoading === 'Purge Deleted'}
                badge={s.transactions.deleted > 0 ? `${s.transactions.deleted} pending` : undefined}
                onClick={() => runAction('Purge Deleted', '/api/admin/purge', 'POST')}
              />
              <ActionButton
                icon={<Upload className="w-4 h-4" />} label="Bulk Import"
                desc="Import transactions from JSON"
                color="brand" loading={actionLoading === 'Bulk Import'}
                onClick={() => setShowBulkImport(!showBulkImport)}
              />
              <ActionButton
                icon={<Download className="w-4 h-4" />} label="Export Data"
                desc="Download all data as JSON"
                color="emerald" loading={actionLoading === 'Export Data'}
                onClick={handleExport}
              />
              <ActionButton
                icon={<RotateCcw className="w-4 h-4" />} label="Reset Database"
                desc="Wipe all data and re-seed demos"
                color="amber" loading={actionLoading === 'Reset Database'}
                onClick={() => runAction('Reset Database', '/api/admin/reset', 'POST')}
                danger
              />
            </div>
          </div>

          {/* Bulk Import Panel */}
          {showBulkImport && (
            <div className="glass-card p-5 border-brand-500/30">
              <h4 className="text-sm font-bold text-text-primary mb-3">Bulk Import — Paste JSON</h4>
              <textarea
                value={bulkJson}
                onChange={e => setBulkJson(e.target.value)}
                placeholder={`[\n  { "amount": 500, "type": "income", "category": "Sales", "date": "2026-04-06" },\n  { "amount": 120, "type": "expense", "category": "Office", "date": "2026-04-06" }\n]`}
                className="w-full min-h-[140px] p-3 glass-input font-mono text-xs resize-none mb-3"
              />
              <div className="flex gap-2">
                <button onClick={() => setShowBulkImport(false)}
                  className="flex-1 px-3 py-2 text-xs font-bold text-text-secondary bg-bg-secondary border border-border-primary rounded-lg">Cancel</button>
                <button onClick={handleBulkImport} disabled={!bulkJson.trim()}
                  className="flex-1 px-3 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 rounded-lg disabled:opacity-40 transition-colors">
                  Import
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Top Expense Categories */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-bold text-text-primary mb-5 flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-rose-500" /> Top Spending Categories
          </h3>
          <div className="space-y-4">
            {s.topExpenseCategories.length === 0 ? (
              <p className="text-sm text-text-secondary text-center py-8">No expense data yet.</p>
            ) : (
              s.topExpenseCategories.map((cat, i) => {
                const pct = (cat.total / maxExpense) * 100;
                return (
                  <div key={cat.category}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="font-bold text-text-primary flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-[10px] text-rose-400 font-bold">{i + 1}</span>
                        {cat.category}
                      </span>
                      <span className="font-bold text-rose-400">${cat.total.toLocaleString()}</span>
                    </div>
                    <div className="h-2 bg-bg-primary rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-rose-500/60 to-rose-500 transition-all duration-700" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Date Range */}
          {s.dateRange.oldest && (
            <div className="mt-6 pt-4 border-t border-border-primary/30">
              <p className="text-xs text-text-secondary">
                Data spans <span className="font-bold text-text-primary">{s.dateRange.oldest}</span> to <span className="font-bold text-text-primary">{s.dateRange.newest}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatCard({ icon, label, value, sub, color }: { icon: React.ReactNode; label: string; value: string | number; sub: string; color: string }) {
  const colors: Record<string, string> = {
    brand: 'text-brand-400 bg-brand-500/10 border-brand-500/20',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    rose: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  };
  return (
    <div className="glass-card p-4 group hover:shadow-lg transition-all">
      <div className={`inline-flex p-2 rounded-lg border mb-3 ${colors[color]}`}>{icon}</div>
      <p className="text-2xl font-display font-bold text-text-primary">{value}</p>
      <p className="text-xs text-text-secondary font-medium mt-1">{label} · {sub}</p>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="flex items-center gap-2 text-text-secondary font-medium">{icon}{label}</span>
      <span className="font-bold text-text-primary">{value}</span>
    </div>
  );
}

function ActionButton({ icon, label, desc, color, loading, onClick, danger, badge }: {
  icon: React.ReactNode; label: string; desc: string; color: string; loading: boolean; onClick: () => void; danger?: boolean; badge?: string;
}) {
  const base = danger
    ? 'border-rose-500/20 hover:border-rose-500/40 hover:bg-rose-500/10'
    : 'border-border-primary/50 hover:border-brand-500/30 hover:bg-bg-primary/50';
  return (
    <button onClick={onClick} disabled={loading}
      className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left group disabled:opacity-60 ${base}`}>
      <div className={`p-2 rounded-lg bg-${color}-500/10 text-${color}-400 shrink-0`}>
        {loading ? <div className="w-4 h-4 rounded-full border-2 border-current/30 border-t-current animate-spin" /> : icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-text-primary flex items-center gap-2">
          {label}
          {badge && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold">{badge}</span>}
        </p>
        <p className="text-xs text-text-secondary truncate">{desc}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-text-secondary/30 group-hover:text-text-secondary transition-colors shrink-0" />
    </button>
  );
}
