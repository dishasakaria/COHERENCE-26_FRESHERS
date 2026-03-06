import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Brain, ChevronDown, ChevronUp, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ChannelIcon from '../components/ui-custom/ChannelIcon';
import DiscBadge from '../components/ui-custom/DiscBadge';
import StatCard from '../components/ui-custom/StatCard';

const decisions = [
  { id: 1, time: '2026-03-06 14:32', lead: 'Rahul Singh', company: 'Acme Corp', disc: 'D', decision: 'Send follow-up email', channel: 'email', confidence: 82, reasoning: 'Email opened twice, interest at 42. DISC type D responds to direct, results-oriented messaging. Follow-up with ROI data.', outcome: 'Pending', overridden: false, message: 'Hi Rahul, I wanted to share some quick numbers...' },
  { id: 2, time: '2026-03-06 14:15', lead: 'Priya Mehta', company: 'TechCorp', disc: 'C', decision: 'Send WhatsApp message', channel: 'whatsapp', confidence: 78, reasoning: 'Interest at 58, email saturated (fatigue 45). Company culture is casual. WhatsApp is preferred channel.', outcome: 'Read', overridden: false, message: 'Hey Priya! Quick question about that ROI calculator...' },
  { id: 3, time: '2026-03-06 13:45', lead: 'James Lee', company: 'Innovate Inc', disc: 'I', decision: 'Send LinkedIn DM', channel: 'linkedin', confidence: 91, reasoning: 'Connection accepted. DISC type I — build rapport first. Congratulate on recent funding.', outcome: 'Reply — Interested', overridden: false, message: 'James, congratulations on the Series B!' },
  { id: 4, time: '2026-03-06 12:20', lead: 'Chen Wei', company: 'ByteForce', disc: 'C', decision: 'Wait 2 more days', channel: 'email', confidence: 54, reasoning: 'No engagement yet. Low confidence — could also try LinkedIn. Decided to wait.', outcome: 'N/A', overridden: true, message: '', override_to: 'Changed to LinkedIn connect — human judgment that ByteForce team is active on LinkedIn.' },
  { id: 5, time: '2026-03-06 11:00', lead: 'Maria Santos', company: 'ConstructPro', disc: 'S', decision: 'Schedule AI voice call', channel: 'call', confidence: 68, reasoning: 'Interest at 65, trust at 50. DISC type S prefers verbal communication. Demo call scheduled.', outcome: 'Pending — scheduled 2pm', overridden: false, message: 'Prepared call script with focus on team collaboration benefits...' },
];

export default function ClientAILog() {
  const [search, setSearch] = useState('');
  const [channelFilter, setChannelFilter] = useState('all');
  const [expanded, setExpanded] = useState(null);

  const filtered = decisions.filter(d => {
    const matchSearch = !search || d.lead.toLowerCase().includes(search.toLowerCase());
    const matchChannel = channelFilter === 'all' || d.channel === channelFilter;
    return matchSearch && matchChannel;
  });

  const totalDecisions = decisions.length;
  const overridden = decisions.filter(d => d.overridden).length;
  const avgConfidence = Math.round(decisions.reduce((s, d) => s + d.confidence, 0) / decisions.length);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">AI Decision Log</h1>
        <p className="text-slate-400 text-sm mt-1">Complete audit trail of every AI decision</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Brain} label="Total Decisions" value={totalDecisions} color="purple" delay={0} />
        <StatCard icon={User} label="Overridden" value={overridden} color="yellow" delay={0.05} />
        <StatCard label="Override Success" value="67%" color="green" delay={0.1} />
        <StatCard label="Avg Confidence" value={`${avgConfidence}%`} color="blue" delay={0.15} />
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input placeholder="Search by lead..." value={search} onChange={e => setSearch(e.target.value)}
            className="pl-9 bg-[#12121a] border-[#1e1e2e] text-white placeholder:text-slate-500" />
        </div>
        <Select value={channelFilter} onValueChange={setChannelFilter}>
          <SelectTrigger className="w-36 bg-[#12121a] border-[#1e1e2e] text-slate-300">
            <SelectValue placeholder="Channel" />
          </SelectTrigger>
          <SelectContent className="bg-[#12121a] border-[#1e1e2e]">
            <SelectItem value="all">All Channels</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="linkedin">LinkedIn</SelectItem>
            <SelectItem value="whatsapp">WhatsApp</SelectItem>
            <SelectItem value="call">Call</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        {filtered.map((d, i) => (
          <motion.div key={d.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
            className={`glass-card overflow-hidden ${d.overridden ? 'border-amber-500/20' : ''}`}
          >
            <div className="p-4 cursor-pointer" onClick={() => setExpanded(expanded === d.id ? null : d.id)}>
              <div className="flex items-center gap-4">
                <ChannelIcon channel={d.channel} showBg />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-white">{d.lead}</span>
                    <span className="text-xs text-slate-500">{d.company}</span>
                    <DiscBadge type={d.disc} />
                    {d.overridden && <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1"><User className="w-2.5 h-2.5" />Overridden</span>}
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">{d.decision}</p>
                </div>
                <div className="text-right shrink-0">
                  <div className={`text-sm font-bold ${d.confidence >= 70 ? 'text-emerald-400' : d.confidence >= 50 ? 'text-amber-400' : 'text-red-400'}`}>{d.confidence}%</div>
                  <p className="text-[10px] text-slate-500">{d.time.split(' ')[1]}</p>
                </div>
                {expanded === d.id ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
              </div>
            </div>

            <AnimatePresence>
              {expanded === d.id && (
                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                  <div className="px-4 pb-4 space-y-3 border-t border-[#1e1e2e] pt-3">
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase font-medium mb-1">AI Reasoning</p>
                      <p className="text-xs text-slate-300">{d.reasoning}</p>
                    </div>
                    {d.message && (
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase font-medium mb-1">Message</p>
                        <p className="text-xs text-slate-300 italic p-2 rounded bg-[#0a0a0f]">"{d.message}"</p>
                      </div>
                    )}
                    {d.outcome && (
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase font-medium mb-1">Outcome</p>
                        <p className="text-xs text-emerald-400">{d.outcome}</p>
                      </div>
                    )}
                    {d.overridden && d.override_to && (
                      <div className="p-2 rounded bg-amber-500/5 border border-amber-500/10">
                        <p className="text-[10px] text-amber-400 uppercase font-medium mb-1">Human Override</p>
                        <p className="text-xs text-slate-300">{d.override_to}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}