import React from 'react';

const stageConfig = {
  new: { label: 'New', color: 'bg-slate-500/20 text-slate-400 border-slate-500/30' },
  in_sequence: { label: 'In Sequence', color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' },
  engaged: { label: 'Engaged', color: 'bg-violet-500/20 text-violet-400 border-violet-500/30' },
  hot: { label: 'Hot 🔥', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  replied: { label: 'Replied', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  meeting_scheduled: { label: 'Meeting 📅', color: 'bg-teal-500/20 text-teal-400 border-teal-500/30' },
  converted: { label: 'Converted', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  nurture: { label: 'Nurture', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
};

export default function StageBadge({ stage }) {
  const cfg = stageConfig[stage] || stageConfig.new;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full border ${cfg.color}`}>
      {cfg.label}
    </span>
  );
}