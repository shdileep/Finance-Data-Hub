import React from 'react';
import { Landmark, ArrowLeft, BarChart3, TrendingUp, DollarSign, Wallet, Shield } from 'lucide-react';

interface DashboardPreviewProps {
  onBack: () => void;
  onLogin: () => void;
}

export default function DashboardPreview({ onBack, onLogin }: DashboardPreviewProps) {
  return (
    <div className="bg-[#0b1c30] text-white font-body-lg min-h-screen flex flex-col w-full selection:bg-secondary-fixed selection:text-primary">
      {/* TopAppBar */}
      <header className="bg-[#131b2e] border-b border-slate-700/50 sticky top-0 w-full z-50 flex justify-between items-center h-16 px-margin-mobile md:px-margin-desktop">
        <div onClick={onBack} className="flex items-center gap-2 cursor-pointer select-none active:opacity-80">
          <Landmark className="text-secondary-fixed w-5 h-5" />
          <span className="font-headline-lg-mobile text-headline-lg-mobile font-bold text-white">FinanceHub</span>
          <span className="bg-secondary text-white px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ml-2">PREVIEW MODE</span>
        </div>
        <div className="flex gap-4">
          <button onClick={onBack} className="flex items-center gap-1 text-slate-400 hover:text-white text-xs font-bold uppercase transition-all">
            <ArrowLeft className="w-4 h-4" /> Exit
          </button>
          <button onClick={onLogin} className="bg-secondary-fixed text-primary font-body-sm px-4 py-2 hover:opacity-90 transition-all font-bold text-xs uppercase tracking-wider">
            Access Full Node
          </button>
        </div>
      </header>

      {/* Main Preview Container */}
      <main className="max-w-[1200px] mx-auto px-margin-mobile py-12 md:py-16 flex-grow w-full space-y-12">
        <header>
          <h1 className="font-display-lg text-3xl font-bold leading-tight mb-2 text-white">Analytics Console Telemetry</h1>
          <p className="text-slate-400 text-sm max-w-xl">
            This represents a low-latency preview of the central clearing ledger and trend analysis metrics.
          </p>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-[#131b2e] border border-slate-700/50 rounded-xl p-6 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-6">
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Assets Managed</span>
              <DollarSign className="text-secondary-fixed w-5 h-5" />
            </div>
            <div>
              <p className="font-data-mono text-3xl font-bold text-white">$4,289,122.00</p>
              <p className="text-secondary text-xs font-bold mt-2 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" /> +14.2% versus last quarter
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-[#131b2e] border border-slate-700/50 rounded-xl p-6 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-6">
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Transactions</span>
              <Wallet className="text-secondary-fixed w-5 h-5" />
            </div>
            <div>
              <p className="font-data-mono text-3xl font-bold text-white">1,424</p>
              <p className="text-slate-400 text-xs mt-2">Continuous reconciliation active</p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-[#131b2e] border border-slate-700/50 rounded-xl p-6 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-6">
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Security State</span>
              <Shield className="text-secondary-fixed w-5 h-5" />
            </div>
            <div>
              <p className="font-data-mono text-3xl font-bold text-secondary-fixed">Zero-Trust Active</p>
              <p className="text-slate-400 text-xs mt-2">100% compliant with SOC2 protocols</p>
            </div>
          </div>
        </div>

        {/* Visual Analytics Simulator */}
        <div className="bg-[#131b2e] border border-slate-700/50 rounded-xl p-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-headline-lg text-lg font-bold text-white">Trend Telemetry Chart</h3>
            <span className="font-data-mono text-xs text-secondary-fixed">LIVE REFRESH: 1s</span>
          </div>
          <div className="h-64 flex items-end gap-3 w-full">
            <div className="bg-secondary-fixed w-full rounded-t-sm" style={{ height: '35%' }} />
            <div className="bg-secondary-fixed w-full rounded-t-sm" style={{ height: '55%' }} />
            <div className="bg-secondary-fixed w-full rounded-t-sm" style={{ height: '45%' }} />
            <div className="bg-secondary-fixed w-full rounded-t-sm" style={{ height: '70%' }} />
            <div className="bg-secondary-fixed w-full rounded-t-sm" style={{ height: '60%' }} />
            <div className="bg-secondary-fixed w-full rounded-t-sm" style={{ height: '85%' }} />
            <div className="bg-secondary-fixed w-full rounded-t-sm" style={{ height: '80%' }} />
            <div className="bg-secondary-fixed w-full rounded-t-sm" style={{ height: '95%' }} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#131b2e] border-t border-slate-700/50 py-8">
        <div className="max-w-[1200px] mx-auto px-margin-mobile flex justify-between items-center text-xs font-bold uppercase tracking-wider text-slate-400">
          <span>© 2026 FinanceHub. Preview Environment.</span>
          <button onClick={onBack} className="hover:underline text-white">Back to Home</button>
        </div>
      </footer>
    </div>
  );
}
