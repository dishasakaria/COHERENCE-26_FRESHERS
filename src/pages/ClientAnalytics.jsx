import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Mail, Percent, Users, CalendarCheck, Bot, Activity, Shield, AlertTriangle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useCampaign } from '../components/campaign/CampaignContext';

const funnelData = [
  { stage: 'Sent', value: 847 }, { stage: 'Opened', value: 412 }, { stage: 'Clicked', value: 123 },
  { stage: 'Replied', value: 68 }, { stage: 'Meeting', value: 14 }, { stage: 'Converted', value: 5 },
];

const channelPerf = [
  { name: 'Email', rate: 8.1 }, { name: 'LinkedIn', rate: 17.9 }, { name: 'WhatsApp', rate: 32.6 }, { name: 'SMS', rate: 13.3 }, { name: 'Call', rate: 42.8 },
];

const discPerf = [
  { type: 'D', conv: 18 }, { type: 'I', conv: 24 }, { type: 'S', conv: 12 }, { type: 'C', conv: 14 },
];

const dailyActivity = Array.from({ length: 14 }, (_, i) => ({
  day: `D${i + 1}`, actions: Math.floor(Math.random() * 30) + 15, replies: Math.floor(Math.random() * 8) + 2,
}));

// System monitor data
const hourlyData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`, emails: i >= 8 && i <= 18 ? Math.floor(Math.random() * 45) + 5 : Math.floor(Math.random() * 8),
}));

const systemEvents = [
  { time: '14:32', type: 'safety', label: 'Safety triggered', detail: 'Fatigue threshold hit', lead: 'Lisa Wang', color: 'text-red-400', dot: 'bg-red-500' },
  { time: '14:18', type: 'throttle', label: 'Throttle approached', detail: '48/50 emails this hour', lead: '—', color: 'text-amber-400', dot: 'bg-amber-500' },
  { time: '14:05', type: 'override', label: 'Human override', detail: 'Paused sequence manually', lead: 'Sarah Chen', color: 'text-blue-400', dot: 'bg-blue-500' },
  { time: '13:51', type: 'sequence', label: 'Sequence completed', detail: 'All 5 steps done', lead: 'James Lee', color: 'text-emerald-400', dot: 'bg-emerald-500' },
  { time: '13:44', type: 'queued', label: 'Action queued', detail: 'Outside active hours', lead: 'Chen Wei', color: 'text-slate-400', dot: 'bg-slate-500' },
  { time: '13:22', type: 'safety', label: 'Opt-out detected', detail: '"unsubscribe" in reply', lead: 'Priya Mehta', color: 'text-red-400', dot: 'bg-red-500' },
  { time: '13:10', type: 'sequence', label: 'Hot lead detected', detail: 'Interest score hit 82', lead: 'Alex Kim', color: 'text-emerald-400', dot: 'bg-emerald-500' },
  { time: '12:58', type: 'throttle', label: 'Throttle limit hit', detail: 'AI waited 60s', lead: '—', color: 'text-amber-400', dot: 'bg-amber-500' },
];

export default function ClientAnalytics() {
  const [tab, setTab] = useState('performance');
  const { state } = useCampaign();
  const stats = state?.stats;

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <div className="ml-4 flex gap-1">
          {[
            { key: 'performance', label: '📊 Performance' },
            { key: 'monitor', label: '🔍 System Monitor' },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-colors ${tab === t.key ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-[#1a1a28]'}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {tab === 'performance' && (
        <>
          {/* Row 1 — Stat cards */}
          <div className="grid grid-cols-5 gap-3">
            {[
              { icon: Mail, label: 'Emails Sent', value: stats?.emailsSent || '520', color: 'text-indigo-400' },
              { icon: Percent, label: 'Reply Rate', value: '8.1%', color: 'text-emerald-400' },
              { icon: Users, label: 'Hot Leads', value: stats?.hotLeads || '8', color: 'text-amber-400' },
              { icon: CalendarCheck, label: 'Meetings', value: stats?.meetings || '14', color: 'text-teal-400' },
              { icon: Bot, label: 'AI Decisions', value: stats?.aiDecisions || '342', color: 'text-violet-400' },
            ].map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="bg-[#111118] border border-[#1e1e2e] rounded-xl p-4">
                <s.icon className={`w-4 h-4 ${s.color} mb-2`} />
                <p className="text-xl font-bold text-white">{s.value}</p>
                <p className="text-xs text-slate-500">{s.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Row 2 — 2x2 charts */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-4">
              <p className="text-sm font-bold text-white mb-3">Conversion Funnel</p>
              <div className="flex items-end justify-around h-40">
                {funnelData.map((item, i) => (
                  <div key={item.stage} className="flex flex-col items-center gap-1 flex-1">
                    <span className="text-xs font-bold text-white">{item.value}</span>
                    <motion.div initial={{ height: 0 }} animate={{ height: `${(item.value / funnelData[0].value) * 120}px` }} transition={{ delay: 0.2 + i * 0.1, duration: 0.6 }}
                      className="w-full max-w-[48px] rounded-t-md bg-gradient-to-t from-indigo-600 to-violet-500" style={{ minHeight: 4 }} />
                    <span className="text-[9px] text-slate-500 text-center">{item.stage}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-4">
              <p className="text-sm font-bold text-white mb-3">Channel Performance (Reply %)</p>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={channelPerf}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
                  <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 10 }} />
                  <Tooltip contentStyle={{ background: '#12121a', border: '1px solid #1e1e2e', borderRadius: 8, color: '#e2e8f0' }} />
                  <Bar dataKey="rate" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-4">
              <p className="text-sm font-bold text-white mb-3">Daily Activity</p>
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={dailyActivity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
                  <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 10 }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 10 }} />
                  <Tooltip contentStyle={{ background: '#12121a', border: '1px solid #1e1e2e', borderRadius: 8, color: '#e2e8f0' }} />
                  <Line type="monotone" dataKey="actions" stroke="#6366f1" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="replies" stroke="#10b981" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-4">
              <p className="text-sm font-bold text-white mb-3">DISC Performance</p>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={discPerf}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
                  <XAxis dataKey="type" tick={{ fill: '#64748b', fontSize: 10 }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 10 }} />
                  <Tooltip contentStyle={{ background: '#12121a', border: '1px solid #1e1e2e', borderRadius: 8, color: '#e2e8f0' }} />
                  <Bar dataKey="conv" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Conversions" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

      {tab === 'monitor' && (
        <>
          {/* Row 1 — 4 status cards */}
          <div className="grid grid-cols-4 gap-4">
            {/* AI Engine */}
            <div className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Bot className="w-4 h-4 text-emerald-400" />
                <p className="text-xs font-semibold text-white">AI Engine</p>
              </div>
              <div className="flex items-center gap-1.5 mb-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 pulse-green" />
                <span className="text-sm font-bold text-emerald-400">Running</span>
              </div>
              <p className="text-[11px] text-slate-500">Processing 12 leads | 8 actions in queue</p>
              <Link to={createPageUrl('ClientLiveFeed')} className="text-[10px] text-indigo-400 hover:text-indigo-300 mt-2 block">View Queue →</Link>
            </div>

            {/* Send Rate */}
            <div className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Activity className="w-4 h-4 text-indigo-400" />
                <p className="text-xs font-semibold text-white">Send Rate</p>
              </div>
              <p className="text-sm font-bold text-white mb-1">32 / 50 this hour</p>
              <div className="w-full h-2 bg-[#1a1a26] rounded-full overflow-hidden mb-1">
                <div className="h-full rounded-full bg-emerald-500" style={{ width: '64%' }} />
              </div>
              <p className="text-[10px] text-slate-500">Throttle limit: 50/hr</p>
            </div>

            {/* Safety Triggers */}
            <div className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-4 h-4 text-red-400" />
                <p className="text-xs font-semibold text-white">Safety Triggers</p>
              </div>
              <div className="space-y-1.5">
                {[
                  { label: 'Auto-pauses today', value: 3, color: 'text-red-400' },
                  { label: 'DNC blocks today', value: 1, color: 'text-amber-400' },
                  { label: 'Opt-out detections', value: 2, color: 'text-orange-400' },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">{item.label}</span>
                    <span className={`text-sm font-bold ${item.color}`}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Human Interventions */}
            <div className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <p className="text-xs font-semibold text-white">Human Interventions</p>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">Pending approvals</span>
                  <span className="text-sm font-bold text-red-400">3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">Overrides today</span>
                  <span className="text-sm font-bold text-white">2</span>
                </div>
              </div>
              <Link to={createPageUrl('ClientIntervention')} className="text-[10px] text-indigo-400 hover:text-indigo-300 mt-2 block">Go to Interventions →</Link>
            </div>
          </div>

          {/* Row 2 — Activity Timeline */}
          <div className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-5">
            <p className="text-sm font-bold text-white mb-4">Activity Timeline — Last 24 Hours</p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
                <XAxis dataKey="hour" tick={{ fill: '#64748b', fontSize: 9 }} interval={2} />
                <YAxis tick={{ fill: '#64748b', fontSize: 9 }} domain={[0, 60]} />
                <Tooltip contentStyle={{ background: '#12121a', border: '1px solid #1e1e2e', borderRadius: 8, color: '#e2e8f0', fontSize: 11 }} />
                <ReferenceLine y={50} stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'Limit 50', fill: '#ef4444', fontSize: 9, position: 'right' }} />
                <Bar dataKey="emails" fill="#6366f1" radius={[2, 2, 0, 0]} name="Emails sent" />
              </BarChart>
            </ResponsiveContainer>

            {/* Events table */}
            <div className="mt-4">
              <p className="text-xs font-semibold text-white mb-2">Recent System Events</p>
              <div className="overflow-y-auto max-h-48 space-y-0 divide-y divide-[#1a1a26]">
                {systemEvents.map((ev, i) => (
                  <div key={i} className="flex items-center gap-3 py-2">
                    <span className="text-[10px] text-slate-600 w-10 shrink-0">{ev.time}</span>
                    <div className={`w-1.5 h-1.5 rounded-full ${ev.dot} shrink-0`} />
                    <span className={`text-[11px] font-medium w-36 shrink-0 ${ev.color}`}>{ev.label}</span>
                    <span className="text-[11px] text-slate-400 flex-1">{ev.detail}</span>
                    <span className="text-[10px] text-slate-600 shrink-0">{ev.lead}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}