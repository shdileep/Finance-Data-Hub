import React, { useState, useEffect } from 'react';
import { Bell, Plus, X, Search, CheckCircle, RefreshCw, Sliders, ToggleLeft, ToggleRight } from 'lucide-react';

export default function Alerts({ user, onInvestigate }) {
  const [rules, setRules] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Rule Form State
  const [ruleField, setRuleField] = useState('amount');
  const [ruleOperator, setRuleOperator] = useState('>');
  const [ruleThreshold, setRuleThreshold] = useState('');
  const [ruleChannel, setRuleChannel] = useState('email');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      fetch('/api/admin/alert-rules', { headers: { 'x-user-id': user.id.toString() } }).then(r => r.json()),
      fetch('/api/admin/fired-alerts', { headers: { 'x-user-id': user.id.toString() } }).then(r => r.json())
    ])
      .then(([rulesData, alertsData]) => {
        setRules(rulesData);
        setAlerts(alertsData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleToggleRule = (id) => {
    fetch(`/api/admin/alert-rules/${id}`, {
      method: 'PUT',
      headers: { 'x-user-id': user.id.toString() }
    })
      .then(res => res.json())
      .then(() => {
        fetchData();
      });
  };

  const handleCreateRule = (e) => {
    e.preventDefault();
    setActionLoading(true);
    fetch('/api/admin/alert-rules', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': user.id.toString()
      },
      body: JSON.stringify({
        field: ruleField,
        operator: ruleOperator,
        threshold: ruleThreshold,
        channel: ruleChannel
      })
    })
      .then(res => res.json())
      .then(() => {
        setShowAddModal(false);
        setRuleThreshold('');
        fetchData();
      })
      .catch(console.error)
      .finally(() => setActionLoading(false));
  };

  const handleDismissAlert = (id) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64 gap-2">
      <RefreshCw className="w-8 h-8 animate-spin text-brand-500" />
      <p className="text-slate-400 text-sm">Scanning alert rules...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in">
      <header className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Bell className="text-brand-500 w-6 h-6 animate-swing" /> Notifications &amp; Alerts Center
          </h2>
          <p className="text-slate-400 text-sm">Configure real-time threshold indicators and view fired anomaly checks.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-brand-600 hover:bg-brand-500 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-bold text-xs uppercase tracking-wider transition-all"
        >
          <Plus className="w-4 h-4" /> New Alert Rule
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Active Rules List */}
        <div className="lg:col-span-5 bg-[#131b2e] border border-slate-700/50 rounded-xl p-6 space-y-6">
          <div className="flex items-center gap-2 font-mono text-xs text-brand-400 font-bold uppercase tracking-wider">
            <Sliders className="w-4 h-4" /> Rule Configurations
          </div>
          <div className="space-y-4">
            {rules.map(rule => (
              <div key={rule.id} className="p-4 bg-slate-800/30 border border-slate-700/50 rounded-lg flex justify-between items-center gap-4 hover:border-slate-600 transition-colors">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white uppercase text-xs">{rule.field}</span>
                    <span className="text-slate-400 text-xs font-mono">{rule.operator}</span>
                    <span className="font-bold text-brand-400 font-mono text-sm">${rule.threshold}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">CHANNEL: {rule.channel.toUpperCase()}</p>
                </div>
                <button 
                  onClick={() => handleToggleRule(rule.id)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  {rule.status === 'active' ? (
                    <ToggleRight className="w-9 h-9 text-brand-500" />
                  ) : (
                    <ToggleLeft className="w-9 h-9 text-slate-600" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Fired Alerts Logs */}
        <div className="lg:col-span-7 bg-[#131b2e] border border-slate-700/50 rounded-xl p-6 space-y-6">
          <div className="flex justify-between items-center pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2 font-mono text-xs text-slate-400 font-bold uppercase tracking-wider">
              <Bell className="w-4 h-4 text-rose-400" /> Fired Alerts Log ({alerts.length})
            </div>
            {alerts.length > 0 && (
              <button 
                onClick={() => setAlerts([])}
                className="text-xs text-slate-500 hover:text-slate-300 font-bold uppercase"
              >
                Dismiss All
              </button>
            )}
          </div>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {alerts.length === 0 ? (
              <div className="text-center py-16 text-slate-500 text-sm">
                No active fired alerts found. All transactions comply with rules.
              </div>
            ) : (
              alerts.map(a => (
                <div key={a.id} className="p-4 bg-rose-500/5 border border-rose-500/20 rounded-lg flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <span className="bg-rose-500/20 text-rose-300 text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase">
                      LIMIT TRIGGERED
                    </span>
                    <p className="text-sm text-white font-medium mt-1">{a.message}</p>
                    <p className="text-[10px] text-slate-500 font-mono">
                      Recorded by: {a.userName} · {new Date(a.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => onInvestigate(a.category)}
                      className="p-2 bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white rounded-lg transition-colors"
                      title="Investigate Transaction"
                    >
                      <Search className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDismissAlert(a.id)}
                      className="p-2 bg-slate-800 hover:bg-slate-750 text-slate-500 hover:text-slate-300 rounded-lg transition-colors"
                      title="Dismiss Alert"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Rules Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#131b2e] border border-slate-700 rounded-xl max-w-md w-full p-6 space-y-6 shadow-xl animate-in zoom-in-95">
            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">Create New Alert Rule</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white text-sm">Cancel</button>
            </div>

            <form onSubmit={handleCreateRule} className="space-y-4">
              <div>
                <label className="block text-slate-400 text-xs font-semibold mb-2">Check Field</label>
                <select 
                  value={ruleField} 
                  onChange={e => setRuleField(e.target.value)}
                  className="w-full bg-slate-850 border border-slate-700 rounded px-4 py-2 text-white"
                >
                  <option value="amount">Amount ($)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 text-xs font-semibold mb-2">Evaluation Operator</label>
                <select 
                  value={ruleOperator} 
                  onChange={e => setRuleOperator(e.target.value)}
                  className="w-full bg-slate-850 border border-slate-700 rounded px-4 py-2 text-white"
                >
                  <option value=">">Greater than (&gt;)</option>
                  <option value="<">Less than (&lt;)</option>
                  <option value="=">Equals (=)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 text-xs font-semibold mb-2">Threshold Limit ($)</label>
                <input 
                  type="number"
                  value={ruleThreshold}
                  onChange={e => setRuleThreshold(e.target.value)}
                  placeholder="e.g. 5000"
                  required
                  className="w-full bg-slate-850 border border-slate-700 rounded px-4 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-xs font-semibold mb-2">Notification Channel</label>
                <select 
                  value={ruleChannel} 
                  onChange={e => setRuleChannel(e.target.value)}
                  className="w-full bg-slate-850 border border-slate-700 rounded px-4 py-2 text-white"
                >
                  <option value="email">Email</option>
                  <option value="sms">SMS Text Alert</option>
                </select>
              </div>

              <button 
                type="submit" 
                disabled={actionLoading}
                className="w-full bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-bold py-3 rounded text-xs uppercase tracking-widest flex justify-center items-center gap-2"
              >
                {actionLoading && <RefreshCw className="w-4 h-4 animate-spin" />}
                Activate Rule
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
