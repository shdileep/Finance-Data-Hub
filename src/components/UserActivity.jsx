import React, { useState, useEffect } from 'react';
import { Eye, BarChart2, Clock, ArrowLeft, RefreshCw, Activity, AlertTriangle } from 'lucide-react';

export default function UserActivity({ user, onImpersonate }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [timelineLoading, setTimelineLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    setLoading(true);
    fetch('/api/users', { headers: { 'x-user-id': user.id.toString() } })
      .then(res => res.json())
      .then(data => {
        setUsers(Array.isArray(data) ? data.filter(u => u.id !== user.id) : []);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  const fetchTimeline = (targetUser) => {
    setSelectedUser(targetUser);
    setTimelineLoading(true);
    fetch(`/api/admin/user-activities/${targetUser.id}`, { headers: { 'x-user-id': user.id.toString() } })
      .then(res => res.json())
      .then(setTimeline)
      .catch(console.error)
      .finally(() => setTimelineLoading(false));
  };

  const getLastActiveColor = (role) => {
    if (role === 'Analyst') return 'text-emerald-400';
    return 'text-amber-400';
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64 gap-2">
      <RefreshCw className="w-8 h-8 animate-spin text-brand-500" />
      <p className="text-slate-400 text-sm">Loading activity logs...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in">
      <header className="mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Activity className="text-brand-500 w-6 h-6" /> User Activity &amp; Impersonation Center
        </h2>
        <p className="text-slate-400 text-sm">Monitor user actions, analyze operation timelines, and view pages as a target user.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* User Picker List */}
        <div className="lg:col-span-7 bg-[#131b2e] border border-slate-700/50 rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-bold text-white mb-4">Active System Users</h3>
          <div className="divide-y divide-slate-800">
            {users.map(u => (
              <div key={u.id} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{u.name}</span>
                    <span className="bg-slate-800 text-slate-400 text-[10px] px-2 py-0.5 rounded font-mono uppercase">{u.role}</span>
                  </div>
                  <p className="text-xs text-slate-400">{u.email}</p>
                </div>
                <div className="flex items-center gap-4">
                  {/* Status Indicator */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Last active: <span className="font-semibold text-slate-300">2h ago</span></span>
                  </div>
                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => fetchTimeline(u)}
                      className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors"
                      title="View Activity Timeline"
                    >
                      <BarChart2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => onImpersonate(u)}
                      className="p-2 bg-brand-600/20 hover:bg-brand-600/40 text-brand-400 hover:text-brand-300 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-bold"
                      title="View App As This User"
                    >
                      <Eye className="w-4 h-4" /> View As
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected User Activity Timeline */}
        <div className="lg:col-span-5 bg-[#131b2e] border border-slate-700/50 rounded-xl p-6">
          {selectedUser ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                <div>
                  <h4 className="font-bold text-white">{selectedUser.name}</h4>
                  <p className="text-xs text-slate-400">{selectedUser.role} timeline</p>
                </div>
                <button 
                  onClick={() => setSelectedUser(null)}
                  className="text-xs text-slate-500 hover:text-slate-300 font-bold uppercase"
                >
                  Clear
                </button>
              </div>

              {timelineLoading ? (
                <div className="flex justify-center py-12">
                  <RefreshCw className="w-6 h-6 animate-spin text-brand-500" />
                </div>
              ) : timeline.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-sm">
                  No logged activity found for this user.
                </div>
              ) : (
                <div className="relative border-l border-slate-800 ml-4 space-y-6">
                  {timeline.map(log => (
                    <div key={log.id} className="relative pl-6">
                      <div className="absolute -left-1.5 top-1.5 w-3 h-3 bg-brand-500 rounded-full border-2 border-[#131b2e]" />
                      <div className="flex justify-between text-xs text-slate-400">
                        <span className="font-mono text-brand-400 font-bold uppercase">{log.method}</span>
                        <span>{new Date(log.created_at).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-white text-sm mt-1 font-mono break-all">{log.endpoint}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">IP: {log.ip}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center py-12 text-center text-slate-500">
              <BarChart2 className="w-12 h-12 mb-3 text-slate-600" />
              <p className="text-sm font-semibold">Select a user to display timeline</p>
              <p className="text-xs max-w-xs mt-1">Timeline displays API endpoints accessed, logs, and relative operation triggers.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
