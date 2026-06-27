import React from 'react';
import { Shield, BarChart3, Eye, ArrowRight, Activity, Cpu, Lock } from 'lucide-react';

interface LandingPageProps {
  onSelectRole: (role: 'Admin' | 'Analyst' | 'Viewer') => void;
  onNavigate: (view: 'products' | 'security' | 'partnership' | 'enterprise' | 'compliance' | 'privacy' | 'terms') => void;
}

export default function LandingPage({ onSelectRole, onNavigate }: LandingPageProps) {
  return (
    <div className="bg-surface text-on-surface font-body-lg overflow-x-hidden min-h-screen flex flex-col w-full">
      {/* TopAppBar */}
      <header className="w-full top-0 sticky z-50 bg-surface-container-lowest border-b border-outline-variant">
        <div className="max-w-container-max mx-auto px-margin-desktop flex justify-between items-center h-16">
          <div 
            onClick={() => onSelectRole('Viewer')}
            className="flex items-center gap-3 cursor-pointer active:opacity-80 select-none"
          >
            <div className="p-1.5 bg-primary-container text-on-primary rounded">
              <span className="text-lg font-bold font-mono">$</span>
            </div>
            <span className="font-headline-lg text-headline-lg font-bold text-tertiary">FinanceHub</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <button onClick={() => onNavigate('products')} className="text-on-surface-variant hover:text-primary transition-colors font-body-sm px-2 py-1 rounded font-semibold cursor-pointer">Products</button>
            <button onClick={() => onNavigate('security')} className="text-on-surface-variant hover:text-primary transition-colors font-body-sm px-2 py-1 rounded font-semibold cursor-pointer">Security</button>
            <button onClick={() => onNavigate('partnership')} className="text-on-surface-variant hover:text-primary transition-colors font-body-sm px-2 py-1 rounded font-semibold cursor-pointer">Institutional</button>
            <button onClick={() => onNavigate('compliance')} className="text-on-surface-variant hover:text-primary transition-colors font-body-sm px-2 py-1 rounded font-semibold cursor-pointer">Compliance</button>
          </nav>

          <div className="flex items-center gap-unit">
            <button 
              onClick={() => onSelectRole('Viewer')}
              className="px-6 py-2 bg-primary-container text-on-primary font-body-sm font-semibold rounded hover:opacity-90 transition-opacity"
            >
              Login
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section id="home" className="relative py-24 md:py-32 overflow-hidden">
          <div className="absolute top-0 right-0 -z-10 w-1/2 h-full opacity-5">
            <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent"></div>
          </div>
          <div className="max-w-container-max mx-auto px-margin-desktop">
            <div className="max-w-3xl">
              <span className="inline-block px-3 py-1 bg-surface-container-high text-on-surface-variant font-data-mono text-xs mb-6 rounded-full uppercase tracking-widest">
                Institutional Grade Intelligence
              </span>
              <h1 className="font-display-lg text-display-lg md:text-[64px] leading-tight mb-8">
                Precision Financial <br/>
                <span className="text-secondary">Management &amp; Analytics</span>
              </h1>
              <p className="font-body-lg text-on-surface-variant text-xl mb-12 max-w-xl">
                Real insights, seamless transactions. Empowering institutional decision-making through advanced data modeling and real-time ledger management.
              </p>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => onSelectRole('Admin')}
                  className="px-8 py-4 bg-primary text-on-primary font-semibold rounded-lg hover:opacity-90 transition-all flex items-center gap-2"
                >
                  Request Demo
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => onNavigate('products')}
                  className="px-8 py-4 border border-outline text-on-surface font-semibold rounded-lg hover:bg-surface-container-low transition-all"
                >
                  View Institutional Products
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="bg-surface-container-lowest border-y border-outline-variant py-8">
          <div className="max-w-container-max mx-auto px-margin-desktop">
            <div className="flex flex-wrap justify-between items-center gap-8">
              <div className="flex flex-col">
                <span className="font-data-mono text-secondary font-bold text-lg">$4.2B+</span>
                <span className="font-body-sm text-on-surface-variant">Assets Tracked</span>
              </div>
              <div className="w-px h-8 bg-outline-variant hidden md:block"></div>
              <div className="flex flex-col">
                <span className="font-data-mono text-secondary font-bold text-lg">99.99%</span>
                <span className="font-body-sm text-on-surface-variant">Uptime SLA</span>
              </div>
              <div className="w-px h-8 bg-outline-variant hidden md:block"></div>
              <div className="flex flex-col">
                <span className="font-data-mono text-secondary font-bold text-lg">24/7</span>
                <span className="font-body-sm text-on-surface-variant">Real-time Monitoring</span>
              </div>
              <div className="w-px h-8 bg-outline-variant hidden md:block"></div>
              <div className="flex flex-col">
                <span className="font-data-mono text-secondary font-bold text-lg">Global</span>
                <span className="font-body-sm text-on-surface-variant">Compliance Ready</span>
              </div>
            </div>
          </div>
        </section>

        {/* Role Selection Section */}
        <section id="roles" className="py-24 bg-surface">
          <div className="max-w-container-max mx-auto px-margin-desktop">
            <div className="text-center mb-16">
              <h2 className="font-headline-lg text-headline-lg mb-4 text-text-primary">Select Your Access Level</h2>
              <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto">
                Each role contains specialized dashboards tailored to your specific operational needs and regulatory requirements.
              </p>
            </div>

            {/* Role Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Admin Card */}
              <div className="bg-surface-container-lowest border border-outline-variant p-8 rounded-xl flex flex-col items-start h-full hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group">
                <div className="w-14 h-14 bg-primary-container rounded-lg flex items-center justify-center mb-8">
                  <Shield className="w-7 h-7 text-on-primary" />
                </div>
                <h3 className="font-title-md text-title-md mb-3 text-text-primary">Admin</h3>
                <p className="font-body-sm text-on-surface-variant mb-10 flex-grow">
                  Full system control &amp; user management. Manage system roles, view global logs, purge soft-deleted records, and run backend database control centers.
                </p>
                <div className="w-full pt-6 border-t border-outline-variant">
                  <ul className="mb-8 space-y-3 font-semibold">
                    <li className="flex items-center gap-2 text-body-sm">
                      <span className="w-2 h-2 rounded-full bg-secondary"></span> Identity Management
                    </li>
                    <li className="flex items-center gap-2 text-body-sm">
                      <span className="w-2 h-2 rounded-full bg-secondary"></span> System-wide Auditing
                    </li>
                  </ul>
                  <button 
                    onClick={() => onSelectRole('Admin')}
                    className="w-full py-3 bg-primary text-on-primary font-semibold rounded-lg hover:bg-opacity-90 transition-colors"
                  >
                    Enter Admin Terminal
                  </button>
                </div>
              </div>

              {/* Analyst Card */}
              <div className="bg-surface-container-lowest border border-outline-variant p-8 rounded-xl flex flex-col items-start h-full hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group">
                <div className="w-14 h-14 bg-surface-container-high rounded-lg flex items-center justify-center mb-8">
                  <BarChart3 className="w-7 h-7 text-on-surface" />
                </div>
                <h3 className="font-title-md text-title-md mb-3 text-text-primary">Analyst</h3>
                <p className="font-body-sm text-on-surface-variant mb-10 flex-grow">
                  Financial trends &amp; detailed reporting. Access complex data visualizations, client-side advanced sorting drawers, and CSV summary exporters.
                </p>
                <div className="w-full pt-6 border-t border-outline-variant">
                  <ul className="mb-8 space-y-3 font-semibold">
                    <li className="flex items-center gap-2 text-body-sm">
                      <span className="w-2 h-2 rounded-full bg-secondary"></span> Trend Telemetry Charts
                    </li>
                    <li className="flex items-center gap-2 text-body-sm">
                      <span className="w-2 h-2 rounded-full bg-secondary"></span> CSV Statement Exporter
                    </li>
                  </ul>
                  <button 
                    onClick={() => onSelectRole('Analyst')}
                    className="w-full py-3 bg-primary text-on-primary font-semibold rounded-lg hover:bg-opacity-90 transition-colors"
                  >
                    Activate Analyst Node
                  </button>
                </div>
              </div>

              {/* Viewer Card */}
              <div className="bg-surface-container-lowest border border-outline-variant p-8 rounded-xl flex flex-col items-start h-full hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group">
                <div className="w-14 h-14 bg-surface-container-low rounded-lg flex items-center justify-center mb-8">
                  <Eye className="w-7 h-7 text-on-surface-variant" />
                </div>
                <h3 className="font-title-md text-title-md mb-3 text-text-primary">Viewer</h3>
                <p className="font-body-sm text-on-surface-variant mb-10 flex-grow">
                  Read-only summaries &amp; record viewing. Designed for executive stakeholders requiring system visibility without administrative control.
                </p>
                <div className="w-full pt-6 border-t border-outline-variant">
                  <ul className="mb-8 space-y-3 font-semibold">
                    <li className="flex items-center gap-2 text-body-sm">
                      <span className="w-2 h-2 rounded-full bg-secondary"></span> Executive Summaries
                    </li>
                    <li className="flex items-center gap-2 text-body-sm">
                      <span className="w-2 h-2 rounded-full bg-secondary"></span> Ledger Inspection
                    </li>
                  </ul>
                  <button 
                    onClick={() => onSelectRole('Viewer')}
                    className="w-full py-3 bg-primary text-on-primary font-semibold rounded-lg hover:bg-opacity-90 transition-colors"
                  >
                    Open Viewer Portal
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Institutional Grade Analytics Platform */}
        <section id="security" className="py-24 bg-surface-container-low">
          <div className="max-w-container-max mx-auto px-margin-desktop">
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant overflow-hidden flex flex-col lg:flex-row shadow-sm">
              <div className="lg:w-1/2 p-12 flex flex-col justify-center">
                <h2 className="font-headline-lg text-headline-lg mb-6 text-text-primary">Institutional Grade Analytics Platform</h2>
                <p className="font-body-lg text-on-surface-variant mb-8">
                  Our platform leverages high-fidelity data streams to provide a comprehensive view of your financial health. Built for the modern enterprise, with security and scalability at its core.
                </p>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-secondary-container rounded-full flex items-center justify-center text-on-secondary-container">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-title-md text-sm mb-1 text-text-primary">Bank-Grade Security</h4>
                      <p className="font-body-sm text-on-surface-variant">AES-256 encryption and role-based authorization for every access point.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-surface-container-high rounded-full flex items-center justify-center text-on-surface">
                      <Activity className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-title-md text-sm mb-1 text-text-primary">Real-time Reconciliation</h4>
                      <p className="font-body-sm text-on-surface-variant">Continuous ledger balancing with automated anomaly detection.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="lg:w-1/2 bg-surface-container-high relative min-h-[400px]">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCgsu3qaE5llBtyR6UqKiL4p04b4Q-7QeDYKPJh4Qts9vR3gLZ5mPWOwW1T_dupi1iW_4Mm5XfM_OkoAnMiII5_APMMSlFKeTVjyiU4W2vqDJ0yprhytGuO-8N3WL8a2MMuraMM7GWb9OrV2Ggg6n9hRwSPq9YEiNbu9GJACsv-iy1bqc0SnkNxOptdwLxxcOpAFHtliKfalvpCNt7BHB-R3C4OzElCWVAVuK4PvWzHasJ_RJWBmn6jP03eVy174wC0LZXo24TjyRQ')" }}></div>
                <div className="absolute inset-0 bg-gradient-to-r from-surface-container-lowest/20 to-transparent"></div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id="institutional" className="w-full mt-auto bg-surface-container-highest border-t border-outline-variant">
        <div className="max-w-container-max mx-auto px-margin-desktop py-12">
          <div className="flex flex-col lg:flex-row justify-between gap-12 mb-12">
            <div className="max-w-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-1.5 bg-primary-container text-on-primary rounded opacity-80">
                  <span className="text-lg font-bold font-mono">$</span>
                </div>
                <span className="font-brand_logo text-title-md font-bold text-tertiary">FinanceHub</span>
              </div>
              <p className="font-body-sm text-on-surface-variant">
                Providing institutional-grade financial infrastructure for the world's most demanding enterprises. Built for precision, secured for trust.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="font-label-caps text-label-caps text-on-surface mb-6 uppercase text-xs font-bold">Platform</h4>
                <ul className="space-y-4">
                  <li><button onClick={() => onNavigate('products')} className="font-body-sm text-on-surface-variant hover:text-primary transition-colors text-left">Overview</button></li>
                  <li><button onClick={() => onNavigate('security')} className="font-body-sm text-on-surface-variant hover:text-primary transition-colors text-left">Analytics</button></li>
                  <li><button onClick={() => onNavigate('enterprise')} className="font-body-sm text-on-surface-variant hover:text-primary transition-colors text-left">Enterprise</button></li>
                </ul>
              </div>
              <div>
                <h4 className="font-label-caps text-label-caps text-on-surface mb-6 uppercase text-xs font-bold">Resources</h4>
                <ul className="space-y-4">
                  <li><button onClick={() => onNavigate('security')} className="font-body-sm text-on-surface-variant hover:text-primary transition-colors text-left">Documentation</button></li>
                  <li><button onClick={() => onNavigate('security')} className="font-body-sm text-on-surface-variant hover:text-primary transition-colors text-left">Security Whitepaper</button></li>
                  <li><button onClick={() => onNavigate('products')} className="font-body-sm text-on-surface-variant hover:text-primary transition-colors text-left">API Reference</button></li>
                </ul>
              </div>
              <div className="col-span-2 md:col-span-1">
                <h4 className="font-label-caps text-label-caps text-on-surface mb-6 uppercase text-xs font-bold">Legal</h4>
                <ul className="space-y-4">
                  <li><button onClick={() => onNavigate('privacy')} className="font-body-sm text-on-surface-variant hover:text-primary transition-colors text-left">Privacy Policy</button></li>
                  <li><button onClick={() => onNavigate('terms')} className="font-body-sm text-on-surface-variant hover:text-primary transition-colors text-left">Terms of Service</button></li>
                  <li><button onClick={() => onNavigate('compliance')} className="font-body-sm text-on-surface-variant hover:text-primary transition-colors text-left">Compliance</button></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-outline-variant flex flex-col md:flex-row justify-between items-center gap-4">
            <span className="font-body-sm text-on-surface-variant">
              © 2026 FinanceHub Institutional Services. All rights reserved. SEC Regulated Entity.
            </span>
            <div className="flex gap-6">
              <button onClick={() => onNavigate('privacy')} className="font-body-sm text-on-surface-variant hover:text-primary transition-colors">Privacy</button>
              <button onClick={() => onNavigate('terms')} className="font-body-sm text-on-surface-variant hover:text-primary transition-colors">Terms</button>
              <button onClick={() => onNavigate('security')} className="font-body-sm text-on-surface-variant hover:text-primary transition-colors">Security</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
