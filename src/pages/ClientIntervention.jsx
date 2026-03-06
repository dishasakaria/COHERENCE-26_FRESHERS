import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Send, X, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCampaign } from '../components/campaign/CampaignContext';

const ALL_ITEMS = [
  { id: 1, lead: 'Sarah Chen', company: 'GlobalTech', issue: 'Replied: "not the right time"', confidence: 52, type: 'not_interested', pauseReason: null, daysPaused: null, lastAction: null },
  { id: 6, lead: 'David Kim', company: 'StartupHub', issue: 'Replied: "not relevant to us"', confidence: 44, type: 'not_interested', pauseReason: null, daysPaused: null, lastAction: null },
  { id: 2, lead: 'Chen Wei', company: 'ByteForce', issue: 'AI uncertain on channel choice — email vs LinkedIn', confidence: 48, type: 'low_confidence', aiDecision: 'Send follow-up email', pauseReason: null, daysPaused: null },
  { id: 3, lead: 'Amit Patel', company: 'CloudNine', issue: 'Low engagement after 4 touchpoints', confidence: 55, type: 'low_confidence', aiDecision: 'Move to nurture or archive', pauseReason: null, daysPaused: null },
  { id: 7, lead: 'Riya Sharma', company: 'FinFlow', issue: 'Confidence below threshold on tone selection', confidence: 49, type: 'low_confidence', aiDecision: 'Switch to Direct tone', pauseReason: null, daysPaused: null },
  { id: 4, lead: 'Lisa Wang', company: 'DataMax', issue: 'Fatigue threshold crossed (score: 82)', confidence: 72, type: 'paused', pauseReason: 'Fatigue threshold 82/75', daysPaused: 2, lastAction: null },
  { id: 5, lead: 'Mike Ross', company: 'LegalEase', issue: 'Human paused — reviewing for re-engage', confidence: 68, type: 'taken_over', pauseReason: null, daysPaused: null, lastAction: 'Manual email sent 3 days ago' },
];

const instructionPresets = ['Be less aggressive this week', 'Focus only on Hot leads for 24h', 'No contacts on Fridays', 'Shorter messages for Tech companies'];

const TABS = [
  { key: 'not_interested', label: '🔴 Not Interested', color: 'text-red-400' },
  { key: 'low_confidence', label: '⚠️ Low Confidence', color: 'text-amber-400' },
  { key: 'paused', label: '⏸ Paused', color: 'text-slate-400' },
  { key: 'taken_over', label: '👤 Taken Over', color: 'text-blue-400' },
];

export default function ClientIntervention() {
  const [items, setItems] = useState(ALL_ITEMS);
  const [resolvedIds, setResolvedIds] = useState([]);
  const [activeTab, setActiveTab] = useState('not_interested');
  const { state } = useCampaign();
  const globalInterventions = state?.interventions;
  const [pulseTabs, setPulseTabs] = useState({});
  const prevCountsRef = useRef({});

  useEffect(() => {
    if (!globalInterventions) return;
    const tabMap = { not_interested: 'not_interested', lowConfidence: 'low_confidence', paused: 'paused', takenOver: 'taken_over' };
    Object.entries(tabMap).forEach(([key, tabKey]) => {
      const curr = globalInterventions[key] || 0;
      const prev = prevCountsRef.current[key] || 0;
      if (curr > prev) {
        setPulseTabs(p => ({ ...p, [tabKey]: true }));
        setTimeout(() => setPulseTabs(p => ({ ...p, [tabKey]: false })), 600);
      }
      prevCountsRef.current[key] = curr;
    });
  }, [globalInterventions]);
  const [instruction, setInstruction] = useState('');
  const [sentInstructions, setSentInstructions] = useState([]);
  const [expandedReengage, setExpandedReengage] = useState(null);
  const [expandedOverride, setExpandedOverride] = useState(null);
  const [reengeageMsg, setReengageMsg] = useState("Hi [name], I understand timing wasn't right before. We've helped similar teams achieve [result] — would a quick 15-min call this week make sense?");

  const resolve = (id) => setResolvedIds(prev => [...prev, id]);
  const sendInstruction = (text) => {
    if (!text.trim()) return;
    setSentInstructions(prev => [{ text, time: 'Just now' }, ...prev]);
    setInstruction('');
  };

  const visible = items.filter(i => !resolvedIds.includes(i.id));
  const tabItems = visible.filter(i => i.type === activeTab);
  const countByTab = (type) => visible.filter(i => i.type === type).length;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      <h1 className="text-2xl font-semibold text-white">Interventions</h1>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {TABS.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-colors border ${activeTab === tab.key ? 'bg-indigo-600 text-white border-indigo-500' : 'border-[#2a2a3e] text-slate-400 hover:text-white hover:bg-[#1a1a28]'}`}>
            {tab.label}
            {countByTab(tab.key) > 0 && (
              <span className={`px-1.5 py-0.5 rounded-full text-xs transition-all duration-300 ${activeTab === tab.key ? 'bg-white/20' : pulseTabs[tab.key] ? 'bg-red-500/40 text-white scale-110' : 'bg-[#2a2a3e]'}`}>{countByTab(tab.key)}</span>
            )}
          </button>
        ))}
      </div>

      {/* AI Instructions bar */}
      <div className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-4">
        {sentInstructions.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {sentInstructions.map((s, i) => (
              <span key={i} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs text-amber-400">
                {s.text}
                <button onClick={() => setSentInstructions(prev => prev.filter((_, j) => j !== i))}><X className="w-2.5 h-2.5" /></button>
              </span>
            ))}
          </div>
        )}
        <div className="flex flex-wrap gap-2 mb-3">
          {instructionPresets.map((p, i) => (
            <button key={i} onClick={() => setInstruction(p)}
              className="px-3 py-1.5 rounded-xl text-xs text-slate-400 bg-[#1a1a28] border border-[#2a2a3e] hover:border-slate-500 hover:text-slate-300 transition-colors">
              {p}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <Input placeholder="Give the AI a new rule... e.g. 'No calls today' or 'Focus only on hot leads'" value={instruction} onChange={e => setInstruction(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendInstruction(instruction)}
            className="bg-[#0a0a0f] border-[#2a2a3e] text-white placeholder:text-slate-600 rounded-xl" />
          <Button onClick={() => sendInstruction(instruction)} className="bg-amber-600 hover:bg-amber-700 rounded-xl px-4">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Tab content */}
      <div className="space-y-2">
        <AnimatePresence>
          {tabItems.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-10 text-center">
              <CheckCircle2 className="w-7 h-7 text-emerald-500 mx-auto mb-2" />
              <p className="text-white font-medium">All clear in this category</p>
            </motion.div>
          ) : tabItems.map((item, idx) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }}
              transition={{ delay: idx * 0.04 }} className="bg-[#111118] border border-[#1e1e2e] rounded-2xl overflow-hidden">
              <div className="p-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#1a1a28] flex items-center justify-center text-sm font-bold text-slate-300 shrink-0">{item.lead[0]}</div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-semibold text-white">{item.lead}</span>
                  <span className="text-xs text-slate-500 ml-2">{item.company}</span>
                  <p className="text-xs text-slate-400 italic mt-0.5">{item.issue}</p>
                </div>

                {/* NOT INTERESTED actions */}
                {activeTab === 'not_interested' && (
                  <div className="flex items-center gap-2 shrink-0">
                    <Button size="sm" onClick={() => setExpandedReengage(expandedReengage === item.id ? null : item.id)} className="bg-emerald-600 hover:bg-emerald-700 text-xs h-7">Re-engage</Button>
                    <Button size="sm" onClick={() => resolve(item.id)} className="bg-amber-600/20 text-amber-400 hover:bg-amber-600/30 text-xs h-7 border border-amber-500/20">Snooze</Button>
                    <Button size="sm" onClick={() => resolve(item.id)} className="bg-red-600/20 text-red-400 hover:bg-red-600/30 text-xs h-7 border border-red-500/20">Archive</Button>
                  </div>
                )}

                {/* LOW CONFIDENCE actions */}
                {activeTab === 'low_confidence' && (
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-slate-500 mr-2">AI: <span className="text-slate-300">{item.aiDecision}</span> — <span className={item.confidence >= 55 ? 'text-amber-400' : 'text-red-400'}>{item.confidence}%</span></span>
                    <Button size="sm" onClick={() => resolve(item.id)} className="bg-emerald-600 hover:bg-emerald-700 text-xs h-7">✅ Confirm</Button>
                    <Button size="sm" onClick={() => setExpandedOverride(expandedOverride === item.id ? null : item.id)} variant="outline" className="border-indigo-500/40 text-indigo-400 text-xs h-7">↩ Override</Button>
                  </div>
                )}

                {/* PAUSED actions */}
                {activeTab === 'paused' && (
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-slate-500 mr-2">{item.pauseReason} · {item.daysPaused}d paused</span>
                    <Button size="sm" onClick={() => resolve(item.id)} className="bg-emerald-600 hover:bg-emerald-700 text-xs h-7"><Play className="w-3 h-3 mr-1" />Resume</Button>
                    <Button size="sm" onClick={() => resolve(item.id)} className="bg-red-600/20 text-red-400 hover:bg-red-600/30 text-xs h-7 border border-red-500/20">Archive</Button>
                  </div>
                )}

                {/* TAKEN OVER actions */}
                {activeTab === 'taken_over' && (
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-slate-500">{item.lastAction}</span>
                    <Button size="sm" onClick={() => resolve(item.id)} className="bg-indigo-600 hover:bg-indigo-700 text-xs h-7">Return to AI</Button>
                  </div>
                )}
              </div>

              {/* Re-engage expanded */}
              <AnimatePresence>
                {activeTab === 'not_interested' && expandedReengage === item.id && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-[#1e1e2e]">
                    <div className="p-4">
                      <p className="text-xs text-slate-500 mb-2">AI-generated re-engagement message (editable):</p>
                      <textarea value={reengeageMsg} onChange={e => setReengageMsg(e.target.value)} rows={3}
                        className="w-full bg-[#0a0a0f] border border-[#2a2a3e] text-white text-sm rounded-xl p-3 resize-none outline-none focus:border-indigo-500/50" />
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" onClick={() => { resolve(item.id); setExpandedReengage(null); }} className="bg-emerald-600 hover:bg-emerald-700 text-xs">Send Re-engage</Button>
                        <Button size="sm" onClick={() => setExpandedReengage(null)} variant="ghost" className="text-slate-500 text-xs">Cancel</Button>
                      </div>
                    </div>
                  </motion.div>
                )}
                {activeTab === 'low_confidence' && expandedOverride === item.id && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-[#1e1e2e]">
                    <div className="p-4 flex items-center gap-3">
                      <span className="text-xs text-slate-400">Override action:</span>
                      <select className="bg-[#0a0a0f] border border-[#2a2a3e] text-white text-xs rounded-lg px-2 py-1.5">
                        <option>Send LinkedIn DM instead</option>
                        <option>Move to Nurture sequence</option>
                        <option>Pause for 7 days</option>
                        <option>Archive lead</option>
                      </select>
                      <Button size="sm" onClick={() => { resolve(item.id); setExpandedOverride(null); }} className="bg-indigo-600 hover:bg-indigo-700 text-xs">Apply</Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}