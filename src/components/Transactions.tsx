import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Trash2, Edit2, X, AlertCircle, RefreshCw, Flag, History } from 'lucide-react';
import { Transaction, User } from '../types';

export default function Transactions({ user }: { user: User }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [filters, setFilters] = useState({ type: '', startDate: '', endDate: '', search: '' });
  const [page, setPage] = useState(0);
  const LIMIT = 10;
  const [auditTx, setAuditTx] = useState<Transaction | null>(null);

  const handleReassignCategory = (tx: Transaction, newCat: string) => {
    fetch(`/api/transactions/${tx.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-user-id': user.id.toString() },
      body: JSON.stringify({ ...tx, category: newCat })
    }).then(res => {
      if (res.ok) fetchTransactions();
    });
  };

  const handleToggleFlag = (id: number) => {
    fetch(`/api/transactions/${id}/flag`, {
      method: 'PUT',
      headers: { 'x-user-id': user.id.toString() }
    }).then(res => {
      if (res.ok) fetchTransactions();
    });
  };

  const [formData, setFormData] = useState({
    amount: '', type: 'expense' as 'income' | 'expense',
    category: '', date: new Date().toISOString().split('T')[0], description: ''
  });

  const fetchTransactions = useCallback(() => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();
    if (filters.type) params.append('type', filters.type);
    if (filters.search) params.append('search', filters.search);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    params.append('limit', LIMIT.toString());
    params.append('offset', (page * LIMIT).toString());

    fetch(`/api/transactions?${params}`, { headers: { 'x-user-id': user.id.toString() } })
      .then(res => { if (!res.ok) throw new Error(`Error ${res.status}`); return res.json(); })
      .then(data => setTransactions(Array.isArray(data) ? data : []))
      .catch(err => setError(err.message || 'Failed to load transactions'))
      .finally(() => setLoading(false));
  }, [filters, page, user.id]);

  useEffect(() => { setPage(0); }, [filters]);
  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);

  const resetForm = () => {
    setEditingTx(null);
    setFormData({ amount: '', type: 'expense', category: '', date: new Date().toISOString().split('T')[0], description: '' });
    setShowModal(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingTx ? 'PUT' : 'POST';
    const url = editingTx ? `/api/transactions/${editingTx.id}` : '/api/transactions';
    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', 'x-user-id': user.id.toString() },
      body: JSON.stringify({ ...formData, amount: parseFloat(formData.amount) })
    }).then(res => {
      if (res.ok) { resetForm(); fetchTransactions(); }
      else res.json().then(d => alert(d.error || 'Operation failed')).catch(() => alert('Operation failed'));
    }).catch(() => alert('Network error'));
  };

  const handleDelete = (id: number) => {
    if (!confirm('Delete this transaction?')) return;
    fetch(`/api/transactions/${id}`, { method: 'DELETE', headers: { 'x-user-id': user.id.toString() } })
      .then(res => { if (res.ok) fetchTransactions(); else alert('Delete failed — check permissions'); });
  };

  const openEdit = (tx: Transaction) => {
    setEditingTx(tx);
    setFormData({ amount: tx.amount.toString(), type: tx.type, category: tx.category, date: tx.date, description: tx.description || '' });
    setShowModal(true);
  };

  const canWrite = user.role === 'Admin';

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-display font-bold text-text-primary mb-2">Transactions</h2>
          <p className="text-text-secondary font-medium">
            {canWrite ? 'Create, edit and manage financial records.' : 'View financial records (read-only).'}
          </p>
        </div>
        {canWrite && (
          <button onClick={() => { resetForm(); setShowModal(true); }}
            className="flex items-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-xl font-medium hover:bg-brand-500 hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all shrink-0">
            <Plus className="w-5 h-5" /> Add Transaction
          </button>
        )}
      </header>

      {/* Filters */}
      <div className="glass-card p-4 flex flex-wrap gap-4 items-end mb-4">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input type="text" placeholder="Category or description..." value={filters.search}
              onChange={e => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-10 p-2.5 glass-input" />
          </div>
        </div>
        <div className="flex-[0_0_150px]">
          <label className="block text-xs font-bold text-text-secondary uppercase tracking-widest mb-2">Type</label>
          <select value={filters.type} onChange={e => setFilters({ ...filters, type: e.target.value })}
            className="w-full p-2.5 glass-input appearance-none bg-bg-secondary/80 text-text-primary">
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
        <div className="flex-[0_0_180px]">
          <label className="block text-xs font-bold text-text-secondary uppercase tracking-widest mb-2">Start Date</label>
          <input type="date" value={filters.startDate} onChange={e => setFilters({ ...filters, startDate: e.target.value })}
            className="w-full p-2.5 glass-input !text-text-primary [color-scheme:dark]" />
        </div>
        <div className="flex-[0_0_180px]">
          <label className="block text-xs font-bold text-text-secondary uppercase tracking-widest mb-2">End Date</label>
          <input type="date" value={filters.endDate} onChange={e => setFilters({ ...filters, endDate: e.target.value })}
            className="w-full p-2.5 glass-input !text-text-primary [color-scheme:dark]" />
        </div>
        <button onClick={() => setFilters({ type: '', startDate: '', endDate: '', search: '' })}
          className="px-4 py-2.5 text-sm font-bold text-text-secondary hover:text-text-primary bg-bg-secondary border border-border-primary hover:bg-bg-primary rounded-xl transition-all h-[46px]">
          Reset
        </button>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-bg-primary/50">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Description</th>
                <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider text-right">Amount</th>
                {canWrite && <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-border-primary/30">
              {loading ? (
                <tr><td colSpan={canWrite ? 6 : 5} className="px-6 py-12 text-center">
                  <div className="flex items-center justify-center gap-3 text-text-secondary">
                    <div className="w-5 h-5 rounded-full border-2 border-brand-500/30 border-t-brand-500 animate-spin" />
                    Loading transactions...
                  </div>
                </td></tr>
              ) : error ? (
                <tr><td colSpan={canWrite ? 6 : 5} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <AlertCircle className="w-8 h-8 text-rose-400" />
                    <p className="text-rose-400 font-medium text-sm">{error}</p>
                    <button onClick={fetchTransactions} className="flex items-center gap-2 text-sm text-brand-500 font-bold hover:text-brand-400">
                      <RefreshCw className="w-4 h-4" /> Retry
                    </button>
                  </div>
                </td></tr>
              ) : transactions.length === 0 ? (
                <tr><td colSpan={canWrite ? 7 : 5} className="px-6 py-12 text-center text-text-secondary font-medium">
                  No transactions found.{canWrite ? ' Click "Add Transaction" to create one.' : ''}
                </td></tr>
              ) : (
                transactions.map(tx => (
                  <tr key={tx.id} className="hover:bg-bg-primary/40 transition-colors">
                    <td className="px-6 py-4 text-sm text-text-secondary font-medium">{tx.date}</td>
                    <td className="px-6 py-4 text-sm">
                      {canWrite ? (
                        <select 
                          value={tx.category} 
                          onChange={(e) => handleReassignCategory(tx, e.target.value)}
                          className="bg-bg-primary border border-border-primary rounded text-xs font-bold text-text-secondary px-2 py-1 appearance-none focus:outline-none"
                        >
                          <option value="Salary">Salary</option>
                          <option value="Rent">Rent</option>
                          <option value="Groceries">Groceries</option>
                          <option value="Utilities">Utilities</option>
                          <option value="Freelance">Freelance</option>
                          <option value="Insurance">Insurance</option>
                          <option value="Dining">Dining</option>
                          <option value="Consulting">Consulting</option>
                          <option value={tx.category}>{tx.category}</option>
                        </select>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-bg-primary border border-border-primary text-xs font-bold text-text-secondary">{tx.category}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary font-medium">
                      <div className="flex items-center gap-2">
                        {tx.is_flagged === 1 && (
                          <span className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-bold px-1.5 py-0.5 rounded font-mono">FLAGGED</span>
                        )}
                        <span>{tx.description || '—'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-medium border ${tx.type === 'income' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>{tx.type}</span>
                    </td>
                    <td className={`px-6 py-4 font-bold text-right ${tx.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {tx.type === 'income' ? '+' : '-'}${tx.amount.toLocaleString()}
                    </td>
                    {canWrite && (
                      <td className="px-6 py-4 text-right space-x-2">
                        <button onClick={() => handleToggleFlag(tx.id)} className={`p-1.5 rounded-lg transition-all border ${tx.is_flagged === 1 ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'text-text-secondary hover:text-rose-400 hover:bg-rose-500/10 border-transparent'}`} title="Flag for Review">
                          <Flag className="w-4 h-4" />
                        </button>
                        <button onClick={() => setAuditTx(tx)} className="p-1.5 text-text-secondary hover:text-brand-400 hover:bg-brand-500/10 border border-transparent rounded-lg transition-all" title="Audit Log">
                          <History className="w-4 h-4" />
                        </button>
                        <button onClick={() => openEdit(tx)} className="p-1.5 text-text-secondary hover:text-brand-500 hover:bg-brand-500/10 border border-transparent rounded-lg transition-all" title="Edit"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(tx.id)} className="p-1.5 text-text-secondary hover:text-rose-500 hover:bg-rose-500/10 border border-transparent rounded-lg transition-all" title="Delete"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 bg-bg-secondary/30 border-t border-border-primary/50 flex items-center justify-between">
          <p className="text-sm text-text-secondary">Page <span className="font-bold text-text-primary">{page + 1}</span></p>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
              className="px-4 py-2 text-sm font-bold text-text-secondary bg-bg-secondary border border-border-primary hover:bg-bg-primary disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-all">← Prev</button>
            <button onClick={() => setPage(p => p + 1)} disabled={transactions.length < LIMIT}
              className="px-4 py-2 text-sm font-bold text-text-secondary bg-bg-secondary border border-border-primary hover:bg-bg-primary disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-all">Next →</button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-bg-primary/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-card w-full max-w-md border border-border-primary">
            <div className="p-6 border-b border-border-primary/50 flex items-center justify-between">
              <h3 className="text-xl font-display font-bold text-text-primary">{editingTx ? 'Edit' : 'Add'} Transaction</h3>
              <button onClick={resetForm} className="text-text-secondary hover:text-text-primary transition-colors"><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-text-secondary mb-1.5">Amount ($)</label>
                <input type="number" required step="0.01" min="0.01" value={formData.amount}
                  onChange={e => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full p-2.5 glass-input font-bold" placeholder="0.00" />
              </div>
              <div>
                <label className="block text-sm font-bold text-text-secondary mb-1.5">Type</label>
                <div className="flex gap-3">
                  {(['income', 'expense'] as const).map(t => (
                    <label key={t} className="flex-1 cursor-pointer">
                      <input type="radio" name="type" value={t} checked={formData.type === t} onChange={() => setFormData({ ...formData, type: t })} className="hidden peer" />
                      <div className={`p-3 text-center border-2 border-border-primary/50 rounded-xl font-bold transition-all peer-checked:${t === 'income' ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'bg-rose-500/10 border-rose-500/50 text-rose-400'} text-text-secondary capitalize`}>{t}</div>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-text-secondary mb-1.5">Category</label>
                <input type="text" required value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-2.5 glass-input font-medium" placeholder="e.g. Salary, Rent, Groceries..." />
              </div>
              <div>
                <label className="block text-sm font-bold text-text-secondary mb-1.5">Date</label>
                <input type="date" required value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })}
                  className="w-full p-2.5 glass-input [color-scheme:dark] font-medium" />
              </div>
              <div>
                <label className="block text-sm font-bold text-text-secondary mb-1.5">Description (optional)</label>
                <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 glass-input min-h-[80px] resize-none font-medium" placeholder="Add notes..." />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={resetForm}
                  className="flex-1 px-4 py-2.5 text-text-secondary bg-bg-secondary hover:bg-bg-primary border border-border-primary rounded-xl font-bold transition-colors">Cancel</button>
                <button type="submit"
                  className="flex-1 px-4 py-2.5 text-white bg-brand-600 hover:bg-brand-500 rounded-xl font-bold transition-colors shadow-[0_0_15px_rgba(99,102,241,0.3)]">{editingTx ? 'Update' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {auditTx && (
        <div className="fixed inset-0 bg-bg-primary/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="glass-card w-full max-w-md border border-border-primary p-6 space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <History className="w-5 h-5 text-brand-500" /> Transaction Audit Log
              </h3>
              <button onClick={() => setAuditTx(null)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4 text-sm text-slate-300">
              <div>
                <span className="text-slate-500 font-bold block text-xs uppercase tracking-wider">Transaction ID</span>
                <span className="font-mono text-white font-semibold">{auditTx.id}</span>
              </div>
              <div>
                <span className="text-slate-500 font-bold block text-xs uppercase tracking-wider">Owner / Created By</span>
                <span>User ID: <span className="font-mono text-white font-semibold">{auditTx.userId}</span></span>
              </div>
              <div>
                <span className="text-slate-500 font-bold block text-xs uppercase tracking-wider">Creation Date</span>
                <span className="font-mono text-white font-semibold">{auditTx.date}</span>
              </div>
              <div>
                <span className="text-slate-500 font-bold block text-xs uppercase tracking-wider">Security Anomaly Status</span>
                {auditTx.amount > 10000 ? (
                  <span className="text-rose-400 font-semibold flex items-center gap-1.5 mt-0.5">
                    <AlertCircle className="w-4 h-4" /> Triggered Anomaly Alert rule (&gt; $10k limit)
                  </span>
                ) : (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1.5 mt-0.5">
                    Passed all automated safety checks
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
