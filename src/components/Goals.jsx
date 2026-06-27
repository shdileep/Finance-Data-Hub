import React, { useState, useEffect } from 'react';
import { Target, Bell, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function Goals({ user }) {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = () => {
    setLoading(true);
    fetch('/api/viewer/goals', { headers: { 'x-user-id': user.id.toString() } })
      .then(res => res.json())
      .then(data => setGoals(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleSubscribe = (id) => {
    // Optimistic toggle
    setGoals(prev => prev.map(g => {
      if (g.id === id) {
        return { ...g, isSubscribed: !g.isSubscribed };
      }
      return g;
    }));

    fetch(`/api/viewer/goals/${id}/subscribe`, {
      method: 'POST',
      headers: { 'x-user-id': user.id.toString() }
    }).catch(console.error);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64 gap-2">
      <RefreshCw className="w-8 h-8 animate-spin text-brand-500" />
      <p className="text-slate-400 text-sm">Loading organizational goals...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in">
      <header className="mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Target className="text-brand-500 w-6 h-6" /> Goals &amp; Benchmarks
        </h2>
        <p className="text-slate-400 text-sm">Monitor organizational goal metrics and subscribe to alerts on runway thresholds.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[900px]">
        {goals.map(g => {
          const progressPercent = Math.min(Math.round((g.current / g.target) * 100), 100);
          
          return (
            <div key={g.id} className="bg-[#131b2e] border border-slate-700/50 rounded-xl p-6 space-y-6 flex flex-col justify-between hover:border-slate-600 transition-colors">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-white text-base leading-tight">{g.name}</h3>
                  <p className="text-slate-400 text-xs mt-1 uppercase font-bold tracking-widest">{g.type} Target</p>
                </div>
                <button 
                  onClick={() => handleSubscribe(g.id)}
                  className={`p-2 rounded-lg transition-colors border ${
                    g.isSubscribed 
                      ? 'bg-brand-500/10 text-brand-400 border-brand-500/20' 
                      : 'bg-slate-800/40 text-slate-500 hover:text-white border-transparent'
                  }`}
                  title={g.isSubscribed ? 'Subscribed' : 'Subscribe to goal changes'}
                >
                  <Bell className="w-4 h-4" />
                </button>
              </div>

              {/* Progress Ring / Bar representation */}
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-400">Current Progress</span>
                  <span className="text-brand-400 font-mono font-bold">{progressPercent}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-brand-500 h-full rounded-full transition-all duration-1000" style={{ width: `${progressPercent}%` }}></div>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                  <span>Current: {g.current}</span>
                  <span>Target Goal: {g.target}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-400 border-t border-slate-800/60 pt-4">
                {progressPercent === 100 ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Goal achieved successfully!</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-slate-500" />
                    <span>In progress, active monitoring enabled.</span>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
