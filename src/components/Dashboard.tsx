import React, { useState, useEffect, useCallback } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Activity, PieChart as PieChartIcon, BarChart as BarChartIcon, AlertCircle, RefreshCw } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Summary, User } from '../types';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function Dashboard({ user }: { user: User }) {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [liveStatus, setLiveStatus] = useState<'connecting' | 'live' | 'offline'>('connecting');
  const [liveMessage, setLiveMessage] = useState<string | null>(null);

  const fetchSummary = useCallback(() => {
    setLoading(true);
    setError(null);
    fetch('/api/summary', {
      headers: { 'x-user-id': user.id.toString() }
    })
      .then(res => {
        if (!res.ok) {
          return res.json().catch(() => null).then(body => {
            throw new Error(body?.message || `Server error: ${res.status}`);
          });
        }
        return res.json();
      })
      .then(data => {
        setSummary(data);
        setError(null);
      })
      .catch(err => {
        setError(err.message || 'Failed to load dashboard. Is the server running?');
      })
      .finally(() => setLoading(false));
  }, [user.id]);

  useEffect(() => { fetchSummary(); }, [fetchSummary]);

  // Real-time SSE Connection
  useEffect(() => {
    const sse = new EventSource('/api/stream');
    
    sse.onopen = () => setLiveStatus('live');
    sse.onerror = () => setLiveStatus('offline');
    
    sse.addEventListener('connected', () => setLiveStatus('live'));
    
    sse.addEventListener('DATA_UPDATE', (e) => {
      try {
        const payload = JSON.parse(e.data);
        setLiveMessage(payload.message || 'Data updated');
        fetchSummary();
        setTimeout(() => setLiveMessage(null), 3000);
      } catch (err) {}
    });

    sse.addEventListener('SYSTEM_UPDATE', (e) => {
      try {
        const payload = JSON.parse(e.data);
        setLiveMessage(payload.message || 'System updated');
        fetchSummary();
        setTimeout(() => setLiveMessage(null), 3000);
      } catch (err) {}
    });

    return () => sse.close();
  }, [fetchSummary]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-96 gap-4">
      <div className="w-12 h-12 rounded-full border-4 border-brand-500/30 border-t-brand-500 animate-spin" />
      <p className="text-text-secondary font-medium">Loading dashboard...</p>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center h-96 gap-6 text-center">
      <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20">
        <AlertCircle className="w-10 h-10 text-rose-400" />
      </div>
      <div>
        <h3 className="text-lg font-bold text-text-primary mb-2">Failed to load dashboard</h3>
        <p className="text-text-secondary text-sm max-w-md">{error}</p>
      </div>
      <button
        onClick={fetchSummary}
        className="flex items-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-xl font-medium hover:bg-brand-500 transition-all"
      >
        <RefreshCw className="w-4 h-4" /> Retry
      </button>
    </div>
  );

  // Use fallback empty arrays/values if summary is somehow null
  const safe = summary ?? {
    totalIncome: 0, totalExpense: 0, netBalance: 0,
    categoryWise: [], recentActivity: [], weeklyTrends: []
  };

  const expenseCategories = safe.categoryWise.filter(c => c.type === 'expense');

  return (
    <div className="space-y-8">
      <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold text-text-primary mb-2 flex items-center gap-3">
            Financial Overview
            <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${
              liveStatus === 'live' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
              liveStatus === 'connecting' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
              'bg-slate-500/10 border-slate-500/20 text-slate-400'
            }`}>
              <div className={`w-1.5 h-1.5 rounded-full ${liveStatus === 'live' ? 'bg-emerald-400 animate-pulse' : liveStatus === 'connecting' ? 'bg-amber-400 animate-bounce' : 'bg-slate-400'}`} />
              {liveStatus}
            </div>
          </h2>
          <p className="text-text-secondary font-medium">
            Welcome back, <span className="text-brand-500 font-semibold">{user.name}</span>.{' '}
            <span className="text-xs px-2 py-0.5 rounded-full border border-brand-500/20 bg-brand-500/10 text-brand-400 font-bold uppercase tracking-wider">{user.role}</span>
          </p>
        </div>
        
        {liveMessage && (
          <div className="animate-in fade-in slide-in-from-top-4 px-4 py-2 bg-brand-500/10 border border-brand-500/20 text-brand-400 text-sm font-bold rounded-xl flex items-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin" /> {liveMessage}
          </div>
        )}
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Income" value={`$${safe.totalIncome.toLocaleString()}`} icon={<TrendingUp className="w-6 h-6 text-emerald-400" />} color="bg-emerald-500/10 border-emerald-500/20" />
        <StatCard title="Total Expenses" value={`$${safe.totalExpense.toLocaleString()}`} icon={<TrendingDown className="w-6 h-6 text-rose-400" />} color="bg-rose-500/10 border-rose-500/20" />
        <StatCard title="Net Balance" value={`$${safe.netBalance.toLocaleString()}`} icon={<DollarSign className="w-6 h-6 text-brand-400" />} color={`${safe.netBalance >= 0 ? 'bg-brand-500/10 border-brand-500/20' : 'bg-rose-500/10 border-rose-500/20'}`} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-text-primary">
            <BarChartIcon className="w-5 h-5 text-brand-500" /> Weekly Trends
          </h3>
          <div className="h-72">
            {safe.weeklyTrends.length === 0 ? (
              <EmptyChart label="No data for the last 7 days" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={safe.weeklyTrends}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tick={{ fill: '#94a3b8' }} />
                  <YAxis stroke="#94a3b8" fontSize={11} tick={{ fill: '#94a3b8' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc', borderRadius: '1rem' }} />
                  <Legend />
                  <Bar dataKey="income" fill="#34d399" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expense" fill="#fb7185" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-text-primary">
            <PieChartIcon className="w-5 h-5 text-brand-500" /> Expense by Category
          </h3>
          <div className="h-72">
            {expenseCategories.length === 0 ? (
              <EmptyChart label="No expense categories yet" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={expenseCategories} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="total" nameKey="category">
                    {expenseCategories.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc', borderRadius: '1rem' }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-border-primary/50 flex items-center justify-between bg-bg-secondary/30">
          <h3 className="text-lg font-semibold flex items-center gap-2 text-text-primary">
            <Activity className="w-5 h-5 text-brand-500" /> Recent Activity
          </h3>
          <span className="text-xs text-text-secondary font-medium">Last 5 transactions</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-bg-primary/50">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Description</th>
                <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-primary/30">
              {safe.recentActivity.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-text-secondary font-medium">No recent activity</td></tr>
              ) : (
                safe.recentActivity.map((tx) => (
                  <tr key={tx.id} className="hover:bg-bg-primary/40 transition-colors">
                    <td className="px-6 py-4 text-sm text-text-secondary font-medium">{tx.date}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-3 py-1 rounded-full bg-bg-primary border border-border-primary text-xs font-bold text-text-secondary">{tx.category}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary font-medium">{tx.description || '—'}</td>
                    <td className={`px-6 py-4 text-sm font-bold text-right ${tx.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {tx.type === 'income' ? '+' : '-'}${tx.amount.toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }: { title: string; value: string; icon: React.ReactNode; color: string }) {
  return (
    <div className="glass-card p-6 overflow-hidden relative group">
      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full blur-[20px] transition-all duration-500 group-hover:scale-150 ${color.split(' ')[0]}`} />
      <div className="relative z-10 flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl border backdrop-blur-md ${color}`}>{icon}</div>
        <span className="text-xs font-bold text-text-secondary uppercase tracking-widest">{title}</span>
      </div>
      <div className="relative z-10">
        <h4 className="text-3xl font-display font-bold text-text-primary tracking-tight">{value}</h4>
      </div>
    </div>
  );
}

function EmptyChart({ label }: { label: string }) {
  return (
    <div className="h-full flex items-center justify-center">
      <p className="text-text-secondary text-sm font-medium">{label}</p>
    </div>
  );
}
