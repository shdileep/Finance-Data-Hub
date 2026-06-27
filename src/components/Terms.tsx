import React from 'react';
import { Landmark, ChevronLeft, Shield, Lock, FileText, CheckCircle } from 'lucide-react';

interface TermsProps {
  onBack: () => void;
  onLogin: () => void;
}

export default function Terms({ onBack, onLogin }: TermsProps) {
  return (
    <div className="bg-background text-on-surface font-body-lg min-h-screen flex flex-col w-full selection:bg-primary-fixed selection:text-primary">
      {/* TopAppBar */}
      <header className="bg-surface-container-lowest sticky top-0 w-full border-b border-outline-variant z-50 flex justify-between items-center h-16 px-margin-mobile md:px-margin-desktop">
        <div 
          onClick={onBack}
          className="flex items-center gap-2 cursor-pointer select-none active:opacity-80"
        >
          <Landmark className="text-primary w-5 h-5" />
          <span className="font-headline-lg-mobile text-headline-lg-mobile font-bold text-primary">FinanceHub</span>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={onBack}
            className="flex items-center gap-1 text-on-surface-variant hover:text-primary text-xs font-bold uppercase transition-all"
          >
            <ChevronLeft className="w-4 h-4" /> Home
          </button>
          <button 
            onClick={onLogin}
            className="text-on-surface-variant font-body-sm px-4 py-2 hover:bg-surface-container-low transition-colors active:opacity-80 text-xs font-bold"
          >
            Login
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[800px] mx-auto px-margin-mobile py-12 md:py-20 flex-grow w-full">
        <header className="mb-12 border-l-4 border-primary pl-6">
          <p className="font-label-caps text-label-caps text-on-surface-variant mb-2 text-xs font-bold uppercase tracking-wider">INSTITUTIONAL SERVICE AGREEMENT</p>
          <h1 className="font-headline-lg text-headline-lg md:text-[40px] text-on-surface mb-4 font-bold">Terms of Service</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl leading-relaxed">
            By utilizing our clearing platforms, you agree to these legal frameworks. Last updated: October 24, 2026.
          </p>
        </header>

        <article className="space-y-12 text-on-surface-variant leading-relaxed text-sm">
          {/* Service Conditions */}
          <section id="service-conditions">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-surface-container-high p-2 rounded">
                <FileText className="text-secondary w-5 h-5" />
              </div>
              <h2 className="font-title-md text-title-md text-primary font-bold">1. Conditions of Service</h2>
            </div>
            <p>
              Our quantitative terminals and asset management solutions are provided strictly for professional and institutional investors. By provisioning seats, you represent that you hold necessary licenses and qualifications.
            </p>
          </section>

          {/* Compliance & Laws */}
          <section id="compliance-laws">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-surface-container-high p-2 rounded">
                <Shield className="text-secondary w-5 h-5" />
              </div>
              <h2 className="font-title-md text-title-md text-primary font-bold">2. Compliance &amp; SEC Regulations</h2>
            </div>
            <p>
              All ledger settlements are subject to local clearing rules and anti-money laundering watchlists. We reserve the right to suspend any institutional node that fails our automatic KYC/AML screening audits.
            </p>
          </section>

          {/* Liabilities */}
          <section id="liabilities">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-surface-container-high p-2 rounded">
                <Lock className="text-secondary w-5 h-5" />
              </div>
              <h2 className="font-title-md text-title-md text-primary font-bold">3. Limitation of Liability</h2>
            </div>
            <p>
              We guarantee 99.99% system availability under our standard Service Level Agreements. Except as explicitly stated, FinanceHub is not liable for volatile market conditions or external network latency issues.
            </p>
          </section>
        </article>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-highest border-t border-outline-variant py-8">
        <div className="max-w-[800px] mx-auto px-margin-mobile flex flex-col sm:flex-row justify-between items-center text-xs font-bold uppercase tracking-wider text-on-surface-variant gap-4">
          <span>© 2026 FinanceHub. All rights reserved.</span>
          <button onClick={onBack} className="hover:underline">Back to Home</button>
        </div>
      </footer>
    </div>
  );
}
