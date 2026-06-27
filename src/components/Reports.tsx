import React, { useState, useEffect, useCallback } from 'react';
import { Download, Filter, FileText, RefreshCw } from 'lucide-react';
import { User, Transaction } from '../types';
import { PageLoading, PageError } from './Analytics';

export default function Reports({ user }: { user: User }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  // Recurring schedules
  const [scheduleInterval, setScheduleInterval] = useState('monthly');
  const [scheduleActive, setScheduleActive] = useState(true);

  const applyTemplate = (tpl: string) => {
    const today = new Date();
    if (tpl === 'monthly_summary') {
      const y = today.getFullYear();
      const m = today.getMonth() + 1;
      const mStr = m < 10 ? `0${m}` : `${m}`;
      setDateFrom(`${y}-${mStr}-01`);
      setDateTo(today.toISOString().split('T')[0]);
      setTypeFilter('');
    } else if (tpl === 'anomaly_audit') {
      const prevDate = new Date();
      prevDate.setDate(today.getDate() - 90);
      setDateFrom(prevDate.toISOString().split('T')[0]);
      setDateTo(today.toISOString().split('T')[0]);
      setTypeFilter('expense');
    }
  };

  const fetchData = useCallback(() => {
    setLoading(true); setError(null);
    const params = new URLSearchParams({ limit: '500' });
    if (dateFrom) params.append('startDate', dateFrom);
    if (dateTo) params.append('endDate', dateTo);
    if (typeFilter) params.append('type', typeFilter);
    fetch(`/api/transactions?${params}`, { headers: { 'x-user-id': user.id.toString() } })
      .then(res => { if (!res.ok) return res.json().then(b => { throw new Error(b.message || `Error ${res.status}`); }); return res.json(); })
      .then(data => setTransactions(Array.isArray(data) ? data : []))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [user.id, dateFrom, dateTo, typeFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ── Aggregations ─────────────────────────────────────────────────────────────
  const totalIncome  = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const netBalance   = totalIncome - totalExpense;

  const categoryTotals = transactions.reduce<Record<string, { income: number; expense: number }>>((acc, t) => {
    if (!acc[t.category]) acc[t.category] = { income: 0, expense: 0 };
    acc[t.category][t.type] += t.amount;
    return acc;
  }, {});

  // ── CSV Export ───────────────────────────────────────────────────────────────
  const exportCSV = () => {
    const headers = ['Date', 'Category', 'Type', 'Amount', 'Description'];
    const rows = transactions.map(t => [
      t.date, t.category, t.type, t.amount.toFixed(2), (t.description || '').replace(/,/g, ';')
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `finance-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <PageLoading label="Building report..." />;
  if (error) return <PageError error={error} onRetry={fetchData} />;

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-display font-bold text-text-primary mb-2">Reports</h2>
          <p className="text-text-secondary">Generate and export financial summaries.</p>
        </div>
        <button onClick={exportCSV} disabled={transactions.length === 0}
          className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0">
          <Download className="w-5 h-5" /> Export CSV ({transactions.length})
        </button>
      </header>

      {/* Templates & Schedules config */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Filters */}
        <div className="lg:col-span-2 glass-card p-5 flex flex-wrap gap-4 items-end">
          <div className="flex-[0_0_180px]">
            <label className="block text-xs font-bold text-text-secondary uppercase tracking-widest mb-2">From Date</label>
            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
              className="w-full p-2.5 glass-input !text-text-primary [color-scheme:dark]" />
          </div>
          <div className="flex-[0_0_180px]">
            <label className="block text-xs font-bold text-text-secondary uppercase tracking-widest mb-2">To Date</label>
            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
              className="w-full p-2.5 glass-input !text-text-primary [color-scheme:dark]" />
          </div>
          <div className="flex-[0_0_150px]">
            <label className="block text-xs font-bold text-text-secondary uppercase tracking-widest mb-2">Type</label>
            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
              className="w-full p-2.5 glass-input appearance-none bg-bg-secondary/80 text-text-primary">
              <option value="">All</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          <button onClick={() => { setDateFrom(''); setDateTo(''); setTypeFilter(''); }}
            className="px-4 py-2.5 text-sm font-bold text-text-secondary bg-bg-secondary border border-border-primary hover:bg-bg-primary rounded-xl h-[46px] transition-all">
            Reset
          </button>
        </div>

        {/* Preset Templates */}
        <div className="glass-card p-5 space-y-3">
          <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">Report Templates</h4>
          <div className="flex flex-col gap-2">
            <button 
              onClick={() => applyTemplate('monthly_summary')}
              className="w-full text-left px-3 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 hover:text-white rounded border border-slate-700 transition-colors"
            >
              💼 Monthly Executive Summary
            </button>
            <button 
              onClick={() => applyTemplate('anomaly_audit')}
              className="w-full text-left px-3 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 hover:text-white rounded border border-slate-700 transition-colors"
            >
              🔍 90-Day Anomaly Audit
            </button>
          </div>
        </div>
      </div>

      {/* Automated Recurring Reports Scheduling */}
      <div className="glass-card p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
        <div>
          <h4 className="text-sm font-bold text-text-primary">Automated Recurring Report Builder</h4>
          <p className="text-xs text-slate-400 mt-1">Configure system to compile and email summaries automatically.</p>
        </div>
        <div className="flex items-center gap-4 justify-end">
          <select 
            value={scheduleInterval} 
            onChange={e => setScheduleInterval(e.target.value)}
            className="bg-bg-primary border border-border-primary rounded px-3 py-1.5 text-xs text-text-primary font-medium"
          >
            <option value="weekly">Weekly Schedule</option>
            <option value="monthly">Monthly Schedule</option>
          </select>
          <button 
            onClick={() => {
              setScheduleActive(!scheduleActive);
              alert(`Recurring ${scheduleInterval} report status toggled to: ${!scheduleActive ? 'Active' : 'Inactive'}`);
            }}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              scheduleActive 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                : 'bg-slate-800 text-slate-400 border border-transparent'
            }`}
          >
            {scheduleActive ? 'ACTIVE' : 'INACTIVE'}
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryCard label="Total Income" value={`$${totalIncome.toLocaleString()}`} color="text-emerald-400" />
        <SummaryCard label="Total Expenses" value={`$${totalExpense.toLocaleString()}`} color="text-rose-400" />
        <SummaryCard label="Net Balance" value={`$${netBalance.toLocaleString()}`} color={netBalance >= 0 ? 'text-brand-400' : 'text-rose-400'} />
      </div>

      {/* Category Breakdown */}
      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-border-primary/50 bg-bg-secondary/30 flex items-center gap-2">
          <FileText className="w-5 h-5 text-brand-500" />
          <h3 className="text-lg font-semibold text-text-primary">Category Breakdown</h3>
          <span className="ml-auto text-xs text-text-secondary font-medium">{transactions.length} records</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-bg-primary/50">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider text-right">Income</th>
                <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider text-right">Expense</th>
                <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider text-right">Net</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-primary/30">
              {Object.keys(categoryTotals).length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-text-secondary">No data for selected filters.</td></tr>
              ) : (
                Object.entries(categoryTotals).sort(([a], [b]) => a.localeCompare(b)).map(([cat, totals]: [string, { income: number; expense: number }]) => {
                  const net = totals.income - totals.expense;
                  return (
                    <tr key={cat} className="hover:bg-bg-primary/40 transition-colors">
                      <td className="px-6 py-3 text-sm font-semibold text-text-primary">{cat}</td>
                      <td className="px-6 py-3 text-sm font-bold text-emerald-400 text-right">{totals.income > 0 ? `$${totals.income.toLocaleString()}` : '—'}</td>
                      <td className="px-6 py-3 text-sm font-bold text-rose-400 text-right">{totals.expense > 0 ? `$${totals.expense.toLocaleString()}` : '—'}</td>
                      <td className={`px-6 py-3 text-sm font-bold text-right ${net >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>${net.toLocaleString()}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Detail Table */}
      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-border-primary/50 bg-bg-secondary/30">
          <h3 className="text-lg font-semibold text-text-primary">Transaction Detail</h3>
        </div>
        <div className="overflow-x-auto max-h-96 overflow-y-auto">
          <table className="w-full text-left">
            <thead className="bg-bg-primary/50 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-xs font-bold text-text-secondary uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-xs font-bold text-text-secondary uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-xs font-bold text-text-secondary uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-xs font-bold text-text-secondary uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-xs font-bold text-text-secondary uppercase tracking-wider text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-primary/30">
              {transactions.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-text-secondary">No transactions match the selected filters.</td></tr>
              ) : (
                transactions.map(tx => (
                  <tr key={tx.id} className="hover:bg-bg-primary/40 transition-colors">
                    <td className="px-6 py-3 text-xs text-text-secondary font-medium">{tx.date}</td>
                    <td className="px-6 py-3 text-xs font-bold text-text-primary">{tx.category}</td>
                    <td className="px-6 py-3 text-xs text-text-secondary">{tx.description || '—'}</td>
                    <td className="px-6 py-3 text-xs">
                      <span className={`px-2 py-0.5 rounded-full font-bold border ${tx.type === 'income' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>{tx.type}</span>
                    </td>
                    <td className={`px-6 py-3 text-sm font-bold text-right ${tx.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
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

function SummaryCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="glass-card p-5 text-center">
      <p className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-2">{label}</p>
      <p className={`text-2xl font-display font-bold ${color}`}>{value}</p>
    </div>
  );
}
