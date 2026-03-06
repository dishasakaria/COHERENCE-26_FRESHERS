import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Mail, Search, MessageSquare, FileText, Phone } from 'lucide-react';

const VALUES = { meetingBooked: 500, hotLead: 200, reply: 50, hourSaved: 400 };
const COSTS = { emailGen: 0.05, companyIntel: 0.18, replyClassify: 0.04, proposalGen: 0.50, callScript: 0.17 };

const dailyData = Array.from({ length: 30 }, (_, i) => ({
  day: `${i + 1}`,
  spend: parseFloat(((i + 1) * 4.2 + Math.random() * 2).toFixed(1)),
  value: parseFloat(((i + 1) * 38 + Math.random() * 20).toFixed(1)),
}));

const fmt = (n) => `₹${Number(n).toLocaleString('en-IN')}`;

const aiStats = [
  { icon: Mail, label: 'Emails written and sent', value: 520, prev: 410, color: 'text-indigo-400' },
  { icon: Search, label: 'Companies researched', value: 156, prev: 120, color: 'text-blue-400' },
  { icon: MessageSquare, label: 'Replies analyzed and routed', value: 68, prev: 55, color: 'text-emerald-400' },
  { icon: FileText, label: 'Proposals generated', value: 5, prev: 3, color: 'text-teal-400' },
  { icon: Phone, label: 'Call scripts created', value: 28, prev: 22, color: 'text-amber-400' },
];

export default function ClientROI() {
  const { data: leads = [] } = useQuery({ queryKey: ['leads'], queryFn: () => base44.entities.Lead.list('-created_date', 200) });
  const { data: meetings = [] } = useQuery({ queryKey: ['meetings'], queryFn: () => base44.entities.Meeting.list('-scheduled_date', 50) });

  const emailsSent = 520, repliesReceived = 68;
  const meetingsBooked = meetings.filter(m => ['confirmed', 'pending'].includes(m.status)).length || 14;
  const hotLeads = leads.filter(l => l.stage === 'hot').length || 8;
  const hoursSaved = Math.round((emailsSent * 0.08) + (repliesReceived * 0.25) + (meetingsBooked * 0.5));
  const totalSpend = parseFloat((emailsSent * COSTS.emailGen) + (156 * COSTS.companyIntel) + (repliesReceived * COSTS.replyClassify) + (5 * COSTS.proposalGen) + (28 * COSTS.callScript)).toFixed(2);
  const totalValue = (meetingsBooked * VALUES.meetingBooked) + (hotLeads * VALUES.hotLead) + (repliesReceived * VALUES.reply) + (hoursSaved * VALUES.hourSaved);
  const roiMultiple = (totalValue / Math.max(totalSpend, 1)).toFixed(1);

  const insightCards = [
    { label: 'Cheapest Win', value: '₹3.20', sub: 'Zara Khan · BuildFast', color: 'text-emerald-400' },
    { label: 'Best ROI Channel', value: 'WhatsApp', sub: '₹1.40 cost per reply', color: 'text-teal-400' },
    { label: 'Cost Per Meeting', value: fmt(Math.round(totalSpend / meetingsBooked)), sub: 'vs ₹8,000 agency', color: 'text-indigo-400' },
    { label: 'Hours Saved', value: `${hoursSaved}h`, sub: `${(hoursSaved / 8).toFixed(1)} working days`, color: 'text-amber-400' },
  ];

  return (
    <div className="p-6 space-y-4 overflow-y-auto min-h-screen">
      {/* Banner */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-gradient-to-r from-emerald-950 via-green-900 to-emerald-950 border border-emerald-700/30 px-8 py-5 flex items-center justify-between">
        <div>
          <p className="text-white text-lg font-bold">
            This month your <span className="text-emerald-300">{fmt(totalSpend)}</span> spend delivered{' '}
            <span className="text-emerald-300">{fmt(totalValue)}</span> in value
          </p>
          <p className="text-emerald-400 text-sm mt-0.5 font-medium">{roiMultiple}× return on your AI spend</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-5xl font-black text-emerald-300">{roiMultiple}×</p>
          <p className="text-emerald-600 text-xs font-medium mt-0.5">ROI MULTIPLIER</p>
        </div>
      </motion.div>

      {/* Main row */}
      <div className="flex gap-4">
        {/* LEFT — What your AI did (55%) */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-[#111118] border border-[#1e1e2e] rounded-2xl overflow-hidden" style={{ flex: '0 0 55%' }}>
          <div className="px-5 py-3.5 border-b border-[#1e1e2e]">
            <p className="text-sm font-semibold text-white">What your AI did this month</p>
          </div>
          <div className="divide-y divide-[#1e1e2e]">
            {aiStats.map((stat, i) => {
              const pctChange = Math.round(((stat.value - stat.prev) / stat.prev) * 100);
              const barPct = Math.min((stat.value / (stat.value * 1.3)) * 100, 100);
              const prevBarPct = Math.min((stat.prev / (stat.value * 1.3)) * 100, 100);
              return (
                <motion.div key={stat.label} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.06 }}
                  className="px-5 py-4 hover:bg-white/[0.01]">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <stat.icon className={`w-4 h-4 ${stat.color} shrink-0`} />
                      <p className="text-sm text-white">{stat.label}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-lg font-black ${stat.color}`}>{stat.value}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">+{pctChange}%</span>
                    </div>
                  </div>
                  <div className="relative h-1.5 bg-[#1a1a26] rounded-full overflow-hidden">
                    <div className="absolute left-0 top-0 h-full rounded-full bg-[#2a2a3e]" style={{ width: `${prevBarPct}%` }} />
                    <motion.div initial={{ width: 0 }} animate={{ width: `${barPct}%` }} transition={{ delay: 0.3 + i * 0.06, duration: 0.8 }}
                      className={`absolute left-0 top-0 h-full rounded-full`} style={{ background: stat.color.replace('text-', '').includes('indigo') ? '#6366f1' : stat.color.replace('text-', '').includes('blue') ? '#3b82f6' : stat.color.replace('text-', '').includes('emerald') ? '#10b981' : stat.color.replace('text-', '').includes('teal') ? '#14b8a6' : '#f59e0b' }} />
                  </div>
                  <p className="text-[10px] text-slate-600 mt-1">vs last month: +{pctChange}%</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* RIGHT — 4 insight cards + chart (45%) */}
        <div className="flex-1 flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            {insightCards.map((card, i) => (
              <motion.div key={card.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.05 }}
                className="bg-[#111118] border border-[#1e1e2e] rounded-xl p-3.5">
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{card.label}</p>
                <p className={`text-xl font-black ${card.color}`}>{card.value}</p>
                <p className="text-[10px] text-slate-600 mt-0.5">{card.sub}</p>
              </motion.div>
            ))}
          </div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            className="bg-[#111118] border border-[#1e1e2e] rounded-xl p-4 flex-1">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-white">AI Spend vs Value Delivered</p>
              <div className="flex items-center gap-3 text-[10px]">
                <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-red-400 inline-block" /> Spend</span>
                <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-emerald-400 inline-block" /> Value</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={120}>
              <LineChart data={dailyData} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a1a26" />
                <XAxis dataKey="day" tick={{ fill: '#475569', fontSize: 8 }} interval={6} />
                <YAxis tick={{ fill: '#475569', fontSize: 8 }} />
                <Tooltip contentStyle={{ background: '#111118', border: '1px solid #1e1e2e', borderRadius: 8, color: '#e2e8f0', fontSize: 10 }}
                  formatter={(v, n) => [`₹${v}`, n === 'spend' ? 'Spend' : 'Value']} />
                <Line type="monotone" dataKey="spend" stroke="#f87171" strokeWidth={1.5} dot={false} />
                <Line type="monotone" dataKey="value" stroke="#34d399" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </div>
    </div>
  );
}