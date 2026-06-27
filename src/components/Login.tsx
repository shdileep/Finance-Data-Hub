import { useState, useEffect } from 'react';
import { Shield, BarChart3, Eye, ChevronLeft, Sun, Moon, Key, Terminal, Verified, Badge, Lock, Info, Fingerprint, ArrowRight, RefreshCw } from 'lucide-react';

interface LoginProps {
  onLogin: (userId: number) => void;
  initialRole: 'Admin' | 'Analyst' | 'Viewer';
  onBack: () => void;
}

export default function Login({ onLogin, initialRole, onBack }: LoginProps) {
  const [role, setRole] = useState<'Admin' | 'Analyst' | 'Viewer'>(initialRole);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true;
  });

  const [loading, setLoading] = useState(false);
  const [timeStr, setTimeStr] = useState('UTC 00:00:00');

  // Input states for Admin
  const [adminNodeId, setAdminNodeId] = useState('PF-NODE-0482');
  const [adminKey, setAdminKey] = useState('••••••••••••');
  const [adminMfa, setAdminMfa] = useState('682941');

  // Input states for Analyst
  const [analystId, setAnalystId] = useState('AN-4902-8821');
  const [analystKey, setAnalystKey] = useState('••••••••••••');

  // Input states for Viewer
  const [viewerEmail, setViewerEmail] = useState('viewer@example.com');
  const [viewerPassword, setViewerPassword] = useState('••••••••');

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Live Clock for Terminal
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTimeStr('UTC ' + now.toISOString().substring(11, 19));
    };
    const timer = setInterval(updateClock, 1000);
    updateClock();
    return () => clearInterval(timer);
  }, []);

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate verification delay matching Stitch micro-interactions
    setTimeout(() => {
      setLoading(false);
      if (role === 'Admin') onLogin(1);
      else if (role === 'Analyst') onLogin(2);
      else onLogin(3);
    }, 1500);
  };

  const handleQuickLogin = (roleType: 'Admin' | 'Analyst' | 'Viewer') => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (roleType === 'Admin') onLogin(1);
      else if (roleType === 'Analyst') onLogin(2);
      else onLogin(3);
    }, 1000);
  };

  // ───────────────────────────────────────────────────────────────────────────
  // VIEW 1: ADMIN LOGIN (Institutional Node Terminal Access - Dark Theme)
  // ───────────────────────────────────────────────────────────────────────────
  if (role === 'Admin') {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4 bg-on-primary-fixed text-on-surface font-body-lg antialiased overflow-hidden relative select-none">
        {/* Background Grid Overlay */}
        <div 
          className="absolute inset-0 opacity-30 pointer-events-none" 
          style={{
            backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />
        {/* Decorative Circles */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-primary-fixed/5 rounded-full pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-primary-fixed/10 rounded-full pointer-events-none animate-pulse" />

        <div className="z-10 w-full max-w-4xl flex flex-col md:flex-row items-stretch shadow-2xl rounded-lg overflow-hidden border border-outline/20 bg-primary-container/85 backdrop-blur-xl">
          {/* Left Branding Side */}
          <div className="hidden md:flex md:w-1/2 bg-primary-container p-12 flex-col justify-between relative overflow-hidden">
            <div className="relative z-20">
              <div 
                onClick={onBack}
                className="inline-flex items-center gap-2 text-xs font-bold text-on-primary-container hover:text-primary-fixed cursor-pointer transition-colors mb-8 group"
              >
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Landing Page
              </div>
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-[#1e293b] rounded-xl border border-outline-variant/30">
                  <Terminal className="w-8 h-8 text-primary-fixed" />
                </div>
                <span className="font-headline-lg text-title-md font-bold text-primary-fixed">
                  FinanceHub
                </span>
              </div>
              <h1 className="font-display-lg text-display-lg text-primary-fixed mb-4">Precision Financial Logic</h1>
              <p className="font-title-md text-on-primary-container max-w-xs">Institutional Node Terminal Access. Authorized Personnel Only.</p>
            </div>
            
            <div className="relative z-20 space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-secondary-fixed" />
                </div>
                <div>
                  <p className="font-label-caps text-on-primary-container">Security Protocol</p>
                  <p className="font-body-sm text-primary-fixed-dim">AES-256 Encrypted Layer</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-primary/40 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-primary-fixed" />
                </div>
                <div>
                  <p className="font-label-caps text-on-primary-container">Auditing Status</p>
                  <p className="font-body-sm text-primary-fixed-dim">Live SEC Transaction Logging</p>
                </div>
              </div>
            </div>
            <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-secondary-fixed/5 blur-3xl rounded-full" />
          </div>

          {/* Right Form Side */}
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative bg-[#131b2e]/80 border border-primary-fixed/10">
            {/* Top mobile navigation */}
            <div className="md:hidden flex justify-between items-center mb-8">
              <button onClick={onBack} className="flex items-center gap-1.5 text-xs text-on-primary-container font-bold">
                <ChevronLeft className="w-4 h-4" /> Landing
              </button>
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-primary-fixed" />
                <span className="text-sm font-bold text-primary-fixed">PFL Terminal</span>
              </div>
            </div>

            <div className="space-y-8">
              {/* Tab Selector */}
              <div className="flex space-x-6 border-b border-outline/20 pb-4 text-xs font-bold uppercase tracking-wider">
                <span className="text-primary-fixed border-b-2 border-primary-fixed pb-4">Terminal Login</span>
                <button onClick={() => setRole('Analyst')} className="text-on-primary-container hover:text-primary-fixed transition-colors">Analyst Node</button>
                <button onClick={() => setRole('Viewer')} className="text-on-primary-container hover:text-primary-fixed transition-colors">Viewer Gate</button>
              </div>

              {/* Form */}
              <form onSubmit={handleAuthSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="font-label-caps text-on-primary-container block text-xs">Terminal Access ID</label>
                  <div className="relative">
                    <Terminal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-primary-container text-sm" />
                    <input 
                      type="text"
                      required
                      value={adminNodeId}
                      onChange={e => setAdminNodeId(e.target.value)}
                      className="w-full bg-on-primary-fixed/50 border border-outline/30 rounded py-3 pl-10 pr-4 text-sm text-primary-fixed focus:outline-none focus:border-primary-fixed-dim transition-all font-data-mono uppercase"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="font-label-caps text-on-primary-container block text-xs">Access Key</label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-primary-container text-sm" />
                    <input 
                      type="password"
                      required
                      value={adminKey}
                      onChange={e => setAdminKey(e.target.value)}
                      className="w-full bg-on-primary-fixed/50 border border-outline/30 rounded py-3 pl-10 pr-4 text-sm text-primary-fixed focus:outline-none focus:border-primary-fixed-dim transition-all font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="font-label-caps text-on-primary-container block text-xs">MFA Token</label>
                    <span className="text-[10px] text-secondary-fixed animate-pulse font-bold">VERIFICATION REQUIRED</span>
                  </div>
                  <div className="relative">
                    <Verified className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-primary-container text-sm" />
                    <input 
                      type="text"
                      required
                      maxLength={6}
                      value={adminMfa}
                      onChange={e => setAdminMfa(e.target.value)}
                      className="w-full bg-on-primary-fixed/50 border border-outline/30 rounded py-3 pl-10 pr-4 text-sm text-primary-fixed focus:outline-none focus:border-primary-fixed-dim transition-all text-center tracking-[0.5em] font-bold font-mono"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-primary-fixed hover:bg-white text-primary-container font-label-caps py-4 rounded transition-all flex items-center justify-center space-x-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>VERIFYING CREDENTIALS...</span>
                    </>
                  ) : (
                    <>
                      <span>AUTHORIZE SESSION</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Live Terminal Clock & Status Footer */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full max-w-container-max flex justify-between px-margin-desktop text-on-primary-container font-data-mono text-[10px] opacity-60">
          <div className="flex space-x-6">
            <span>SYSTEM: NOMINAL</span>
            <span>{timeStr}</span>
          </div>
          <div className="flex space-x-6">
            <span>ENCRYPTION: ACTIVE</span>
            <span>NODE: LDN-04-ADMIN</span>
          </div>
        </div>
      </div>
    );
  }

  // ───────────────────────────────────────────────────────────────────────────
  // VIEW 2: ANALYST LOGIN (Analyst Node Activation - Light/Grid Theme)
  // ───────────────────────────────────────────────────────────────────────────
  if (role === 'Analyst') {
    return (
      <div className="min-h-screen flex flex-col font-body-lg text-on-surface bg-background relative overflow-hidden select-none">
        {/* Background Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-30 pointer-events-none" 
          style={{
            backgroundImage: 'linear-gradient(to right, #e5eeff 1px, transparent 1px), linear-gradient(to bottom, #e5eeff 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />

        {/* Top Navigation Anchor */}
        <header className="w-full sticky bg-surface border-b border-outline-variant z-50">
          <div className="flex justify-between items-center px-margin-desktop py-4 max-w-container-max mx-auto">
            <div 
              onClick={onBack}
              className="flex items-center gap-4 cursor-pointer select-none active:opacity-80"
            >
              <img alt="FinanceHub Logo" className="h-10 w-10 object-contain" src="/financehub_logo_1775405496940.png" />
              <span className="font-display-lg text-title-md font-bold text-primary">Precision Financial Logic</span>
            </div>
            <div className="hidden md:flex items-center gap-8 font-label-caps text-on-surface-variant uppercase tracking-widest">
              <span className="flex items-center gap-2"><Shield className="w-4 h-4 text-secondary" /> Node: SEC-042</span>
              <span className="flex items-center gap-2"><RefreshCw className="w-4 h-4 text-secondary" /> Session: Idle</span>
            </div>
          </div>
        </header>

        <main className="flex-grow flex items-center justify-center px-margin-mobile md:px-margin-desktop py-12 relative overflow-hidden z-10">
          {/* Background Data Elements */}
          <div className="absolute inset-0 pointer-events-none opacity-5 font-mono">
            <div className="absolute top-20 left-20 transform -rotate-12 text-[80px] font-extrabold leading-tight text-secondary">
              101.24<br/>88.90<br/>342.11
            </div>
            <div className="absolute bottom-20 right-20 transform rotate-6 text-[60px] font-extrabold leading-tight text-secondary">
              RISK: LOW<br/>ALPHA: 0.42<br/>BETA: 1.05
            </div>
          </div>

          <div className="max-w-[1100px] w-full grid grid-cols-1 lg:grid-cols-2 gap-gutter items-stretch">
            {/* Context & Information Panel */}
            <div className="hidden lg:flex flex-col justify-center p-12 bg-primary-container text-on-primary-container rounded-lg relative overflow-hidden">
              <div className="scanline" />
              <div className="mb-8">
                <span className="font-label-caps text-secondary-container mb-2 block uppercase">Institutional Access</span>
                <h1 className="font-headline-lg text-headline-lg text-white mb-6">Analyst Node Activation</h1>
                <p className="text-on-primary-container/80 font-body-lg max-w-md leading-relaxed">
                  Access the institutional reporting terminal. Precision Financial Logic provides real-time market synthesis, risk vector analysis, and deterministic financial modeling for authorized analysts only.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="mt-1 flex-shrink-0 bg-surface-container-highest/10 p-2 rounded">
                    <BarChart3 className="w-5 h-5 text-secondary-container" />
                  </div>
                  <div>
                    <h3 className="font-title-md text-white">Advanced Telemetry</h3>
                    <p className="text-body-sm text-on-primary-container/60">Sub-millisecond data synchronization across global liquidity hubs.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="mt-1 flex-shrink-0 bg-surface-container-highest/10 p-2 rounded">
                    <Shield className="w-5 h-5 text-secondary-container" />
                  </div>
                  <div>
                    <h3 className="font-title-md text-white">Portfolio Admin</h3>
                    <p className="text-body-sm text-on-primary-container/60">Complete audit trails and multi-signature authorization protocols.</p>
                  </div>
                </div>
              </div>
              <div className="mt-auto pt-12">
                <div className="flex items-center gap-6 border-t border-white/10 pt-8">
                  <div className="flex flex-col">
                    <span className="font-data-mono text-xl text-secondary-fixed-dim">1.2M+</span>
                    <span className="font-label-caps text-xs opacity-50">Data Points/Sec</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-data-mono text-xl text-secondary-fixed-dim">99.99%</span>
                    <span className="font-label-caps text-xs opacity-50">Uptime Reliability</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Auth Form Panel */}
            <div className="bg-surface-container-lowest border border-outline-variant p-8 md:p-12 rounded-lg shadow-sm flex flex-col">
              <div className="mb-8 flex border-b border-outline-variant font-bold text-xs uppercase tracking-wider">
                <button onClick={() => setRole('Admin')} className="flex-1 py-3 text-on-surface-variant hover:text-primary transition-colors">Admin</button>
                <span className="flex-1 py-3 border-b-2 border-primary text-primary text-center">Analyst Mode</span>
                <button onClick={() => setRole('Viewer')} className="flex-1 py-3 text-on-surface-variant hover:text-primary transition-colors text-right">Viewer</button>
              </div>

              <div className="mb-6">
                <h2 className="font-headline-lg text-title-md text-primary mb-2">Analyst Authentication</h2>
                <p className="text-on-surface-variant text-body-sm">Initialize terminal credentials for secure access.</p>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-6">
                <div>
                  <label className="block font-label-caps text-on-surface-variant mb-2">Analyst Credentials (ID)</label>
                  <div className="relative">
                    <Badge className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg" />
                    <input 
                      type="text"
                      required
                      value={analystId}
                      onChange={e => setAnalystId(e.target.value)}
                      className="w-full bg-surface-container-low border border-outline-variant pl-10 pr-4 py-3 rounded-lg focus:ring-1 focus:ring-on-primary-container focus:border-on-primary-container outline-none transition-all font-data-mono text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-label-caps text-on-surface-variant mb-2">Station Authorization Key</label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg" />
                    <input 
                      type="password"
                      required
                      value={analystKey}
                      onChange={e => setAnalystKey(e.target.value)}
                      className="w-full bg-surface-container-low border border-outline-variant pl-10 pr-4 py-3 rounded-lg focus:ring-1 focus:ring-on-primary-container focus:border-on-primary-container outline-none transition-all font-body-sm"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center py-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-outline-variant text-secondary focus:ring-secondary" />
                    <span className="text-body-sm text-on-surface-variant">Persistent Session</span>
                  </label>
                  <span className="text-body-sm text-on-secondary-container hover:underline font-semibold cursor-pointer">Key Recovery</span>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-primary-container text-white py-4 rounded-lg font-label-caps hover:bg-black transition-all flex justify-center items-center gap-2 group disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>EXECUTING AUTHORIZATION...</span>
                    </>
                  ) : (
                    <>
                      <span>Execute Authorization</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </main>

        <footer className="w-full bottom-0 bg-surface-dim border-t border-outline-variant">
          <div className="flex flex-col md:flex-row justify-between items-center px-margin-desktop py-gutter max-w-container-max mx-auto text-xs font-bold text-on-surface-variant uppercase tracking-wider">
            <span>© 2026 Precision Financial Logic. All rights reserved. SEC Regulated Entity.</span>
            <div className="flex gap-6">
              <a href="#" className="hover:text-text-primary transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-text-primary transition-colors">Security Protocol</a>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // ───────────────────────────────────────────────────────────────────────────
  // VIEW 3: VIEWER LOGIN (Viewer Access Gateway - Clean Slate Light Mode)
  // ───────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-margin-mobile md:p-margin-desktop relative overflow-hidden select-none font-sans bg-background">
      {/* Background Decorative Blur Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-container-max h-full pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-primary-fixed rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-secondary-container rounded-full blur-[120px]"></div>
      </div>

      {/* Back button */}
      <div className="absolute top-8 left-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-surface hover:bg-surface-container-high border border-outline-variant text-on-surface-variant hover:text-primary text-xs font-bold rounded-lg transition-all shadow-sm"
        >
          <ChevronLeft className="w-4 h-4" /> Landing Page
        </button>
      </div>

      {/* Theme toggle */}
      <div className="absolute top-8 right-8">
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-3 bg-surface hover:bg-surface-container-high border border-outline-variant rounded-lg text-on-surface-variant hover:text-primary transition-all"
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
        </button>
      </div>

      <div className="w-full max-w-md z-10">
        {/* Branding header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="mb-4">
            <img alt="FinanceHub Logo" className="w-16 h-16 object-contain" src="/financehub_logo_1775405496940.png" />
          </div>
          <h1 className="font-display-lg text-display-lg text-primary tracking-tight">FinanceHub</h1>
          <p className="font-body-sm text-on-surface-variant mt-2">Institutional Viewer Access · Read-Only Node</p>
        </div>

        {/* Card */}
        <div className="bg-surface-container-lowest border border-outline-variant p-8 rounded-lg shadow-sm" id="auth-container">
          <div className="mb-6 flex border-b border-outline-variant font-bold text-xs uppercase tracking-wider">
            <button onClick={() => setRole('Admin')} className="flex-1 py-3 text-on-surface-variant hover:text-primary transition-colors">Admin</button>
            <button onClick={() => setRole('Analyst')} className="flex-1 py-3 text-on-surface-variant hover:text-primary transition-colors">Analyst</button>
            <span className="flex-1 py-3 border-b-2 border-primary text-primary text-center">Viewer Gate</span>
          </div>

          <header className="mb-8">
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-1">Welcome back</h2>
            <p className="font-body-sm text-on-surface-variant">Sign in to access your financial summaries.</p>
          </header>

          {/* Quick Login Options */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button 
              onClick={() => handleQuickLogin('Viewer')}
              className="flex items-center justify-center gap-2 py-3 px-4 bg-surface hover:bg-surface-container-high border border-outline-variant transition-all rounded-lg active:scale-[0.98]"
            >
              <Fingerprint className="w-4 h-4 text-primary" />
              <span className="font-label-caps text-on-surface text-xs">Biometric</span>
            </button>
            <button 
              onClick={() => handleQuickLogin('Viewer')}
              className="flex items-center justify-center gap-2 py-3 px-4 bg-surface hover:bg-surface-container-high border border-outline-variant transition-all rounded-lg active:scale-[0.98]"
            >
              <Key className="w-4 h-4 text-primary" />
              <span className="font-label-caps text-on-surface text-xs">SSO</span>
            </button>
          </div>

          <div className="relative flex items-center mb-8 text-center justify-center">
            <div className="flex-grow border-t border-outline-variant"></div>
            <span className="flex-shrink mx-4 font-label-caps text-outline text-[10px]">OR CONTINUE WITH EMAIL</span>
            <div className="flex-grow border-t border-outline-variant"></div>
          </div>

          {/* Form */}
          <form onSubmit={handleAuthSubmit} className="space-y-6">
            <div>
              <label className="block font-body-sm font-semibold text-on-surface mb-2">Institutional Email</label>
              <input 
                type="email"
                required
                value={viewerEmail}
                onChange={e => setViewerEmail(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant focus:border-on-primary-fixed-variant focus:ring-1 focus:ring-on-primary-fixed-variant rounded-lg py-3 px-4 font-body-lg outline-none transition-all"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="font-body-sm font-semibold text-on-surface">Password</label>
                <span className="font-label-caps text-on-secondary-fixed-variant hover:underline cursor-pointer">Forgot?</span>
              </div>
              <input 
                type="password"
                required
                value={viewerPassword}
                onChange={e => setViewerPassword(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant focus:border-on-primary-fixed-variant focus:ring-1 focus:ring-on-primary-fixed-variant rounded-lg py-3 px-4 font-body-lg outline-none transition-all"
              />
            </div>

            <div className="flex items-center">
              <input type="checkbox" id="remember" defaultChecked className="w-4 h-4 rounded border-outline-variant text-secondary focus:ring-secondary-container" />
              <label htmlFor="remember" className="ml-2 font-body-sm text-on-surface-variant">Keep me signed in for 30 days</label>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-primary-container text-primary-fixed hover:bg-on-primary-fixed-variant transition-colors py-4 px-6 rounded-lg font-title-md flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>ACCESSING TERM GATEWAY...</span>
                </>
              ) : (
                <>
                  <span>Access Viewer Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-16 border-t border-outline-variant pt-8 flex flex-col md:flex-row justify-between items-center gap-4 px-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider text-center">
          <span>© 2026 Precision Financial Logic. SEC Regulated Entity.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-text-primary transition-colors">Security</a>
          </div>
        </div>
      </div>
    </div>
  );
}
