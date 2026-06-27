import React from 'react';
import { Landmark, ArrowRight, CheckCircle, Shield, Code, Group, Users, Server, Table } from 'lucide-react';

interface EnterpriseProps {
  onBack: () => void;
  onLogin: () => void;
  onNavigate: (view: 'products' | 'security' | 'partnership' | 'enterprise' | 'compliance' | 'privacy' | 'terms') => void;
}

export default function Enterprise({ onBack, onLogin, onNavigate }: EnterpriseProps) {
  return (
    <div className="bg-background text-on-surface font-body-lg min-h-screen flex flex-col w-full selection:bg-primary-fixed selection:text-primary">
      {/* TopAppBar */}
      <header className="sticky top-0 w-full z-50 bg-surface border-b border-outline-variant flex justify-between items-center h-16 px-margin-mobile md:px-margin-desktop">
        <div 
          onClick={onBack}
          className="flex items-center gap-2 cursor-pointer select-none active:opacity-80"
        >
          <Landmark className="text-primary w-6 h-6" />
          <span className="font-headline-lg-mobile text-headline-lg-mobile font-bold text-primary">FinanceHub</span>
        </div>
        <nav className="hidden md:flex gap-8">
          <button onClick={() => onNavigate('enterprise')} className="text-primary font-semibold font-body-sm text-body-sm hover:bg-surface-container-low transition-colors px-3 py-2 rounded">Solutions</button>
          <button onClick={() => onNavigate('security')} className="text-on-surface-variant font-body-sm text-body-sm hover:bg-surface-container-low transition-colors px-3 py-2 rounded">Infrastructure</button>
          <button onClick={() => onNavigate('compliance')} className="text-on-surface-variant font-body-sm text-body-sm hover:bg-surface-container-low transition-colors px-3 py-2 rounded">Compliance</button>
        </nav>
        <div className="flex items-center gap-4">
          <button onClick={onLogin} className="text-on-surface-variant font-body-sm text-body-sm px-4 py-2 hover:bg-surface-container-low transition-all">Login</button>
          <button onClick={onLogin} className="bg-primary text-on-primary font-body-sm text-body-sm px-6 py-2 active:opacity-80 transition-opacity">Request Demo</button>
        </div>
      </header>

      <main className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-24 flex-grow w-full">
        {/* Hero Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-32">
          <div>
            <span className="inline-block px-3 py-1 bg-primary-fixed text-on-primary-fixed font-label-caps text-label-caps mb-6 rounded-full text-xs font-semibold uppercase tracking-widest">
              ENTERPRISE GRADE
            </span>
            <h1 className="font-display-lg text-display-lg font-bold text-primary mb-6 leading-tight">
              Institutional Infrastructure for Modern Capital.
            </h1>
            <p className="text-on-surface-variant mb-10 max-w-lg">
              FinanceHub provides the resilient core for large-scale financial operations, combining high-throughput API integration with sophisticated multi-user governance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={onLogin} className="bg-primary text-on-primary px-8 py-4 font-body-lg text-body-lg flex items-center justify-center gap-2 font-semibold">
                Build with API <ArrowRight className="w-5 h-5" />
              </button>
              <button onClick={() => onNavigate('security')} className="border border-outline px-8 py-4 font-body-lg text-body-lg flex items-center justify-center gap-2 hover:bg-surface-container-low transition-colors font-semibold">
                Documentation
              </button>
            </div>
          </div>
          
          {/* Server Mock Visual */}
          <div className="relative h-[400px] md:h-[500px] bg-primary-container rounded-lg overflow-hidden border border-outline-variant shadow-lg flex items-center justify-center text-white">
            <div className="text-center p-8">
              <Server className="w-16 h-16 mx-auto text-secondary-fixed mb-4" />
              <h3 className="text-xl font-bold font-display">Resilient Infrastructure</h3>
              <p className="text-primary-fixed-dim text-sm max-w-xs mx-auto mt-2">Ultra-reliable core optimized for low-latency settlements.</p>
            </div>
            
            {/* KPI Card */}
            <div className="absolute bottom-8 left-8 p-6 bg-white border border-outline-variant shadow-lg max-w-[240px] text-on-surface">
              <p className="font-label-caps text-label-caps text-on-surface-variant mb-1 uppercase tracking-widest text-[10px] font-bold">Uptime SLA</p>
              <p className="font-data-mono text-3xl font-bold text-secondary">99.999%</p>
              <div className="mt-4 flex gap-1">
                <div className="h-1 w-full bg-secondary"></div>
                <div className="h-1 w-full bg-secondary"></div>
                <div className="h-1 w-full bg-secondary"></div>
                <div className="h-1 w-full bg-secondary"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Infrastructure Pillars */}
        <section className="mb-32">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-2xl">
              <h2 className="font-headline-lg text-headline-lg font-bold text-primary mb-4">Core Infrastructure Pillars</h2>
              <p className="text-on-surface-variant">Scalable solutions engineered to handle millions of transactions with sub-millisecond latency.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* API Integration */}
            <div className="md:col-span-8 p-8 border border-outline-variant bg-white flex flex-col justify-between min-h-[320px] rounded-xl shadow-sm hover:border-primary transition-all">
              <div>
                <Code className="text-primary mb-4 w-8 h-8" />
                <h3 className="font-title-md text-title-md font-bold text-primary mb-2">Unified API Ecosystem</h3>
                <p className="text-on-surface-variant max-w-md">
                  Connect your existing stack to our high-performance ledger and clearing systems. RESTful and WebSocket interfaces available for real-time data streaming.
                </p>
              </div>
              <div className="mt-8 bg-surface-container-low p-4 rounded font-data-mono text-body-sm text-on-primary-container border border-outline-variant">
                <span className="text-secondary font-bold">POST</span> /v1/enterprise/settlement
              </div>
            </div>

            {/* Governance */}
            <div className="md:col-span-4 p-8 border border-outline-variant bg-surface-container-high flex flex-col justify-between min-h-[320px] rounded-xl shadow-sm">
              <div>
                <Users className="text-primary mb-4 w-8 h-8" />
                <h3 className="font-title-md text-title-md font-bold text-primary mb-2">Advanced Governance</h3>
                <p className="text-on-surface-variant">
                  Hierarchical account structures with granular permissions, multi-sig approval workflows, and full audit logging.
                </p>
              </div>
            </div>

            {/* Support */}
            <div className="md:col-span-4 p-8 border border-outline-variant bg-white rounded-xl shadow-sm hover:border-primary transition-all flex flex-col justify-between">
              <div>
                <Landmark className="text-primary mb-4 w-8 h-8" />
                <h3 className="font-title-md text-title-md font-bold text-primary mb-2">Dedicated Coverage</h3>
                <p className="text-on-surface-variant">
                  24/7 institutional desk with dedicated account managers and technical solutions engineers.
                </p>
              </div>
            </div>

            {/* Compliance */}
            <div className="md:col-span-8 p-8 border border-outline-variant bg-white rounded-xl shadow-sm hover:border-primary transition-all flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1">
                <Shield className="text-primary mb-4 w-8 h-8" />
                <h3 className="font-title-md text-title-md font-bold text-primary mb-2">Global Compliance Engine</h3>
                <p className="text-on-surface-variant">
                  Automated KYC/AML, SOC2 Type II certified infrastructure, and localized regulatory reporting tools.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 w-full md:w-auto text-center font-bold text-xs uppercase tracking-wider">
                <div className="px-4 py-2 border border-outline-variant">SOC2</div>
                <div className="px-4 py-2 border border-outline-variant">ISO 27001</div>
                <div className="px-4 py-2 border border-outline-variant">GDPR</div>
                <div className="px-4 py-2 border border-outline-variant">FINRA</div>
              </div>
            </div>
          </div>
        </section>

        {/* Benchmarks Table */}
        <section className="mb-32">
          <h2 className="font-headline-lg text-headline-lg font-bold text-primary mb-12 text-center">Institutional Benchmarks</h2>
          <div className="overflow-x-auto border border-outline-variant rounded-xl shadow-sm">
            <table className="w-full text-left border-collapse bg-white">
              <thead className="bg-surface-container text-on-surface border-b border-outline-variant">
                <tr className="font-label-caps text-label-caps text-xs">
                  <th className="p-6">Metric</th>
                  <th className="p-6">Standard Node</th>
                  <th className="p-6">Enterprise Cluster</th>
                  <th className="p-6">Global Distribution</th>
                </tr>
              </thead>
              <tbody className="font-body-sm divide-y divide-outline-variant text-on-surface">
                <tr className="hover:bg-surface-container-low transition-colors">
                  <td className="p-6 font-bold">Throughput (tx/s)</td>
                  <td className="p-6 font-mono text-sm">5,000+</td>
                  <td className="p-6 font-mono text-sm">50,000+</td>
                  <td className="p-6 font-mono text-sm text-secondary font-bold">Unlimited Scaling</td>
                </tr>
                <tr className="hover:bg-surface-container-low transition-colors">
                  <td className="p-6 font-bold">Execution Latency</td>
                  <td className="p-6 font-mono text-sm">&lt; 150ms</td>
                  <td className="p-6 font-mono text-sm">&lt; 20ms</td>
                  <td className="p-6 font-mono text-sm text-secondary font-bold">&lt; 5ms (Direct Connect)</td>
                </tr>
                <tr className="hover:bg-surface-container-low transition-colors">
                  <td className="p-6 font-bold">API Rate Limit</td>
                  <td className="p-6 font-mono text-sm">100/sec</td>
                  <td className="p-6 font-mono text-sm">Dynamic Tiering</td>
                  <td className="p-6 font-mono text-sm font-bold">Custom Uncapped</td>
                </tr>
                <tr className="hover:bg-surface-container-low transition-colors">
                  <td className="p-6 font-bold">Uptime History</td>
                  <td className="p-6 font-mono text-sm">99.9%</td>
                  <td className="p-6 font-mono text-sm">99.99%</td>
                  <td className="p-6 font-mono text-sm font-bold">99.999%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary text-on-primary p-12 md:p-24 relative overflow-hidden rounded-2xl shadow-xl">
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 text-white">
            <div className="max-w-xl">
              <h2 className="font-display-lg text-display-lg text-white font-bold mb-6 leading-tight">Ready to modernize your infrastructure?</h2>
              <p className="text-primary-fixed-dim font-body-lg text-body-lg mb-8">
                Join the world's leading hedge funds, family offices, and fintech pioneers building on FinanceHub.
              </p>
              <div className="flex gap-4">
                <button onClick={onLogin} className="bg-white text-primary px-8 py-4 font-bold hover:bg-primary-fixed transition-colors">
                  Speak to Sales
                </button>
                <button onClick={() => onNavigate('security')} className="border border-white/30 text-white px-8 py-4 font-bold hover:border-white transition-all">
                  Download Case Study
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container border-t border-outline-variant flex flex-col md:flex-row justify-between items-center py-8 px-margin-mobile md:px-margin-desktop w-full gap-4 text-on-surface-variant">
        <div className="flex items-center gap-2">
          <span className="font-title-md text-title-md font-bold text-primary">FinanceHub</span>
          <span className="text-on-surface-variant font-body-sm text-body-sm ml-4">© 2026 FinanceHub Institutional. All rights reserved.</span>
        </div>
        <div className="flex gap-6 text-xs font-semibold uppercase tracking-wider">
          <button onClick={() => onNavigate('privacy')} className="hover:underline">Privacy</button>
          <button onClick={() => onNavigate('terms')} className="hover:underline">Terms</button>
          <button onClick={() => onNavigate('compliance')} className="hover:underline">Compliance</button>
        </div>
      </footer>
    </div>
  );
}
