import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, Pause, Play, ArrowUpDown, ChevronRight, Mail, Users, Flame, CalendarCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const companies = [
  { id: '1', name: 'Acme Corp', plan: 'enterprise', status: 'active', leads: 342, sequences: 5, emails_sent: 2145, reply_rate: 18.5, hot_leads: 18, meetings: 12, health_score: 92, joined: '2025-06-15', industry: 'SaaS', contact: 'john@acme.com' },
  { id: '2', name: 'TechFlow', plan: 'growth', status: 'active', leads: 156, sequences: 3, emails_sent: 890, reply_rate: 14.2, hot_leads: 7, meetings: 5, health_score: 78, joined: '2025-08-22', industry: 'FinTech', contact: 'sara@techflow.io' },
  { id: '3', name: 'BuildFast', plan: 'starter', status: 'onboarding', leads: 23, sequences: 1, emails_sent: 45, reply_rate: 8.0, hot_leads: 0, meetings: 0, health_score: 45, joined: '2026-02-10', industry: 'Construction', contact: 'mark@buildfast.com' },
  { id: '4', name: 'ScaleUp Labs', plan: 'enterprise', status: 'active', leads: 567, sequences: 8, emails_sent: 4320, reply_rate: 22.1, hot_leads: 34, meetings: 18, health_score: 88, joined: '2025-04-01', industry: 'AI/ML', contact: 'lisa@scaleuplabs.ai' },
  { id: '5', name: 'InnovateTech', plan: 'growth', status: 'paused', leads: 89, sequences: 0, emails_sent: 320, reply_rate: 6.3, hot_leads: 2, meetings: 1, health_score: 32, joined: '2025-11-05', industry: 'HealthTech', contact: 'raj@innovatetech.com' },
  { id: '6', name: 'StartupXYZ', plan: 'starter', status: 'active', leads: 45, sequences: 2, emails_sent: 178, reply_rate: 11.7, hot_leads: 3, meetings: 2, health_score: 65, joined: '2026-01-18', industry: 'EdTech', contact: 'amy@startupxyz.com' },
];

const planColors = {
  starter: 'bg-slate-500/20 text-slate-400',
  growth: 'bg-indigo-500/20 text-indigo-400',
  enterprise: 'bg-violet-500/20 text-violet-400',
};

const statusColors = {
  active: 'text-emerald-400',
  paused: 'text-amber-400',
  onboarding: 'text-blue-400',
  churned: 'text-red-400',
};

export default function AdminCompanies() {
  const [search, setSearch] = useState('');
  const [planFilter, setPlanFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState(null);

  const filtered = companies.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchPlan = planFilter === 'all' || c.plan === planFilter;
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchSearch && matchPlan && matchStatus;
  });

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Companies</h1>
        <p className="text-slate-400 text-sm mt-1">Manage all client companies</p>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input
            placeholder="Search companies..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 bg-[#12121a] border-[#1e1e2e] text-white placeholder:text-slate-500"
          />
        </div>
        <Select value={planFilter} onValueChange={setPlanFilter}>
          <SelectTrigger className="w-32 bg-[#12121a] border-[#1e1e2e] text-slate-300">
            <SelectValue placeholder="Plan" />
          </SelectTrigger>
          <SelectContent className="bg-[#12121a] border-[#1e1e2e]">
            <SelectItem value="all">All Plans</SelectItem>
            <SelectItem value="starter">Starter</SelectItem>
            <SelectItem value="growth">Growth</SelectItem>
            <SelectItem value="enterprise">Enterprise</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-32 bg-[#12121a] border-[#1e1e2e] text-slate-300">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-[#12121a] border-[#1e1e2e]">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
            <SelectItem value="onboarding">Onboarding</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1e1e2e]">
                {['Company', 'Plan', 'Status', 'Leads', 'Sequences', 'Emails', 'Reply %', 'Hot', 'Meetings', 'Health', 'Joined'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <motion.tr
                  key={c.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => setSelected(c)}
                  className="border-b border-[#1e1e2e]/50 hover:bg-white/[0.02] cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-white font-bold text-xs">{c.name[0]}</div>
                      <span className="text-sm font-medium text-white">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${planColors[c.plan]}`}>{c.plan}</span></td>
                  <td className="px-4 py-3"><span className={`text-sm font-medium capitalize ${statusColors[c.status]}`}>{c.status}</span></td>
                  <td className="px-4 py-3 text-sm text-slate-300">{c.leads}</td>
                  <td className="px-4 py-3 text-sm text-slate-300">{c.sequences}</td>
                  <td className="px-4 py-3 text-sm text-slate-300">{c.emails_sent.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-slate-300">{c.reply_rate}%</td>
                  <td className="px-4 py-3 text-sm text-orange-400 font-medium">{c.hot_leads}</td>
                  <td className="px-4 py-3 text-sm text-teal-400">{c.meetings}</td>
                  <td className="px-4 py-3">
                    <span className={`text-sm font-bold ${c.health_score >= 70 ? 'text-emerald-400' : c.health_score >= 40 ? 'text-amber-400' : 'text-red-400'}`}>{c.health_score}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-500">{c.joined}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="w-full max-w-lg bg-[#0c0c14] border-l border-[#1e1e2e] h-full overflow-y-auto p-6"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">{selected.name}</h2>
                <Button variant="ghost" size="icon" onClick={() => setSelected(null)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="glass-card p-4">
                  <h3 className="text-xs font-medium text-slate-500 uppercase mb-3">Company Profile</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div><span className="text-slate-500">Industry:</span> <span className="text-white">{selected.industry}</span></div>
                    <div><span className="text-slate-500">Contact:</span> <span className="text-white">{selected.contact}</span></div>
                    <div><span className="text-slate-500">Plan:</span> <span className={`${planColors[selected.plan]} px-2 py-0.5 rounded-full text-xs`}>{selected.plan}</span></div>
                    <div><span className="text-slate-500">Status:</span> <span className={`${statusColors[selected.status]} capitalize`}>{selected.status}</span></div>
                  </div>
                </div>

                <div className="glass-card p-4">
                  <h3 className="text-xs font-medium text-slate-500 uppercase mb-3">Usage Stats</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-indigo-400" /><div><p className="text-lg font-bold text-white">{selected.emails_sent.toLocaleString()}</p><p className="text-[10px] text-slate-500">Emails Sent</p></div></div>
                    <div className="flex items-center gap-2"><Users className="w-4 h-4 text-emerald-400" /><div><p className="text-lg font-bold text-white">{selected.leads}</p><p className="text-[10px] text-slate-500">Leads</p></div></div>
                    <div className="flex items-center gap-2"><Flame className="w-4 h-4 text-orange-400" /><div><p className="text-lg font-bold text-white">{selected.hot_leads}</p><p className="text-[10px] text-slate-500">Hot Leads</p></div></div>
                    <div className="flex items-center gap-2"><CalendarCheck className="w-4 h-4 text-teal-400" /><div><p className="text-lg font-bold text-white">{selected.meetings}</p><p className="text-[10px] text-slate-500">Meetings</p></div></div>
                  </div>
                </div>

                <div className="flex gap-2 flex-wrap">
                  <Button size="sm" variant="outline" className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10"><Pause className="w-3 h-3 mr-1" /> Pause Account</Button>
                  <Button size="sm" variant="outline" className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"><Play className="w-3 h-3 mr-1" /> Resume</Button>
                  <Button size="sm" variant="outline" className="border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10"><ArrowUpDown className="w-3 h-3 mr-1" /> Change Plan</Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}