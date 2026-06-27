import React from 'react';
import { Landmark, Wallet, Globe, TrendingUp, GitMerge, LineChart, Terminal, Database, History, ChevronRight, ArrowRight, CheckCircle, HelpCircle } from 'lucide-react';

interface ProductsProps {
  onBack: () => void;
  onLogin: () => void;
  onNavigate: (view: 'products' | 'security' | 'partnership' | 'enterprise' | 'compliance' | 'privacy' | 'terms') => void;
}

export default function Products({ onBack, onLogin, onNavigate }: ProductsProps) {
  return (
    <div className="bg-background text-on-background font-body-lg min-h-screen flex flex-col w-full selection:bg-primary-fixed selection:text-primary">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-surface border-b border-outline-variant">
        <div className="flex justify-between items-center max-w-container-max mx-auto px-margin-desktop py-4 h-16">
          <div 
            onClick={onBack}
            className="flex items-center gap-3 cursor-pointer select-none active:opacity-80"
          >
            <div className="p-1.5 bg-primary text-white rounded">
              <span className="text-sm font-bold font-mono">$</span>
            </div>
            <span className="font-headline-lg text-headline-lg font-bold text-primary">FinanceHub</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <button onClick={() => onNavigate('products')} className="text-primary border-b-2 border-primary pb-1 font-label-caps text-label-caps font-semibold cursor-pointer">Products</button>
            <button onClick={() => onNavigate('security')} className="text-on-surface-variant hover:text-primary transition-colors font-label-caps text-label-caps cursor-pointer">Security</button>
            <button onClick={() => onNavigate('partnership')} className="text-on-surface-variant hover:text-primary transition-colors font-label-caps text-label-caps cursor-pointer">Institutional</button>
            <button onClick={() => onNavigate('compliance')} className="text-on-surface-variant hover:text-primary transition-colors font-label-caps text-label-caps cursor-pointer">Compliance</button>
          </nav>
          <div className="flex items-center gap-4">
            <button 
              onClick={onLogin}
              className="font-body-sm text-body-sm text-primary font-bold px-4 py-2 border border-primary rounded-lg hover:bg-surface-container-high transition-all"
            >
              Client Portal
            </button>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-12 flex-grow">
        {/* Hero Section */}
        <section className="max-w-container-max mx-auto px-margin-desktop py-16">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/2">
              <span className="font-label-caps text-label-caps text-secondary mb-4 block tracking-widest uppercase">
                INSTITUTIONAL GRADE SOLUTIONS
              </span>
              <h1 className="font-display-lg text-display-lg text-on-surface mb-6 leading-tight">
                Precision Financial<br/>Execution.
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-8 max-w-lg">
                Empowering institutional investors with rigorous analytical frameworks, high-frequency execution capabilities, and real-time data integrity.
              </p>
              <div className="flex gap-4">
                <button onClick={onLogin} className="bg-primary text-on-primary px-8 py-3 rounded-lg font-title-md transition-all hover:bg-primary-container">
                  Request Demo
                </button>
                <button onClick={() => onNavigate('security')} className="bg-surface-container-low text-primary border border-outline-variant px-8 py-3 rounded-lg font-title-md transition-all hover:bg-surface-container-high">
                  Documentation
                </button>
              </div>
            </div>
            
            {/* Visual Telemetry Box */}
            <div className="w-full md:w-1/2 relative h-[400px]">
              <div className="absolute inset-0 bg-primary-container rounded-xl overflow-hidden shadow-xl border border-outline-variant">
                <div className="relative z-10 p-8 flex flex-col justify-end h-full">
                  <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg border border-white/20">
                    <div className="flex items-center justify-between mb-4 text-white">
                      <span className="font-label-caps text-[10px] tracking-widest opacity-80">MARKET VOLATILITY INDEX</span>
                      <span className="font-data-mono text-xs text-secondary-fixed">0.024ms LATENCY</span>
                    </div>
                    {/* Simulated Mini Chart */}
                    <div className="h-24 w-full flex items-end gap-1">
                      <div className="bg-secondary-fixed w-full rounded-t-sm" style={{ height: '40%' }}></div>
                      <div className="bg-secondary-fixed w-full rounded-t-sm" style={{ height: '60%' }}></div>
                      <div className="bg-secondary-fixed w-full rounded-t-sm" style={{ height: '55%' }}></div>
                      <div className="bg-secondary-fixed w-full rounded-t-sm" style={{ height: '80%' }}></div>
                      <div className="bg-secondary-fixed w-full rounded-t-sm" style={{ height: '70%' }}></div>
                      <div className="bg-secondary-fixed w-full rounded-t-sm" style={{ height: '90%' }}></div>
                      <div className="bg-secondary-fixed w-full rounded-t-sm" style={{ height: '85%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Product Categories */}
        <section className="max-w-container-max mx-auto px-margin-desktop py-12 space-y-24">
          
          {/* Asset Management Section */}
          <div id="asset-management">
            <div className="flex items-center gap-4 mb-12 border-b border-outline-variant pb-4">
              <Wallet className="text-secondary w-10 h-10" />
              <h2 className="font-headline-lg text-headline-lg">Asset Management</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Global Equity */}
              <div className="group bg-surface-container-lowest border border-outline-variant p-8 rounded-xl hover:-translate-y-1 hover:border-secondary transition-all duration-300">
                <div className="bg-surface-container-low w-12 h-12 flex items-center justify-center rounded-lg mb-6 group-hover:bg-secondary-container transition-colors">
                  <Globe className="w-6 h-6 text-primary group-hover:text-on-secondary-container" />
                </div>
                <h3 className="font-title-md text-title-md mb-3 text-primary">Global Equity</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-6">
                  Diversified exposure across developed and emerging markets with proprietary alpha-capture strategies.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-body-sm text-on-surface-variant">
                    <CheckCircle className="text-secondary w-4 h-4" /> Systematic Risk Management
                  </li>
                  <li className="flex items-center gap-2 text-body-sm text-on-surface-variant">
                    <CheckCircle className="text-secondary w-4 h-4" /> Multi-factor Alpha Models
                  </li>
                </ul>
                <button onClick={onLogin} className="inline-flex items-center gap-2 text-secondary font-bold hover:gap-3 transition-all">
                  Explore Strategy <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Fixed Income */}
              <div className="group bg-surface-container-lowest border border-outline-variant p-8 rounded-xl hover:-translate-y-1 hover:border-secondary transition-all duration-300">
                <div className="bg-surface-container-low w-12 h-12 flex items-center justify-center rounded-lg mb-6 group-hover:bg-secondary-container transition-colors">
                  <TrendingUp className="w-6 h-6 text-primary group-hover:text-on-secondary-container" />
                </div>
                <h3 className="font-title-md text-title-md mb-3 text-primary">Fixed Income</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-6">
                  Optimized yield curves and credit selection powered by real-time interest rate analysis.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-body-sm text-on-surface-variant">
                    <CheckCircle className="text-secondary w-4 h-4" /> Sovereign &amp; Corporate Debt
                  </li>
                  <li className="flex items-center gap-2 text-body-sm text-on-surface-variant">
                    <CheckCircle className="text-secondary w-4 h-4" /> Duration Immunization
                  </li>
                </ul>
                <button onClick={onLogin} className="inline-flex items-center gap-2 text-secondary font-bold hover:gap-3 transition-all">
                  View Portfolios <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Alternatives */}
              <div className="group bg-surface-container-lowest border border-outline-variant p-8 rounded-xl hover:-translate-y-1 hover:border-secondary transition-all duration-300">
                <div className="bg-surface-container-low w-12 h-12 flex items-center justify-center rounded-lg mb-6 group-hover:bg-secondary-container transition-colors">
                  <GitMerge className="w-6 h-6 text-primary group-hover:text-on-secondary-container" />
                </div>
                <h3 className="font-title-md text-title-md mb-3 text-primary">Alternative Investments</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-6">
                  Non-correlated asset classes including Private Equity, Real Estate, and Hedge Fund mandates.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-body-sm text-on-surface-variant">
                    <CheckCircle className="text-secondary w-4 h-4" /> Private Market Access
                  </li>
                  <li className="flex items-center gap-2 text-body-sm text-on-surface-variant">
                    <CheckCircle className="text-secondary w-4 h-4" /> Enhanced Yield Structures
                  </li>
                </ul>
                <button onClick={onLogin} className="inline-flex items-center gap-2 text-secondary font-bold hover:gap-3 transition-all">
                  Learn More <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Quantitative Trading Section */}
          <div id="quantitative-trading">
            <div className="flex items-center gap-4 mb-12 border-b border-outline-variant pb-4">
              <LineChart className="text-on-tertiary-container w-10 h-10" />
              <h2 className="font-headline-lg text-headline-lg">Quantitative Trading</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Terminal */}
              <div className="relative overflow-hidden bg-primary-container text-on-primary rounded-xl p-10 flex flex-col justify-between group min-h-[320px] border border-outline-variant">
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded font-label-caps text-[10px] tracking-widest">HFT ENABLED</span>
                    <span className="text-on-primary-container font-data-mono text-xs">Terminal v4.2.0</span>
                  </div>
                  <h3 className="font-headline-lg text-headline-lg mb-4 text-white">High-Frequency Terminals</h3>
                  <p className="font-body-lg text-on-primary-container mb-8 max-w-md">
                    Ultra-low latency interface providing sub-millisecond execution speeds and direct market access (DMA) to 60+ global exchanges.
                  </p>
                </div>
                <div className="relative z-10 flex gap-4">
                  <button onClick={onLogin} className="bg-secondary text-white px-6 py-2 rounded-lg font-bold hover:bg-secondary/90 transition-all">
                    Provision Seat
                  </button>
                  <button onClick={() => onNavigate('security')} className="bg-white/10 text-white border border-white/20 px-6 py-2 rounded-lg font-bold hover:bg-white/20 transition-all">
                    Specs
                  </button>
                </div>
              </div>

              {/* Algorithmic Execution */}
              <div className="group bg-surface-container-highest border border-outline-variant p-10 rounded-xl flex flex-col justify-between min-h-[320px]">
                <div>
                  <div className="bg-primary w-12 h-12 flex items-center justify-center rounded-lg mb-6 text-white">
                    <Terminal className="w-6 h-6" />
                  </div>
                  <h3 className="font-headline-lg text-headline-lg mb-4 text-primary">Algorithmic Execution</h3>
                  <p className="font-body-lg text-on-surface-variant mb-8 max-w-md">
                    Custom VWAP, TWAP, and Implementation Shortfall algorithms designed to minimize market impact on large block trades.
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex flex-col">
                    <span className="font-data-mono text-on-surface text-base font-bold">99.99%</span>
                    <span className="font-label-caps text-[10px] text-on-surface-variant uppercase">Uptime SLA</span>
                  </div>
                  <div className="h-8 w-[1px] bg-outline-variant"></div>
                  <div className="flex flex-col">
                    <span className="font-data-mono text-on-surface text-base font-bold">&lt; 5ms</span>
                    <span className="font-label-caps text-[10px] text-on-surface-variant uppercase">Response Time</span>
                  </div>
                  <button onClick={onLogin} className="ml-auto text-primary font-bold hover:underline">
                    API Reference
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Data Services Section */}
          <div id="data-services">
            <div className="flex items-center gap-4 mb-12 border-b border-outline-variant pb-4">
              <Database className="text-primary w-10 h-10" />
              <h2 className="font-headline-lg text-headline-lg">Data Services</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              
              {/* Real-time Market Feeds */}
              <div className="md:col-span-8 bg-surface-container-low border border-outline-variant rounded-xl p-8 flex flex-col sm:flex-row gap-8 items-center">
                <div className="hidden lg:block w-48 h-48 bg-white rounded-lg p-4 border border-outline-variant">
                  <div className="w-full h-full flex flex-col gap-2">
                    <div className="h-4 bg-surface-container-high rounded animate-pulse"></div>
                    <div className="h-4 bg-surface-container-high rounded animate-pulse w-3/4"></div>
                    <div className="h-12 bg-secondary-container/20 rounded border border-secondary/20 flex items-center px-3 font-data-mono text-[10px] text-on-secondary-container">
                      {"{ \"stream\": \"EURUSD\" }"}
                    </div>
                    <div className="h-4 bg-surface-container-high rounded animate-pulse"></div>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-title-md text-title-md mb-4 text-primary">Real-time Market Feeds</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-6">
                    Normalized tick data from major L1 liquidity providers, delivered via gRPC or WebSockets for zero-lag integration.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="bg-white border border-outline-variant px-3 py-1 rounded text-[11px] font-data-mono">FIX 4.4</span>
                    <span className="bg-white border border-outline-variant px-3 py-1 rounded text-[11px] font-data-mono">JSON/WS</span>
                    <span className="bg-white border border-outline-variant px-3 py-1 rounded text-[11px] font-data-mono">gRPC</span>
                  </div>
                  <button onClick={() => onNavigate('security')} className="text-secondary font-bold flex items-center gap-2 hover:gap-3 transition-all">
                    View Documentation <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Archives */}
              <div className="md:col-span-4 bg-surface-container-low border border-outline-variant rounded-xl p-8 flex flex-col justify-between">
                <div>
                  <History className="text-primary mb-4 w-8 h-8" />
                  <h3 className="font-title-md text-title-md mb-2 text-primary">Historical Archives</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    25+ years of granular OHLCV and order book data for backtesting.
                  </p>
                </div>
                <div className="mt-8">
                  <div className="flex justify-between text-body-sm mb-2 text-on-surface">
                    <span className="text-on-surface-variant">Storage Capacity</span>
                    <span className="font-data-mono font-bold">4.2 PB</span>
                  </div>
                  <div className="w-full bg-outline-variant/30 h-1 rounded-full overflow-hidden">
                    <div className="bg-primary h-full w-3/4"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-container-max mx-auto px-margin-desktop py-12">
          <div className="bg-secondary-container rounded-2xl p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(#002113 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            </div>
            <div className="relative z-10 text-on-secondary-container">
              <h2 className="font-headline-lg text-headline-lg text-on-secondary-fixed mb-4">Ready to integrate?</h2>
              <p className="font-body-lg text-on-secondary-fixed-variant mb-10 max-w-2xl mx-auto">
                Our solutions are built for institutional scale. Speak with a technical account manager to discuss your firm's specific requirements.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button onClick={onLogin} className="bg-on-secondary-fixed text-white px-10 py-4 rounded-lg font-bold shadow-lg hover:bg-black transition-all">
                  Schedule Consultation
                </button>
                <button onClick={onLogin} className="bg-transparent text-on-secondary-fixed border border-on-secondary-fixed/30 px-10 py-4 rounded-lg font-bold hover:bg-white/20 transition-all">
                  Client Login
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-highest border-t border-outline-variant">
        <div className="flex flex-col md:flex-row justify-between items-center max-w-container-max mx-auto px-margin-desktop py-8 text-on-surface-variant">
          <div className="flex flex-col gap-2 items-center md:items-start mb-6 md:mb-0">
            <div className="flex items-center gap-2">
              <Landmark className="text-primary w-5 h-5" />
              <span className="font-title-md text-title-md text-primary font-bold">FinanceHub Institutional</span>
            </div>
            <p className="font-body-sm text-body-sm">© 2026 FinanceHub Institutional. All rights reserved.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-xs font-bold uppercase tracking-wider">
            <button onClick={() => onNavigate('terms')} className="hover:underline decoration-primary">Legal</button>
            <button onClick={() => onNavigate('privacy')} className="hover:underline decoration-primary">Privacy Policy</button>
            <button onClick={() => onNavigate('compliance')} className="hover:underline decoration-primary">Regulatory Disclosure</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
