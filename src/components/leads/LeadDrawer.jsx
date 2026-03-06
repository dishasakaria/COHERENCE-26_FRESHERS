import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Mail, Phone, MapPin, Building2, Bot, Search, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import DiscBadge from '../ui-custom/DiscBadge';
import ScoreBar from '../ui-custom/ScoreBar';
import StageBadge from '../ui-custom/StageBadge';
import ChannelIcon from '../ui-custom/ChannelIcon';

const mockTimeline = [
  { channel: 'email', desc: 'Initial outreach email sent', time: '3 days ago', outcome: 'Opened' },
  { channel: 'email', desc: 'Follow-up email sent', time: '2 days ago', outcome: 'Clicked link' },
  { channel: 'linkedin', desc: 'LinkedIn connection request sent', time: '1 day ago', outcome: 'Accepted' },
  { channel: 'whatsapp', desc: 'WhatsApp intro message', time: '4 hours ago', outcome: 'Read' },
];

// Determine path based on stage/fatigue
function getPath(lead) {
  if (['hot', 'replied', 'meeting_scheduled', 'converted'].includes(lead.stage)) return 'converting';
  if ((lead.fatigue_score || 0) > 75 || lead.stage === 'nurture') return 'intervention';
  if (['engaged', 'in_sequence'].includes(lead.stage)) return 'nurturing';
  return 'prospecting';
}

const PATH_CONFIGS = {
  converting: {
    label: 'Converting', badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
    steps: ['Outreach', 'Interest Detected', 'Proposal Sent', 'Call Scheduled', 'Close'],
  },
  nurturing: {
    label: 'Nurturing', badge: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
    steps: ['Outreach', 'Warming', 'Re-evaluate', 'Pitch or Archive'],
  },
  intervention: {
    label: 'Intervention', badge: 'bg-red-500/15 text-red-400 border-red-500/25',
    steps: ['Outreach', 'Not Interested Signal', 'Human Decision Pending'],
  },
  prospecting: {
    label: 'Prospecting', badge: 'bg-slate-500/15 text-slate-400 border-slate-500/25',
    steps: ['Outreach', 'Follow-up', 'Engagement', 'Convert'],
  },
};

function getCompletedSteps(lead, path) {
  if (path === 'converting') {
    if (lead.stage === 'converted') return 5;
    if (lead.stage === 'meeting_scheduled') return 3;
    if (lead.stage === 'replied') return 2;
    if (lead.stage === 'hot') return 1;
    return 1;
  }
  if (path === 'nurturing') {
    if (lead.stage === 'engaged') return 1;
    if (lead.stage === 'in_sequence') return 1;
    return 1;
  }
  if (path === 'intervention') return 1;
  return 0;
}

function PathTimeline({ lead }) {
  const path = getPath(lead);
  const config = PATH_CONFIGS[path];
  const completed = getCompletedSteps(lead, path);

  return (
    <div className="bg-[#0e0e16] border border-[#1e1e2e] rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${config.badge}`}>
          {config.label}
        </span>
        <span className="text-[10px] text-slate-600">Current Path</span>
      </div>
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {config.steps.map((step, i) => {
          const isDone = i < completed;
          const isCurrent = i === completed;
          const isFuture = i > completed;
          return (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center shrink-0">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] border transition-all
                  ${isDone ? 'bg-emerald-500 border-emerald-500 text-white' : ''}
                  ${isCurrent ? 'bg-indigo-500/20 border-indigo-500 text-indigo-400 ring-2 ring-indigo-500/30 ring-offset-1 ring-offset-[#0e0e16]' : ''}
                  ${isFuture ? 'bg-[#1a1a26] border-[#2a2a3e] text-slate-600' : ''}
                `}>
                  {isDone ? <CheckCircle2 className="w-3 h-3" /> : isCurrent ? <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" /> : <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />}
                </div>
                <p className={`text-[9px] mt-1 max-w-[52px] text-center leading-tight
                  ${isDone ? 'text-emerald-400' : isCurrent ? 'text-indigo-400 font-semibold' : 'text-slate-700'}
                `}>{step}</p>
              </div>
              {i < config.steps.length - 1 && (
                <div className={`w-6 h-px shrink-0 mt-[-10px] ${isDone ? 'bg-emerald-500/50' : 'bg-[#2a2a3e]'}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

function DeepResearchTab({ lead }) {
  const [researching, setResearching] = useState(false);
  const [result, setResult] = useState(null);

  const runResearch = async () => {
    setResearching(true);
    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `Research ${lead.company}. Find and analyze: their website about page, LinkedIn presence, recent news, what they're hiring for, and how their founder/leadership communicates publicly. Build a deep company intelligence profile.`,
      add_context_from_internet: true,
      response_json_schema: {
        type: 'object', properties: {
          research_depth: { type: 'string' },
          website_tone: { type: 'string' },
          current_priorities: { type: 'array', items: { type: 'string' } },
          recent_news: { type: 'string' },
          hiring_signals: { type: 'string' },
          founder_communication_style: { type: 'string' },
          best_outreach_angle: { type: 'string' },
          things_happening_now: { type: 'string' },
          red_flags: { type: 'string' },
        }
      }
    });
    setResult(res);
    setResearching(false);
  };

  if (!result && !researching) {
    return (
      <div className="text-center py-8">
        <Bot className="w-8 h-8 text-violet-400 mx-auto mb-3" />
        <p className="text-sm text-white font-medium mb-1">Deep Research</p>
        <p className="text-xs text-slate-500 mb-4">AI will analyze {lead.company}'s website, LinkedIn, news and hiring signals</p>
        <Button onClick={runResearch} className="bg-violet-600 hover:bg-violet-700 text-sm">
          <Search className="w-4 h-4 mr-2" /> Research {lead.company}
        </Button>
      </div>
    );
  }

  if (researching) {
    return (
      <div className="space-y-3">
        {['Website tone', 'Current priorities', 'Recent news', 'Hiring signals', 'Founder style', 'Best outreach angle'].map(k => (
          <div key={k}>
            <div className="h-3 w-24 bg-[#1a1a28] rounded animate-pulse mb-1.5" />
            <div className="h-4 w-full bg-[#1a1a28] rounded animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  const fields = [
    { key: 'website_tone', label: 'Website Tone' },
    { key: 'current_priorities', label: 'Current Priorities', isArray: true },
    { key: 'recent_news', label: 'Recent News' },
    { key: 'hiring_signals', label: 'Hiring Signals' },
    { key: 'founder_communication_style', label: 'Founder Communication Style' },
    { key: 'best_outreach_angle', label: '✨ Best Outreach Angle' },
    { key: 'things_happening_now', label: 'Things Happening Now' },
    { key: 'red_flags', label: '⚠️ Red Flags' },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
        <div className="w-2 h-2 rounded-full bg-emerald-500" />
        <span className="text-xs text-emerald-400 font-medium">Deep Research Complete</span>
      </div>
      {fields.map(({ key, label, isArray }) => (
        result?.[key] && (
          <div key={key} className="bg-[#0e0e16] rounded-xl p-3">
            <p className="text-[10px] font-semibold text-slate-500 uppercase mb-1.5">{label}</p>
            {isArray && Array.isArray(result[key]) ? (
              <ul className="space-y-1">
                {result[key].map((item, i) => <li key={i} className="text-xs text-slate-300 flex items-start gap-1.5"><span className="text-indigo-400 mt-0.5">•</span>{item}</li>)}
              </ul>
            ) : (
              <p className="text-xs text-slate-300 leading-relaxed">{result[key]}</p>
            )}
          </div>
        )
      ))}
    </div>
  );
}

export default function LeadDrawer({ lead, onClose }) {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25 }}
        className="w-full max-w-lg bg-[#0c0c14] border-l border-[#1e1e2e] h-full flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-[#1e1e2e] shrink-0">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h2 className="text-xl font-bold text-white">{lead.name}</h2>
              <p className="text-sm text-slate-400">{lead.title} at {lead.company}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-slate-500 mb-3">
            {lead.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{lead.email}</span>}
            {lead.phone_number && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{lead.phone_number}</span>}
            {lead.city && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{lead.city}</span>}
            {lead.industry && <span className="flex items-center gap-1"><Building2 className="w-3 h-3" />{lead.industry}</span>}
          </div>
          {/* Tabs */}
          <div className="flex gap-1">
            {[['overview', 'Overview'], ['research', 'Deep Research']].map(([tab, label]) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
                  ${activeTab === tab ? 'bg-indigo-500/15 text-indigo-400' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {activeTab === 'overview' ? (
            <>
              {/* Path Timeline */}
              <PathTimeline lead={lead} />

              {/* DISC */}
              <div className="bg-[#0e0e16] border border-[#1e1e2e] rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <DiscBadge type={lead.disc_type} showLabel size="lg" />
                  {lead.disc_confidence && <span className="text-xs text-slate-500">{lead.disc_confidence}% confidence</span>}
                </div>
                {lead.disc_reason && <p className="text-xs text-slate-400">{lead.disc_reason}</p>}
              </div>

              {/* Scores */}
              <div className="bg-[#0e0e16] border border-[#1e1e2e] rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-semibold text-slate-500 uppercase">Scores</h3>
                <ScoreBar label="Interest" value={lead.interest_score || 0} color="blue" />
                <ScoreBar label="Trust" value={lead.trust_score || 0} color="green" />
                <ScoreBar label="Fatigue" value={lead.fatigue_score || 0} color="red" />
              </div>

              <div className="flex items-center gap-2">
                <StageBadge stage={lead.stage} />
                {lead.linkedin_url && (
                  <a href={lead.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 text-xs flex items-center gap-1">
                    LinkedIn <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              {/* AI Next Action */}
              <div className="bg-[#0e0e16] border border-violet-500/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Bot className="w-4 h-4 text-violet-400" />
                  <h3 className="text-xs font-medium text-violet-400">AI Next Action</h3>
                </div>
                <p className="text-sm text-slate-300">Send a personalized follow-up email focusing on ROI data, as this lead shows DISC type {lead.disc_type} tendencies.</p>
              </div>

              {/* Timeline */}
              <div className="bg-[#0e0e16] border border-[#1e1e2e] rounded-xl p-4">
                <h3 className="text-xs font-semibold text-slate-500 uppercase mb-3">Communication Timeline</h3>
                <div className="space-y-3">
                  {mockTimeline.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <ChannelIcon channel={item.channel} showBg />
                      <div className="flex-1">
                        <p className="text-xs text-slate-300">{item.desc}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-slate-500">{item.time}</span>
                          {item.outcome && <span className="text-[10px] text-emerald-400">{item.outcome}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <DeepResearchTab lead={lead} />
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}