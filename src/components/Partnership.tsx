import React from 'react';
import { Landmark, ArrowRight, CheckCircle, Shield, TrendingUp, Code, Handshake, Briefcase, UserCheck } from 'lucide-react';

interface PartnershipProps {
  onBack: () => void;
  onLogin: () => void;
  onNavigate: (view: 'products' | 'security' | 'partnership' | 'enterprise' | 'compliance' | 'privacy' | 'terms') => void;
}

export default function Partnership({ onBack, onLogin, onNavigate }: PartnershipProps) {
  return (
    <div className="bg-background text-on-surface font-body-lg min-h-screen flex flex-col w-full selection:bg-primary-fixed selection:text-primary">
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
            <button onClick={() => onNavigate('products')} className="text-on-surface-variant hover:text-primary transition-colors font-label-caps text-label-caps cursor-pointer">Products</button>
            <button onClick={() => onNavigate('security')} className="text-on-surface-variant hover:text-primary transition-colors font-label-caps text-label-caps cursor-pointer">Security</button>
            <button onClick={() => onNavigate('partnership')} className="text-primary border-b-2 border-primary pb-1 font-label-caps text-label-caps font-semibold cursor-pointer">Institutional</button>
            <button onClick={() => onNavigate('compliance')} className="text-on-surface-variant hover:text-primary transition-colors font-label-caps text-label-caps cursor-pointer">Compliance</button>
          </nav>
          <div 
            onClick={onLogin}
            className="cursor-pointer transition-all duration-200 px-6 py-2 bg-primary text-on-primary rounded font-label-caps text-label-caps text-xs font-semibold"
          >
            Client Portal
          </div>
        </div>
      </header>

      <main className="pt-24 pb-20 flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#0b1c30]/5 to-[#d3e4fe]/30 py-24 px-margin-desktop rounded-b-3xl">
          <div className="max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="col-span-12 lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full text-xs font-semibold">
                <CheckCircle className="w-4 h-4 text-secondary" />
                <span className="font-label-caps text-label-caps uppercase tracking-wider">Institutional Grade</span>
              </div>
              <h2 className="font-display-lg text-display-lg text-primary text-5xl font-bold leading-tight">
                Engineered for the World's Most Sophisticated Entities.
              </h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
                FinanceHub Institutional provides the infrastructure, liquidity, and analytical rigor required by hedge funds, family offices, and pension funds to operate at scale.
              </p>
              <div className="flex gap-4 pt-4">
                <button onClick={onLogin} className="bg-primary text-on-primary px-8 py-4 font-label-caps text-label-caps rounded transition-transform hover:scale-[1.02] font-semibold text-xs uppercase tracking-wider">
                  Request Access
                </button>
                <button onClick={() => onNavigate('security')} className="border border-outline text-primary px-8 py-4 font-label-caps text-label-caps rounded transition-colors hover:bg-surface-container font-semibold text-xs uppercase tracking-wider">
                  View Platform Docs
                </button>
              </div>
            </div>
            
            {/* Visual Cover Asset */}
            <div className="col-span-12 lg:col-span-6 relative h-[400px] lg:h-[500px] rounded-xl overflow-hidden border border-outline-variant bg-white shadow-xl">
              <div className="absolute inset-0 bg-[#0f172a]/90 flex items-center justify-center p-8 text-white">
                <div className="text-center space-y-4">
                  <Landmark className="w-16 h-16 mx-auto text-secondary-fixed" />
                  <h3 className="text-2xl font-bold font-display">A+ Tier Execution</h3>
                  <p className="text-primary-fixed-dim text-sm max-w-xs mx-auto">High-resolution financial clearing with sub-millisecond execution speeds.</p>
                </div>
              </div>
              <div className="absolute bottom-6 left-6 p-4 bg-white/90 backdrop-blur-md rounded-lg shadow-xl border border-outline-variant">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 bg-secondary-container rounded-full flex items-center justify-center text-on-secondary-container">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-label-caps text-label-caps text-primary text-xs font-bold">Real-time Liquidity</p>
                    <p className="font-data-mono text-data-mono text-secondary text-xs font-bold">A+ Tier Execution</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Global Reach (Market Presence) */}
        <section className="py-24 px-margin-desktop bg-white">
          <div className="max-w-container-max mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
              <div className="max-w-2xl">
                <h3 className="font-headline-lg text-headline-lg text-primary font-bold">Unrivaled Global Reach</h3>
                <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                  Our network spans 40+ international markets, providing localized expertise with a global perspective. Dedicated institutional support desks are active 24/7 in London, New York, Hong Kong, and Singapore.
                </p>
              </div>
              <div className="flex gap-12">
                <div className="text-center">
                  <p className="font-display-lg text-[40px] text-primary font-bold">40+</p>
                  <p className="font-label-caps text-label-caps text-on-surface-variant text-[10px] uppercase font-bold tracking-wider">Global Markets</p>
                </div>
                <div className="text-center">
                  <p className="font-display-lg text-[40px] text-primary font-bold">24/7</p>
                  <p className="font-label-caps text-label-caps text-on-surface-variant text-[10px] uppercase font-bold tracking-wider">Direct Support</p>
                </div>
              </div>
            </div>

            {/* Global Nodes */}
            <div className="w-full bg-surface-container rounded-xl p-8 border border-outline-variant shadow-sm">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                <div className="flex flex-col justify-end p-6 bg-white/60 backdrop-blur-sm border border-outline-variant/50 rounded-lg shadow-sm hover:bg-white transition-all cursor-default">
                  <Landmark className="text-primary mb-2 w-5 h-5" />
                  <p className="font-title-md text-title-md text-primary font-bold">EMEA Central</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">London, UK</p>
                </div>
                <div className="flex flex-col justify-end p-6 bg-white/60 backdrop-blur-sm border border-outline-variant/50 rounded-lg shadow-sm hover:bg-white transition-all cursor-default">
                  <Landmark className="text-primary mb-2 w-5 h-5" />
                  <p className="font-title-md text-title-md text-primary font-bold">Americas</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">New York, US</p>
                </div>
                <div className="flex flex-col justify-end p-6 bg-white/60 backdrop-blur-sm border border-outline-variant/50 rounded-lg shadow-sm hover:bg-white transition-all cursor-default">
                  <Landmark className="text-primary mb-2 w-5 h-5" />
                  <p className="font-title-md text-title-md text-primary font-bold">APAC Hub</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Singapore</p>
                </div>
                <div className="flex flex-col justify-end p-6 bg-white/60 backdrop-blur-sm border border-outline-variant/50 rounded-lg shadow-sm hover:bg-white transition-all cursor-default">
                  <Landmark className="text-primary mb-2 w-5 h-5" />
                  <p className="font-title-md text-title-md text-primary font-bold">Greater China</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Hong Kong</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Partnership Models */}
        <section className="py-24 px-margin-desktop bg-surface-container-low border-y border-outline-variant/50">
          <div className="max-w-container-max mx-auto">
            <h3 className="font-headline-lg text-headline-lg text-primary text-center font-bold mb-16">Tailored Partnership Models</h3>
            <div className="grid grid-cols-12 gap-6">
              
              {/* API Solutions */}
              <div className="col-span-12 md:col-span-7 bg-white p-10 border border-outline-variant rounded-xl shadow-sm flex flex-col justify-between group">
                <div>
                  <div className="h-14 w-14 bg-surface-container flex items-center justify-center rounded-lg mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                    <Code className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
                  </div>
                  <h4 className="font-headline-lg text-headline-lg text-primary mb-4">Custom API Infrastructure</h4>
                  <p className="font-body-lg text-body-lg text-on-surface-variant mb-8 leading-relaxed">
                    Integrate our proprietary liquidity pools directly into your execution management system (EMS) via ultra-low latency FIX and REST APIs. Designed for high-frequency trading and automated portfolio rebalancing.
                  </p>
                </div>
                <ul className="space-y-3 font-body-sm text-body-sm text-on-surface-variant border-t border-outline-variant/30 pt-6">
                  <li className="flex items-center gap-2"><CheckCircle className="text-secondary w-4 h-4" /> 5ms average latency</li>
                  <li className="flex items-center gap-2"><CheckCircle className="text-secondary w-4 h-4" /> Dedicated technical TAM support</li>
                  <li className="flex items-center gap-2"><CheckCircle className="text-secondary w-4 h-4" /> Custom data feed configurations</li>
                </ul>
              </div>

              {/* Co-managed */}
              <div className="col-span-12 md:col-span-5 bg-primary text-on-primary p-10 rounded-xl shadow-sm flex flex-col justify-between">
                <div>
                  <div className="h-14 w-14 bg-white/10 flex items-center justify-center rounded-lg mb-6">
                    <Handshake className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-headline-lg text-headline-lg text-white mb-4">Co-managed Portfolios</h4>
                  <p className="font-body-lg text-body-lg text-primary-fixed-dim mb-8 leading-relaxed">
                    Leverage our alpha-generating strategies alongside your internal mandates. Our institutional desk collaborates directly with your investment committee.
                  </p>
                </div>
                <div className="pt-8 border-t border-white/20">
                  <button onClick={onLogin} className="flex items-center gap-2 font-label-caps text-label-caps text-xs font-semibold text-secondary-fixed hover:gap-4 transition-all">
                    Consult with an Advisor <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Prime Brokerage */}
              <div className="col-span-12 md:col-span-5 bg-surface-container-high p-10 border border-outline-variant rounded-xl shadow-sm flex flex-col justify-between">
                <div>
                  <h4 className="font-title-md text-title-md text-primary mb-2 font-bold">Prime Brokerage Services</h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-6 leading-relaxed">
                    Securities lending, leveraged financing, and cross-margining capabilities.
                  </p>
                </div>
                <div className="h-32 bg-white/50 rounded border border-dashed border-outline-variant flex items-center justify-center">
                  <Briefcase className="text-outline w-12 h-12" />
                </div>
              </div>

              {/* Custody */}
              <div className="col-span-12 md:col-span-7 bg-white p-10 border border-outline-variant rounded-xl shadow-sm flex flex-col sm:flex-row gap-8 items-center">
                <div className="flex-1">
                  <h4 className="font-title-md text-title-md text-primary mb-2 font-bold">Institutional Custody</h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    Qualified custodial solutions with SOC2 Type II certification and multi-signature security protocols for digital and traditional assets.
                  </p>
                </div>
                <div className="w-32 h-32 bg-secondary-container/20 rounded-full flex items-center justify-center shrink-0">
                  <UserCheck className="text-secondary w-14 h-14" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Executive Pedigree */}
        <section className="py-24 px-margin-desktop bg-white">
          <div className="max-w-container-max mx-auto grid grid-cols-12 gap-8 items-center">
            <div className="col-span-12 lg:col-span-5 space-y-6">
              <h3 className="font-headline-lg text-headline-lg text-primary font-bold">Institutional Pedigree</h3>
              <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                Our leadership team comprises veterans from the world's most respected financial institutions, bringing decades of experience in risk management, algorithmic trading, and regulatory compliance.
              </p>
              <div className="space-y-6">
                <div className="flex gap-4 p-4 hover:bg-surface-container-low transition-colors rounded-lg border border-transparent hover:border-outline-variant">
                  <div className="h-12 w-12 rounded bg-surface-dim overflow-hidden flex-shrink-0 flex items-center justify-center font-bold text-sm bg-primary-container text-white">
                    MT
                  </div>
                  <div>
                    <p className="font-title-md text-title-md text-primary leading-none font-bold">Marcus Thorne</p>
                    <p className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest mt-1 font-semibold">Chief Investment Officer</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-2">Former Head of Global Macro at Tier 1 Investment Bank.</p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 hover:bg-surface-container-low transition-colors rounded-lg border border-transparent hover:border-outline-variant">
                  <div className="h-12 w-12 rounded bg-surface-dim overflow-hidden flex-shrink-0 flex items-center justify-center font-bold text-sm bg-primary-container text-white">
                    ER
                  </div>
                  <div>
                    <p className="font-title-md text-title-md text-primary leading-none font-bold">Elena Rodriguez</p>
                    <p className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest mt-1 font-semibold">Head of Compliance</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-2">20+ years navigating international financial regulations.</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Visual Boardroom Mockup */}
            <div className="col-span-12 lg:col-span-7 grid grid-cols-2 gap-4">
              <div className="aspect-square bg-surface-container rounded-xl overflow-hidden border border-outline-variant flex items-center justify-center p-6 text-on-surface-variant/40 text-xs font-mono">
                [BOARDROOM PREVIEW]
              </div>
              <div className="aspect-square bg-primary flex flex-col justify-center items-center text-center p-8 rounded-xl text-white shadow-lg">
                <Landmark className="text-secondary w-14 h-14 mb-4" />
                <p className="font-headline-lg text-white font-bold">Analytical Rigor</p>
                <p className="font-body-sm text-primary-fixed-dim mt-2">Decisions backed by petabytes of historical and real-time market data.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-20 px-margin-desktop bg-primary text-on-primary rounded-2xl shadow-xl">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="font-display-lg text-display-lg text-white font-bold mb-6">Secure Your Institutional Future.</h3>
            <p className="font-body-lg text-primary-fixed-dim mb-10 max-w-xl mx-auto">
              Join 250+ global entities who trust FinanceHub for their mission-critical financial operations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={onLogin} className="bg-secondary-container text-on-secondary-container px-10 py-5 font-label-caps text-label-caps rounded-full font-bold transition-transform hover:scale-105 text-sm uppercase tracking-wider">
                Contact Sales
              </button>
              <button onClick={onLogin} className="border border-white/30 text-white px-10 py-5 font-label-caps text-label-caps rounded-full hover:bg-white/10 transition-colors text-sm uppercase tracking-wider">
                Request Platform Demo
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-highest border-t border-outline-variant">
        <div className="flex flex-col md:flex-row justify-between items-center max-w-container-max mx-auto px-margin-desktop py-8 text-on-surface-variant">
          <div className="flex items-center gap-2 mb-6 md:mb-0">
            <Landmark className="text-primary w-5 h-5" />
            <span className="font-title-md text-title-md text-primary font-bold">FinanceHub Institutional</span>
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-xs font-bold uppercase tracking-wider mb-6 md:mb-0">
            <button onClick={() => onNavigate('terms')} className="hover:underline decoration-primary">Legal</button>
            <button onClick={() => onNavigate('privacy')} className="hover:underline decoration-primary">Privacy Policy</button>
            <button onClick={() => onNavigate('compliance')} className="hover:underline decoration-primary">Regulatory Disclosure</button>
          </div>
          <p className="font-body-sm text-body-sm">© 2026 FinanceHub Institutional. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
