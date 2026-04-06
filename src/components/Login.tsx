import { useState, useEffect } from 'react';
import { Shield, BarChart, Eye, ChevronLeft, LogIn, Sun, Moon } from 'lucide-react';
import { User } from '../types';

export default function Login({ onLogin }: { onLogin: (userId: number) => void }) {
  const [selectedRole, setSelectedRole] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true;
  });

  const demoUsers: User[] = [
    { id: 1, name: 'Admin User', email: 'admin@example.com', role: 'Admin', status: 'active' },
    { id: 2, name: 'Analyst User', email: 'analyst@example.com', role: 'Analyst', status: 'active' },
    { id: 3, name: 'Viewer User', email: 'viewer@example.com', role: 'Viewer', status: 'active' }
  ];

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  const handleGoogleLogin = () => {
    if (!selectedRole) return;
    const btn = document.getElementById('google-btn');
    if (btn) btn.innerText = 'Redirecting to Google...';
    setTimeout(() => onLogin(selectedRole.id), 1200);
  };

  if (loading) return <div className="min-h-screen bg-bg-primary flex items-center justify-center text-text-primary font-bold">Loading...</div>;

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center p-4 relative overflow-hidden transition-colors duration-300 font-sans">
      {/* Background Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-brand-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Theme Toggle */}
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="absolute top-8 right-8 p-3 rounded-2xl glass hover:bg-bg-secondary transition-all z-20 group border border-border-primary"
      >
        {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-500" />}
      </button>

      <div className="max-w-lg w-full relative z-10 glass shadow-2xl rounded-3xl overflow-hidden border border-border-primary">
        <div className="p-8 text-center bg-bg-secondary/30 backdrop-blur-md">
          <div className="w-24 h-24 mx-auto mb-6 rounded-2xl overflow-hidden shadow-2xl ring-4 ring-brand-500/20 group hover:scale-105 transition-transform duration-500">
             <img src="/financehub_logo_1775405496940.png" alt="FinanceHub Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-4xl font-display font-bold text-text-primary tracking-tight mb-2">FinanceHub</h1>
          <p className="text-text-secondary font-medium">Precision Financial Management & Analytics</p>
        </div>

        <div className="p-8 relative min-h-[400px] flex flex-col items-center justify-center overflow-hidden">
          {!selectedRole ? (
            /* Role Selection Screen */
            <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-500">
              <div className="text-center mb-8">
                <h2 className="text-xl font-bold text-text-primary">Select Your Access Level</h2>
                <p className="text-sm text-text-secondary">Each role contains specialized dashboards</p>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {demoUsers.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => setSelectedRole(user)}
                    className="flex items-center gap-4 p-5 rounded-2xl border-2 border-border-primary bg-bg-secondary/40 hover:bg-bg-primary hover:border-brand-500/50 hover:shadow-xl transition-all group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-500/0 to-brand-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className={`p-4 rounded-xl shadow-lg ring-1 ring-white/10 group-hover:scale-110 transition-transform ${
                      user.role === 'Admin' ? 'bg-indigo-500' : 
                      user.role === 'Analyst' ? 'bg-brand-500' : 'bg-purple-500'
                    }`}>
                      {user.role === 'Admin' ? <Shield className="w-6 h-6 text-white" /> : 
                       user.role === 'Analyst' ? <BarChart className="w-6 h-6 text-white" /> : 
                       <Eye className="w-6 h-6 text-white" />}
                    </div>
                    <div className="text-left flex-1 relative z-10">
                      <p className="font-bold text-text-primary text-lg">{user.role}</p>
                      <p className="text-xs text-text-secondary font-medium">
                        {user.role === 'Admin' ? 'Full system control & user management' : 
                         user.role === 'Analyst' ? 'Financial trends & detailed reporting' : 
                         'Read-only summaries & record viewing'}
                      </p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-bg-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                      <ChevronLeft className="w-4 h-4 text-brand-500 rotate-180" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Auth Selection Screen (Selected Role) */
            <div className="w-full text-center space-y-8 animate-in zoom-in-95 fade-in duration-500">
              <div className="flex flex-col items-center">
                <div onClick={() => setSelectedRole(null)} className="cursor-pointer flex items-center gap-2 px-4 py-1.5 rounded-full bg-bg-secondary text-brand-500 text-xs font-bold border border-border-primary hover:bg-bg-primary transition-all mb-6 group">
                  <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                  Change Access Level
                </div>
                
                <div className={`p-6 rounded-3xl mb-4 ${
                  selectedRole.role === 'Admin' ? 'bg-indigo-500/10' : 
                  selectedRole.role === 'Analyst' ? 'bg-brand-500/10' : 'bg-purple-500/10'
                }`}>
                   {selectedRole.role === 'Admin' ? <Shield className="w-12 h-12 text-indigo-500" /> : 
                    selectedRole.role === 'Analyst' ? <BarChart className="w-12 h-12 text-brand-500" /> : 
                    <Eye className="w-12 h-12 text-purple-500" />}
                </div>
                <h3 className="text-2xl font-bold text-text-primary">Welcome, {selectedRole.role}</h3>
                <p className="text-text-secondary font-medium px-8">Sign in with your verified Google account to access the {selectedRole.role} console.</p>
              </div>

              <div className="px-8 pb-4">
                <button
                  id="google-btn"
                  onClick={handleGoogleLogin}
                  className="w-full h-16 flex items-center justify-center gap-4 rounded-2xl bg-white text-slate-900 font-bold shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all border border-slate-200"
                >
                  <svg className="w-7 h-7" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  </svg>
                  Login with Google Workspace
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <p className="mt-8 text-sm text-text-secondary relative z-10 font-bold tracking-tight">
        FinanceHub &copy; 2026 • Premium Ledger Infrastructure
      </p>
    </div>
  );
}
