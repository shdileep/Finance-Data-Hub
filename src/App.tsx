import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Receipt, Users, LogOut, DollarSign, Sun, Moon, BarChart2, FileText, Clock, UserCircle, Zap } from 'lucide-react';
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

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true;
  });

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
        if (data.id) setUser(data);
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
    setUser(null);
  };

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  if (!user) return <Login onLogin={handleLogin} />;

  return (
    <Router>
      <div className={`flex h-screen bg-bg-primary transition-colors duration-300`}>
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
            {/* ── Existing (untouched) ── */}
            <NavLink to="/" icon={<LayoutDashboard className="w-5 h-5" />} label="Dashboard" />
            <NavLink to="/transactions" icon={<Receipt className="w-5 h-5" />} label="Transactions" />
            {user.role === 'Admin' && (
              <NavLink to="/users" icon={<Users className="w-5 h-5" />} label="User Management" />
            )}
            {/* ── New features ── */}
            {(user.role === 'Admin' || user.role === 'Analyst') && (
              <NavLink to="/analytics" icon={<BarChart2 className="w-5 h-5" />} label="Analytics" />
            )}
            {(user.role === 'Admin' || user.role === 'Analyst') && (
              <NavLink to="/reports" icon={<FileText className="w-5 h-5" />} label="Reports" />
            )}
            {user.role === 'Admin' && (
              <NavLink to="/audit" icon={<Clock className="w-5 h-5" />} label="Audit Log" />
            )}
            {user.role === 'Admin' && (
              <NavLink to="/admin" icon={<Zap className="w-5 h-5" />} label="Control Center" />
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
                  {user.name[0]}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text-primary truncate">{user.name}</p>
                <p className="text-xs text-brand-500 truncate font-medium">{user.role}</p>
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
              {/* ── Existing (untouched) ── */}
              <Route path="/" element={<Dashboard user={user} />} />
              <Route path="/transactions" element={<Transactions user={user} />} />
              {user.role === 'Admin' && <Route path="/users" element={<UserManagement />} />}
              {/* ── New routes ── */}
              {(user.role === 'Admin' || user.role === 'Analyst') && <Route path="/analytics" element={<Analytics user={user} />} />}
              {(user.role === 'Admin' || user.role === 'Analyst') && <Route path="/reports" element={<Reports user={user} />} />}
              {user.role === 'Admin' && <Route path="/audit" element={<AuditLog user={user} />} />}
              {user.role === 'Admin' && <Route path="/admin" element={<AdminPanel user={user} />} />}
              <Route path="/profile" element={<Profile user={user} />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </main>
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
