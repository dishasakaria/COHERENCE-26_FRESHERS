import React from 'react';

const discConfig = {
  D: { label: 'Dominant', color: 'bg-red-500/10 text-red-500 border-red-500/20' },
  I: { label: 'Influential', color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' },
  S: { label: 'Steady', color: 'bg-green-500/10 text-green-500 border-green-500/20' },
  C: { label: 'Conscientious', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
};

export default function DiscBadge({ type, showLabel = false, size = 'sm' }) {
  if (!type || !discConfig[type]) return null;
  const cfg = discConfig[type];
  const sizeClass = size === 'lg' ? 'px-2.5 py-1 text-sm' : 'w-5 h-5 text-[10px] flex items-center justify-center';

  return (
    <div className="relative group shrink-0 inline-flex">
      <span className={`font-bold rounded-md border ${cfg.color} ${sizeClass} cursor-help`}>
        {type}
        {showLabel && <span className="ml-1 font-normal hidden sm:inline">{cfg.label}</span>}
      </span>
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1.5 rounded-lg bg-[#1a1a28] border border-[#2a2a3e] text-[9px] leading-tight text-slate-300 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
        DISC Personality Type used for outreach personalization.
      </div>
    </div>
  );
}