import React, { useState, useEffect } from 'react';
import { Landmark, ChevronLeft, ChevronRight, Download, RefreshCw, FileText } from 'lucide-react';

export default function Statements({ user }) {
  const months = ['2026-04', '2026-03', '2026-02'];
  const [currentMonthIdx, setCurrentMonthIdx] = useState(0);
  const [statement, setStatement] = useState(null);
  const [loading, setLoading] = useState(true);

  const month = months[currentMonthIdx];

  useEffect(() => {
    fetchStatement();
  }, [currentMonthIdx]);

  const fetchStatement = () => {
    setLoading(true);
    fetch(`/api/viewer/statements/${month}`, { headers: { 'x-user-id': user.id.toString() } })
      .then(res => res.json())
      .then(setStatement)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleDownloadStatement = () => {
    if (!statement) return;
    const content = `
FINANCEHUB OFFICIAL STATEMENT
-----------------------------------
Statement Period: ${statement.month}
Account Holder: ${user.name}
Role Type: Stakeholder Viewer
-----------------------------------
Opening Balance:  $${statement.openingBalance.toFixed(2)}
Total Inflow:     $${statement.totalIn.toFixed(2)}
Total Outflow:    $${statement.totalOut.toFixed(2)}
Closing Balance:  $${statement.closingBalance.toFixed(2)}
-----------------------------------
TRANSACTIONS LISTING:
${statement.transactions.map(t => `[${t.date}] ${t.category.padEnd(12)} | ${t.type.toUpperCase().padEnd(7)} | $${t.amount.toFixed(2).padEnd(8)} | ${t.description || ''}`).join('\n')}
-----------------------------------
Generated on: ${new Date().toLocaleString()}
SEC/FINRA Regulated Ledger Log
    `;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `finance-statement-${statement.month}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64 gap-2">
      <RefreshCw className="w-8 h-8 animate-spin text-brand-500" />
      <p className="text-slate-400 text-sm">Compiling monthly statement...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in">
      <header className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <FileText className="text-brand-500 w-6 h-6" /> Monthly Statements
          </h2>
          <p className="text-slate-400 text-sm">Inspect audited monthly statements and download compliance print sheets.</p>
        </div>
        
        {/* Month Selector */}
        <div className="flex items-center gap-3 bg-[#131b2e] border border-slate-700/50 rounded-lg p-1.5">
          <button 
            disabled={currentMonthIdx === months.length - 1}
            onClick={() => setCurrentMonthIdx(prev => prev + 1)}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 rounded transition-colors text-white"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-mono text-sm font-bold text-white px-2">{month}</span>
          <button 
            disabled={currentMonthIdx === 0}
            onClick={() => setCurrentMonthIdx(prev => prev - 1)}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 rounded transition-colors text-white"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Statement Card */}
      {statement && (
        <div className="bg-[#131b2e] border border-slate-700/50 rounded-xl p-8 space-y-8 max-w-[700px] mx-auto shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-500/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex justify-between items-start border-b border-slate-800 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <Landmark className="text-brand-500 w-6 h-6" />
                <span className="text-xl font-bold text-white font-display">FinanceHub Official</span>
              </div>
              <p className="text-xs text-slate-500 mt-1 uppercase font-bold tracking-widest">SEC Regulated Statement</p>
            </div>
            <button 
              onClick={handleDownloadStatement}
              className="bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-lg flex items-center gap-1.5 font-bold text-[10px] uppercase tracking-wider transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" /> Download
            </button>
          </div>

          {/* Balance Summary Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-4">
            <div>
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Opening Balance</span>
              <span className="font-data-mono text-lg font-bold text-white mt-1 block">${statement.openingBalance.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Total Deposits</span>
              <span className="font-data-mono text-lg font-bold text-emerald-400 mt-1 block">${statement.totalIn.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Total Outflows</span>
              <span className="font-data-mono text-lg font-bold text-rose-400 mt-1 block">${statement.totalOut.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Closing Balance</span>
              <span className="font-data-mono text-lg font-bold text-brand-400 mt-1 block">${statement.closingBalance.toLocaleString()}</span>
            </div>
          </div>

          {/* Transactions List */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono text-slate-400 font-bold uppercase tracking-wider">Transaction History ({statement.transactions.length})</h3>
            <div className="divide-y divide-slate-800/60 border-t border-b border-slate-800/60 max-h-[300px] overflow-y-auto pr-2">
              {statement.transactions.map(t => (
                <div key={t.id} className="py-3.5 flex justify-between items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{t.category}</span>
                      <span className="text-slate-500 text-[10px] font-mono">{t.date}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{t.description}</p>
                  </div>
                  <span className={`font-data-mono text-sm font-bold ${
                    t.type === 'income' ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
