import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  TrendingUp, TrendingDown, BarChart2, PieChart as PieIcon, Calendar, RefreshCw,
  AlertCircle, Filter, SlidersHorizontal, ArrowUpDown, DollarSign, Activity, Eye, EyeOff
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { User, Summary, Transaction } from '../types';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

export default function Analytics({ user }: { user: User }) {
  const [summary, setSummary] = useState<Summary & { monthlyTrends?: any[] } | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Advanced Filters
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'category'>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);

  // Chart View Toggle
  const [chartView, setChartView] = useState<'area' | 'bar'>('area');
  const [showIncome, setShowIncome] = useState(true);
  const [showExpense, setShowExpense] = useState(true);

  // SSE Live
  const [liveStatus, setLiveStatus] = useState<'connecting' | 'live' | 'offline'>('connecting');

  const fetchData = useCallback(() => {
    setLoading(true); setError(null);
    const params = new URLSearchParams({ limit: '500' });
    if (dateFrom) params.append('startDate', dateFrom);
    if (dateTo) params.append('endDate', dateTo);
    if (typeFilter) params.append('type', typeFilter);

    Promise.all([
      fetch('/api/summary', { headers: { 'x-user-id': user.id.toString() } }).then(r => r.json()),
      fetch(`/api/transactions?${params}`, { headers: { 'x-user-id': user.id.toString() } }).then(r => r.json()),
    ])
      .then(([sum, txns]) => {
        setSummary(sum);
        setTransactions(Array.isArray(txns) ? txns : []);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [user.id, dateFrom, dateTo, typeFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // SSE
  useEffect(() => {
    const sse = new EventSource('/api/stream');
    sse.onopen = () => setLiveStatus('live');
    sse.onerror = () => setLiveStatus('offline');
    sse.addEventListener('connected', () => setLiveStatus('live'));
    sse.addEventListener('DATA_UPDATE', () => fetchData());
    sse.addEventListener('SYSTEM_UPDATE', () => fetchData());
    return () => sse.close();
  }, [fetchData]);

  // Derived data with client-side filtering
  const filteredTx = useMemo(() => {
    let result = [...transactions];
    if (categoryFilter) result = result.filter(t => t.category.toLowerCase().includes(categoryFilter.toLowerCase()));
    if (minAmount) result = result.filter(t => t.amount >= parseFloat(minAmount));
    if (maxAmount) result = result.filter(t => t.amount <= parseFloat(maxAmount));
    result.sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1;
      if (sortBy === 'date') return dir * (new Date(a.date).getTime() - new Date(b.date).getTime());
      if (sortBy === 'amount') return dir * (a.amount - b.amount);
      return dir * a.category.localeCompare(b.category);
    });
    return result;
  }, [transactions, categoryFilter, minAmount, maxAmount, sortBy, sortDir]);

  // Category aggregation from filtered data
  const categoryAgg = useMemo(() => {
    const map: Record<string, { income: number; expense: number; count: number }> = {};
    filteredTx.forEach(t => {
      if (!map[t.category]) map[t.category] = { income: 0, expense: 0, count: 0 };
      map[t.category][t.type] += t.amount;
      map[t.category].count++;
    });
    return Object.entries(map).map(([category, data]) => ({ category, ...data, total: data.income + data.expense }))
      .sort((a, b) => b.total - a.total);
  }, [filteredTx]);

  // Daily heatmap data
  const dailyData = useMemo(() => {
    const map: Record<string, { date: string; income: number; expense: number; total: number }> = {};
    filteredTx.forEach(t => {
      if (!map[t.date]) map[t.date] = { date: t.date, income: 0, expense: 0, total: 0 };
      map[t.date][t.type] += t.amount;
      map[t.date].total += t.amount;
    });
    return Object.values(map).sort((a, b) => a.date.localeCompare(b.date));
  }, [filteredTx]);

  // Unique categories for filter dropdown
  const uniqueCategories = useMemo(() => {
    return [...new Set(transactions.map(t => t.category))].sort();
  }, [transactions]);

  // Stats
  const filteredIncome = filteredTx.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const filteredExpense = filteredTx.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const filteredNet = filteredIncome - filteredExpense;
  const avgTransaction = filteredTx.length > 0 ? (filteredTx.reduce((s, t) => s + t.amount, 0) / filteredTx.length) : 0;
  const largestTx = filteredTx.length > 0 ? Math.max(...filteredTx.map(t => t.amount)) : 0;

  if (loading) return <PageLoading label="Loading analytics..." />;
  if (error) return <PageError error={error} onRetry={fetchData} />;

  const safe = summary!;
  const savingsRate = safe.totalIncome > 0 ? ((safe.netBalance / safe.totalIncome) * 100).toFixed(1) : '0.0';
  const expenseRatio = safe.totalIncome > 0 ? ((safe.totalExpense / safe.totalIncome) * 100).toFixed(1) : '0.0';
  const incomeCategories = safe.categoryWise.filter(c => c.type === 'income');
  const expenseCategories = safe.categoryWise.filter(c => c.type === 'expense');
  const monthly = (safe as any).monthlyTrends ?? [];

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-display font-bold text-text-primary mb-2 flex items-center gap-3">
            Analytics
            <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${
              liveStatus === 'live' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
              liveStatus === 'connecting' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
              'bg-slate-500/10 border-slate-500/20 text-slate-400'
            }`}>
              <div className={`w-1.5 h-1.5 rounded-full ${liveStatus === 'live' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'}`} />
              {liveStatus}
            </div>
          </h2>
          <p className="text-text-secondary">Deep dive into your financial performance with advanced filtering.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all border ${showFilters ? 'bg-brand-500/10 border-brand-500/30 text-brand-400' : 'bg-bg-secondary border-border-primary text-text-secondary hover:text-text-primary'}`}>
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>
          <button onClick={fetchData}
            className="flex items-center gap-2 px-4 py-2.5 bg-bg-secondary border border-border-primary text-text-secondary hover:text-text-primary rounded-xl font-medium transition-all">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>
      </header>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div className="glass-card p-5 space-y-4 border-brand-500/20">
          <h3 className="text-sm font-bold text-text-primary flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-brand-500" /> Advanced Filters
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase tracking-widest mb-1.5">From Date</label>
              <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
                className="w-full p-2 glass-input text-sm !text-text-primary [color-scheme:dark]" />
            </div>
            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase tracking-widest mb-1.5">To Date</label>
              <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
                className="w-full p-2 glass-input text-sm !text-text-primary [color-scheme:dark]" />
            </div>
            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase tracking-widest mb-1.5">Type</label>
              <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
                className="w-full p-2 glass-input text-sm appearance-none bg-bg-secondary/80 text-text-primary">
                <option value="">All</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase tracking-widest mb-1.5">Category</label>
              <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
                className="w-full p-2 glass-input text-sm appearance-none bg-bg-secondary/80 text-text-primary">
                <option value="">All Categories</option>
                {uniqueCategories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase tracking-widest mb-1.5">Min Amount</label>
              <input type="number" placeholder="0" value={minAmount} onChange={e => setMinAmount(e.target.value)}
                className="w-full p-2 glass-input text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase tracking-widest mb-1.5">Max Amount</label>
              <input type="number" placeholder="∞" value={maxAmount} onChange={e => setMaxAmount(e.target.value)}
                className="w-full p-2 glass-input text-sm" />
            </div>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">Sort By</label>
              <select value={sortBy} onChange={e => setSortBy(e.target.value as any)}
                className="p-1.5 glass-input text-xs appearance-none bg-bg-secondary/80 text-text-primary">
                <option value="date">Date</option>
                <option value="amount">Amount</option>
                <option value="category">Category</option>
              </select>
              <button onClick={() => setSortDir(d => d === 'asc' ? 'desc' : 'asc')}
                className="p-1.5 glass-input text-text-secondary hover:text-text-primary transition-colors">
                <ArrowUpDown className="w-3.5 h-3.5" />
              </button>
            </div>
            <button onClick={() => { setDateFrom(''); setDateTo(''); setTypeFilter(''); setCategoryFilter(''); setMinAmount(''); setMaxAmount(''); setSortBy('date'); setSortDir('desc'); }}
              className="ml-auto px-3 py-1.5 text-xs font-bold text-text-secondary bg-bg-secondary border border-border-primary hover:bg-bg-primary rounded-lg">
              Reset All
            </button>
          </div>
        </div>
      )}

      {/* Filtered KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <KpiCard label="Filtered Income" value={`$${filteredIncome.toLocaleString()}`} sub={`${filteredTx.filter(t => t.type === 'income').length} records`} color="emerald" />
        <KpiCard label="Filtered Expense" value={`$${filteredExpense.toLocaleString()}`} sub={`${filteredTx.filter(t => t.type === 'expense').length} records`} color="rose" />
        <KpiCard label="Net Balance" value={`$${filteredNet.toLocaleString()}`} sub={filteredNet >= 0 ? 'surplus' : 'deficit'} color={filteredNet >= 0 ? 'brand' : 'rose'} />
        <KpiCard label="Savings Rate" value={`${savingsRate}%`} sub="of total income" color="emerald" />
        <KpiCard label="Avg Transaction" value={`$${avgTransaction.toFixed(0)}`} sub={`${filteredTx.length} total`} color="brand" />
        <KpiCard label="Largest" value={`$${largestTx.toLocaleString()}`} sub="single transaction" color="amber" />
      </div>

      {/* Daily Activity Chart with Toggle */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold flex items-center gap-2 text-text-primary">
            <Activity className="w-5 h-5 text-brand-500" /> Daily Activity
          </h3>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowIncome(!showIncome)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${showIncome ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-bg-secondary border-border-primary text-text-secondary'}`}>
              {showIncome ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />} Income
            </button>
            <button onClick={() => setShowExpense(!showExpense)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${showExpense ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' : 'bg-bg-secondary border-border-primary text-text-secondary'}`}>
              {showExpense ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />} Expense
            </button>
            <div className="h-5 w-px bg-border-primary mx-1" />
            <button onClick={() => setChartView('area')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${chartView === 'area' ? 'bg-brand-500/10 border-brand-500/30 text-brand-400' : 'bg-bg-secondary border-border-primary text-text-secondary'}`}>
              Area
            </button>
            <button onClick={() => setChartView('bar')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${chartView === 'bar' ? 'bg-brand-500/10 border-brand-500/30 text-brand-400' : 'bg-bg-secondary border-border-primary text-text-secondary'}`}>
              Bar
            </button>
          </div>
        </div>
        <div className="h-72">
          {dailyData.length === 0 ? <EmptyChart label="No data for selected filters" /> : (
            <ResponsiveContainer width="100%" height="100%">
              {chartView === 'area' ? (
                <AreaChart data={dailyData}>
                  <defs>
                    <linearGradient id="colorIncome2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorExpense2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#fb7185" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#fb7185" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tick={{ fill: '#94a3b8' }} />
                  <YAxis stroke="#94a3b8" fontSize={10} tick={{ fill: '#94a3b8' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc', borderRadius: '1rem' }} />
                  <Legend />
                  {showIncome && <Area type="monotone" dataKey="income" stroke="#34d399" fill="url(#colorIncome2)" strokeWidth={2} />}
                  {showExpense && <Area type="monotone" dataKey="expense" stroke="#fb7185" fill="url(#colorExpense2)" strokeWidth={2} />}
                </AreaChart>
              ) : (
                <BarChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tick={{ fill: '#94a3b8' }} />
                  <YAxis stroke="#94a3b8" fontSize={10} tick={{ fill: '#94a3b8' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc', borderRadius: '1rem' }} />
                  <Legend />
                  {showIncome && <Bar dataKey="income" fill="#34d399" radius={[4, 4, 0, 0]} />}
                  {showExpense && <Bar dataKey="expense" fill="#fb7185" radius={[4, 4, 0, 0]} />}
                </BarChart>
              )}
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income pie */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-text-primary">
            <PieIcon className="w-5 h-5 text-emerald-500" /> Income Breakdown
          </h3>
          <div className="h-64">
            {incomeCategories.length === 0 ? <EmptyChart label="No income data" /> : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={incomeCategories} cx="50%" cy="50%" outerRadius={90} dataKey="total" nameKey="category" paddingAngle={4}>
                    {incomeCategories.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc', borderRadius: '1rem' }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Expense pie */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-text-primary">
            <PieIcon className="w-5 h-5 text-rose-500" /> Expense Breakdown
          </h3>
          <div className="h-64">
            {expenseCategories.length === 0 ? <EmptyChart label="No expense data" /> : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={expenseCategories} cx="50%" cy="50%" outerRadius={90} dataKey="total" nameKey="category" paddingAngle={4}>
                    {expenseCategories.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc', borderRadius: '1rem' }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Category Breakdown Table with Bars */}
      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-border-primary/50 bg-bg-secondary/30 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-brand-500" /> Category Performance
          </h3>
          <span className="text-xs text-text-secondary font-medium">{categoryAgg.length} categories · {filteredTx.length} records</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-bg-primary/50">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider text-right">Income</th>
                <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider text-right">Expense</th>
                <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider text-right">Net</th>
                <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider text-right">Count</th>
                <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider w-48">Distribution</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-primary/30">
              {categoryAgg.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-text-secondary">No data matches your filters.</td></tr>
              ) : (
                categoryAgg.map((cat) => {
                  const net = cat.income - cat.expense;
                  const maxTotal = Math.max(...categoryAgg.map(c => c.total));
                  const pct = maxTotal > 0 ? (cat.total / maxTotal) * 100 : 0;
                  return (
                    <tr key={cat.category} className="hover:bg-bg-primary/40 transition-colors">
                      <td className="px-6 py-3 text-sm font-bold text-text-primary">{cat.category}</td>
                      <td className="px-6 py-3 text-sm font-bold text-emerald-400 text-right">{cat.income > 0 ? `$${cat.income.toLocaleString()}` : '—'}</td>
                      <td className="px-6 py-3 text-sm font-bold text-rose-400 text-right">{cat.expense > 0 ? `$${cat.expense.toLocaleString()}` : '—'}</td>
                      <td className={`px-6 py-3 text-sm font-bold text-right ${net >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>${net.toLocaleString()}</td>
                      <td className="px-6 py-3 text-sm text-text-secondary font-medium text-right">{cat.count}</td>
                      <td className="px-6 py-3">
                        <div className="h-2 bg-bg-primary rounded-full overflow-hidden">
                          <div className="h-full rounded-full bg-gradient-to-r from-brand-500/60 to-brand-500 transition-all duration-700" style={{ width: `${pct}%` }} />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  const colorMap: Record<string, string> = {
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    rose: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    brand: 'text-brand-400 bg-brand-500/10 border-brand-500/20',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  };
  return (
    <div className="glass-card p-4 group hover:shadow-lg transition-all">
      <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1.5">{label}</p>
      <p className={`text-xl font-display font-bold mb-0.5 ${colorMap[color]?.split(' ')[0]}`}>{value}</p>
      <p className="text-[10px] text-text-secondary font-medium">{sub}</p>
    </div>
  );
}

function EmptyChart({ label }: { label: string }) {
  return <div className="h-full flex items-center justify-center"><p className="text-text-secondary text-sm">{label}</p></div>;
}

export function PageLoading({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-96 gap-4">
      <div className="w-12 h-12 rounded-full border-4 border-brand-500/30 border-t-brand-500 animate-spin" />
      <p className="text-text-secondary font-medium">{label}</p>
    </div>
  );
}

export function PageError({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-96 gap-6 text-center">
      <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20">
        <AlertCircle className="w-10 h-10 text-rose-400" />
      </div>
      <div>
        <h3 className="text-lg font-bold text-text-primary mb-2">Something went wrong</h3>
        <p className="text-text-secondary text-sm max-w-md">{error}</p>
      </div>
      <button onClick={onRetry} className="flex items-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-xl font-medium hover:bg-brand-500 transition-all">
        <RefreshCw className="w-4 h-4" /> Retry
      </button>
    </div>
  );
}
