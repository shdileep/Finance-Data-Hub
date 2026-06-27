import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User as UserIcon, Shield, CheckCircle, Mail, Calendar, Lock, ExternalLink, Ban, BarChart2 } from 'lucide-react';
import { User } from '../types';
import { PageLoading } from './Analytics';

// Each permission maps to a route so it's clickable
const ROLE_PERMISSIONS: Record<string, { label: string; allowed: boolean; route: string | null }[]> = {
  Admin: [
    { label: 'View Dashboard & Summary', allowed: true, route: '/' },
    { label: 'View Transactions', allowed: true, route: '/transactions' },
    { label: 'Create / Edit Transactions', allowed: true, route: '/transactions' },
    { label: 'Delete Transactions (soft)', allowed: true, route: '/transactions' },
    { label: 'View Analytics & Reports', allowed: true, route: '/analytics' },
    { label: 'Export CSV Reports', allowed: true, route: '/reports' },
    { label: 'View Audit Log', allowed: true, route: '/audit' },
    { label: 'View & Manage Users', allowed: true, route: '/users' },
    { label: 'Admin Control Center', allowed: true, route: '/admin' },
  ],
  Analyst: [
    { label: 'View Dashboard & Summary', allowed: true, route: '/' },
    { label: 'View Transactions', allowed: true, route: '/transactions' },
    { label: 'Create / Edit Transactions', allowed: false, route: null },
    { label: 'Delete Transactions (soft)', allowed: false, route: null },
    { label: 'View Analytics & Reports', allowed: true, route: '/analytics' },
    { label: 'Export CSV Reports', allowed: true, route: '/reports' },
    { label: 'View Audit Log', allowed: false, route: null },
    { label: 'View & Manage Users', allowed: false, route: null },
  ],
  Viewer: [
    { label: 'View Dashboard & Summary', allowed: true, route: '/' },
    { label: 'View Transactions', allowed: true, route: '/transactions' },
    { label: 'Create / Edit Transactions', allowed: false, route: null },
    { label: 'Delete Transactions (soft)', allowed: false, route: null },
    { label: 'View Analytics & Reports', allowed: false, route: null },
    { label: 'Export CSV Reports', allowed: false, route: null },
    { label: 'View Audit Log', allowed: false, route: null },
    { label: 'View & Manage Users', allowed: false, route: null },
  ],
};

const ROLE_COLORS: Record<string, string> = {
  Admin: 'from-indigo-500 to-purple-600',
  Analyst: 'from-brand-500 to-cyan-500',
  Viewer: 'from-purple-500 to-pink-500',
};

const ROLE_BADGE: Record<string, string> = {
  Admin: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
  Analyst: 'text-brand-400 bg-brand-500/10 border-brand-500/20',
  Viewer: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
};

export default function Profile({ user }: { user: User }) {
  const [fullUser, setFullUser] = useState<User>(user);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/me', { headers: { 'x-user-id': user.id.toString() } })
      .then(res => res.json())
      .then(data => { if (data.id) setFullUser(data); })
      .finally(() => setLoading(false));
  }, [user.id]);

  if (loading) return <PageLoading label="Loading profile..." />;

  const permissions = ROLE_PERMISSIONS[fullUser.role] ?? [];

  return (
    <div className="space-y-8">
      <header className="mb-6">
        <h2 className="text-3xl font-display font-bold text-text-primary mb-2">Profile</h2>
        <p className="text-text-secondary">Your account details and access permissions. Click any allowed permission to navigate.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1 glass-card p-6 flex flex-col items-center text-center gap-4">
          <div className={`w-24 h-24 rounded-full bg-gradient-to-tr ${ROLE_COLORS[fullUser.role]} p-[3px] shadow-xl`}>
            <div className="w-full h-full rounded-full bg-bg-primary flex items-center justify-center text-text-primary font-display font-bold text-3xl">
              {fullUser.name[0]}
            </div>
          </div>
          <div>
            <h3 className="text-xl font-display font-bold text-text-primary">{fullUser.name}</h3>
            <p className="text-text-secondary text-sm font-medium mt-1">{fullUser.email}</p>
          </div>
          <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold border ${ROLE_BADGE[fullUser.role]}`}>
            <Shield className="w-4 h-4" /> {fullUser.role}
          </span>
          <div className={`w-full mt-2 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border ${fullUser.status === 'active' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-slate-500/10 border-slate-500/20 text-slate-400'}`}>
            <CheckCircle className="w-3.5 h-3.5" />
            Account {fullUser.status}
          </div>
        </div>

        {/* Account Details */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-card p-6">
            <h3 className="text-base font-bold text-text-primary mb-5 flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-brand-500" /> Account Details
            </h3>
            <div className="space-y-4">
              <DetailRow icon={<UserIcon className="w-4 h-4" />} label="Full Name" value={fullUser.name} />
              <DetailRow icon={<Mail className="w-4 h-4" />} label="Email Address" value={fullUser.email} />
              <DetailRow icon={<Shield className="w-4 h-4" />} label="System Role" value={fullUser.role} />
              <DetailRow icon={<CheckCircle className="w-4 h-4" />} label="Account Status" value={fullUser.status.charAt(0).toUpperCase() + fullUser.status.slice(1)} />
              <DetailRow icon={<Lock className="w-4 h-4" />} label="Auth Method" value="Mock Header (x-user-id)" />
              <DetailRow icon={<Calendar className="w-4 h-4" />} label="User ID" value={`#${fullUser.id}`} />
            </div>
          </div>
        </div>
      </div>

      {/* Permissions — Clickable */}
      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-border-primary/50 bg-bg-secondary/30">
          <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
            <Lock className="w-5 h-5 text-brand-500" /> Role Permissions — {fullUser.role}
          </h3>
          <p className="text-xs text-text-secondary mt-1">Green items are clickable and will navigate to that feature.</p>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {permissions.map(p => (
            p.allowed && p.route ? (
              <button
                key={p.label}
                onClick={() => navigate(p.route!)}
                className="flex items-center gap-3 p-3 rounded-xl border bg-emerald-500/5 border-emerald-500/20 hover:bg-emerald-500/15 hover:border-emerald-500/40 hover:shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all duration-200 cursor-pointer text-left group"
              >
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 bg-emerald-500/20 group-hover:bg-emerald-500/30 transition-colors">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <span className="text-sm font-medium text-text-primary flex-1">{p.label}</span>
                <ExternalLink className="w-3.5 h-3.5 text-emerald-400/50 group-hover:text-emerald-400 transition-colors shrink-0" />
              </button>
            ) : (
              <button
                key={p.label}
                onClick={() => navigate('/help')}
                className="flex items-center gap-3 p-3 rounded-xl border bg-bg-primary/30 border-border-primary/30 opacity-70 hover:opacity-100 hover:border-slate-600 transition-all text-left cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 bg-slate-500/20">
                  <Ban className="w-3.5 h-3.5 text-slate-500" />
                </div>
                <span className="text-sm font-medium text-text-secondary flex-1">{p.label} (See Glossary)</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500/50 shrink-0" />
              </button>
            )
          ))}
        </div>
      </div>

      {/* Saved Scenarios Quick Links for Analyst */}
      {fullUser.role === 'Analyst' && (
        <div className="glass-card p-6 space-y-4">
          <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-brand-500" /> Saved Scenarios &amp; Forecasting Models
          </h3>
          <p className="text-xs text-text-secondary">Quick links to load your forecasting models directly in your workspace.</p>
          <button 
            onClick={() => navigate('/forecast')}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded text-xs font-bold uppercase transition-colors"
          >
            Load forecasting Workspace
          </button>
        </div>
      )}
    </div>
  );
}

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border-primary/30 last:border-0">
      <div className="flex items-center gap-2 text-text-secondary text-sm font-medium">
        {icon}{label}
      </div>
      <span className="text-sm font-bold text-text-primary">{value}</span>
    </div>
  );
}
