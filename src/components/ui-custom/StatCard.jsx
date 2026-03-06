import React from 'react';
import { motion } from 'framer-motion';

export default function StatCard({ icon: Icon, label, value, trend, color = 'blue', delay = 0 }) {
  const colorMap = {
    blue: 'from-indigo-500/10 to-indigo-500/5 text-indigo-400 border-indigo-500/20',
    green: 'from-emerald-500/10 to-emerald-500/5 text-emerald-400 border-emerald-500/20',
    red: 'from-red-500/10 to-red-500/5 text-red-400 border-red-500/20',
    yellow: 'from-amber-500/10 to-amber-500/5 text-amber-400 border-amber-500/20',
    purple: 'from-violet-500/10 to-violet-500/5 text-violet-400 border-violet-500/20',
    teal: 'from-teal-500/10 to-teal-500/5 text-teal-400 border-teal-500/20',
  };
  const iconColorMap = {
    blue: 'text-indigo-400', green: 'text-emerald-400', red: 'text-red-400',
    yellow: 'text-amber-400', purple: 'text-violet-400', teal: 'text-teal-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className={`glass-card bg-gradient-to-br ${colorMap[color]} p-5 relative overflow-hidden`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          {trend && <p className="text-xs text-emerald-400 mt-1">{trend}</p>}
        </div>
        {Icon && <Icon className={`w-5 h-5 ${iconColorMap[color]} opacity-60`} />}
      </div>
    </motion.div>
  );
}