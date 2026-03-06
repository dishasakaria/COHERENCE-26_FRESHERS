import React from 'react';

export default function ScoreBar({ label, value = 0, color = 'blue', max = 100 }) {
  const colorMap = {
    blue: 'bg-indigo-500',
    green: 'bg-emerald-500',
    red: 'bg-red-500',
    yellow: 'bg-amber-500',
    purple: 'bg-violet-500',
  };
  const pct = Math.min((value / max) * 100, 100);

  return (
    <div className="flex items-center gap-2">
      {label && <span className="text-xs text-slate-400 w-14 shrink-0">{label}</span>}
      <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full score-bar ${colorMap[color]}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-mono text-slate-300 w-7 text-right">{Math.round(value)}</span>
    </div>
  );
}