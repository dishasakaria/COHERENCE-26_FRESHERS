import React from 'react';

const discConfig = {
  D: { label: 'Dominant', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
  I: { label: 'Influential', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  S: { label: 'Steady', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  C: { label: 'Conscientious', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
};

export default function DiscBadge({ type, showLabel = false, size = 'sm' }) {
  if (!type || !discConfig[type]) return null;
  const cfg = discConfig[type];
  const sizeClass = size === 'lg' ? 'px-3 py-1.5 text-sm' : 'px-2 py-0.5 text-xs';

  return (
    <span className={`inline-flex items-center gap-1 font-semibold rounded-full border ${cfg.color} ${sizeClass}`}>
      {type}
      {showLabel && <span className="font-normal">{cfg.label}</span>}
    </span>
  );
}