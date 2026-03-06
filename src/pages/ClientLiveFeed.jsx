import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, Pause, Play, Lock, Bot, ThumbsUp, ThumbsDown, Pencil, SkipForward, StopCircle, Clock, ChevronDown, ChevronUp, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ChannelIcon from '../components/ui-custom/ChannelIcon';
import DiscBadge from '../components/ui-custom/DiscBadge';
import { useCampaign } from '../components/campaign/CampaignContext';

const initialFeed = [
  { id: 1, time: 'Just now', channel: 'email', lead: 'Rahul Singh', company: 'Acme Corp', action: 'Follow-up email sent', message: 'Hi Rahul, I noticed you reviewed our case study on SaaS onboarding efficiency...', reasoning: 'Interest score reached 42, email was opened twice but no reply. Following up with value proposition.', interest: 42, trust: 28, fatigue: 15, node: 'Node 4: Follow-up Email' },
  { id: 2, time: '3m ago', channel: 'whatsapp', lead: 'Priya Mehta', company: 'TechCorp', action: 'WhatsApp message sent', message: 'Hey Priya! Quick question — did you get a chance to look at the ROI calculator I shared?', reasoning: 'Interest at 58, email channel saturated. WhatsApp preferred for casual company culture.', interest: 58, trust: 35, fatigue: 22, node: 'Node 6: WhatsApp' },
  { id: 3, time: '7m ago', channel: 'linkedin', lead: 'James Lee', company: 'Innovate Inc', action: 'LinkedIn DM sent', message: 'James, congratulations on the Series B! Would love to chat about how we help fast-growing teams...', reasoning: 'Connection accepted yesterday. DISC type I — friendly, personalized approach.', interest: 45, trust: 40, fatigue: 10, node: 'Node 3: LinkedIn DM' },
  { id: 4, time: '12m ago', channel: 'email', lead: 'Chen Wei', company: 'ByteForce', action: 'Initial outreach sent', message: 'Hi Chen, I came across ByteForce while researching leaders in enterprise data solutions...', reasoning: 'New lead in sequence. DISC type C — data-heavy, ROI-focused email with specific metrics.', interest: 0, trust: 0, fatigue: 3, node: 'Node 1: Initial Outreach' },
  { id: 5, time: '18m ago', channel: 'call', lead: 'Maria Santos', company: 'ConstructPro', action: 'AI voice call completed', message: 'Prepared call script focusing on team collaboration benefits and scheduling demo.', reasoning: 'Interest at 65, trust at 50. DISC type S prefers verbal communication.', interest: 65, trust: 50, fatigue: 30, node: 'Node 7: AI Call' },
];

const scheduledQueue = [
  { id: 1, lead: 'Rahul Singh', channel: 'email', action: 'Follow-up email #3', time: 'Today, 2:17 PM', delay: '45m' },
  { id: 2, lead: 'Priya Mehta', channel: 'whatsapp', action: 'WhatsApp check-in', time: 'Today, 3:42 PM', delay: '2h 10m' },
  { id: 3, lead: 'James Lee', channel: 'linkedin', action: 'LinkedIn value-add DM', time: 'Today, 4:08 PM', delay: '2h 36m' },
  { id: 4, lead: 'Chen Wei', channel: 'email', action: 'Case study email', time: 'Tomorrow, 9:23 AM', delay: '20h' },
  { id: 5, lead: 'Maria Santos', channel: 'call', action: 'AI voice call', time: 'Tomorrow, 10:47 AM', delay: '21h' },
];

export default function ClientLiveFeed() {
  const [aiStatus, setAiStatus] = useState('active');
  const [expanded, setExpanded] = useState(null);
  const { state } = useCampaign();
  const throttle = state?.throttle;
  const globalFeed = state?.feed || [];

  const countdown = throttle?.nextSendIn ?? 47;
  const emailsThisHour = throttle?.emailsThisHour ?? 32;
  const HOURLY_LIMIT = throttle?.hourlyLimit ?? 50;
  const isNearLimit = emailsThisHour / HOURLY_LIMIT > 0.8;
  const pct = (emailsThisHour / HOURLY_LIMIT) * 100;
  const barColor = pct >= 90 ? 'bg-red-500' : pct >= 70 ? 'bg-amber-500' : 'bg-emerald-500';

  // Merge global feed events with initial feed
  const eventTypeToAction = { email_sent: 'Email sent', email_opened: 'Email opened', reply_received: 'Reply received', ai_decision: 'AI decision made', safety_triggered: 'Safety triggered', hot_lead: 'Hot lead detected', meeting_scheduled: 'Meeting scheduled', throttle_limit: 'Throttle limit hit' };
  const mergedFeed = [...globalFeed.slice(0, 3).map(e => ({
    id: e.id, time: e.time, channel: e.type === 'email_sent' || e.type === 'email_opened' ? 'email' : e.type === 'reply_received' ? 'email' : e.type === 'ai_decision' ? 'email' : 'email',
    lead: e.lead || '', company: '', action: `${eventTypeToAction[e.type] || e.type}`, message: e.detail || '', reasoning: e.detail || '', interest: 0, trust: 0, fatigue: 0, node: '',
  })), ...initialFeed].slice(0, 8);

  return (
    <div className="p-8 space-y-4 h-screen flex flex-col max-h-screen overflow-hidden">
      {/* Status bar */}
      <div className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className={`w-2 h-2 rounded-full ${aiStatus === 'active' ? 'bg-emerald-500 pulse-green' : aiStatus === 'paused' ? 'bg-red-500' : 'bg-amber-500'}`} />
          <span className="text-sm font-medium text-white">
            {aiStatus === 'active' ? 'AI Active — processing 12 leads' : aiStatus === 'paused' ? 'AI Paused' : 'Review Mode — actions queued'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={() => setAiStatus('paused')} className="text-red-400 hover:bg-red-500/10 text-xs h-8">
            <Pause className="w-3.5 h-3.5 mr-1" /> Pause
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setAiStatus('active')} className="text-emerald-400 hover:bg-emerald-500/10 text-xs h-8">
            <Play className="w-3.5 h-3.5 mr-1" /> Resume
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setAiStatus('review')} className="text-amber-400 hover:bg-amber-500/10 text-xs h-8">
            <Lock className="w-3.5 h-3.5 mr-1" /> Review Mode
          </Button>
        </div>
      </div>

      {/* Throttle status bar */}
      <div className={`border rounded-xl px-4 py-2.5 flex items-center gap-4 shrink-0 ${isNearLimit ? 'bg-red-500/10 border-red-500/30' : 'bg-[#111118] border-[#1e1e2e]'}`}>
        <div className="flex items-center gap-2 flex-1">
          <Activity className={`w-3.5 h-3.5 shrink-0 ${isNearLimit ? 'text-red-400' : 'text-slate-400'}`} />
          <span className="text-xs text-slate-400 shrink-0">Send Rate:</span>
          <div className="flex items-center gap-2 flex-1">
            <div className="flex-1 h-2 bg-[#1a1a26] rounded-full overflow-hidden max-w-32">
              <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${pct}%` }} />
            </div>
            <span className={`text-xs font-bold ${isNearLimit ? 'text-red-400' : 'text-white'}`}>{emailsThisHour}/{HOURLY_LIMIT} this hour</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400 border-l border-[#2a2a3e] pl-4">
          <Clock className="w-3 h-3" />
          <span>Next send in: <span className="text-white font-mono font-bold">{countdown}s</span></span>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500 border-l border-[#2a2a3e] pl-4">
          <span>Daily: <span className="text-white">156/200</span></span>
          <span>Week: <span className="text-white">3/5</span> per lead avg</span>
        </div>
      </div>

      <div className="flex gap-6 flex-1 overflow-hidden min-h-0">
        {/* Live Feed */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#0c0c10] border border-[#1e1e2e] rounded-2xl">
          <div className="px-4 py-3 border-b border-[#1e1e2e] flex items-center gap-2 shrink-0">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-amber-500/60" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
            </div>
            <span className="text-xs font-mono text-slate-500 ml-2">ai_activity_log — live stream</span>
            <div className="ml-auto flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 pulse-green" />
              <span className="text-[10px] font-mono text-emerald-500">LIVE</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2 font-mono">
            {mergedFeed.map((item) => (
              <div key={item.id} className="group">
                <button onClick={() => setExpanded(expanded === item.id ? null : item.id)}
                  className="w-full text-left p-3 rounded-lg hover:bg-white/[0.03] transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-slate-600 w-12 shrink-0">{item.time}</span>
                    <ChannelIcon channel={item.channel} />
                    <span className="text-xs text-slate-300 flex-1">{item.action} → <span className="text-white font-medium">{item.lead}</span></span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1 rounded hover:bg-white/10"><Pencil className="w-3 h-3 text-slate-500" /></button>
                      <button className="p-1 rounded hover:bg-white/10"><SkipForward className="w-3 h-3 text-slate-500" /></button>
                      <button className="p-1 rounded hover:bg-red-500/10"><StopCircle className="w-3 h-3 text-red-500/70" /></button>
                    </div>
                    {expanded === item.id ? <ChevronUp className="w-3 h-3 text-slate-600 shrink-0" /> : <ChevronDown className="w-3 h-3 text-slate-600 shrink-0" />}
                  </div>
                </button>
                <AnimatePresence>
                  {expanded === item.id && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="ml-16 mr-2 mb-2 p-3 rounded-lg bg-[#0a0a0e] border border-[#1e1e2e]">
                        <p className="text-[11px] text-slate-400 mb-2 italic">"{item.message}"</p>
                        <p className="text-[10px] text-violet-400 mb-1.5"><Bot className="w-2.5 h-2.5 inline mr-1" />{item.reasoning}</p>
                        <div className="flex gap-3 text-[10px]">
                          <span className="text-indigo-400">Interest: {item.interest}</span>
                          <span className="text-emerald-400">Trust: {item.trust}</span>
                          <span className="text-red-400">Fatigue: {item.fatigue}</span>
                          <span className="text-slate-600">{item.node}</span>
                        </div>
                        <div className="flex gap-1 mt-2">
                          <button className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] text-emerald-400 hover:bg-emerald-500/10"><ThumbsUp className="w-2.5 h-2.5" /> Good</button>
                          <button className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] text-red-400 hover:bg-red-500/10"><ThumbsDown className="w-2.5 h-2.5" /> Bad</button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* Scheduled Queue Sidebar */}
        <div className="w-72 flex flex-col bg-[#111118] border border-[#1e1e2e] rounded-2xl overflow-hidden shrink-0">
          <div className="px-4 py-3 border-b border-[#1e1e2e] shrink-0">
            <p className="text-xs font-semibold text-white">Scheduled Next</p>
            <p className="text-[10px] text-slate-500 mt-0.5">{scheduledQueue.length} actions queued</p>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-[#1a1a26]">
            {scheduledQueue.map(item => (
              <div key={item.id} className="px-4 py-3 hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-2 mb-1">
                  <ChannelIcon channel={item.channel} />
                  <span className="text-xs font-medium text-white truncate">{item.lead}</span>
                </div>
                <p className="text-[11px] text-slate-400 mb-1 truncate">{item.action}</p>
                <div className="flex items-center gap-1 text-[10px] text-slate-600">
                  <Clock className="w-2.5 h-2.5" />
                  <span>{item.time}</span>
                  <span className="ml-auto text-amber-500/80">{item.delay}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}