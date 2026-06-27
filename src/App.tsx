import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Receipt, Users, LogOut, DollarSign, Sun, Moon, BarChart2, FileText, Clock, UserCircle, Zap, Bell, Target, BookOpen, FolderTree } from 'lucide-react';
import { User } from './types';
import Dashboard from './components/Dashboard';
import Transactions from './components/Transactions';
import UserManagement from './components/UserManagement';
import Login from './components/Login';
import Analytics from './components/Analytics';
import Reports from './components/Reports';
import AuditLog from './components/AuditLog';
import Profile from './components/Profile';
import AdminPanel from './components/AdminPanel';
import LandingPage from './components/LandingPage';
import Products from './components/Products';
import SecurityArchitecture from './components/SecurityArchitecture';
import Partnership from './components/Partnership';
import Enterprise from './components/Enterprise';
import Compliance from './components/Compliance';
import Privacy from './components/Privacy';
import Terms from './components/Terms';
import DesignSystem from './components/DesignSystem';
import DashboardPreview from './components/DashboardPreview';

// New Pages
import UserActivity from './components/UserActivity.jsx';
import AccessMap from './components/AccessMap.jsx';
import Alerts from './components/Alerts.jsx';
import Forecast from './components/Forecast.jsx';
import Categories from './components/Categories.jsx';
import Statements from './components/Statements.jsx';
import Insights from './components/Insights.jsx';
import Goals from './components/Goals.jsx';
import Help from './components/Help.jsx';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [impersonatingUser, setImpersonatingUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<'Admin' | 'Analyst' | 'Viewer' | null>(null);
  const [currentView, setCurrentView] = useState<'landing' | 'login' | 'products' | 'security' | 'partnership' | 'enterprise' | 'compliance' | 'privacy' | 'terms' | 'design-system' | 'dashboard-preview'>('landing');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true;
  });

  const activeUser = impersonatingUser || user;

  // Intercept window.fetch globally to append view-as headers when impersonation is active
  useEffect(() => {
    const originalFetch = window.fetch;
    window.fetch = async (input, init) => {
      const url = typeof input === 'string' ? input : input.url;
      if (url.startsWith('/api/') && !url.includes('/api/admin/impersonate-log')) {
        const viewAsId = sessionStorage.getItem('viewAsUserId');
        if (viewAsId) {
          init = init || {};
          const nextHeaders = new Headers(init.headers || {});
          nextHeaders.set('x-view-as-user-id', viewAsId);
          init.headers = nextHeaders;
        }
      }
      return originalFetch(input, init);
    };
    return () => {
      window.fetch = originalFetch;
    };
  }, []);

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
    const savedUserId = localStorage.getItem('userId');
    if (savedUserId) {
      fetch('/api/me', {
        headers: { 'x-user-id': savedUserId }
      })
      .then(res => res.json())
      .then(data => {
        if (data.id) {
          setUser(data);
          // Restore active impersonation state from session storage on reload
          const viewAsId = sessionStorage.getItem('viewAsUserId');
          if (viewAsId && data.role === 'Admin') {
            fetch('/api/users', { headers: { 'x-user-id': savedUserId } })
              .then(r => r.json())
              .then(usersList => {
                const target = usersList.find((u: any) => u.id.toString() === viewAsId);
                if (target) setImpersonatingUser(target);
              });
          }
        }
        else localStorage.removeItem('userId');
      })
      .catch(() => localStorage.removeItem('userId'))
      .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = (userId: number) => {
    localStorage.setItem('userId', userId.toString());
    fetch('/api/me', {
      headers: { 'x-user-id': userId.toString() }
    })
    .then(res => res.json())
    .then(data => setUser(data));
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    sessionStorage.removeItem('viewAsUserId');
    setImpersonatingUser(null);
    setUser(null);
  };

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  if (!user || !activeUser) {
    if (currentView === 'landing') {
      return (
        <LandingPage 
          onSelectRole={(role) => {
            setSelectedRole(role);
            setCurrentView('login');
          }} 
          onNavigate={(view) => setCurrentView(view)}
        />
      );
    }
    if (currentView === 'products') {
      return <Products onBack={() => setCurrentView('landing')} onLogin={() => { setSelectedRole('Viewer'); setCurrentView('login'); }} onNavigate={(view) => setCurrentView(view)} />;
    }
    if (currentView === 'security') {
      return <SecurityArchitecture onBack={() => setCurrentView('landing')} onLogin={() => { setSelectedRole('Viewer'); setCurrentView('login'); }} onNavigate={(view) => setCurrentView(view)} />;
    }
    if (currentView === 'partnership') {
      return <Partnership onBack={() => setCurrentView('landing')} onLogin={() => { setSelectedRole('Viewer'); setCurrentView('login'); }} onNavigate={(view) => setCurrentView(view)} />;
    }
    if (currentView === 'enterprise') {
      return <Enterprise onBack={() => setCurrentView('landing')} onLogin={() => { setSelectedRole('Viewer'); setCurrentView('login'); }} onNavigate={(view) => setCurrentView(view)} />;
    }
    if (currentView === 'compliance') {
      return <Compliance onBack={() => setCurrentView('landing')} onLogin={() => { setSelectedRole('Viewer'); setCurrentView('login'); }} onNavigate={(view) => setCurrentView(view)} />;
    }
    if (currentView === 'privacy') {
      return <Privacy onBack={() => setCurrentView('landing')} onLogin={() => { setSelectedRole('Viewer'); setCurrentView('login'); }} />;
    }
    if (currentView === 'terms') {
      return <Terms onBack={() => setCurrentView('landing')} onLogin={() => { setSelectedRole('Viewer'); setCurrentView('login'); }} />;
    }
    if (currentView === 'design-system') {
      return <DesignSystem onBack={() => setCurrentView('landing')} />;
    }
    if (currentView === 'dashboard-preview') {
      return <DashboardPreview onBack={() => setCurrentView('landing')} onLogin={() => { setSelectedRole('Viewer'); setCurrentView('login'); }} />;
    }
    if (currentView === 'login' && selectedRole) {
      return (
        <Login 
          onLogin={(userId) => {
            setSelectedRole(null);
            setCurrentView('landing');
            handleLogin(userId);
          }} 
          initialRole={selectedRole} 
          onBack={() => {
            setSelectedRole(null);
            setCurrentView('landing');
          }} 
        />
      );
    }
    return (
      <LandingPage 
        onSelectRole={(role) => {
          setSelectedRole(role);
          setCurrentView('login');
        }} 
        onNavigate={(view) => setCurrentView(view)}
      />
    );
  }

  return (
    <Router>
      <div className="flex flex-col h-screen bg-bg-primary transition-colors duration-300">
        {/* Impersonation Warning Banner */}
        {impersonatingUser && (
          <div className="bg-amber-600 border-b border-amber-700 text-[#131b2e] px-6 py-2.5 flex justify-between items-center text-xs font-bold shrink-0 animate-in slide-in-from-top duration-300">
            <span className="flex items-center gap-1.5 uppercase tracking-wider">
              ⚠️ Sandboxed View Mode: impersonating {impersonatingUser.role} ({impersonatingUser.name}) · Mutations disabled
            </span>
            <button 
              onClick={() => {
                setImpersonatingUser(null);
                sessionStorage.removeItem('viewAsUserId');
              }}
              className="px-3 py-1 bg-slate-900 text-white hover:bg-slate-800 rounded font-bold uppercase transition-colors"
            >
              Exit View Mode
            </button>
          </div>
        )}

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <aside className="w-64 glass border-r-0 flex flex-col z-10">
            <div className="p-6 border-b border-slate-700/50">
              <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-brand-500 to-indigo-600 rounded-xl shadow-lg shadow-brand-500/20">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                  FinanceHub
                </span>
              </h1>
            </div>
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {/* Admin Sidebar Navigation */}
              {activeUser.role === 'Admin' && (
                <>
                  <NavLink to="/" icon={<LayoutDashboard className="w-5 h-5" />} label="Dashboard" />
                  <NavLink to="/transactions" icon={<Receipt className="w-5 h-5" />} label="Transactions" />
                  <NavLink to="/users" icon={<Users className="w-5 h-5" />} label="User Management" />
                  <NavLink to="/admin/user-activity" icon={<Clock className="w-5 h-5" />} label="User Activity Viewer" />
                  <NavLink to="/admin/access-map" icon={<Shield className="w-5 h-5" />} label="Data Access Map" />
                  <NavLink to="/admin/alerts" icon={<Bell className="w-5 h-5" />} label="Alerts Center" />
                  <NavLink to="/analytics" icon={<BarChart2 className="w-5 h-5" />} label="Analytics" />
                  <NavLink to="/reports" icon={<FileText className="w-5 h-5" />} label="Reports" />
                  <NavLink to="/audit" icon={<Clock className="w-5 h-5" />} label="Audit Log" />
                  <NavLink to="/admin" icon={<Zap className="w-5 h-5" />} label="Control Center" />
                </>
              )}

              {/* Analyst Sidebar Navigation */}
              {activeUser.role === 'Analyst' && (
                <>
                  <NavLink to="/" icon={<LayoutDashboard className="w-5 h-5" />} label="Dashboard" />
                  <NavLink to="/transactions" icon={<Receipt className="w-5 h-5" />} label="Transactions" />
                  <NavLink to="/forecast" icon={<BarChart2 className="w-5 h-5" />} label="Forecasting Workspace" />
                  <NavLink to="/categories" icon={<FolderTree className="w-5 h-5" />} label="Category Intelligence" />
                  <NavLink to="/analytics" icon={<BarChart2 className="w-5 h-5" />} label="Analytics" />
                  <NavLink to="/reports" icon={<FileText className="w-5 h-5" />} label="Reports" />
                </>
              )}

              {/* Viewer Sidebar Navigation */}
              {activeUser.role === 'Viewer' && (
                <>
                  <NavLink to="/" icon={<LayoutDashboard className="w-5 h-5" />} label="Dashboard" />
                  <NavLink to="/transactions" icon={<Receipt className="w-5 h-5" />} label="Transactions" />
                  <NavLink to="/statements" icon={<FileText className="w-5 h-5" />} label="Statements" />
                  <NavLink to="/insights" icon={<Clock className="w-5 h-5" />} label="Insights Feed" />
                  <NavLink to="/goals" icon={<Target className="w-5 h-5" />} label="Goals &amp; Benchmarks" />
                  <NavLink to="/help" icon={<BookOpen className="w-5 h-5" />} label="FAQ &amp; Glossary" />
                </>
              )}
              
              <NavLink to="/profile" icon={<UserCircle className="w-5 h-5" />} label="Profile" />
            </nav>
            <div className="p-4 border-t border-border-primary/50">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="flex-1 flex items-center justify-center gap-2 p-2.5 text-sm font-medium bg-bg-primary border border-border-primary rounded-xl hover:bg-bg-secondary transition-all text-text-primary"
                >
                  {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
                  {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                </button>
              </div>
              
              <div className="flex items-center gap-3 my-4 p-3 rounded-xl bg-bg-secondary/50 border border-border-primary">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-500 to-purple-500 p-[2px]">
                  <div className="w-full h-full rounded-full bg-bg-primary flex items-center justify-center text-text-primary font-bold text-sm">
                    {activeUser.name[0]}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text-primary truncate">{activeUser.name}</p>
                  <p className="text-xs text-brand-500 truncate font-medium">{activeUser.role}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 p-2.5 text-sm text-red-500 font-medium hover:bg-red-500/10 rounded-xl transition-all"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 overflow-auto p-8 relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />
            
            <div className="relative z-10 max-w-7xl mx-auto">
              <Routes>
                {/* Profile routing */}
                <Route path="/profile" element={<Profile user={activeUser} />} />

                {/* Admin Routes */}
                {activeUser.role === 'Admin' && (
                  <>
                    <Route path="/" element={<Dashboard user={activeUser} />} />
                    <Route path="/transactions" element={<Transactions user={activeUser} />} />
                    <Route path="/users" element={<UserManagement />} />
                    <Route path="/admin/user-activity" element={<UserActivity user={activeUser} onImpersonate={(u: User) => {
                      sessionStorage.setItem('viewAsUserId', u.id.toString());
                      setImpersonatingUser(u);
                      fetch('/api/admin/impersonate-log', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'x-user-id': user.id.toString() },
                        body: JSON.stringify({ targetUserId: u.id })
                      });
                    }} />} />
                    <Route path="/admin/access-map" element={<AccessMap user={activeUser} />} />
                    <Route path="/admin/alerts" element={<Alerts user={activeUser} onInvestigate={() => {}} />} />
                    <Route path="/analytics" element={<Analytics user={activeUser} />} />
                    <Route path="/reports" element={<Reports user={activeUser} />} />
                    <Route path="/audit" element={<AuditLog user={activeUser} />} />
                    <Route path="/admin" element={<AdminPanel user={activeUser} />} />
                  </>
                )}

                {/* Analyst Routes */}
                {activeUser.role === 'Analyst' && (
                  <>
                    <Route path="/" element={<Dashboard user={activeUser} />} />
                    <Route path="/transactions" element={<Transactions user={activeUser} />} />
                    <Route path="/forecast" element={<Forecast user={activeUser} />} />
                    <Route path="/categories" element={<Categories user={activeUser} />} />
                    <Route path="/analytics" element={<Analytics user={activeUser} />} />
                    <Route path="/reports" element={<Reports user={activeUser} />} />
                  </>
                )}

                {/* Viewer Routes */}
                {activeUser.role === 'Viewer' && (
                  <>
                    <Route path="/" element={<Dashboard user={activeUser} />} />
                    <Route path="/transactions" element={<Transactions user={activeUser} />} />
                    <Route path="/statements" element={<Statements user={activeUser} />} />
                    <Route path="/insights" element={<Insights user={activeUser} />} />
                    <Route path="/goals" element={<Goals user={activeUser} />} />
                    <Route path="/help" element={<Help user={activeUser} />} />
                  </>
                )}

                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </Router>
  );
}

function NavLink({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
        isActive 
          ? 'bg-brand-500/10 text-brand-500 font-semibold border border-brand-500/20 shadow-sm' 
          : 'text-text-secondary font-medium hover:bg-bg-secondary hover:text-text-primary'
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}
