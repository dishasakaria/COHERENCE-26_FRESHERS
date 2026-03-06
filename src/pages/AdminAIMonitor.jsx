import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Flag, AlertTriangle, Filter, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ChannelIcon from '../components/ui-custom/ChannelIcon';

const mockActions = [
  { id: 1, time: 'Just now', company: 'Acme Corp', companyColor: 'bg-indigo-500/20 text-indigo-400', lead: 'Rahul Singh', leadCompany: 'Tata Digital', channel: 'email', action: 'Sent follow-up email', reasoning: 'Email opened twice, no reply. Interest score at 42. Time to escalate with value proposition.', outcome: 'Pending', anomaly: false, flagged: false },
  { id: 2, time: '2 min ago', company: 'TechFlow', companyColor: 'bg-emerald-500/20 text-emerald-400', lead: 'Priya Mehta', leadCompany: 'TechCorp', channel: 'whatsapp', action: 'Sent WhatsApp message', reasoning: 'High interest (58), email channel saturated (fatigue 45). WhatsApp preferred for casual company culture.', outcome: null, anomaly: false, flagged: false },
  { id: 3, time: '5 min ago', company: 'ScaleUp Labs', companyColor: 'bg-violet-500/20 text-violet-400', lead: 'James Lee', leadCompany: 'Innovate Inc', channel: 'linkedin', action: 'Sent LinkedIn DM', reasoning: 'Connection accepted yesterday. DISC type I — responded well to personalized, friendly approach.', outcome: 'Reply received — Interested', anomaly: false, flagged: false },
  { id: 4, time: '8 min ago', company: 'Acme Corp', companyColor: 'bg-indigo-500/20 text-indigo-400', lead: 'Chen Wei', leadCompany: 'ByteForce', channel: 'email', action: 'Sent initial outreach', reasoning: 'New lead added to sequence. DISC type C — sent data-heavy, ROI-focused email.', outcome: null, anomaly: false, flagged: false },
  { id: 5, time: '12 min ago', company: 'BuildFast', companyColor: 'bg-amber-500/20 text-amber-400', lead: 'Maria Santos', leadCompany: 'ConstructPro', channel: 'call', action: 'Scheduled AI voice call', reasoning: 'Interest at 65, trust at 50. Call scheduled during business hours. Previous email replied with questions.', outcome: 'Pending - scheduled 2pm', anomaly: true, flagged: false },
  { id: 6, time: '18 min ago', company: 'InnovateTech', companyColor: 'bg-red-500/20 text-red-400', lead: 'Alex Kim', leadCompany: 'DataDriven', channel: 'sms', action: 'Sent SMS reminder', reasoning: 'Meeting tomorrow, no confirmation. SMS as gentle nudge. Fatigue at 72 — marked as final contact attempt.', outcome: null, anomaly: true, flagged: false },
];

export default function AdminAIMonitor() {
  const [actions, setActions] = useState(mockActions);
  const [channelFilter, setChannelFilter] = useState('all');
  const [companyFilter, setCompanyFilter] = useState('all');

  const filtered = actions.filter(a => {
    const matchChannel = channelFilter === 'all' || a.channel === channelFilter;
    const matchCompany = companyFilter === 'all' || a.company === companyFilter;
    return matchChannel && matchCompany;
  });

  const toggleFlag = (id) => {
    setActions(prev => prev.map(a => a.id === id ? { ...a, flagged: !a.flagged } : a));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">AI Activity Monitor</h1>
          <p className="text-slate-400 text-sm mt-1">Live feed of all AI actions across clients</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <Bot className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-xs font-medium text-emerald-400">AI Processing</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Select value={channelFilter} onValueChange={setChannelFilter}>
          <SelectTrigger className="w-36 bg-[#12121a] border-[#1e1e2e] text-slate-300">
            <SelectValue placeholder="Channel" />
          </SelectTrigger>
          <SelectContent className="bg-[#12121a] border-[#1e1e2e]">
            <SelectItem value="all">All Channels</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="linkedin">LinkedIn</SelectItem>
            <SelectItem value="whatsapp">WhatsApp</SelectItem>
            <SelectItem value="sms">SMS</SelectItem>
            <SelectItem value="call">Call</SelectItem>
          </SelectContent>
        </Select>
        <Select value={companyFilter} onValueChange={setCompanyFilter}>
          <SelectTrigger className="w-40 bg-[#12121a] border-[#1e1e2e] text-slate-300">
            <SelectValue placeholder="Company" />
          </SelectTrigger>
          <SelectContent className="bg-[#12121a] border-[#1e1e2e]">
            <SelectItem value="all">All Companies</SelectItem>
            <SelectItem value="Acme Corp">Acme Corp</SelectItem>
            <SelectItem value="TechFlow">TechFlow</SelectItem>
            <SelectItem value="ScaleUp Labs">ScaleUp Labs</SelectItem>
            <SelectItem value="BuildFast">BuildFast</SelectItem>
            <SelectItem value="InnovateTech">InnovateTech</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {filtered.map((action, i) => (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`glass-card p-4 ${action.anomaly ? 'border-amber-500/30 bg-amber-500/5' : ''} ${action.flagged ? 'border-red-500/30' : ''}`}
            >
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center gap-1 pt-1">
                  <ChannelIcon channel={action.channel} showBg />
                  <span className="text-[10px] text-slate-500">{action.time}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${action.companyColor}`}>{action.company}</span>
                    <span className="text-sm font-medium text-white">{action.lead}</span>
                    <span className="text-xs text-slate-500">at {action.leadCompany}</span>
                    {action.anomaly && <span className="text-amber-400 text-xs flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Anomaly</span>}
                  </div>
                  <p className="text-sm text-slate-300 mb-2">{action.action}</p>
                  <p className="text-xs text-slate-500 leading-relaxed">{action.reasoning}</p>
                  {action.outcome && <p className="text-xs text-emerald-400 mt-1">Outcome: {action.outcome}</p>}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="ghost" size="sm"
                    className={`${action.flagged ? 'text-red-400' : 'text-slate-500'} hover:text-red-400`}
                    onClick={() => toggleFlag(action.id)}
                  >
                    <Flag className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}