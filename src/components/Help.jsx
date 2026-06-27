import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, MessageCircle } from 'lucide-react';

export default function Help({ user }) {
  const glossary = [
    {
      term: 'Net Balance',
      definition: 'The calculated difference between total income deposits and total expense outflows. A positive net balance indicates a surplus, whereas a negative balance indicates a cash deficit.'
    },
    {
      term: 'Runway',
      definition: 'The estimated length of time (usually in months) that the organization can continue operating at current spending levels without receiving additional funding/income.'
    },
    {
      term: 'Savings Rate',
      definition: 'The percentage of total income that is retained as cash surplus. Calculated by dividing Net Balance by Total Income.'
    },
    {
      term: 'Category Distribution',
      definition: 'The breakdown of transaction amounts across categorized headers (e.g. Rent, Freelance, Groceries) to understand resource allocation trends.'
    }
  ];

  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = (index) => {
    setExpandedIndex(prev => prev === index ? null : index);
  };

  return (
    <div className="space-y-8 animate-in fade-in max-w-[800px]">
      <header className="mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <BookOpen className="text-brand-500 w-6 h-6" /> FAQ &amp; Glossary
        </h2>
        <p className="text-slate-400 text-sm">Plain-language explainer definitions for financial terminologies used across the system.</p>
      </header>

      {/* Accordion list */}
      <div className="bg-[#131b2e] border border-slate-700/50 rounded-xl overflow-hidden divide-y divide-slate-800/80">
        {glossary.map((g, index) => {
          const isExpanded = expandedIndex === index;
          return (
            <div key={g.term} className="transition-colors hover:bg-slate-850/10">
              <button 
                onClick={() => toggleExpand(index)}
                className="w-full px-6 py-5 flex justify-between items-center text-left font-bold text-white text-base select-none"
              >
                <span>{g.term}</span>
                {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
              </button>
              {isExpanded && (
                <div className="px-6 pb-6 text-sm text-slate-300 leading-relaxed animate-in slide-in-from-top-2 duration-200">
                  {g.definition}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Contact Admin Section */}
      <div className="bg-slate-800/20 border border-slate-700/50 rounded-xl p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h4 className="font-bold text-white text-base">Still confused or need custom permissions?</h4>
          <p className="text-slate-400 text-xs mt-1">Send a prefilled compliance message straight to your Admin group.</p>
        </div>
        <a 
          href={`mailto:admin@example.com?subject=FinanceHub%20Support%20Request%20-%20Viewer&body=Hello%20Admin,%20I%20am%20signed%20in%20as%20a%20Viewer%20and%20need%20clarification%20on...`}
          className="bg-brand-600 hover:bg-brand-500 text-white px-5 py-3 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-colors shrink-0"
        >
          <MessageCircle className="w-4 h-4" /> Contact Admin Desk
        </a>
      </div>
    </div>
  );
}
