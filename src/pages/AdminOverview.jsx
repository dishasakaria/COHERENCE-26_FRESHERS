import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Users, Mail, CalendarCheck, TrendingUp, Server, Eye, AlertTriangle, CreditCard, Flame } from 'lucide-react';
import StatCard from '../components/ui-custom/StatCard';

const mockCompanies = [
  { id: '1', name: 'Acme Corp', plan: 'enterprise', status: 'active', health_score: 92, leads: 342, sequences: 5, hot_leads: 18, meetings_week: 4, ai_status: 'AI Running — 3 actions in last hour', flags: [] },
  { id: '2', name: 'TechFlow', plan: 'growth', status: 'active', health_score: 78, leads: 156, sequences: 3, hot_leads: 7, meetings_week: 2, ai_status: 'AI Running — 1 action in last hour', flags: ['payment_due'] },
  { id: '3', name: 'BuildFast', plan: 'starter', status: 'onboarding', health_score: 45, leads: 23, sequences: 1, hot_leads: 0, meetings_week: 0, ai_status: 'Idle', flags: ['no_activity'] },
  { id: '4', name: 'ScaleUp Labs', plan: 'enterprise', status: 'active', health_score: 88, leads: 567, sequences: 8, hot_leads: 34, meetings_week: 7, ai_status: 'AI Running — 5 actions in last hour', flags: [] },
  { id: '5', name: 'InnovateTech', plan: 'growth', status: 'paused', health_score: 32, leads: 89, sequences: 0, hot_leads: 2, meetings_week: 0, ai_status: 'Paused', flags: ['fatigue_high'] },
  { id: '6', name: 'StartupXYZ', plan: 'starter', status: 'active', health_score: 65, leads: 45, sequences: 2, hot_leads: 3, meetings_week: 1, ai_status: 'AI Running — idle', flags: [] },
];

const tickerEvents = [
  'Acme Corp: Email sent to Rahul Singh',
  'TechFlow: Hot lead detected — Priya Mehta',
  'BuildFast: Meeting confirmed with Zara Khan',
  'ScaleUp Labs: LinkedIn DM sent to James Lee',
  'Acme Corp: Reply received from Sarah Chen — Interested',
  'InnovateTech: Lead paused — fatigue threshold reached',
];

const planColors = {
  starter: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  growth: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
  enterprise: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
};

const statusColors = {
  active: 'bg-emerald-500',
  paused: 'bg-amber-500',
  onboarding: 'bg-blue-500',
  churned: 'bg-red-500',
};

export default function AdminOverview() {
  const navigate = useNavigate();

  const healthColor = (score) => {
    if (score >= 70) return 'text-emerald-400';
    if (score >= 40) return 'text-amber-400';
    return 'text-red-400';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Platform Overview</h1>
          <p className="text-slate-400 text-sm mt-1">Real-time status across all client companies</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <div className="w-2 h-2 rounded-full bg-emerald-500 pulse-green" />
          <span className="text-xs font-medium text-emerald-400">All Systems Live</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard icon={Building2} label="Client Companies" value="6" color="blue" delay={0} />
        <StatCard icon={Users} label="Active Leads" value="1,222" color="green" delay={0.05} />
        <StatCard icon={Mail} label="Emails Today" value="847" color="purple" delay={0.1} />
        <StatCard icon={CalendarCheck} label="Meetings Booked" value="14" color="teal" delay={0.15} />
        <StatCard icon={TrendingUp} label="Conversions (Mo)" value="38" color="yellow" delay={0.2} />
        <StatCard icon={Server} label="Uptime" value="99.97%" color="green" delay={0.25} />
      </div>

      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Company Health Grid</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockCompanies.map((company, i) => (
            <motion.div
              key={company.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card p-5 cursor-pointer hover:border-indigo-500/30"
              onClick={() => navigate(createPageUrl('AdminCompanies'))}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-white font-bold text-sm">
                    {company.name[0]}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{company.name}</h3>
                    <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded-full border ${planColors[company.plan]}`}>
                      {company.plan.charAt(0).toUpperCase() + company.plan.slice(1)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${statusColors[company.status]} ${company.status === 'active' ? 'pulse-green' : ''}`} />
                  <span className="text-xs text-slate-400 capitalize">{company.status}</span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 mb-3">
                <div className="text-center">
                  <p className="text-lg font-bold text-white">{company.leads}</p>
                  <p className="text-[10px] text-slate-500">Leads</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-white">{company.sequences}</p>
                  <p className="text-[10px] text-slate-500">Sequences</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-indigo-400">{company.hot_leads}</p>
                  <p className="text-[10px] text-slate-500">Hot</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-teal-400">{company.meetings_week}</p>
                  <p className="text-[10px] text-slate-500">Meetings</p>
                </div>
              </div>

              <p className="text-xs text-slate-400 mb-3">{company.ai_status}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Health</span>
                  <span className={`text-sm font-bold ${healthColor(company.health_score)}`}>
                    {company.health_score}
                  </span>
                  <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full score-bar ${company.health_score >= 70 ? 'bg-emerald-500' : company.health_score >= 40 ? 'bg-amber-500' : 'bg-red-500'}`}
                      style={{ width: `${company.health_score}%` }}
                    />
                  </div>
                </div>
                <div className="flex gap-1">
                  {company.flags.includes('fatigue_high') && <span title="High fatigue">🔴</span>}
                  {company.flags.includes('no_activity') && <span title="No activity 48hrs">⚠️</span>}
                  {company.flags.includes('payment_due') && <span title="Payment due">💳</span>}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="px-4 py-3 border-b border-[#1e1e2e] flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 pulse-green" />
          <span className="text-xs font-medium text-slate-400">LIVE ACTIVITY TICKER</span>
        </div>
        <div className="overflow-hidden whitespace-nowrap py-3 px-4">
          <div className="ticker-scroll inline-block">
            {tickerEvents.map((event, i) => (
              <span key={i} className="text-sm text-slate-300 mx-8">
                <span className="text-indigo-400">●</span> {event}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}