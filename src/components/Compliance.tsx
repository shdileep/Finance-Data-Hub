import React from 'react';
import { Landmark, Shield, CheckCircle, Lock, Download, AlertCircle, Play, ChevronRight, FileText } from 'lucide-react';

interface ComplianceProps {
  onBack: () => void;
  onLogin: () => void;
  onNavigate: (view: 'products' | 'security' | 'partnership' | 'enterprise' | 'compliance' | 'privacy' | 'terms') => void;
}

export default function Compliance({ onBack, onLogin, onNavigate }: ComplianceProps) {
  return (
    <div className="bg-background text-on-surface font-body-lg min-h-screen flex flex-col w-full selection:bg-primary-fixed selection:text-primary">
      {/* TopAppBar */}
      <header className="sticky top-0 w-full bg-surface-container-lowest border-b border-outline-variant z-50 flex justify-between items-center h-16 px-margin-mobile md:px-margin-desktop">
        <div 
          onClick={onBack}
          className="flex items-center gap-3 cursor-pointer select-none active:opacity-80"
        >
          <Landmark className="text-primary w-6 h-6" />
          <span className="font-headline-lg text-headline-lg font-bold text-primary">FinanceHub</span>
        </div>
        <nav className="hidden md:flex gap-8 items-center">
          <button onClick={() => onNavigate('products')} className="text-on-surface-variant hover:text-primary transition-colors font-medium">Products</button>
          <button onClick={() => onNavigate('security')} className="text-on-surface-variant hover:text-primary transition-colors font-medium">Security</button>
          <button onClick={() => onNavigate('compliance')} className="text-primary font-semibold">Compliance</button>
          <button onClick={() => onNavigate('partnership')} className="text-on-surface-variant hover:text-primary transition-colors font-medium">Institutional</button>
        </nav>
        <div className="flex items-center gap-4">
          <button onClick={onLogin} className="px-4 py-2 text-primary font-semibold hover:bg-surface-container-low transition-colors rounded">Login</button>
          <button onClick={onLogin} className="px-4 py-2 bg-primary text-on-primary font-semibold rounded hover:opacity-90 transition-opacity">Get Started</button>
        </div>
      </header>

      <main className="relative flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden border-b border-outline-variant bg-surface-container-low">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #c6c6cd 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop relative z-10">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-secondary-container text-on-secondary-container font-label-caps text-label-caps rounded-full mb-6 text-xs font-semibold uppercase tracking-wider">
                <Shield className="w-4 h-4" /> INSTITUTIONAL GRADE SECURITY
              </span>
              <h1 className="font-display-lg text-display-lg text-on-surface mb-6 leading-tight text-5xl font-bold">
                Built for Trust. <br/>
                <span className="text-secondary">Certified for Compliance.</span>
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-10 max-w-2xl leading-relaxed">
                FinanceHub operates under the most rigorous global financial standards. Our infrastructure is audited continuously to ensure total data integrity, sovereign privacy, and regulatory alignment for institutional partners.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-surface-container-lowest border border-outline-variant px-4 py-3 rounded shadow-sm">
                  <span className="font-bold text-on-surface text-sm">SOC2 TYPE II</span>
                  <CheckCircle className="text-secondary w-4 h-4" />
                </div>
                <div className="flex items-center gap-2 bg-surface-container-lowest border border-outline-variant px-4 py-3 rounded shadow-sm">
                  <span className="font-bold text-on-surface text-sm">GDPR COMPLIANT</span>
                  <CheckCircle className="text-secondary w-4 h-4" />
                </div>
                <div className="flex items-center gap-2 bg-surface-container-lowest border border-outline-variant px-4 py-3 rounded shadow-sm">
                  <span className="font-bold text-on-surface text-sm">ISO 27001</span>
                  <CheckCircle className="text-secondary w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bento Grid */}
        <section className="py-24 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* GDPR & Privacy */}
            <div className="md:col-span-8 bg-surface-container-lowest border border-outline-variant p-8 rounded-xl hover:border-secondary transition-colors group flex flex-col justify-between">
              <div className="flex justify-between items-start mb-12">
                <div>
                  <h3 className="font-headline-lg text-headline-lg text-on-surface mb-2 font-bold">GDPR &amp; Global Privacy</h3>
                  <p className="text-on-surface-variant max-w-md">Data sovereignty and right-to-be-forgotten protocols are baked into the core architecture of our ledger systems.</p>
                </div>
                <Shield className="text-primary w-10 h-10 group-hover:text-secondary transition-colors" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-outline-variant/30 pt-6">
                <div className="space-y-2">
                  <div className="font-label-caps text-label-caps text-secondary text-[10px] font-bold tracking-wider">ENCRYPTION</div>
                  <div className="font-title-md text-title-md text-on-surface font-bold text-sm">AES-256 At-Rest</div>
                </div>
                <div className="space-y-2">
                  <div className="font-label-caps text-label-caps text-secondary text-[10px] font-bold tracking-wider">SOVEREIGNTY</div>
                  <div className="font-title-md text-title-md text-on-surface font-bold text-sm">EU Residency</div>
                </div>
                <div className="space-y-2">
                  <div className="font-label-caps text-label-caps text-secondary text-[10px] font-bold tracking-wider">PROTOCOL</div>
                  <div className="font-title-md text-title-md text-on-surface font-bold text-sm">TLS 1.3 In-Transit</div>
                </div>
              </div>
            </div>

            {/* SOC2 Card */}
            <div className="md:col-span-4 bg-primary text-on-primary p-8 rounded-xl relative overflow-hidden flex flex-col justify-between text-white shadow-lg">
              <div>
                <Shield className="text-secondary-fixed w-10 h-10 mb-6" />
                <h3 className="font-headline-lg text-headline-lg mb-4 font-bold">SOC2 Type II Certified</h3>
                <p className="text-on-primary-container text-body-sm leading-relaxed">Our security controls are independently audited annually to ensure the highest standards of availability, confidentiality, and processing integrity.</p>
              </div>
              <button onClick={onLogin} className="mt-8 flex items-center gap-2 font-semibold text-secondary-fixed hover:underline text-xs">
                Download Audit Report <Download className="w-4 h-4" />
              </button>
            </div>

            {/* Immutable Logs */}
            <div className="md:col-span-12 bg-surface-container-high border border-outline-variant rounded-xl overflow-hidden shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-12">
                  <h3 className="font-headline-lg text-headline-lg text-on-surface mb-6 font-bold">Immutable Audit Logging</h3>
                  <p className="text-on-surface-variant mb-8 font-body-lg leading-relaxed">
                    FinanceHub maintains a cryptographically signed audit trail of every administrative action, data access request, and configuration change within your environment.
                  </p>
                  <ul className="space-y-4 text-sm font-semibold">
                    <li className="flex items-center gap-3">
                      <CheckCircle className="text-secondary w-5 h-5" />
                      <span>Real-time SIEM integration (Splunk, Datadog)</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="text-secondary w-5 h-5" />
                      <span>Non-repudiation logging with SHA-256 hashing</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="text-secondary w-5 h-5" />
                      <span>7-year standard data retention policy</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-surface-container-lowest p-8 border-l border-outline-variant overflow-x-auto">
                  <div className="font-data-mono text-xs bg-[#0b1c30] text-surface-container-lowest p-6 rounded shadow-inner min-w-[400px] font-mono leading-relaxed space-y-2">
                    <div className="opacity-50 flex justify-between mb-4 text-[10px]">
                      <span>SYSTEM_LOG_SNAPSHOT</span>
                      <span>UTC LIVE MONITORING</span>
                    </div>
                    <div className="flex gap-4"><span className="text-secondary-fixed">[INFO]</span> <span className="opacity-70">AUTH_SUCCESS</span> <span>User ID: admin_029</span></div>
                    <div className="flex gap-4"><span className="text-secondary-fixed">[INFO]</span> <span className="opacity-70">ACCESS_GRANTED</span> <span>Record: TX_9921_PRV</span></div>
                    <div className="flex gap-4"><span className="text-error">[WARN]</span> <span className="opacity-70">POLICY_CHG</span> <span>Target: Firewall_Tier_1</span></div>
                    <div className="flex gap-4"><span className="text-secondary-fixed">[INFO]</span> <span className="opacity-70">HASH_SIGN</span> <span>Block: 0x82f...a1e</span></div>
                    <div className="flex gap-4 animate-pulse"><span className="text-secondary-fixed">[INFO]</span> <span className="opacity-70">LOG_STRM</span> <span className="text-secondary-fixed">Broadcasting...</span></div>
                  </div>
                </div>
              </div>
            </div>

            {/* KYC & AML */}
            <div className="md:col-span-6 bg-surface-container-lowest border border-outline-variant p-8 rounded-xl flex flex-col justify-between shadow-sm">
              <div>
                <div className="bg-secondary-container w-12 h-12 rounded flex items-center justify-center mb-6 text-on-secondary-container">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="font-title-md text-title-md text-on-surface mb-4 font-bold">KYC &amp; AML Automation</h3>
                <p className="text-on-surface-variant leading-relaxed">
                  Our integrated compliance engine automates Know Your Customer (KYC) and Anti-Money Laundering (AML) screening against 150+ global watchlists including OFAC, UN, and EU Sanctions.
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-outline-variant flex items-center justify-between">
                <span className="font-label-caps text-label-caps text-secondary text-[10px] font-bold">COVERAGE</span>
                <span className="font-data-mono text-data-mono text-sm font-bold">195 Countries</span>
              </div>
            </div>

            {/* DR */}
            <div className="md:col-span-6 bg-surface-container-lowest border border-outline-variant p-8 rounded-xl flex flex-col justify-between shadow-sm">
              <div>
                <div className="bg-primary-container w-12 h-12 rounded flex items-center justify-center mb-6 text-primary-fixed">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="font-title-md text-title-md text-on-surface mb-4 font-bold">Operational Resilience</h3>
                <p className="text-on-surface-variant leading-relaxed">
                  Multi-region disaster recovery with a recovery point objective (RPO) of &lt; 1 minute and a recovery time objective (RTO) of &lt; 15 minutes for Tier 1 services.
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-outline-variant flex items-center justify-between">
                <span className="font-label-caps text-label-caps text-secondary text-[10px] font-bold">UPTIME SLA</span>
                <span className="font-data-mono text-data-mono text-sm font-bold">99.99% Guaranteed</span>
              </div>
            </div>
          </div>
        </section>

        {/* Philosophy Section */}
        <section className="bg-[#0b1c30] py-24 text-white">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-headline-lg text-headline-lg mb-6 font-bold text-white">Our Security Philosophy</h2>
              <p className="text-primary-fixed-dim font-body-lg mb-8">
                Security at FinanceHub is not a bolt-on feature—it is the bedrock of our existence. We employ a "Zero Trust" architecture where every request is verified, regardless of origin.
              </p>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <span className="w-8 h-8 rounded-full border border-secondary text-secondary flex items-center justify-center shrink-0 font-bold">1</span>
                  <div>
                    <h4 className="font-bold text-white">Least Privilege Access</h4>
                    <p className="text-primary-fixed-dim text-sm">Granular RBAC ensures users only access what they need.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="w-8 h-8 rounded-full border border-secondary text-secondary flex items-center justify-center shrink-0 font-bold">2</span>
                  <div>
                    <h4 className="font-bold text-white">Continuous Monitoring</h4>
                    <p className="text-primary-fixed-dim text-sm">AI-driven anomaly detection monitors for suspicious behavior 24/7.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="w-8 h-8 rounded-full border border-secondary text-secondary flex items-center justify-center shrink-0 font-bold">3</span>
                  <div>
                    <h4 className="font-bold text-white">Third-Party Risk Management</h4>
                    <p className="text-primary-fixed-dim text-sm">Every vendor in our supply chain undergoes rigorous assessment.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative h-[400px] bg-primary-container rounded-xl overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 opacity-10 bg-grid"></div>
              <div className="relative z-10 w-48 h-48 border border-secondary/30 rounded-full flex items-center justify-center animate-spin">
                <Shield className="text-secondary w-16 h-16" />
              </div>
            </div>
          </div>
        </section>

        {/* Compliance Resources Table */}
        <section className="py-24 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-12 font-bold">Compliance Documents</h2>
          <div className="border border-outline-variant rounded-xl overflow-hidden bg-white shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container border-b border-outline-variant font-label-caps text-label-caps text-xs">
                  <th className="px-6 py-4">DOCUMENT NAME</th>
                  <th className="px-6 py-4">CATEGORY</th>
                  <th className="px-6 py-4">VERSION</th>
                  <th className="px-6 py-4">LAST UPDATED</th>
                  <th className="px-6 py-4 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant font-body-sm text-on-surface">
                <tr className="hover:bg-surface-container-low transition-colors">
                  <td className="px-6 py-4 font-medium text-primary">Privacy Policy (v2.4)</td>
                  <td className="px-6 py-4"><span className="px-2 py-1 bg-surface-container rounded text-xs font-semibold">Legal</span></td>
                  <td className="px-6 py-4 font-mono text-xs">2.4.1</td>
                  <td className="px-6 py-4 text-on-surface-variant">May 12, 2026</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => onNavigate('privacy')} className="text-secondary hover:underline font-semibold flex items-center gap-1 justify-end ml-auto">
                      View <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-surface-container-low transition-colors">
                  <td className="px-6 py-4 font-medium text-primary">Information Security Policy</td>
                  <td className="px-6 py-4"><span className="px-2 py-1 bg-surface-container rounded text-xs font-semibold">Security</span></td>
                  <td className="px-6 py-4 font-mono text-xs">1.9.0</td>
                  <td className="px-6 py-4 text-on-surface-variant">Apr 05, 2026</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => onNavigate('security')} className="text-secondary hover:underline font-semibold flex items-center gap-1 justify-end ml-auto">
                      View <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-surface-container-low transition-colors">
                  <td className="px-6 py-4 font-medium text-primary">Data Processing Addendum (DPA)</td>
                  <td className="px-6 py-4"><span className="px-2 py-1 bg-surface-container rounded text-xs font-semibold">GDPR</span></td>
                  <td className="px-6 py-4 font-mono text-xs">3.0.2</td>
                  <td className="px-6 py-4 text-on-surface-variant">Jan 18, 2026</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={onLogin} className="text-secondary hover:underline font-semibold flex items-center gap-1 justify-end ml-auto">
                      View <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-24">
          <div className="bg-secondary p-12 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-8 text-white shadow-lg">
            <div className="text-center md:text-left">
              <h3 className="font-headline-lg text-headline-lg font-bold text-white mb-2">Need detailed audit materials?</h3>
              <p className="text-secondary-fixed text-body-lg">Institutional partners can request full SOC2 reports and pentest results.</p>
            </div>
            <button onClick={onLogin} className="bg-white text-secondary px-8 py-4 rounded font-bold hover:bg-surface-bright transition-colors shadow-md">
              Contact Compliance Desk
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container border-t border-outline-variant w-full text-on-surface-variant">
        <div className="flex flex-col md:flex-row justify-between items-center py-12 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto gap-8">
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-2">
              <Landmark className="text-primary w-5 h-5" />
              <span className="font-title-md text-title-md font-bold text-primary">FinanceHub</span>
            </div>
            <p className="font-body-sm text-body-sm max-w-xs text-center md:text-left">
              Professional infrastructure for institutional digital asset management and settlement.
            </p>
          </div>
          <div className="flex flex-col items-center md:items-end gap-6 text-xs font-semibold uppercase tracking-wider">
            <nav className="flex gap-6">
              <button onClick={() => onNavigate('privacy')} className="hover:underline">Privacy</button>
              <button onClick={() => onNavigate('terms')} className="hover:underline">Terms</button>
              <button onClick={() => onNavigate('compliance')} className="hover:underline text-secondary">Compliance</button>
            </nav>
            <p className="font-body-sm text-body-sm">
              © 2026 FinanceHub Institutional. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
