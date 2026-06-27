import React, { useState, useEffect } from 'react';
import { Shield, HelpCircle, Edit3, ArrowRight, CheckCircle, RefreshCw, Info } from 'lucide-react';

export default function AccessMap({ user }) {
  const [map, setMap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeCell, setActiveCell] = useState(null);
  const [showRequestForm, setShowRequestForm] = useState(false);
  
  // Form State
  const [reqRole, setReqRole] = useState('Analyst');
  const [reqResource, setReqResource] = useState('Transactions');
  const [reqAccess, setReqAccess] = useState('Full');
  const [reqReason, setReqReason] = useState('');
  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
    fetchMap();
  }, []);

  const fetchMap = () => {
    setLoading(true);
    fetch('/api/admin/access-map', { headers: { 'x-user-id': user.id.toString() } })
      .then(res => res.json())
      .then(setMap)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const getCellExplainText = (role, resource, level) => {
    if (level === 'Full') {
      return `The ${role} role is granted full Read and Write (CRUD) access to ${resource}. Enforced by the server-side authorize('${role}') middleware in server.ts.`;
    }
    if (level === 'Read') {
      return `The ${role} role is granted Read-Only access to ${resource}. Any mutating write queries (POST/PUT/DELETE) will be blocked with 403 Forbidden.`;
    }
    return `Access to ${resource} is completely denied for the ${role} role. Not registered in the route configuration.`;
  };

  const getBadgeClass = (level) => {
    if (level === 'Full') return 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400';
    if (level === 'Read') return 'bg-amber-500/10 border border-amber-500/20 text-amber-400';
    return 'bg-slate-500/10 border border-slate-500/20 text-slate-400';
  };

  const handleSubmitRequest = (e) => {
    e.preventDefault();
    setSubmitStatus('submitting');
    fetch('/api/admin/permission-change-request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': user.id.toString()
      },
      body: JSON.stringify({
        role: reqRole,
        resource: reqResource,
        access_level: reqAccess,
        reason: reqReason
      })
    })
      .then(res => res.json())
      .then(data => {
        setSubmitStatus('success');
        setReqReason('');
        setTimeout(() => {
          setSubmitStatus(null);
          setShowRequestForm(false);
        }, 2000);
      })
      .catch(() => setSubmitStatus('error'));
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64 gap-2">
      <RefreshCw className="w-8 h-8 animate-spin text-brand-500" />
      <p className="text-slate-400 text-sm">Building access mapping...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in">
      <header className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Shield className="text-brand-500 w-6 h-6" /> Data Access Map
          </h2>
          <p className="text-slate-400 text-sm">Audit role-based authorization matrix, inspect middleware policies, and log governance request changes.</p>
        </div>
        <button 
          onClick={() => setShowRequestForm(true)}
          className="bg-brand-600 hover:bg-brand-500 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-bold text-xs uppercase tracking-wider transition-all"
        >
          <Edit3 className="w-4 h-4" /> Request Policy Change
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Permission Grid Matrix */}
        <div className="lg:col-span-8 bg-[#131b2e] border border-slate-700/50 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 border-b border-slate-700 text-xs font-mono tracking-wider text-slate-400 uppercase">
                <th className="p-6">Resource</th>
                <th className="p-6">Admin</th>
                <th className="p-6">Analyst</th>
                <th className="p-6">Viewer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {map.resources.map(resource => (
                <tr key={resource} className="hover:bg-slate-800/20 transition-colors">
                  <td className="p-6 font-bold text-white">{resource}</td>
                  {Object.keys(map.roles).map(role => {
                    const level = map.roles[role][resource] || 'None';
                    return (
                      <td key={role} className="p-6">
                        <button 
                          onClick={() => setActiveCell({ role, resource, level })}
                          className={`px-3 py-1 rounded text-xs font-bold uppercase ${getBadgeClass(level)}`}
                        >
                          {level}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Explain Pane Drawer */}
        <div className="lg:col-span-4 bg-[#131b2e] border border-slate-700/50 rounded-xl p-6 flex flex-col justify-between min-h-[320px]">
          {activeCell ? (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-brand-400 font-mono text-xs pb-4 border-b border-slate-800 uppercase tracking-widest font-bold">
                <Info className="w-4 h-4" /> Policy Explainer
              </div>
              <div>
                <h4 className="text-white text-base font-bold">
                  {activeCell.role} &times; {activeCell.resource}
                </h4>
                <p className="text-slate-400 text-sm mt-3 leading-relaxed">
                  {getCellExplainText(activeCell.role, activeCell.resource, activeCell.level)}
                </p>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 py-12">
              <Shield className="w-12 h-12 mb-3 text-slate-600" />
              <p className="text-sm font-semibold">Select a matrix cell to inspect</p>
              <p className="text-xs max-w-xs mt-1">Click any cell badge on the left to see the security rules explaining that role's authorization mapping.</p>
            </div>
          )}
        </div>
      </div>

      {/* Governance Request Modal */}
      {showRequestForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#131b2e] border border-slate-700 rounded-xl max-w-md w-full p-6 space-y-6 shadow-xl animate-in zoom-in-95">
            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">Governance Change Request</h3>
              <button onClick={() => setShowRequestForm(false)} className="text-slate-400 hover:text-white text-sm">Cancel</button>
            </div>

            {submitStatus === 'success' ? (
              <div className="text-center py-12 space-y-4">
                <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto animate-bounce" />
                <h4 className="text-white font-bold">Governance Request Logged</h4>
                <p className="text-slate-400 text-xs">The change request was logged successfully in the Audit Trail.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitRequest} className="space-y-4">
                <div>
                  <label className="block text-slate-400 text-xs font-semibold mb-2">Role Target</label>
                  <select 
                    value={reqRole} 
                    onChange={e => setReqRole(e.target.value)}
                    className="w-full bg-slate-850 border border-slate-700 rounded px-4 py-2 text-white"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Analyst">Analyst</option>
                    <option value="Viewer">Viewer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 text-xs font-semibold mb-2">Resource Endpoint</label>
                  <select 
                    value={reqResource} 
                    onChange={e => setReqResource(e.target.value)}
                    className="w-full bg-slate-850 border border-slate-700 rounded px-4 py-2 text-white"
                  >
                    {map.resources.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 text-xs font-semibold mb-2">Access Type Target</label>
                  <select 
                    value={reqAccess} 
                    onChange={e => setReqAccess(e.target.value)}
                    className="w-full bg-slate-850 border border-slate-700 rounded px-4 py-2 text-white"
                  >
                    <option value="Full">Full (Read/Write)</option>
                    <option value="Read">Read Only</option>
                    <option value="None">None</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 text-xs font-semibold mb-2">Reasoning &amp; Compliance Justification</label>
                  <textarea 
                    value={reqReason}
                    onChange={e => setReqReason(e.target.value)}
                    placeholder="Enter compliance justification..."
                    required
                    className="w-full bg-slate-850 border border-slate-700 rounded px-4 py-3 text-white h-24"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={submitStatus === 'submitting'}
                  className="w-full bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-bold py-3 rounded text-xs uppercase tracking-widest flex justify-center items-center gap-2"
                >
                  {submitStatus === 'submitting' && <RefreshCw className="w-4 h-4 animate-spin" />}
                  Submit Proposal
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
