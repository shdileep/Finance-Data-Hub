import React, { useState, useEffect } from 'react';
import { SlidersHorizontal, Save, Copy, Scale, Share2, RefreshCw, BarChart2 } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export default function Forecast({ user }) {
  const [scenarios, setScenarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [monthlyGrowth, setMonthlyGrowth] = useState(5.0);
  const [expenseGrowth, setExpenseGrowth] = useState(2.0);
  const [scenarioName, setScenarioName] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [comparedIds, setComparedIds] = useState(new Set());

  useEffect(() => {
    fetchScenarios();
  }, []);

  const fetchScenarios = () => {
    setLoading(true);
    fetch('/api/forecast/scenarios', { headers: { 'x-user-id': user.id.toString() } })
      .then(res => res.json())
      .then(data => setScenarios(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleSaveScenario = (e) => {
    e.preventDefault();
    if (!scenarioName) return;
    setActionLoading(true);
    fetch('/api/forecast/scenarios', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': user.id.toString()
      },
      body: JSON.stringify({
        name: scenarioName,
        monthly_growth: monthlyGrowth,
        expense_growth: expenseGrowth
      })
    })
      .then(res => res.json())
      .then(() => {
        setScenarioName('');
        fetchScenarios();
      })
      .catch(console.error)
      .finally(() => setActionLoading(false));
  };

  const handleDeleteScenario = (id) => {
    fetch(`/api/forecast/scenarios/${id}`, {
      method: 'DELETE',
      headers: { 'x-user-id': user.id.toString() }
    })
      .then(() => {
        setComparedIds(prev => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        fetchScenarios();
      });
  };

  const handleToggleCompare = (id) => {
    setComparedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (next.size >= 3) return prev; // Limit comparison to 3 scenarios
        next.add(id);
      }
      return next;
    });
  };

  // Generate 6-month projected data
  const projectionData = React.useMemo(() => {
    const data = [];
    let currentBalance = 6450; // Seed net balance
    let currentIncome = 8000;
    let currentExpense = 1550;

    const months = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];

    for (let i = 0; i < 6; i++) {
      const month = months[i];
      const result = { month };

      // Base Projection
      currentIncome = currentIncome * (1 + monthlyGrowth / 100);
      currentExpense = currentExpense * (1 + expenseGrowth / 100);
      currentBalance = currentBalance + (currentIncome - currentExpense);
      result['Projected Balance'] = Math.round(currentBalance);

      // Scenarios overlay
      scenarios.forEach(sc => {
        if (comparedIds.has(sc.id)) {
          let scBalance = 6450;
          let scInc = 8000;
          let scExp = 1550;
          for (let j = 0; j <= i; j++) {
            scInc = scInc * (1 + sc.monthly_growth / 100);
            scExp = scExp * (1 + sc.expense_growth / 100);
            scBalance = scBalance + (scInc - scExp);
          }
          result[sc.name] = Math.round(scBalance);
        }
      });

      data.push(result);
    }
    return data;
  }, [monthlyGrowth, expenseGrowth, scenarios, comparedIds]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64 gap-2">
      <RefreshCw className="w-8 h-8 animate-spin text-brand-500" />
      <p className="text-slate-400 text-sm">Initializing projection tables...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in">
      <header className="mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <BarChart2 className="text-brand-500 w-6 h-6" /> Scenario Forecasting Workspace
        </h2>
        <p className="text-slate-400 text-sm">Build what-if cash projection scenarios and overlay multiple models on a 6-month scale.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sliders & Scenario Form */}
        <div className="lg:col-span-4 bg-[#131b2e] border border-slate-700/50 rounded-xl p-6 space-y-6">
          <h3 className="text-lg font-bold text-white mb-2">Parameters</h3>

          {/* Growth Sliders */}
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-400">Monthly Revenue Growth</span>
                <span className="text-brand-400 font-mono font-bold">{monthlyGrowth}%</span>
              </div>
              <input 
                type="range" 
                min="-10" 
                max="30" 
                step="0.5"
                value={monthlyGrowth}
                onChange={e => setMonthlyGrowth(parseFloat(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-500"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-400">Monthly Expense Growth</span>
                <span className="text-brand-400 font-mono font-bold">{expenseGrowth}%</span>
              </div>
              <input 
                type="range" 
                min="-10" 
                max="30" 
                step="0.5"
                value={expenseGrowth}
                onChange={e => setExpenseGrowth(parseFloat(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-500"
              />
            </div>
          </div>

          {/* Save Scenario Form */}
          <form onSubmit={handleSaveScenario} className="space-y-4 pt-6 border-t border-slate-800">
            <div>
              <label className="block text-slate-400 text-xs font-semibold mb-2">Scenario Title</label>
              <input 
                type="text"
                value={scenarioName}
                onChange={e => setScenarioName(e.target.value)}
                placeholder="e.g. Bull Run Case"
                required
                className="w-full bg-slate-850 border border-slate-700 rounded px-4 py-2 text-white text-sm"
              />
            </div>
            <button 
              type="submit" 
              disabled={actionLoading}
              className="w-full bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-bold py-3 rounded text-xs uppercase tracking-widest flex justify-center items-center gap-2"
            >
              <Save className="w-4 h-4" /> Save Scenario Model
            </button>
          </form>
        </div>

        {/* Projection Recharts Visual */}
        <div className="lg:col-span-8 bg-[#131b2e] border border-slate-700/50 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white mb-6">6-Month Balance Projections</h3>
            <div className="h-72 w-full text-slate-300">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={projectionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="month" stroke="#9ca3af" fontSize={11} />
                  <YAxis stroke="#9ca3af" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151' }} />
                  <Legend />
                  <Line type="monotone" dataKey="Projected Balance" stroke="#4f46e5" strokeWidth={3} activeDot={{ r: 8 }} />
                  
                  {/* Compared scenarios overlays */}
                  {scenarios.map((sc, i) => {
                    if (comparedIds.has(sc.id)) {
                      const colors = ['#10b981', '#f59e0b', '#ec4899'];
                      return (
                        <Line 
                          key={sc.id}
                          type="monotone" 
                          dataKey={sc.name} 
                          stroke={colors[i % colors.length]} 
                          strokeDasharray="5 5"
                          strokeWidth={2} 
                        />
                      );
                    }
                    return null;
                  })}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Saved Scenarios Comparison Desk */}
      <div className="bg-[#131b2e] border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Saved Forecast Models</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {scenarios.map(sc => {
            const isComparing = comparedIds.has(sc.id);
            return (
              <div 
                key={sc.id} 
                className={`p-5 border rounded-xl flex flex-col justify-between gap-4 transition-all duration-300 ${
                  isComparing ? 'border-brand-500 bg-brand-500/5' : 'border-slate-700 bg-slate-800/10'
                }`}
              >
                <div>
                  <h4 className="font-bold text-white text-base">{sc.name}</h4>
                  <div className="grid grid-cols-2 gap-4 mt-3 text-xs">
                    <div>
                      <span className="text-slate-400 block">Revenue growth</span>
                      <span className="font-bold text-emerald-400 mt-0.5 block">{sc.monthly_growth}%</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Expense growth</span>
                      <span className="font-bold text-rose-400 mt-0.5 block">{sc.expense_growth}%</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 border-t border-slate-800 pt-4">
                  <button 
                    onClick={() => handleToggleCompare(sc.id)}
                    className={`flex-1 py-2 rounded text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors ${
                      isComparing 
                        ? 'bg-brand-600 text-white hover:bg-brand-500' 
                        : 'bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white'
                    }`}
                  >
                    <Scale className="w-3.5 h-3.5" /> {isComparing ? 'Comparing' : 'Compare'}
                  </button>
                  <button 
                    onClick={() => handleDeleteScenario(sc.id)}
                    className="p-2 bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
