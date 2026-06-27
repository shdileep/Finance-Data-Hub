import React, { useState, useEffect } from 'react';
import { FolderTree, BellRing, TrendingUp, TrendingDown, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';

export default function Categories({ user }) {
  const [categories, setCategories] = useState([]);
  const [watches, setWatches] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Merge Category State
  const [sourceCat, setSourceCat] = useState('');
  const [targetCat, setTargetCat] = useState('');
  const [mergeLoading, setMergeLoading] = useState(false);
  const [mergeMessage, setMergeMessage] = useState(null);

  // Watch Form State
  const [watchCat, setWatchCat] = useState('');
  const [watchLimit, setWatchLimit] = useState('');
  const [watchStatus, setWatchStatus] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      fetch('/api/categories/intelligence', { headers: { 'x-user-id': user.id.toString() } }).then(r => r.json()),
      fetch('/api/categories/watches', { headers: { 'x-user-id': user.id.toString() } }).then(r => r.json())
    ])
      .then(([intel, watchData]) => {
        setCategories(intel);
        setWatches(watchData);
        if (intel.length > 0) {
          setSourceCat(intel[0].category);
          setTargetCat(intel[1] ? intel[1].category : intel[0].category);
          setWatchCat(intel[0].category);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleMerge = (e) => {
    e.preventDefault();
    if (sourceCat === targetCat) {
      alert('Source and target categories must be different.');
      return;
    }
    if (!confirm(`Are you sure you want to merge "${sourceCat}" into "${targetCat}"? This updates all transactions in the database.`)) return;

    setMergeLoading(true);
    fetch('/api/categories/merge', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': user.id.toString()
      },
      body: JSON.stringify({ source: sourceCat, target: targetCat })
    })
      .then(res => res.json())
      .then(data => {
        setMergeMessage(data.message);
        fetchData();
        setTimeout(() => setMergeMessage(null), 3000);
      })
      .catch(console.error)
      .finally(() => setMergeLoading(false));
  };

  const handleCreateWatch = (e) => {
    e.preventDefault();
    setWatchStatus('submitting');
    fetch('/api/categories/watches', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': user.id.toString()
      },
      body: JSON.stringify({ category: watchCat, threshold: watchLimit })
    })
      .then(res => res.json())
      .then(() => {
        setWatchStatus('success');
        setWatchLimit('');
        fetchData();
        setTimeout(() => setWatchStatus(null), 2000);
      })
      .catch(() => setWatchStatus('error'));
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64 gap-2">
      <RefreshCw className="w-8 h-8 animate-spin text-brand-500" />
      <p className="text-slate-400 text-sm">Gathering category intelligence...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in">
      <header className="mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <FolderTree className="text-brand-500 w-6 h-6" /> Category Intelligence
        </h2>
        <p className="text-slate-400 text-sm">Monitor category spending thresholds, inspect anomaly alerts, and merge duplicate category structures.</p>
      </header>

      {/* Category Performance Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(c => (
          <div key={c.category} className="bg-[#131b2e] border border-slate-700/50 rounded-xl p-5 hover:border-slate-600 transition-colors flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <span className="font-bold text-white text-base truncate">{c.category}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded font-mono uppercase font-bold ${
                  c.type === 'income' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                }`}>{c.type}</span>
              </div>
              <p className="font-data-mono text-xl font-bold text-white mt-4">${c.total.toLocaleString()}</p>
              <p className="text-xs text-slate-400 mt-1">{c.count} transactions</p>
            </div>

            {/* Anomaly Indicator */}
            {c.trend === 'spike' ? (
              <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg flex items-center gap-2 text-rose-400 text-xs">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span className="font-semibold leading-normal">{c.anomalyMsg}</span>
              </div>
            ) : (
              <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-400">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Spending is within normal limits.</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Watch Alert Setup */}
        <div className="bg-[#131b2e] border border-slate-700/50 rounded-xl p-6 space-y-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <BellRing className="text-brand-500 w-5 h-5" /> Category Threshold Watches
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Form */}
            <form onSubmit={handleCreateWatch} className="space-y-4">
              <div>
                <label className="block text-slate-400 text-xs font-semibold mb-2">Category to Watch</label>
                <select 
                  value={watchCat} 
                  onChange={e => setWatchCat(e.target.value)}
                  className="w-full bg-slate-850 border border-slate-700 rounded px-4 py-2 text-white text-sm"
                >
                  {categories.map(c => <option key={c.category} value={c.category}>{c.category}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 text-xs font-semibold mb-2">Spend Alert Limit ($)</label>
                <input 
                  type="number" 
                  value={watchLimit}
                  onChange={e => setWatchLimit(e.target.value)}
                  placeholder="e.g. 1000"
                  required
                  className="w-full bg-slate-850 border border-slate-700 rounded px-4 py-2 text-white text-sm"
                />
              </div>

              <button 
                type="submit" 
                disabled={watchStatus === 'submitting'}
                className="w-full bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-bold py-2.5 rounded text-xs uppercase tracking-widest flex items-center justify-center gap-2"
              >
                {watchStatus === 'submitting' && <RefreshCw className="w-4 h-4 animate-spin" />}
                Add Threshold Monitor
              </button>
            </form>

            {/* Current Watch Subscriptions List */}
            <div className="space-y-4 border-l border-slate-800 pl-6">
              <h4 className="font-bold text-slate-400 text-xs uppercase tracking-wider">Active Watches</h4>
              {watches.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No watches active.</p>
              ) : (
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {watches.map(w => (
                    <div key={w.id} className="p-3 bg-slate-800/30 border border-slate-700/50 rounded flex justify-between items-center text-xs">
                      <span className="font-bold text-white">{w.category}</span>
                      <span className="font-mono text-brand-400 font-bold">${w.threshold}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Merge Categories Panel */}
        <div className="bg-[#131b2e] border border-slate-700/50 rounded-xl p-6 space-y-6 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FolderTree className="text-brand-500 w-5 h-5" /> Merge Duplicate Categories
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Consolidate categories in bulk (e.g. merge "SaaS" into "Software"). This action updates all active transactions in the database matching the source category.
            </p>
          </div>

          {mergeMessage && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-xs font-semibold">
              {mergeMessage}
            </div>
          )}

          <form onSubmit={handleMerge} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <div>
              <label className="block text-slate-400 text-xs font-semibold mb-2">Merge Source Category</label>
              <select 
                value={sourceCat}
                onChange={e => setSourceCat(e.target.value)}
                className="w-full bg-slate-850 border border-slate-700 rounded px-4 py-2 text-white text-sm"
              >
                {categories.map(c => <option key={c.category} value={c.category}>{c.category}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 text-xs font-semibold mb-2">Merge Target Category</label>
              <select 
                value={targetCat}
                onChange={e => setTargetCat(e.target.value)}
                className="w-full bg-slate-850 border border-slate-700 rounded px-4 py-2 text-white text-sm"
              >
                {categories.map(c => <option key={c.category} value={c.category}>{c.category}</option>)}
              </select>
            </div>

            <div className="sm:col-span-2 mt-4">
              <button 
                type="submit"
                disabled={mergeLoading}
                className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 disabled:opacity-50 text-white font-bold py-3 rounded text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
              >
                {mergeLoading && <RefreshCw className="w-4 h-4 animate-spin" />}
                Execute Consolidation Merge
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
