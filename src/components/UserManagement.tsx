import React, { useState, useEffect, useCallback } from 'react';
import { UserPlus, Shield, CheckCircle, XCircle, AlertCircle, RefreshCw, Trash2, Edit2, X } from 'lucide-react';
import { User } from '../types';

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', role: 'Viewer' as User['role'], status: 'active' as User['status'] });
  const [showLogsDrawer, setShowLogsDrawer] = useState(false);
  const [impersonationLogs, setImpersonationLogs] = useState<any[]>([]);

  const adminId = localStorage.getItem('userId') || '';

  const handleForceReset = (id: number) => {
    alert(`Mock password reset flow triggered. User ID ${id} session invalidated.`);
  };

  useEffect(() => {
    if (showLogsDrawer) {
      fetch('/api/admin/impersonation-logs', { headers: { 'x-user-id': adminId } })
        .then(res => res.json())
        .then(setImpersonationLogs)
        .catch(console.error);
    }
  }, [showLogsDrawer, adminId]);

  const fetchUsers = useCallback(() => {
    setLoading(true);
    setError(null);
    fetch('/api/users', { headers: { 'x-user-id': adminId } })
      .then(res => { if (!res.ok) throw new Error(`Error ${res.status}`); return res.json(); })
      .then(data => setUsers(Array.isArray(data) ? data : []))
      .catch(err => setError(err.message || 'Failed to load users'))
      .finally(() => setLoading(false));
  }, [adminId]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const resetForm = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', role: 'Viewer', status: 'active' });
    setShowModal(false);
  };

  const openEdit = (u: User) => {
    setEditingUser(u);
    setFormData({ name: u.name, email: u.email, role: u.role, status: u.status });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isEdit = !!editingUser;
    const url = isEdit ? `/api/users/${editingUser!.id}` : '/api/users';
    const method = isEdit ? 'PUT' : 'POST';
    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', 'x-user-id': adminId },
      body: JSON.stringify(formData)
    }).then(res => {
      if (res.ok) { resetForm(); fetchUsers(); }
      else res.json().then(d => alert(d.error || 'Operation failed')).catch(() => alert('Operation failed'));
    });
  };

  const handleDelete = (id: number) => {
    if (!confirm('Delete this user? This cannot be undone.')) return;
    fetch(`/api/users/${id}`, { method: 'DELETE', headers: { 'x-user-id': adminId } })
      .then(res => { if (res.ok) fetchUsers(); else alert('Delete failed'); });
  };

  const roleColors: Record<string, string> = {
    Admin: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    Analyst: 'text-brand-400 bg-brand-500/10 border-brand-500/20',
    Viewer: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-display font-bold text-text-primary mb-2">User Management</h2>
          <p className="text-text-secondary font-medium">Create, edit and manage system users and their roles.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowLogsDrawer(true)}
            className="flex items-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white rounded-xl font-medium transition-all">
            Impersonation History
          </button>
          <button onClick={() => { resetForm(); setShowModal(true); }}
            className="flex items-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-xl font-medium hover:bg-brand-500 hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all">
            <UserPlus className="w-5 h-5" /> Add User
          </button>
        </div>
      </header>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-bg-primary/50">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-primary/30">
              {loading ? (
                <tr><td colSpan={4} className="px-6 py-12 text-center">
                  <div className="flex items-center justify-center gap-3 text-text-secondary">
                    <div className="w-5 h-5 rounded-full border-2 border-brand-500/30 border-t-brand-500 animate-spin" />
                    Loading users...
                  </div>
                </td></tr>
              ) : error ? (
                <tr><td colSpan={4} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <AlertCircle className="w-8 h-8 text-rose-400" />
                    <p className="text-rose-400 text-sm font-medium">{error}</p>
                    <button onClick={fetchUsers} className="flex items-center gap-2 text-sm text-brand-500 font-bold">
                      <RefreshCw className="w-4 h-4" /> Retry
                    </button>
                  </div>
                </td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-text-secondary">No users found.</td></tr>
              ) : (
                users.map(u => (
                  <tr key={u.id} className="hover:bg-bg-primary/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-500 to-purple-500 p-[2px]">
                          <div className="w-full h-full rounded-full bg-bg-primary flex items-center justify-center text-text-primary font-bold text-sm">{u.name[0]}</div>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-text-primary">{u.name}</p>
                          <p className="text-xs text-text-secondary">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${roleColors[u.role] || ''}`}>
                        <Shield className="w-3 h-3" />{u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${u.status === 'active' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-slate-500/10 border-slate-500/20 text-slate-400'}`}>
                        {u.status === 'active' ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        {u.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button onClick={() => handleForceReset(u.id)} className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-rose-450 bg-rose-500/5 hover:bg-rose-500/15 border border-rose-500/20 rounded transition-all">Force Reset</button>
                      <button onClick={() => openEdit(u)} className="p-1.5 text-text-secondary hover:text-brand-500 hover:bg-brand-500/10 rounded-lg transition-all"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(u.id)} className="p-1.5 text-text-secondary hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Permissions Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { role: 'Admin', color: 'indigo', perms: ['Full CRUD on transactions', 'User management', 'All dashboard data', 'Delete & edit records'] },
          { role: 'Analyst', color: 'brand', perms: ['View all transactions', 'Access dashboard summary', 'Filter & search records', 'No write access'] },
          { role: 'Viewer', color: 'purple', perms: ['View dashboard overview', 'View transactions list', 'Read-only access', 'No modifications allowed'] },
        ].map(({ role, color, perms }) => (
          <div key={role} className="glass-card p-5">
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border mb-4 text-${color}-400 bg-${color}-500/10 border-${color}-500/20`}>
              <Shield className="w-3.5 h-3.5" />{role}
            </div>
            <ul className="space-y-2">
              {perms.map(p => (
                <li key={p} className="flex items-center gap-2 text-xs text-text-secondary font-medium">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />{p}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-bg-primary/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-card w-full max-w-md border border-border-primary">
            <div className="p-6 border-b border-border-primary/50 flex items-center justify-between">
              <h3 className="text-xl font-display font-bold text-text-primary">{editingUser ? 'Edit User' : 'Add New User'}</h3>
              <button onClick={resetForm} className="text-text-secondary hover:text-text-primary"><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-text-secondary mb-1.5">Full Name</label>
                <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 glass-input font-medium" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-bold text-text-secondary mb-1.5">Email Address</label>
                <input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2.5 glass-input font-medium" placeholder="john@example.com" />
              </div>
              <div>
                <label className="block text-sm font-bold text-text-secondary mb-1.5">Role</label>
                <select value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value as User['role'] })}
                  className="w-full p-2.5 glass-input appearance-none bg-bg-secondary/40 text-text-primary font-medium">
                  <option value="Viewer">Viewer — Read only</option>
                  <option value="Analyst">Analyst — View & insights</option>
                  <option value="Admin">Admin — Full access</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-text-secondary mb-1.5">Status</label>
                <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value as User['status'] })}
                  className="w-full p-2.5 glass-input appearance-none bg-bg-secondary/40 text-text-primary font-medium">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={resetForm}
                  className="flex-1 px-4 py-2.5 text-text-secondary bg-bg-secondary hover:bg-bg-primary border border-border-primary rounded-xl font-bold transition-colors">Cancel</button>
                <button type="submit"
                  className="flex-1 px-4 py-2.5 text-white bg-brand-600 hover:bg-brand-500 rounded-xl font-bold transition-colors shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                  {editingUser ? 'Update User' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showLogsDrawer && (
        <div className="fixed inset-0 bg-bg-primary/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="glass-card w-full max-w-lg border border-border-primary p-6 space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
              <h3 className="text-xl font-display font-bold text-text-primary">Impersonation Logs</h3>
              <button onClick={() => setShowLogsDrawer(false)} className="text-text-secondary hover:text-text-primary"><X className="w-6 h-6" /></button>
            </div>
            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 divide-y divide-slate-800">
              {impersonationLogs.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-4">No view-as logs recorded yet.</p>
              ) : (
                impersonationLogs.map(log => (
                  <div key={log.id} className="py-3 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-white">{log.adminName}</span>
                      <span className="text-slate-400"> impersonated </span>
                      <span className="font-bold text-brand-400">{log.targetName}</span>
                    </div>
                    <span className="text-slate-500 font-mono">{new Date(log.created_at).toLocaleString()}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
