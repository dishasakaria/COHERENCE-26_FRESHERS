import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Upload, Sparkles, ChevronDown, ChevronRight, Edit3, Check, X, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import DiscBadge from '../components/ui-custom/DiscBadge';
import ScoreBar from '../components/ui-custom/ScoreBar';
import LeadDetailPanel from '../components/leads/LeadDetailPanel';
import PersonalityBuilderModal from '../components/leads/PersonalityBuilderModal';

// Lead score
function calcScore(lead) {
  return Math.round((lead.interest_score || 0) * 0.4 + (lead.trust_score || 0) * 0.4 + (100 - (lead.fatigue_score || 0)) * 0.2);
}

function ScoreBadge({ score }) {
  const color = score >= 70 ? 'text-emerald-400' : score >= 40 ? 'text-amber-400' : 'text-red-400';
  return <span className={`text-xs font-bold ${color}`}>{score}</span>;
}

function ResearchDot({ depth }) {
  const configs = {
    basic: { color: 'bg-red-500', tooltip: 'Basic' },
    standard: { color: 'bg-yellow-500', tooltip: 'Standard' },
    deep: { color: 'bg-emerald-500', tooltip: 'Deep' },
  };
  const cfg = configs[depth] || configs.basic;
  return (
    <div className="relative group shrink-0">
      <div className={`w-2 h-2 rounded-full ${cfg.color}`} />
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded-lg bg-[#1a1a28] border border-[#2a2a3e] text-[10px] text-slate-300 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">{cfg.tooltip}</div>
    </div>
  );
}

function PathBadge({ lead }) {
  const fatigue = lead.fatigue_score || 0;
  const stage = lead.stage;
  if (['hot', 'replied', 'meeting_scheduled', 'converted'].includes(stage))
    return <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">Converting</span>;
  if (fatigue > 75 || stage === 'nurture')
    return <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 shrink-0">Intervention</span>;
  if (['engaged', 'in_sequence'].includes(stage))
    return <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">Nurturing</span>;
  return <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-500/10 text-slate-400 border border-slate-500/20 shrink-0">Prospecting</span>;
}

const STAGES = [
  { key: 'new', label: 'New', color: 'text-slate-400' },
  { key: 'in_sequence', label: 'In Sequence', color: 'text-indigo-400' },
  { key: 'engaged', label: 'Engaged', color: 'text-violet-400' },
  { key: 'hot', label: 'Hot 🔥', color: 'text-orange-400' },
  { key: 'replied', label: 'Replied', color: 'text-emerald-400' },
  { key: 'meeting_scheduled', label: 'Meeting Scheduled', color: 'text-teal-400' },
  { key: 'converted', label: 'Converted', color: 'text-green-400' },
  { key: 'nurture', label: 'Nurture', color: 'text-amber-400' },
];

const KANBAN_STAGES = [
  { key: 'new', label: 'New', color: 'border-slate-500/30 text-slate-400' },
  { key: 'in_sequence', label: 'In Sequence', color: 'border-indigo-500/30 text-indigo-400' },
  { key: 'engaged', label: 'Engaged', color: 'border-violet-500/30 text-violet-400' },
  { key: 'hot', label: 'Hot 🔥', color: 'border-orange-500/30 text-orange-400' },
  { key: 'replied', label: 'Replied', color: 'border-emerald-500/30 text-emerald-400' },
  { key: 'meeting_scheduled', label: 'Meeting', color: 'border-teal-500/30 text-teal-400' },
  { key: 'converted', label: 'Converted ✓', color: 'border-green-500/30 text-green-400' },
  { key: 'nurture', label: 'Nurture', color: 'border-amber-500/30 text-amber-400' },
];

function KanbanCard({ lead, stages, onMoveStage }) {
  const [editing, setEditing] = useState(false);
  const [selectedStage, setSelectedStage] = useState(lead.stage);
  const score = calcScore(lead);
  const scoreColor = score >= 70 ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : score >= 40 ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' : 'text-red-400 bg-red-500/10 border-red-500/20';
  return (
    <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
      className="bg-[#0e0e16] border border-[#1a1a26] rounded-xl p-2.5 hover:border-[#2a2a3e] transition-colors">
      <div className="flex items-start justify-between mb-1.5">
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          <div className="w-6 h-6 rounded-full bg-[#1a1a28] flex items-center justify-center text-[10px] font-bold text-slate-300 shrink-0">{lead.name?.[0]}</div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-white truncate">{lead.name}</p>
            <p className="text-[10px] text-slate-500 truncate">{lead.company}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <span className={`text-[9px] px-1.5 py-0.5 rounded-full border font-bold ${scoreColor}`}>{score}</span>
          <button onClick={() => setEditing(!editing)} className="p-0.5 rounded hover:bg-white/10 text-slate-600 hover:text-slate-300">
            <Edit3 className="w-2.5 h-2.5" />
          </button>
        </div>
      </div>
      <div className="space-y-0.5 mb-1.5">
        <ScoreBar value={lead.interest_score || 0} color="blue" />
        <ScoreBar value={lead.trust_score || 0} color="green" />
      </div>
      {editing && (
        <div className="p-1.5 bg-[#111118] rounded-lg border border-[#1e1e2e]">
          <select value={selectedStage} onChange={e => setSelectedStage(e.target.value)}
            className="w-full text-[10px] bg-[#0a0a0f] border border-[#2a2a3e] text-white rounded-md px-1.5 py-1 mb-1.5">
            {stages.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
          </select>
          <div className="flex gap-1">
            <button onClick={() => { onMoveStage(lead.id, selectedStage); setEditing(false); }} className="flex-1 flex items-center justify-center gap-0.5 py-0.5 rounded bg-emerald-600 text-[10px] text-white">
              <Check className="w-2.5 h-2.5" /> Save
            </button>
            <button onClick={() => setEditing(false)} className="flex-1 flex items-center justify-center gap-0.5 py-0.5 rounded bg-[#1a1a28] text-[10px] text-slate-400">
              <X className="w-2.5 h-2.5" /> Cancel
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default function ClientLeads() {
  const [tab, setTab] = useState('leads');
  const [search, setSearch] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [addMode, setAddMode] = useState(null);
  const [expandedStages, setExpandedStages] = useState(['hot', 'engaged', 'in_sequence']);
  const [selectedLead, setSelectedLead] = useState(null);
  const [showPersonality, setShowPersonality] = useState(false);
  const [personality, setPersonality] = useState(null);
  const queryClient = useQueryClient();

  const { data: leads = [] } = useQuery({
    queryKey: ['leads'],
    queryFn: () => base44.entities.Lead.list('-created_date', 200),
  });

  const createLeadsMutation = useMutation({
    mutationFn: (data) => base44.entities.Lead.bulkCreate(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['leads'] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, stage }) => base44.entities.Lead.update(id, { stage }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['leads'] }),
  });

  const toggleStage = (key) => setExpandedStages(prev =>
    prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
  );

  const filtered = leads.filter(l =>
    !search || l.name?.toLowerCase().includes(search.toLowerCase()) || l.company?.toLowerCase().includes(search.toLowerCase())
  );

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
    setAddMode(null);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    const result = await base44.integrations.Core.ExtractDataFromUploadedFile({ file_url, json_schema: { type: "array", items: { type: "object", properties: { name: { type: "string" }, email: { type: "string" }, company: { type: "string" }, title: { type: "string" } } } } });
    if (result?.output) {
      const data = (Array.isArray(result.output) ? result.output : [result.output]).map(l => ({ ...l, interest_score: 0, trust_score: 0, fatigue_score: 0, stage: 'new', channels_used: [] }));
      await createLeadsMutation.mutateAsync(data);
    }
    setAddMode(null);
  };

  return (
    <div className="p-5 flex flex-col gap-4 h-screen overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <h1 className="text-2xl font-semibold text-white">Leads & Pipeline</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowPersonality(true)} className="border-violet-500/40 text-violet-300 hover:bg-violet-500/10 text-xs">
            <User className="w-3.5 h-3.5 mr-1.5" /> My Outreach Identity
          </Button>
          <Button variant="outline" size="sm" onClick={() => setAddMode(addMode === 'upload' ? null : 'upload')} className="border-[#2a2a3e] text-slate-300 hover:bg-[#1a1a28] text-xs">
            <Upload className="w-3.5 h-3.5 mr-1.5" /> Upload CSV
          </Button>
          <Button size="sm" onClick={() => setAddMode(addMode === 'ai' ? null : 'ai')} className="bg-indigo-600 hover:bg-indigo-700 text-xs">
            <Sparkles className="w-3.5 h-3.5 mr-1.5" /> AI Find Leads
          </Button>
        </div>
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
            <label className="block p-6 text-center cursor-pointer hover:bg-white/[0.02]">
              <Upload className="w-7 h-7 text-slate-600 mx-auto mb-2" />
              <p className="text-sm text-slate-400">Drop CSV/Excel here or click to browse</p>
              <input type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={handleFileUpload} />
            </label>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs */}
      <div className="flex gap-1 shrink-0">
        <button onClick={() => setTab('leads')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${tab === 'leads' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-[#1a1a28]'}`}>
          👥 Leads
        </button>
        <button onClick={() => setTab('pipeline')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${tab === 'pipeline' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-[#1a1a28]'}`}>
          🗂️ Pipeline
        </button>
        <span className="ml-auto text-xs text-slate-500 self-center">{leads.length} total leads</span>
      </div>

      {/* LEADS TAB */}
      {tab === 'leads' && (
        <div className="flex gap-4 flex-1 overflow-hidden min-h-0">
          {/* Left — stage list (40%) */}
          <div className="flex flex-col gap-3 overflow-hidden" style={{ flex: '0 0 40%' }}>
            <div className="relative shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600" />
              <Input placeholder="Search leads..." value={search} onChange={e => setSearch(e.target.value)}
                className="pl-9 bg-[#111118] border-[#1e1e2e] text-white placeholder:text-slate-600 rounded-xl h-9 text-sm" />
            </div>
            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
              {STAGES.map(stage => {
                const stageLeads = filtered.filter(l => l.stage === stage.key);
                const isOpen = expandedStages.includes(stage.key);
                return (
                  <div key={stage.key} className="bg-[#111118] border border-[#1e1e2e] rounded-xl overflow-hidden">
                    <button onClick={() => toggleStage(stage.key)}
                      className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                      <div className="flex items-center gap-2.5">
                        {isOpen ? <ChevronDown className="w-3.5 h-3.5 text-slate-500" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-500" />}
                        <span className={`text-sm font-semibold ${stage.color}`}>{stage.label}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 bg-[#1a1a26] px-2 py-0.5 rounded-full">{stageLeads.length}</span>
                    </button>
                    <AnimatePresence>
                      {isOpen && stageLeads.length > 0 && (
                        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                          <div className="border-t border-[#1a1a26] divide-y divide-[#1a1a26]">
                            {stageLeads.map(lead => {
                              const score = calcScore(lead);
                              const tierIcon = score >= 70 ? '🔥' : score < 40 ? '❄️' : '';
                              return (
                                <div key={lead.id} onClick={() => setSelectedLead(lead)}
                                  className={`px-4 py-3 flex items-center gap-2.5 hover:bg-white/[0.02] cursor-pointer transition-colors ${selectedLead?.id === lead.id ? 'bg-indigo-500/5 border-l-2 border-indigo-500' : ''}`}>
                                  <ResearchDot depth={lead.research_depth || 'basic'} />
                                  <div className="w-7 h-7 rounded-full bg-[#1a1a28] flex items-center justify-center text-xs font-bold text-slate-300 shrink-0">{lead.name?.[0]}</div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white truncate">{tierIcon} {lead.name}</p>
                                    <p className="text-[11px] text-slate-500 truncate">{lead.title} · {lead.company}</p>
                                  </div>
                                  <PathBadge lead={lead} />
                                  <DiscBadge type={lead.disc_type} />
                                  <ScoreBadge score={score} />
                                </div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                      {isOpen && stageLeads.length === 0 && (
                        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                          <div className="border-t border-[#1a1a26] px-4 py-4 text-center text-xs text-slate-600">No leads in this stage</div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right — Lead Detail Panel (60%) */}
          <div className="flex-1 overflow-hidden">
            {selectedLead ? (
              <LeadDetailPanel lead={selectedLead} onClose={() => setSelectedLead(null)} />
            ) : (
              <div className="h-full bg-[#0e0e16] border border-[#1e1e2e] rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-2xl bg-[#1a1a28] flex items-center justify-center mx-auto mb-3">
                    <User className="w-5 h-5 text-slate-600" />
                  </div>
                  <p className="text-slate-500 text-sm font-medium">Select a lead to see their profile</p>
                  <p className="text-slate-600 text-xs mt-1">Click any lead in the list</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* PIPELINE TAB */}
      {tab === 'pipeline' && (
        <div className="flex-1 overflow-auto">
          <div className="flex gap-3 min-w-max pb-4">
            {KANBAN_STAGES.map((stage) => {
              const stageLeads = leads.filter(l => l.stage === stage.key);
              const borderClass = stage.color.split(' ')[0];
              const textClass = stage.color.split(' ')[1];
              return (
                <div key={stage.key} className={`bg-[#111118] border rounded-2xl overflow-hidden flex-shrink-0`} style={{ width: 160, borderColor: 'rgba(30,30,46,1)' }}>
                  <div className="px-3 py-2.5 border-b border-[#1a1a26] flex items-center justify-between">
                    <span className={`text-[11px] font-semibold ${textClass}`}>{stage.label}</span>
                    <span className="text-[9px] text-slate-600 bg-[#1a1a26] px-1.5 py-0.5 rounded-full">{stageLeads.length}</span>
                  </div>
                  <div className="p-2 space-y-1.5 min-h-[100px]">
                    {stageLeads.length === 0 ? (
                      <p className="text-[10px] text-slate-700 text-center py-4">Empty</p>
                    ) : stageLeads.slice(0, 5).map(lead => (
                      <KanbanCard key={lead.id} lead={lead} stages={KANBAN_STAGES} onMoveStage={(id, stage) => updateMutation.mutate({ id, stage })} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {showPersonality && (
        <PersonalityBuilderModal
          onClose={() => setShowPersonality(false)}
          onSave={(p) => { setPersonality(p); setShowPersonality(false); }}
        />
      )}
    </div>
  );
}