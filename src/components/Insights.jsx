import React, { useState, useEffect } from 'react';
import { Eye, Search, ThumbsUp, Heart, RefreshCw } from 'lucide-react';

export default function Insights({ user }) {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [feedbacks, setFeedbacks] = useState({});

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = () => {
    setLoading(true);
    fetch('/api/viewer/insights', { headers: { 'x-user-id': user.id.toString() } })
      .then(res => res.json())
      .then(data => setInsights(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleFeedback = (id, type) => {
    // Optimistic feedback update
    setFeedbacks(prev => ({
      ...prev,
      [id]: prev[id] === type ? null : type // toggle feedback
    }));

    fetch(`/api/viewer/insights/${id}/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': user.id.toString()
      },
      body: JSON.stringify({ type })
    }).catch(console.error);
  };

  const filteredInsights = insights.filter(ins => 
    ins.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ins.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64 gap-2">
      <RefreshCw className="w-8 h-8 animate-spin text-brand-500" />
      <p className="text-slate-400 text-sm">Gathering executive insights...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in">
      <header className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Eye className="text-brand-500 w-6 h-6" /> Platform Insights Feed
          </h2>
          <p className="text-slate-400 text-sm">Scrollable timeline of plain-language financial digests and performance summaries.</p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <span className="absolute left-3 top-2.5 text-slate-500">
            <Search className="w-4 h-4" />
          </span>
          <input 
            type="text" 
            placeholder="Search insights..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-[#131b2e] border border-slate-700/50 rounded-lg pl-10 pr-4 py-2 text-white text-sm"
          />
        </div>
      </header>

      {/* Insights List */}
      <div className="space-y-6 max-w-[800px]">
        {filteredInsights.length === 0 ? (
          <div className="text-center py-16 text-slate-500 text-sm">
            No insights match your search query.
          </div>
        ) : (
          filteredInsights.map(ins => {
            const activeFeedback = feedbacks[ins.id];
            return (
              <div key={ins.id} className="bg-[#131b2e] border border-slate-700/50 rounded-xl p-6 space-y-4 hover:border-slate-600 transition-colors">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-white text-base leading-tight">{ins.title}</h3>
                  <span className="text-slate-500 font-mono text-[10px]">{ins.created_at}</span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">{ins.message}</p>
                
                {/* Feedback loop */}
                <div className="flex items-center gap-4 pt-4 border-t border-slate-800/60">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Was this helpful?</span>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleFeedback(ins.id, 'thumbsup')}
                      className={`p-2 rounded-lg flex items-center gap-1.5 transition-colors ${
                        activeFeedback === 'thumbsup' 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : 'bg-slate-800/40 text-slate-400 hover:text-white border border-transparent'
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold">HELPFUL</span>
                    </button>
                    <button 
                      onClick={() => handleFeedback(ins.id, 'heart')}
                      className={`p-2 rounded-lg flex items-center gap-1.5 transition-colors ${
                        activeFeedback === 'heart' 
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                          : 'bg-slate-800/40 text-slate-400 hover:text-white border border-transparent'
                      }`}
                    >
                      <Heart className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold">LOVE IT</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
