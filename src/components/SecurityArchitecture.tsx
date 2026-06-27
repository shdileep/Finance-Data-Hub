import React, { useEffect, useState } from 'react';
import { Landmark, Shield, Lock, CheckCircle, RefreshCw, Key, Download, HelpCircle, AlertCircle, Fingerprint, CloudLightning, TrendingUp } from 'lucide-react';

interface SecurityArchitectureProps {
  onBack: () => void;
  onLogin: () => void;
  onNavigate: (view: 'products' | 'security' | 'partnership' | 'enterprise' | 'compliance' | 'privacy' | 'terms') => void;
}

export default function SecurityArchitecture({ onBack, onLogin, onNavigate }: SecurityArchitectureProps) {
  const [statusBarHeights, setStatusBarHeights] = useState([50, 75, 66, 100, 33, 66, 83]);

  // Orbiting status heights update simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setStatusBarHeights(prev => prev.map(() => Math.floor(Math.random() * 80) + 20));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

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
          <nav className="hidden md:flex gap-8 items-center">
            <button onClick={() => onNavigate('products')} className="text-on-surface-variant hover:text-primary transition-colors font-label-caps text-label-caps cursor-pointer">Products</button>
            <button onClick={() => onNavigate('security')} className="text-primary border-b-2 border-primary pb-1 font-label-caps text-label-caps font-semibold cursor-pointer">Security</button>
            <button onClick={() => onNavigate('partnership')} className="text-on-surface-variant hover:text-primary transition-colors font-label-caps text-label-caps cursor-pointer">Institutional</button>
            <button onClick={() => onNavigate('compliance')} className="text-on-surface-variant hover:text-primary transition-colors font-label-caps text-label-caps cursor-pointer">Compliance</button>
          </nav>
          <div className="flex items-center gap-4">
            <button onClick={onLogin} className="px-6 py-2 bg-primary text-on-primary font-label-caps text-label-caps rounded-lg hover:opacity-90 transition-all cursor-pointer">
              Client Portal
            </button>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-20 max-w-container-max mx-auto px-margin-desktop flex-grow">
        {/* Hero Section */}
        <section className="mb-16 py-12">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <h1 className="font-display-lg text-display-lg text-on-surface mb-6 leading-tight">
                Institutional-Grade <span className="text-secondary">Security Protocol</span>
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mb-8">
                FinanceHub employs a defense-in-depth strategy, combining cutting-edge cryptographic standards with rigorous operational controls to protect global institutional assets.
              </p>
              <div className="flex gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-surface-container-high border border-outline-variant rounded-lg">
                  <CheckCircle className="text-secondary w-5 h-5" />
                  <span className="font-label-caps text-label-caps text-xs">SOC2 Type II Certified</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-surface-container-high border border-outline-variant rounded-lg">
                  <Lock className="text-secondary w-5 h-5" />
                  <span className="font-label-caps text-label-caps text-xs">AES-256 Encrypted</span>
                </div>
              </div>
            </div>
            
            {/* Security Scan Simulator */}
            <div className="flex-1 relative w-full aspect-video rounded-xl overflow-hidden bg-surface-container border border-outline-variant shadow-lg flex items-center justify-center">
              <div className="security-scan-line" />
              <div className="p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-full animate-pulse">
                <Shield className="text-6xl text-primary w-16 h-16 opacity-80" />
              </div>
            </div>
          </div>
        </section>

        {/* Security Infrastructure: Bento Grid */}
        <section className="mb-20">
          <div className="mb-10">
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2">Security Infrastructure</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Technological foundations of our data integrity and availability.</p>
          </div>
          
          <div className="grid grid-cols-12 gap-6">
            {/* AES Card */}
            <div className="col-span-12 md:col-span-8 p-8 border border-outline-variant bg-white flex flex-col justify-between min-h-[320px] rounded-xl shadow-sm">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <Lock className="w-10 h-10 text-primary" />
                  <span className="font-data-mono text-data-mono text-secondary px-3 py-1 bg-secondary/10 rounded-full text-xs">
                    ENCRYPTION_STANDARD_v3.2
                  </span>
                </div>
                <h3 className="font-title-md text-title-md mb-4 text-primary">AES-256 Military-Grade Encryption</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-6 leading-relaxed">
                  All sensitive data at rest is encrypted using Advanced Encryption Standard (AES) with 256-bit keys. For data in transit, we enforce TLS 1.3 with Perfect Forward Secrecy, ensuring that even if a future key is compromised, past communications remain secure.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-surface-container-low border border-outline-variant rounded">
                  <p className="font-label-caps text-label-caps text-on-surface-variant mb-1 text-[10px]">DATA AT REST</p>
                  <p className="font-data-mono text-data-mono font-bold text-sm">SHA-3 Hashing</p>
                </div>
                <div className="p-4 bg-surface-container-low border border-outline-variant rounded">
                  <p className="font-label-caps text-label-caps text-on-surface-variant mb-1 text-[10px]">KEY ROTATION</p>
                  <p className="font-data-mono text-data-mono font-bold text-sm">24-Hour Cycle</p>
                </div>
              </div>
            </div>

            {/* Disaster Recovery Card */}
            <div className="col-span-12 md:col-span-4 p-8 border border-outline-variant bg-surface-container-highest flex flex-col justify-between rounded-xl shadow-sm">
              <div>
                <CloudLightning className="w-10 h-10 text-primary mb-6" />
                <h3 className="font-title-md text-title-md mb-4 text-primary">Multi-Region Recovery</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  Real-time data replication across three geographically isolated zones ensures 99.99% availability. In the event of a catastrophic regional failure, our automated failover protocol achieves an RTO of &lt; 15 minutes.
                </p>
              </div>
              <div className="mt-6 border border-outline-variant/30 rounded overflow-hidden">
                <div className="bg-surface-container-high/40 p-4 h-24 flex items-center justify-center text-on-surface-variant opacity-60 text-xs font-mono">
                  [REPLICATED DATA FLOW MAP]
                </div>
              </div>
            </div>

            {/* Access Control Card */}
            <div className="col-span-12 md:col-span-5 p-8 border border-outline-variant bg-white rounded-xl shadow-sm">
              <Fingerprint className="w-10 h-10 text-primary mb-6" />
              <h3 className="font-title-md text-title-md mb-4 text-primary">Biometric MFA</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-6 leading-relaxed">
                Mandatory multi-factor authentication using WebAuthn standards, supporting hardware keys and biometric sensors to eliminate credential theft risks.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 font-body-sm text-body-sm">
                  <CheckCircle className="text-secondary w-4 h-4" />
                  <span>FIDO2 Compliance</span>
                </li>
                <li className="flex items-center gap-3 font-body-sm text-body-sm">
                  <CheckCircle className="text-secondary w-4 h-4" />
                  <span>Biometric Hardware Keys</span>
                </li>
              </ul>
            </div>

            {/* Zero Trust Card */}
            <div className="col-span-12 md:col-span-7 p-8 border border-outline-variant bg-primary-container text-on-primary-container relative overflow-hidden rounded-xl shadow-sm">
              <div className="relative z-10 text-white">
                <Shield className="w-10 h-10 text-secondary mb-6" />
                <h3 className="font-title-md text-title-md mb-4 text-white">Zero-Trust Architecture</h3>
                <p className="font-body-sm text-body-sm text-on-primary-container/80 mb-6 leading-relaxed">
                  Every request, whether internal or external, is authenticated, authorized, and continuously validated before being granted access to specific data segments. Network micro-segmentation prevents lateral movement in the unlikely event of a perimeter breach.
                </p>
                <div className="flex gap-4">
                  <div className="bg-white/10 px-4 py-2 border border-white/20 rounded">
                    <span className="font-label-caps text-label-caps text-xs text-white">Identity Centric</span>
                  </div>
                  <div className="bg-white/10 px-4 py-2 border border-white/20 rounded">
                    <span className="font-label-caps text-label-caps text-xs text-white">Least Privilege</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Certifications & Compliance */}
        <section className="mb-20">
          <div className="bg-surface-container-low border border-outline-variant p-10 rounded-xl">
            <div className="text-center mb-12">
              <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2">Global Compliance &amp; Certifications</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Validated by independent third-party audits annually.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-6 bg-white border border-outline-variant shadow-sm rounded-lg">
                <div className="w-16 h-16 bg-primary-container text-secondary flex items-center justify-center rounded-full mb-6 font-bold text-sm">SOC2</div>
                <h4 className="font-title-md text-title-md mb-2 text-primary">SOC2 Type II</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Audited availability, confidentiality, and security controls over a 12-month period.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-white border border-outline-variant shadow-sm rounded-lg">
                <div className="w-16 h-16 bg-primary-container text-secondary flex items-center justify-center rounded-full mb-6 font-bold text-sm">ISO</div>
                <h4 className="font-title-md text-title-md mb-2 text-primary">ISO/IEC 27001</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant">International standard for managing information security systems and physical security.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-white border border-outline-variant shadow-sm rounded-lg">
                <div className="w-16 h-16 bg-primary-container text-secondary flex items-center justify-center rounded-full mb-6 font-bold text-sm">GDPR</div>
                <h4 className="font-title-md text-title-md mb-2 text-primary">GDPR Compliant</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Strict adherence to data privacy and protection regulations for all global users.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Monitoring Info Section */}
        <section className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 space-y-6">
              <div className="p-6 border border-outline-variant bg-white hover:border-secondary transition-all rounded-xl shadow-sm">
                <div className="flex items-center gap-4 mb-2">
                  <TrendingUp className="text-secondary w-6 h-6" />
                  <h4 className="font-title-md text-title-md text-primary">24/7 Security Operations Center</h4>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Continuous monitoring of all network traffic and system logs for anomaly detection and rapid response.
                </p>
              </div>
              <div className="p-6 border border-outline-variant bg-white hover:border-secondary transition-all rounded-xl shadow-sm">
                <div className="flex items-center gap-4 mb-2">
                  <AlertCircle className="text-secondary w-6 h-6" />
                  <h4 className="font-title-md text-title-md text-primary">Vulnerability Management</h4>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Quarterly penetration tests conducted by external firms and a continuous Bug Bounty program.
                </p>
              </div>
              <div className="p-6 border border-outline-variant bg-white hover:border-secondary transition-all rounded-xl shadow-sm">
                <div className="flex items-center gap-4 mb-2">
                  <Shield className="text-secondary w-6 h-6" />
                  <h4 className="font-title-md text-title-md text-primary">Role-Based Access (RBAC)</h4>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Granular permission layers ensuring employees only access data strictly necessary for their function.
                </p>
              </div>
            </div>
            
            {/* Status Heights Visualization */}
            <div className="order-1 md:order-2 bg-surface-container-highest p-8 border border-outline-variant rounded-xl shadow-sm flex flex-col justify-center min-h-[400px]">
              <div className="mb-8 flex justify-between items-center text-on-surface">
                <div>
                  <p className="font-label-caps text-label-caps text-on-surface-variant text-[10px]">LIVE MONITORING STATUS</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-2 h-2 bg-secondary rounded-full animate-pulse"></span>
                    <span className="font-data-mono text-data-mono text-secondary text-xs font-bold">SYSTEMS_NOMINAL</span>
                  </div>
                </div>
                <span className="font-data-mono text-data-mono opacity-50 text-xs">LATENCY: 12ms</span>
              </div>
              <div className="space-y-4">
                <div className="h-4 bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-3/4"></div>
                </div>
                <div className="h-4 bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-secondary w-1/2"></div>
                </div>
                <div className="h-4 bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-5/6"></div>
                </div>
                {/* Simulated equalizer animation heights */}
                <div className="h-32 flex items-end gap-2 mt-8">
                  {statusBarHeights.map((h, i) => (
                    <div 
                      key={i} 
                      className={`flex-1 rounded-t-sm transition-all duration-700 ${i % 2 === 0 ? 'bg-primary' : 'bg-secondary'}`}
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center py-16 px-8 border border-outline-variant bg-white shadow-sm rounded-xl">
          <h2 className="font-headline-lg text-headline-lg mb-4 text-primary">Review Our Security Whitepaper</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-10 max-w-2xl mx-auto">
            For detailed technical specifications, request a copy of our Institutional Security &amp; Compliance documentation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={onLogin} className="px-8 py-3 bg-primary text-on-primary font-label-caps text-label-caps rounded hover:opacity-90 transition-all flex items-center justify-center gap-2">
              <Download className="w-4 h-4" />
              Download Whitepaper
            </button>
            <button onClick={onLogin} className="px-8 py-3 bg-white text-primary border border-primary font-label-caps text-label-caps rounded hover:bg-surface-container-low transition-all">
              Contact Security Team
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full bg-surface-container-highest border-t border-outline-variant">
        <div className="flex flex-col md:flex-row justify-between items-center max-w-container-max mx-auto px-margin-desktop py-8 text-on-surface-variant">
          <div className="mb-6 md:mb-0">
            <span className="font-title-md text-title-md text-primary font-bold">FinanceHub</span>
            <p className="font-body-sm text-body-sm mt-1">© 2026 FinanceHub Institutional. All rights reserved.</p>
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
