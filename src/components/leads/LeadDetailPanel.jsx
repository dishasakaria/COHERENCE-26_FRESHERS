import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { X, Mail, Linkedin, MessageCircle, MessageSquare, Phone, ChevronRight, RefreshCw, Edit3, Check, TrendingUp, TrendingDown, Minus, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import DiscBadge from '../ui-custom/DiscBadge';
import ScoreBar from '../ui-custom/ScoreBar';
import { useCampaign } from '../campaign/CampaignContext';

// Lead score calculation
function calcScore(lead) {
  return Math.round((lead.interest_score || 0) * 0.4 + (lead.trust_score || 0) * 0.4 + (100 - (lead.fatigue_score || 0)) * 0.2);
}

function ScoreDisplay({ score }) {
  const color = score >= 70 ? 'text-emerald-400' : score >= 40 ? 'text-amber-400' : 'text-red-400';
  const borderColor = score >= 70 ? 'border-emerald-500/30' : score >= 40 ? 'border-amber-500/30' : 'border-red-500/30';
  const sparkline = [score - 8, score - 3, score + 2, score - 1, score + 4, score - 2, score];
  const trend = sparkline[6] > sparkline[0];
  return (
    <div className={`bg-[#0e0e16] border ${borderColor} rounded-xl p-4 flex items-center justify-between`}>
      <div>
        <p className="text-xs text-slate-500 mb-0.5">Lead Score</p>
        <p className={`text-3xl font-black ${color}`}>{score}</p>
        <div className="flex items-center gap-1 mt-1">
          {trend ? <TrendingUp className="w-3 h-3 text-emerald-400" /> : <TrendingDown className="w-3 h-3 text-red-400" />}
          <span className={`text-[10px] ${trend ? 'text-emerald-400' : 'text-red-400'}`}>{trend ? 'Trending up' : 'Trending down'}</span>
        </div>
      </div>
      <svg width="80" height="32" className="opacity-60">
        {sparkline.map((v, i) => {
          const x = (i / 6) * 76 + 2;
          const y = 30 - ((v / 100) * 26);
          return i === 0 ? null : (
            <line key={i} x1={(((i - 1) / 6) * 76) + 2} y1={30 - ((sparkline[i - 1] / 100) * 26)} x2={x} y2={y}
              stroke={trend ? '#10b981' : '#ef4444'} strokeWidth="1.5" />
          );
        })}
      </svg>
    </div>
  );
}

const PATH_STEPS = {
  converting: ['Prospecting', 'Nurturing', 'Engaging', 'Hot Lead', 'Converting'],
  nurturing: ['Prospecting', 'Nurturing', 'Re-engaging', 'Warming Up', 'Converting'],
  intervention: ['Engaged', 'Fatigued', 'Intervention', 'Recovery', 'Re-sequence'],
  prospecting: ['Identified', 'Researched', 'Outreach', 'Follow-up', 'Engaged'],
};

function getPath(lead) {
  const stage = lead.stage;
  if (['hot', 'replied', 'meeting_scheduled', 'converted'].includes(stage)) return { key: 'converting', label: 'Converting', color: 'text-emerald-400', activeStep: 4 };
  if ((lead.fatigue_score || 0) > 75 || stage === 'nurture') return { key: 'intervention', label: 'Intervention', color: 'text-red-400', activeStep: 2 };
  if (['engaged', 'in_sequence'].includes(stage)) return { key: 'nurturing', label: 'Nurturing', color: 'text-amber-400', activeStep: 2 };
  return { key: 'prospecting', label: 'Prospecting', color: 'text-slate-400', activeStep: 2 };
}

// Mock email history per lead
function getMockEmails(lead) {
  return [
    { id: 1, label: 'Email #1', type: 'email', date: 'Mar 4', status: 'Opened', disc: lead.disc_type || 'C', subject: `Quick question about ${lead.company || 'your company'}`, body: `Hi ${lead.name?.split(' ')[0] || 'there'},\n\nI came across ${lead.company || 'your company'} while researching leaders in ${lead.industry || 'your industry'} — impressive trajectory.\n\nWe help teams like yours cut outreach time by 70% while tripling reply rates using AI-personalized sequences.\n\nWould 15 minutes this week make sense to explore if this fits your current priorities?\n\nBest,\nAlex` },
    { id: 2, label: 'Follow-up #1', type: 'email', date: 'Mar 6', status: 'Sent', disc: lead.disc_type || 'C', subject: `Re: Quick question about ${lead.company || 'your company'}`, body: `Hi ${lead.name?.split(' ')[0] || 'there'},\n\nJust circling back on my previous note. I know inboxes get busy.\n\nOne thing that might be relevant: we recently helped a ${lead.industry || 'similar'} company increase their booked meetings by 3x in 6 weeks.\n\nHappy to share how — would a brief call work?\n\nAlex` },
    { id: 3, label: 'LinkedIn DM #1', type: 'linkedin', date: 'Mar 7', status: 'Clicked', disc: lead.disc_type || 'I', subject: 'LinkedIn connection note', body: `Hi ${lead.name?.split(' ')[0] || 'there'}, noticed your post about ${lead.industry || 'the industry'} — completely aligned with what we're seeing too. Would love to connect!` },
  ];
}

const STAGE_OPTIONS = ['new', 'in_sequence', 'engaged', 'hot', 'replied', 'meeting_scheduled', 'converted', 'nurture'];
const EMAIL_TONES = ['Professional', 'Friendly', 'Direct', 'Consultative', 'Bold'];
const TEMPLATE_TYPES = ['Follow-up (No Reply)', 'Soft Re-engage', 'Value Add', 'Meeting Ask'];

const INTEL_STEPS = [
  { icon: '🌐', label: 'Website', tooltip: 'Formal enterprise tone, heavy ROI language, recent Series A funding mentioned.' },
  { icon: '💼', label: 'LinkedIn', tooltip: '230 employees, hiring 3 sales roles, founder posts weekly about growth.' },
  { icon: '📰', label: 'News', tooltip: 'Featured in TechCrunch last month, partnered with Salesforce recently.' },
  { icon: '👤', label: 'Founder', tooltip: 'Direct communication style, data-driven, prefers brevity in comms.' },
  { icon: '🧠', label: 'Profile Built', tooltip: 'Intelligence profile complete. Best angle: ROI + efficiency + growth narrative.' },
];

export default function LeadDetailPanel({ lead, onClose }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedEmail, setSelectedEmail] = useState(0);
  const [editingBody, setEditingBody] = useState(false);
  const [editedBody, setEditedBody] = useState('');
  const [showToneDropdown, setShowToneDropdown] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [emailContent, setEmailContent] = useState(null);
  const [why, setWhy] = useState(null);
  const [whyLoading, setWhyLoading] = useState(false);
  const [templateLoading, setTemplateLoading] = useState(false);
  const [templateResult, setTemplateResult] = useState(null);
  const [showInterrupt, setShowInterrupt] = useState(false);
  const [researchRunning, setResearchRunning] = useState(false);
  const [researchStep, setResearchStep] = useState(-1);
  const [researchDone, setResearchDone] = useState(false);
  const [overrideForm, setOverrideForm] = useState({ disc: lead.disc_type || 'C', interest: lead.interest_score || 0, trust: lead.trust_score || 0, fatigue: lead.fatigue_score || 0, stage: lead.stage || 'new', paused: lead.is_paused || false, notes: lead.notes || '' });
  const [showProposal, setShowProposal] = useState(false);

  const { state: campaignState } = useCampaign();
  const isRoutingActive = campaignState?.smartRoutingActive;

  const score = calcScore(lead);
  const path = getPath(lead);
  const emails = getMockEmails(lead);
  const currentEmail = emails[selectedEmail];
  const isHot = ['hot', 'replied'].includes(lead.stage);

  const getRecommendedModel = (l) => {
    const s = calcScore(l);
    if (s < 35 || l.stage === 'nurture') return 'Mistral Small (Cost Saver)';
    const d = l.disc_category || l.disc_type || 'C';
    if (d === 'D' && s > 60) return 'Claude 3 Sonnet (High Personalization)';
    if (d === 'I') return 'GPT-4o Mini (Conversational)';
    if (d === 'S') return 'GPT-4o Mini (Relationship focused)';
    if (d === 'C') return 'Claude 3 Sonnet (Detailed messaging)';
    if (l.stage === 'prospecting') return 'Gemini 1.5 Flash (Research Optimized)';
    return 'GPT-4o Mini';
  };

  const loadWhy = async (email) => {
    setWhyLoading(true);
    setWhy(null);
    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `For a sales email sent to ${lead.name} (${lead.disc_type || 'C'}-type DISC) at ${lead.company}: explain in exactly 3 bullets why the AI wrote this email this way. Return JSON: { tone: "...", company_angle: "...", style: "..." }`,
      response_json_schema: { type: 'object', properties: { tone: { type: 'string' }, company_angle: { type: 'string' }, style: { type: 'string' } } }
    });
    setWhy(res);
    setWhyLoading(false);
  };

  const regenerateEmail = async (tone) => {
    setShowToneDropdown(false);
    setRegenerating(true);
    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `Rewrite this sales email in a ${tone} tone for ${lead.name} (${lead.disc_type || 'C'}-type DISC) at ${lead.company} (${lead.industry || 'tech industry'}). Keep it under 100 words. Return just the email body text, no subject line.`
    });
    setEmailContent(res);
    setRegenerating(false);
    loadWhy(null);
  };

  const applyTemplate = async (templateType) => {
    setTemplateLoading(true);
    setTemplateResult(null);
    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `Write a "${templateType}" email for ${lead.name} (${lead.disc_type || 'C'}-type) at ${lead.company}. Keep it under 80 words. Return JSON: { body: "...", why: "1 sentence why this template works for this lead" }`,
      response_json_schema: { type: 'object', properties: { body: { type: 'string' }, why: { type: 'string' } } }
    });
    setTemplateResult(res);
    setTemplateLoading(false);
  };

  const runDeepResearch = async () => {
    setResearchRunning(true);
    setResearchStep(0);
    for (let i = 0; i < INTEL_STEPS.length; i++) {
      await new Promise(r => setTimeout(r, 700));
      setResearchStep(i);
    }
    await new Promise(r => setTimeout(r, 500));
    setResearchRunning(false);
    setResearchDone(true);
  };

  const tierIcon = score >= 70 ? '🔥' : score < 40 ? '❄️' : '';
  const tabs = ['overview', 'emails', 'research', 'override'];

  return (
    <div className="h-full flex flex-col bg-[#0e0e16] border border-[#1e1e2e] rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#1e1e2e] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#1a1a28] flex items-center justify-center text-sm font-bold text-slate-300">{lead.name?.[0]}</div>
          <div>
            <div className="flex items-center gap-1.5 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{tierIcon} {lead.name}</p>
              <DiscBadge type={lead.disc_category || lead.disc_type} />
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-xs text-slate-500 truncate">{lead.role || lead.title} · {lead.company}</p>
              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#1a1a28] border border-[#2a2a3e]">
                <Mail className="w-2.5 h-2.5 text-slate-500" />
                <span className="text-[10px] text-slate-400 truncate max-w-[120px]">{lead.email}</span>
                <button onClick={() => { navigator.clipboard.writeText(lead.email); }} className="hover:text-white transition-colors">
                  <Edit3 className="w-2.5 h-2.5 text-slate-600 hover:text-indigo-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
        <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors shrink-0 ml-4"><X className="w-4 h-4" /></button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#1e1e2e] shrink-0">
        {[{ key: 'overview', label: 'Overview' }, { key: 'emails', label: 'Emails' }, { key: 'research', label: 'Deep Research' }, { key: 'override', label: 'Override' }].map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className={`flex-1 py-2.5 text-xs font-medium transition-colors ${activeTab === t.key ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-slate-500 hover:text-slate-300'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="p-4 space-y-4">
            {/* Lead Score */}
            <ScoreDisplay score={score} />

            {/* Path Stepper */}
            <div className="bg-[#111118] border border-[#1e1e2e] rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-white">Current Path</p>
                <span className={`text-xs font-medium ${path.color}`}>{path.label}</span>
              </div>
              <div className="flex items-center gap-1">
                {PATH_STEPS[path.key].map((step, i) => (
                  <React.Fragment key={step}>
                    <div className={`flex-1 text-center`}>
                      <div className={`h-1.5 rounded-full ${i <= path.activeStep ? (path.color.includes('emerald') ? 'bg-emerald-500' : path.color.includes('red') ? 'bg-red-500' : path.color.includes('amber') ? 'bg-amber-500' : 'bg-slate-500') : 'bg-[#1a1a26]'}`} />
                      <p className={`text-[9px] mt-1 ${i === path.activeStep ? 'text-white font-semibold' : 'text-slate-600'}`}>{step}</p>
                    </div>
                    {i < 4 && <div className="w-1" />}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Personality Scores */}
            <div className="bg-[#111118] border border-[#1e1e2e] rounded-xl p-4 space-y-4">
              <p className="text-xs font-semibold text-white">Personality Insights</p>
              
              {lead.ai_summary && (
                <div className="p-2.5 rounded-lg bg-[#0e0e16] border border-[#1a1a26]">
                  <p className="text-[11px] text-slate-400 leading-relaxed italic">"{lead.ai_summary}"</p>
                </div>
              )}

              <div className="grid grid-cols-1 gap-3">
                <ScoreBar label="Assertiveness" value={lead.assertiveness_score || 0} color="red" />
                <ScoreBar label="Warmth" value={lead.warmth_score || 0} color="amber" />
                <ScoreBar label="Analytical" value={lead.analytical_score || 0} color="blue" />
              </div>

              <div className="pt-2 border-t border-[#1a1a26] space-y-3">
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1.5">Recommended Approach</p>
                  <p className="text-xs text-slate-300 leading-relaxed">{lead.recommended_approach}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1.5">Best Opening Line</p>
                  <div className="p-2 rounded bg-indigo-500/5 border border-indigo-500/20">
                    <p className="text-xs text-indigo-300 leading-relaxed">"{lead.best_opening_line}"</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Outreach Health */}
            <div className="bg-[#111118] border border-[#1e1e2e] rounded-xl p-4 space-y-3">
              <p className="text-xs font-semibold text-white">Outreach Health</p>
              <ScoreBar value={lead.interest_score || 0} color="blue" label="Interest" />
              <ScoreBar value={lead.trust_score || 0} color="green" label="Trust" />
              <ScoreBar value={lead.fatigue_score || 0} color="red" label="Fatigue" />
            </div>

            {/* AI Next Action */}
            <div className="bg-violet-500/5 border border-violet-500/20 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-violet-400">🤖 AI Next Action</p>
                <span className="text-[10px] text-violet-300/70">82% confidence</span>
              </div>
              <p className="text-sm text-white mb-1">Send follow-up email with case study</p>
              <p className="text-xs text-slate-400">Interest is building but no reply yet. A value-add email with a relevant case study matches their C-type preference for data-driven content.</p>
              {!showInterrupt ? (
                <button onClick={() => setShowInterrupt(true)} className="mt-3 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium hover:bg-red-500/20 transition-colors">
                  ⚡ INTERRUPT
                </button>
              ) : (
                <div className="mt-3 space-y-2">
                  <select className="w-full bg-[#0a0a0f] border border-[#2a2a3e] text-white text-xs rounded-lg px-2 py-1.5">
                    <option>Pause sequence</option>
                    <option>Skip to next step</option>
                    <option>Switch channel to LinkedIn</option>
                    <option>Move to Nurture</option>
                    <option>Archive lead</option>
                  </select>
                  <textarea placeholder="Custom instruction..." rows={2} className="w-full bg-[#0a0a0f] border border-[#2a2a3e] text-white text-xs rounded-lg px-2 py-1.5 resize-none outline-none" />
                  <div className="flex gap-2">
                    <button className="flex-1 py-1.5 rounded-lg bg-red-600 text-white text-xs font-medium hover:bg-red-700">Apply Override</button>
                    <button onClick={() => setShowInterrupt(false)} className="flex-1 py-1.5 rounded-lg bg-[#1a1a28] text-slate-400 text-xs hover:bg-[#2a2a38]">Cancel</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* EMAILS */}
        {activeTab === 'emails' && (
          <div className="flex flex-col h-full">
            {/* Hot proposal banner */}
            {isHot && !showProposal && (
              <div className="mx-4 mt-4 p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">🔥 This lead is hot — proposal ready</p>
                    <p className="text-xs text-slate-400 mt-0.5">Meeting Brief · "We can help {lead.company} increase pipeline by 3x in 60 days through AI-driven..."</p>
                  </div>
                  <Button size="sm" onClick={() => setShowProposal(true)} className="bg-emerald-600 hover:bg-emerald-700 text-xs ml-3 shrink-0">View</Button>
                </div>
              </div>
            )}

            {showProposal ? (
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-white">Full Proposal</p>
                  <button onClick={() => setShowProposal(false)} className="text-xs text-slate-500 hover:text-white">← Back to emails</button>
                </div>
                {['Executive Summary', 'Problem Statement', 'Solution', 'Benefits', 'Next Steps'].map((section, i) => (
                  <details key={section} className="bg-[#111118] border border-[#1e1e2e] rounded-xl overflow-hidden" open={i === 0}>
                    <summary className="px-4 py-3 cursor-pointer text-sm font-medium text-white flex items-center justify-between">
                      {section}
                      <span className="text-[10px] text-indigo-400 hover:text-indigo-300">Regenerate</span>
                    </summary>
                    <div className="px-4 pb-4">
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {section === 'Executive Summary' ? `This proposal outlines how FlowReach AI can help ${lead.company} achieve a 3× increase in pipeline growth through intelligent, AI-powered outreach automation.` : `[${section} content for ${lead.company}]`}
                      </p>
                    </div>
                  </details>
                ))}
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Accept & Send Proposal</Button>
              </div>
            ) : (
              <div className="flex flex-1 overflow-hidden">
                {/* Email list */}
                <div className="w-28 border-r border-[#1e1e2e] overflow-y-auto shrink-0">
                  {emails.map((email, i) => {
                    const statusColors = { Sent: 'text-slate-400 bg-slate-500/10', Opened: 'text-blue-400 bg-blue-500/10', Clicked: 'text-violet-400 bg-violet-500/10', Replied: 'text-emerald-400 bg-emerald-500/10' };
                    const ChannelIcons = { email: Mail, linkedin: Linkedin, whatsapp: MessageCircle, sms: MessageSquare, call: Phone };
                    const CIcon = ChannelIcons[email.type] || Mail;
                    return (
                      <button key={email.id} onClick={() => { setSelectedEmail(i); setEmailContent(null); setWhy(null); setEditingBody(false); setTemplateResult(null); }}
                        className={`w-full text-left p-2.5 border-b border-[#1a1a26] hover:bg-white/[0.03] transition-colors ${selectedEmail === i ? 'bg-indigo-500/10' : ''}`}>
                        <div className="flex items-center gap-1.5 mb-1">
                          <CIcon className="w-3 h-3 text-slate-500" />
                          <span className="text-[10px] text-slate-300 font-medium truncate">{email.label}</span>
                        </div>
                        <span className="text-[9px] text-slate-600">{email.date}</span>
                        <div className="mt-1">
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${statusColors[email.status]}`}>{email.status}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Email preview */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {isRoutingActive && (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                      <Bot className="w-3 h-3 text-indigo-400" />
                      <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest">
                        Model: {getRecommendedModel(lead)}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Subject</p>
                    <p className="text-sm font-bold text-white">{currentEmail.subject}</p>
                  </div>
                  {editingBody ? (
                    <div>
                      <textarea value={editedBody} onChange={e => setEditedBody(e.target.value)} rows={8}
                        className="w-full bg-[#0a0a0f] border border-indigo-500/30 text-sm text-white rounded-xl p-3 resize-none outline-none leading-relaxed" />
                      <button onClick={() => { setEmailContent(editedBody); setEditingBody(false); }}
                        className="mt-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs hover:bg-emerald-700">
                        <Check className="w-3 h-3" /> Save
                      </button>
                    </div>
                  ) : (
                    <div className="bg-[#111118] border border-[#1e1e2e] rounded-xl p-4">
                      {regenerating ? (
                        <div className="space-y-2">{[1,2,3,4].map(i => <div key={i} className="h-3 bg-[#1a1a28] rounded animate-pulse" style={{width:`${90-i*10}%`}} />)}</div>
                      ) : (
                        <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{emailContent || currentEmail.body}</p>
                      )}
                    </div>
                  )}

                  {/* Why card */}
                  {!why && !whyLoading && !editingBody && (
                    <button onClick={() => loadWhy(currentEmail)} className="text-xs text-indigo-400 hover:text-indigo-300">💡 Why did the AI write it this way?</button>
                  )}
                  {whyLoading && (
                    <div className="bg-[#111118] border border-[#1e1e2e] rounded-xl p-3 space-y-2">
                      {[1,2,3].map(i => <div key={i} className="h-3 bg-[#1a1a28] rounded animate-pulse" />)}
                    </div>
                  )}
                  {why && (
                    <div className="bg-[#111118] border border-[#1e1e2e] rounded-xl p-3">
                      <p className="text-xs font-semibold text-slate-400 mb-2">💡 Why the AI wrote it this way:</p>
                      <ul className="space-y-1.5 text-xs text-slate-300">
                        <li>• <span className="text-slate-400">Tone:</span> {why.tone}</li>
                        <li>• <span className="text-slate-400">Company angle:</span> {why.company_angle}</li>
                        <li>• <span className="text-slate-400">Your style:</span> {why.style}</li>
                      </ul>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-xs flex-1">✅ Accept & Send</Button>
                    <div className="relative flex-1">
                      <Button size="sm" onClick={() => setShowToneDropdown(!showToneDropdown)} className="bg-violet-600 hover:bg-violet-700 text-xs w-full">🔄 Regenerate</Button>
                      {showToneDropdown && (
                        <div className="absolute bottom-full left-0 mb-1 w-36 bg-[#111118] border border-[#2a2a3e] rounded-xl overflow-hidden z-20">
                          {EMAIL_TONES.map(t => (
                            <button key={t} onClick={() => regenerateEmail(t)} className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-white/[0.05] hover:text-white">{t}</button>
                          ))}
                        </div>
                      )}
                    </div>
                    <Button size="sm" variant="outline" onClick={() => { setEditingBody(true); setEditedBody(emailContent || currentEmail.body); }} className="border-[#2a2a3e] text-slate-300 text-xs flex-1">✏️ Edit</Button>
                  </div>

                  {/* Smart Reply Templates */}
                  <div className="border-t border-[#1e1e2e] pt-3">
                    <p className="text-xs font-semibold text-slate-400 mb-2">Smart Reply Templates</p>
                    <div className="flex flex-wrap gap-2">
                      {TEMPLATE_TYPES.map(t => (
                        <button key={t} onClick={() => applyTemplate(t)} disabled={templateLoading}
                          className="px-2.5 py-1.5 rounded-lg border border-[#2a2a3e] text-[11px] text-slate-400 hover:border-indigo-500/40 hover:text-indigo-300 transition-colors">
                          {t}
                        </button>
                      ))}
                    </div>
                    {templateLoading && (
                      <div className="mt-3 space-y-2">{[1,2,3].map(i => <div key={i} className="h-3 bg-[#1a1a28] rounded animate-pulse" />)}</div>
                    )}
                    {templateResult && (
                      <div className="mt-3 bg-[#111118] border border-indigo-500/20 rounded-xl p-3 space-y-2">
                        <p className="text-xs text-slate-300 leading-relaxed">{templateResult.body}</p>
                        <p className="text-[10px] text-indigo-400 italic">Why this works: {templateResult.why}</p>
                        <div className="flex gap-2">
                          <button onClick={() => { setEmailContent(templateResult.body); setTemplateResult(null); }} className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-xs hover:bg-emerald-700">Use this</button>
                          <button onClick={() => setTemplateResult(null)} className="px-2.5 py-1 rounded-lg bg-[#1a1a28] text-slate-400 text-xs hover:bg-[#2a2a38]">Dismiss</button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Compliance Log */}
                  <div className="border-t border-[#1e1e2e] pt-3">
                    <p className="text-xs font-semibold text-slate-400 mb-2">🛡️ Safety checks for this lead</p>
                    <div className="bg-[#111118] border border-[#1e1e2e] rounded-xl overflow-hidden">
                      {[
                        { check: 'DNC list', lastRun: '2 min ago', result: '✅ Clear', ok: true },
                        { check: 'Opt-out keywords', lastRun: '5 min ago', result: '✅ None detected', ok: true },
                        { check: 'Fatigue threshold', lastRun: 'Live', result: `✅ ${lead.fatigue_score || 0}/75`, ok: true },
                        { check: 'Rate limit', lastRun: 'Live', result: '✅ Under limit', ok: true },
                        { check: 'Quiet hours', lastRun: 'Live', result: '✅ Active hours', ok: true },
                      ].map((row, i) => (
                        <div key={row.check} className={`flex items-center justify-between px-3 py-2 text-[11px] border-b border-[#1a1a26] last:border-0 ${!row.ok ? 'bg-red-500/5' : ''}`}>
                          <span className="text-slate-400 w-28">{row.check}</span>
                          <span className="text-slate-600">{row.lastRun}</span>
                          <span className={row.ok ? 'text-emerald-400' : 'text-red-400'}>{row.result}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* DEEP RESEARCH */}
        {activeTab === 'research' && (
          <div className="p-4 space-y-5">
            {/* Intelligence Trail */}
            <div className="bg-[#111118] border border-[#1e1e2e] rounded-xl p-4">
              <p className="text-xs font-semibold text-white mb-4">Intelligence Trail</p>
              <div className="flex items-center justify-between">
                {INTEL_STEPS.map((step, i) => {
                  const isDone = researchDone || i < 3;
                  const isCurrent = researchRunning && i === researchStep;
                  return (
                    <React.Fragment key={step.label}>
                      <div className="flex flex-col items-center group relative">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-base border-2 transition-all
                          ${isCurrent ? 'border-blue-500 bg-blue-500/20 animate-pulse' : isDone ? 'border-emerald-500 bg-emerald-500/20' : 'border-[#2a2a3e] bg-[#1a1a28]'}`}>
                          {step.icon}
                        </div>
                        <p className={`text-[9px] mt-1 ${isDone ? 'text-emerald-400' : 'text-slate-600'}`}>{step.label}</p>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1.5 rounded-lg bg-[#1a1a28] border border-[#2a2a3e] text-[10px] text-slate-300 w-40 text-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                          {isDone ? step.tooltip : 'Not yet analyzed'}
                        </div>
                      </div>
                      {i < 4 && <div className={`flex-1 h-0.5 mx-1 ${i < (researchDone ? 5 : researchStep) ? 'bg-emerald-500' : 'bg-[#1a1a26]'}`} />}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            {/* Company Profile 2x2 */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { title: 'How they communicate', content: 'Formal, data-driven, ROI-focused. Prefer structured communication with metrics and timelines. Avoid casual language.' },
                { title: 'What they care about', tags: ['Efficiency', 'ROI', 'Scale', 'Data', 'Compliance'] },
                { title: 'Their pain points', bullets: ['Manual processes slowing growth', 'Sales team struggling with outreach volume', 'Inconsistent personalization at scale'] },
                { title: 'Best angle to reach them', highlight: `Lead with operational efficiency gains + concrete ROI numbers — ${lead.company || 'their company'} prioritizes measurable outcomes above all else.` },
              ].map((card, i) => (
                <div key={card.title} className="bg-[#111118] border border-[#1e1e2e] rounded-xl p-3.5">
                  <p className="text-xs font-semibold text-white mb-2">{card.title}</p>
                  {card.content && <p className="text-xs text-slate-400 leading-relaxed">{card.content}</p>}
                  {card.tags && <div className="flex flex-wrap gap-1.5">{card.tags.map(t => <span key={t} className="px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] text-indigo-300">{t}</span>)}</div>}
                  {card.bullets && <ul className="space-y-1">{card.bullets.map(b => <li key={b} className="text-xs text-slate-400 flex gap-1.5"><span className="text-red-400 shrink-0">•</span>{b}</li>)}</ul>}
                  {card.highlight && <p className="text-xs text-emerald-400 bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-2 leading-relaxed">{card.highlight}</p>}
                </div>
              ))}
            </div>

            {/* Research Depth */}
            <div className="bg-[#111118] border border-[#1e1e2e] rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${researchDone ? 'bg-emerald-500' : lead.research_depth === 'standard' ? 'bg-yellow-500' : 'bg-red-500'}`} />
                <p className="text-sm text-white font-medium">{researchDone ? 'Deep Research' : lead.research_depth === 'standard' ? 'Standard Research' : 'Basic Research'}</p>
                <span className="text-xs text-slate-500">{researchDone ? 'Complete' : 'Partial data only'}</span>
              </div>
              <Button size="sm" onClick={runDeepResearch} disabled={researchRunning || researchDone} className="bg-indigo-600 hover:bg-indigo-700 text-xs">
                {researchRunning ? 'Researching...' : researchDone ? '✓ Done' : 'Run Deep Research'}
              </Button>
            </div>
          </div>
        )}

        {/* OVERRIDE */}
        {activeTab === 'override' && (
          <div className="p-4 space-y-4">
            <p className="text-xs text-slate-500">Override AI decisions for this lead. Changes apply immediately.</p>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">DISC Type</label>
              <select value={overrideForm.disc} onChange={e => setOverrideForm(p => ({ ...p, disc: e.target.value }))}
                className="w-full bg-[#0a0a0f] border border-[#2a2a3e] text-white text-sm rounded-xl px-3 py-2">
                {['D', 'I', 'S', 'C'].map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            {[['interest', 'Interest Score', 'blue'], ['trust', 'Trust Score', 'green'], ['fatigue', 'Fatigue Score', 'red']].map(([key, label, color]) => (
              <div key={key}>
                <div className="flex justify-between mb-1.5">
                  <label className="text-xs text-slate-400">{label}</label>
                  <span className="text-xs font-bold text-indigo-400">{overrideForm[key]}</span>
                </div>
                <Slider value={[overrideForm[key]]} onValueChange={([v]) => setOverrideForm(p => ({ ...p, [key]: v }))} max={100} step={1}
                  className="[&_[role=slider]]:bg-white [&_[role=slider]]:border-2 [&_[role=slider]]:border-indigo-500 [&_[role=slider]]:w-4 [&_[role=slider]]:h-4" />
              </div>
            ))}
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Pipeline Stage</label>
              <select value={overrideForm.stage} onChange={e => setOverrideForm(p => ({ ...p, stage: e.target.value }))}
                className="w-full bg-[#0a0a0f] border border-[#2a2a3e] text-white text-sm rounded-xl px-3 py-2">
                {STAGE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Sequence</span>
              <button onClick={() => setOverrideForm(p => ({ ...p, paused: !p.paused }))}
                className={`relative w-11 h-6 rounded-full transition-colors ${overrideForm.paused ? 'bg-[#2a2a3e]' : 'bg-indigo-600'}`}>
                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${overrideForm.paused ? 'translate-x-0.5' : 'translate-x-5'}`} />
              </button>
              <span className="text-xs text-slate-400">{overrideForm.paused ? 'Paused' : 'Active'}</span>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Notes</label>
              <textarea value={overrideForm.notes} onChange={e => setOverrideForm(p => ({ ...p, notes: e.target.value }))} rows={3}
                className="w-full bg-[#0a0a0f] border border-[#2a2a3e] text-white text-xs rounded-xl p-3 resize-none outline-none focus:border-indigo-500/50" />
            </div>
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700">Save Override</Button>
          </div>
        )}
      </div>
    </div>
  );
}