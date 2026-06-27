import React from 'react';
import { Landmark, ChevronLeft, Shield, Lock, Eye, CheckCircle } from 'lucide-react';

interface PrivacyProps {
  onBack: () => void;
  onLogin: () => void;
}

export default function Privacy({ onBack, onLogin }: PrivacyProps) {
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
          <p className="font-label-caps text-label-caps text-on-surface-variant mb-2 text-xs font-bold uppercase tracking-wider">INSTITUTIONAL COMPLIANCE</p>
          <h1 className="font-headline-lg text-headline-lg md:text-[40px] text-on-surface mb-4 font-bold">Privacy Policy</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl leading-relaxed">
            This policy outlines our rigorous standards for data protection and transparency. Last updated: October 24, 2026.
          </p>
        </header>

        <article className="space-y-12 text-on-surface-variant leading-relaxed text-sm">
          {/* Data Collection */}
          <section id="data-collection">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-surface-container-high p-2 rounded">
                <Eye className="text-secondary w-5 h-5" />
              </div>
              <h2 className="font-title-md text-title-md text-primary font-bold">1. Data Collection Protocols</h2>
            </div>
            <p className="mb-4">
              We collect and process only the minimum amount of personal and institutional data required to perform transaction clearing, portfolio management, and compliance checks.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Institutional Identity Verification (KYC/KYB credentials).</li>
              <li>Operational ledger records and transaction values.</li>
              <li>Network telemetries for security log verification.</li>
            </ul>
          </section>

          {/* Data Security */}
          <section id="data-security">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-surface-container-high p-2 rounded">
                <Lock className="text-secondary w-5 h-5" />
              </div>
              <h2 className="font-title-md text-title-md text-primary font-bold">2. Data Security &amp; Sovereignty</h2>
            </div>
            <p className="mb-4">
              Our servers store records in geographically isolated European nodes under SOC2 regulations. We encrypt all data at-rest using AES-256 and enforce TLS 1.3 for transits.
            </p>
          </section>

          {/* Third Parties */}
          <section id="third-parties">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-surface-container-high p-2 rounded">
                <Shield className="text-secondary w-5 h-5" />
              </div>
              <h2 className="font-title-md text-title-md text-primary font-bold">3. Third Party Disclosures</h2>
            </div>
            <p>
              We do not lease, trade, or share user data with third-party advertising companies. Data transfers only occur to satisfy clearing and SEC regulatory reporting standards.
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
