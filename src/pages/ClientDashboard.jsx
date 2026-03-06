import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Percent, CalendarCheck, Users, Calendar, Clock, AlertTriangle, Bot, HelpCircle, Pause, BarChart3, StopCircle, User, Upload, Sparkles, X } from 'lucide-react';
import AIChatbot from '../components/dashboard/AIChatbot';
import HowItWorksModal from '../components/dashboard/HowItWorksModal';
import { useCampaign } from '../components/campaign/CampaignContext';
import DemoFlow from '../components/demo/DemoFlow';
import PersonalityBuilderModal from '../components/leads/PersonalityBuilderModal';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';

function LiveNumber({ value, className }) {
  const [display, setDisplay] = useState(value);
  const [flash, setFlash] = useState(false);
  const prevRef = useRef(value);
  useEffect(() => {
    if (value === prevRef.current) return;
    setFlash(true);
    const start = prevRef.current;
    const end = typeof value === 'number' ? value : parseFloat(value);
    const startNum = typeof start === 'number' ? start : parseFloat(start);
    if (!isNaN(end) && !isNaN(startNum)) {
      const diff = end - startNum;
      const steps = 20;
      let step = 0;
      const interval = setInterval(() => {
        step++;
        const next = startNum + Math.round((diff * step) / steps);
        setDisplay(typeof value === 'string' && value.includes('%') ? next + '%' : String(next));
        if (step >= steps) { clearInterval(interval); setDisplay(value); }
      }, 25);
    } else {
      setDisplay(value);
    }
    prevRef.current = value;
    setTimeout(() => setFlash(false), 600);
  }, [value]);
  return (
    <span className={`${className} transition-colors duration-300 ${flash ? 'text-emerald-300' : ''}`}>{display}</span>
  );
}

const urgentItems = [
  { lead: 'Sarah Chen', company: 'GlobalTech', issue: 'Replied: "not the right time"', color: 'text-red-400', dot: 'bg-red-500' },
  { lead: 'Lisa Wang', company: 'DataMax', issue: 'Fatigue threshold crossed (82/75)', color: 'text-amber-400', dot: 'bg-amber-500' },
  { lead: 'Chen Wei', company: 'ByteForce', issue: 'AI uncertain on channel choice', color: 'text-amber-400', dot: 'bg-amber-500' },
];

const aiInsightCards = [
  { emoji: '📈', text: 'LinkedIn DMs have 2.2× higher reply rate for I-type leads this week' },
  { emoji: '⏰', text: 'Best send time: Tuesday & Thursday 9–11am based on open rates' },
  { emoji: '⚠️', text: '5 leads approaching fatigue threshold — consider pausing sequences' },
];

export default function ClientDashboard() {
  const [addModeLocal, setAddModeLocal] = useState(null);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [briefing, setBriefing] = useState("Your campaign is performing above average. 6 replies in the last 24 hours — 4 show strong buying intent. Sarah Chen has moved to nurture. 3 leads paused due to fatigue. AI confidence: 79% avg. One decision flagged for review.");
  const { state, updateCampaignStatus, setUIState } = useCampaign();
  const queryClient = useQueryClient();

  const addMode = state.ui.addMode;
  const showPersonality = state.ui.showPersonality;
  const showHowItWorks = state.ui.showHowItWorks;
  const showDemo = state.ui.showDemo || false;

  const globalStats = state?.stats;
  const campaign = state?.campaign;
  const feed = state?.feed || [];

  const createLeadsMutation = useMutation({
    mutationFn: (data) => base44.entities.Lead.bulkCreate(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['leads'] }),
  });

  const generateLeads = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `Generate 8 realistic fictional sales leads matching: "${aiPrompt}". Each lead: name, email, company, title, industry, department, city, linkedin_url, phone_number.`,
      response_json_schema: { type: "object", properties: { leads: { type: "array", items: { type: "object", properties: { name: { type: "string" }, email: { type: "string" }, company: { type: "string" }, title: { type: "string" }, industry: { type: "string" }, department: { type: "string" }, city: { type: "string" }, linkedin_url: { type: "string" }, phone_number: { type: "string" } } } } } }
    });
    if (res?.leads) {
      const enriched = res.leads.map(l => ({ ...l, interest_score: 0, trust_score: 0, fatigue_score: 0, stage: 'new', channels_used: [] }));
      await createLeadsMutation.mutateAsync(enriched);
    }
    setIsGenerating(false);
    setAiPrompt('');
    setUIState('addMode', null);
  };

  const [uploadStatus, setUploadStatus] = useState(null); // 'uploading' | 'processing' | 'generating' | 'sending' | 'done' | null
  const [lastResults, setLastResults] = useState([]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploadStatus('uploading');
    try {
      // Step 1: Uploading
      const formData = new FormData();
      formData.append("csvfile", file);

      // We use the direct fetch as requested or the api utility
      setUploadStatus('processing');
      const response = await fetch("http://localhost:5678/webhook/upload-leads", {
        method: "POST",
        body: formData
      });

      if (!response.ok) throw new Error("n8n connection failed");

      setUploadStatus('generating');
      // Simulate some time for generating/sending if n8n doesn't return immediately
      // Actually, n8n will return the final results if configured correctly
      const results = await response.json();
      
      setUploadStatus('sending');
      await new Promise(r => setTimeout(r, 1000)); // Brief pause for UI effect
      
      setLastResults(results);
      setUploadStatus('done');
      
      // If results is an array of leads, save them to the local entities
      if (Array.isArray(results)) {
        const leadsToCreate = results.map(l => ({
          name: l.name,
          email: l.email || l.company_email,
          company: l.company,
          title: l.title,
          industry: l.industry || 'Unknown',
          generated_email: l.generated_email,
          disc_type: l.disc_type || 'Unknown',
          interest_score: l.interest_score || 0,
          trust_score: l.trust_score || 0,
          fatigue_score: l.fatigue_score || 0,
          stage: 'replied', // Since n8n sent the email, they are in progress
          status: 'emailed'
        }));
        await createLeadsMutation.mutateAsync(leadsToCreate);
      }
    } catch (err) {
      console.error("Upload failed", err);
      setUploadStatus(null);
      alert("Failed to connect to n8n backend. Ensure it is running at http://localhost:5678");
    }
  };

  const hoursAgo = campaign?.startTime
    ? Math.floor((Date.now() - campaign.startTime) / 3600000)
    : 0;

  const { data: meetings = [] } = useQuery({
    queryKey: ['meetings'],
    queryFn: () => base44.entities.Meeting.list('-scheduled_date', 10),
  });

  const upcomingMeetings = meetings.filter(m => ['pending', 'confirmed'].includes(m.status)).slice(0, 5);

  return (
    <div className="p-6 space-y-5 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">Dashboard Overview</h1>
      </div>

      {/* Add mode panels */}
      <AnimatePresence>
        {addMode === 'ai' && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-4 overflow-hidden shrink-0">
            <p className="text-sm font-medium text-white mb-3">Describe your ideal leads</p>
            <Textarea placeholder="e.g. 'SaaS founders in Mumbai with 10–50 employees'" value={aiPrompt} onChange={e => setAiPrompt(e.target.value)}
              className="bg-[#0a0a0f] border-[#2a2a3e] text-white placeholder:text-slate-600 mb-3 min-h-[60px] rounded-xl" />
            <Button onClick={generateLeads} disabled={isGenerating} className="bg-indigo-600 hover:bg-indigo-700 text-sm">
              {isGenerating ? 'Generating...' : <><Sparkles className="w-4 h-4 mr-2" />Find Leads</>}
            </Button>
          </motion.div>
        )}
        {addMode === 'upload' && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="bg-[#111118] border border-[#1e1e2e] rounded-2xl overflow-hidden shrink-0">
            {uploadStatus && uploadStatus !== 'done' ? (
              <div className="p-8 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-full border-t-2 border-indigo-500 animate-spin mb-4" />
                <p className="text-sm font-medium text-white capitalize">{uploadStatus}...</p>
                <p className="text-xs text-slate-500 mt-2">
                  {uploadStatus === 'uploading' && 'Streaming file to backend...'}
                  {uploadStatus === 'processing' && 'Extracting leads and researching companies...'}
                  {uploadStatus === 'generating' && 'Groq Llama-3.1 generating personalized emails...'}
                  {uploadStatus === 'sending' && 'Queueing outreach via Gmail SMTP...'}
                </p>
              </div>
            ) : uploadStatus === 'done' ? (
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-bold text-emerald-400">✅ {lastResults.length} Leads Processed Successfully</p>
                  <button onClick={() => setUploadStatus(null)} className="text-xs text-slate-500 hover:text-white">Clear</button>
                </div>
                <div className="max-h-48 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                  {lastResults.map((rl, i) => (
                    <div key={i} className="bg-[#0a0a0f] border border-[#1e1e2e] rounded-xl p-3 flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-white truncate">{rl.name} <span className="text-slate-600 font-normal">@ {rl.company}</span></p>
                        <p className="text-[10px] text-slate-500 mt-0.5 truncate">{rl.generated_email?.slice(0, 60)}...</p>
                      </div>
                      <div className="flex items-center gap-2 ml-4 shrink-0">
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold">{rl.disc_type || 'D'}</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">SENT</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <label className="block p-6 text-center cursor-pointer hover:bg-white/[0.02]">
                <Upload className="w-7 h-7 text-slate-600 mx-auto mb-2" />
                <p className="text-sm text-slate-400">Drop CSV/Excel here or click to browse</p>
                <input type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={handleFileUpload} />
              </label>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Campaign Status Banner */}
      <AnimatePresence>
        {campaign?.status && campaign.status !== 'null' && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className={`border rounded-2xl px-5 py-3 flex items-center justify-between ${
              campaign.status === 'active' ? 'border-emerald-500/30 bg-emerald-500/5 border-l-4 border-l-emerald-500' :
              campaign.status === 'paused' ? 'border-amber-500/30 bg-amber-500/5 border-l-4 border-l-amber-500' :
              'border-blue-500/30 bg-blue-500/5 border-l-4 border-l-blue-500'
            }`}>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {campaign.status === 'active' && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 pulse-green" />}
                <span className="text-sm font-semibold text-white">{campaign.name}</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${
                campaign.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                campaign.status === 'paused' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                'bg-blue-500/10 text-blue-400 border-blue-500/20'
              }`}>{campaign.status}</span>
              <span className="text-xs text-slate-500">Started {hoursAgo}h ago · {campaign.leadsCount} leads in progress</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => updateCampaignStatus('paused')} className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#1a1a28] text-slate-400 text-xs hover:bg-[#2a2a38] hover:text-white transition-colors">
                <Pause className="w-3 h-3" /> Pause
              </button>
              <button className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#1a1a28] text-slate-400 text-xs hover:bg-[#2a2a38] hover:text-white transition-colors">
                <BarChart3 className="w-3 h-3" /> Report
              </button>
              <button onClick={() => updateCampaignStatus('complete')} className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-500/10 text-red-400 text-xs hover:bg-red-500/20 transition-colors border border-red-500/20">
                <StopCircle className="w-3 h-3" /> Stop
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Row 1 — KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Send, label: 'Total Sent', value: '847', liveValue: globalStats?.emailsSent || 847, sub: 'today', color: 'text-indigo-400' },
          { icon: Percent, label: 'Reply Rate', value: '8.1%', sub: '+1.2% vs avg', color: 'text-emerald-400' },
          { icon: CalendarCheck, label: 'Meetings Booked', value: '14', liveValue: globalStats?.meetings || 14, sub: 'this week', color: 'text-teal-400' },
          { icon: Users, label: 'Active Leads', value: '132', liveValue: campaign?.leadsCount || 132, sub: 'in sequences', color: 'text-violet-400' },
        ].map((kpi, i) => (
          <motion.div key={kpi.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-5">
            <kpi.icon className={`w-4 h-4 ${kpi.color} mb-3`} />
            <p className="text-2xl font-bold">
              <LiveNumber value={kpi.liveValue || kpi.value} className={`text-2xl font-bold ${kpi.color === 'text-indigo-400' ? 'text-white' : 'text-white'}`} />
            </p>
            <p className="text-xs font-medium text-slate-400 mt-0.5">{kpi.label}</p>
            <p className="text-[11px] text-slate-600 mt-0.5">{kpi.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Start Demo Button */}
      <motion.button
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        onClick={() => setUIState('showDemo', true)}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white font-bold text-base transition-all shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 flex items-center justify-center gap-2">
        ▶ Start Demo — Launch Your First AI Campaign
      </motion.button>

      {/* Row 2 — 3 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left — Upcoming Meetings */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-[#111118] border border-[#1e1e2e] rounded-2xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-[#1e1e2e] flex items-center gap-2">
            <Calendar className="w-4 h-4 text-teal-400" />
            <p className="text-sm font-semibold text-white">Upcoming Meetings</p>
          </div>
          <div className="divide-y divide-[#1a1a26]">
            {upcomingMeetings.length === 0 ? (
              <div className="px-5 py-8 text-center">
                <p className="text-slate-500 text-sm">No upcoming meetings.</p>
              </div>
            ) : upcomingMeetings.map((m) => {
              const date = new Date(m.scheduled_date);
              return (
                <div key={m.id} className="px-5 py-3 flex items-center gap-3 hover:bg-white/[0.02] transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-teal-500/10 flex flex-col items-center justify-center border border-teal-500/20 shrink-0">
                    <span className="text-[9px] font-bold text-teal-400">{date.toLocaleDateString('en', { month: 'short' }).toUpperCase()}</span>
                    <span className="text-sm font-bold text-white leading-none">{date.getDate()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{m.lead_name}</p>
                    <p className="text-xs text-slate-500 truncate">{m.lead_company}</p>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full shrink-0 ${m.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                    {m.status}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Center — Urgent Attention */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="bg-[#111118] border border-[#1e1e2e] rounded-2xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-[#1e1e2e] flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <p className="text-sm font-semibold text-white">Urgent Attention</p>
          </div>
          <div className="divide-y divide-[#1a1a26]">
            {urgentItems.map((item, i) => (
              <div key={i} className="px-5 py-3 flex items-start gap-3 hover:bg-white/[0.02] transition-colors">
                <div className={`w-2 h-2 rounded-full ${item.dot} mt-1.5 shrink-0`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{item.lead}</p>
                  <p className="text-xs text-slate-500 truncate">{item.company}</p>
                  <p className={`text-xs mt-0.5 ${item.color}`}>{item.issue}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right — AI Briefing */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-[#111118] border border-[#1e1e2e] rounded-2xl overflow-hidden flex flex-col">
          <div className="px-5 py-3.5 border-b border-[#1e1e2e] flex items-center gap-2">
            <Bot className="w-4 h-4 text-violet-400" />
            <p className="text-sm font-semibold text-white">AI Briefing</p>
          </div>
          <div className="px-5 py-4 flex-1">
            <p className="text-sm text-slate-300 leading-relaxed mb-4">{briefing}</p>
            <div className="space-y-2">
              {aiInsightCards.map((card, i) => (
                <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#0e0e16] border border-[#1a1a26]">
                  <span className="text-base shrink-0">{card.emoji}</span>
                  <p className="text-xs text-slate-400 leading-relaxed">{card.text}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <AIChatbot />
      {showHowItWorks && <HowItWorksModal onClose={() => setUIState('showHowItWorks', false)} />}
      {showPersonality && <PersonalityBuilderModal onClose={() => setUIState('showPersonality', false)} onSave={() => setUIState('showPersonality', false)} />}
      <AnimatePresence>
        {showDemo && <DemoFlow onClose={() => setUIState('showDemo', false)} />}
      </AnimatePresence>
    </div>
  );
}