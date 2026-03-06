import React from 'react';

const STEPS = [
  { n: 1, label: 'Your Startup' },
  { n: 2, label: 'Find Leads' },
  { n: 3, label: 'Review Emails' },
  { n: 4, label: 'Send' },
  { n: 5, label: 'Watch Replies' },
  { n: 6, label: 'Done' },
];

export default function DemoProgressBar({ current }) {
  return (
    <div className="flex items-center gap-0 w-full max-w-2xl mx-auto">
      {STEPS.map((s, i) => (
        <React.Fragment key={s.n}>
          <div className="flex flex-col items-center gap-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
              s.n < current ? 'bg-violet-600 border-violet-600 text-white' :
              s.n === current ? 'bg-violet-600 border-violet-400 text-white shadow-lg shadow-violet-500/30' :
              'bg-[#12121a] border-[#2a2a3e] text-slate-500'
            }`}>{s.n < current ? '✓' : s.n}</div>
            <span className={`text-[10px] font-medium whitespace-nowrap ${s.n === current ? 'text-violet-300' : s.n < current ? 'text-slate-400' : 'text-slate-600'}`}>{s.label}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`flex-1 h-0.5 mb-3 mx-1 transition-all ${s.n < current ? 'bg-violet-600' : 'bg-[#2a2a3e]'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}