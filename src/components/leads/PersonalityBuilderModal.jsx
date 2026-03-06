import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const TONES = ['Confident', 'Humble', 'Witty', 'Direct', 'Warm', 'Formal', 'Conversational', 'Bold', 'Empathetic', 'Data-driven'];
const PHILOSOPHIES = [
  'Lead with value — educate first, sell later',
  'Lead with pain — call out their problem directly',
  'Lead with social proof — name-drop, build credibility',
  'Lead with curiosity — ask questions, don\'t pitch',
  'Lead with brevity — short, punchy, get to the point',
];

export default function PersonalityBuilderModal({ onClose, onSave }) {
  const [step, setStep] = useState(1);
  const [form1, setForm1] = useState({ name: '', description: '', target: '' });
  const [form2, setForm2] = useState({ tones: [], philosophy: '', length: 'Medium', cta: 'Soft', formality: 30 });
  const [loading, setLoading] = useState(false);
  const [personality, setPersonality] = useState(null);

  const canNext1 = form1.name.trim() && form1.description.trim() && form1.target.trim();
  const canNext2 = form2.tones.length > 0 && form2.philosophy;

  const toggleTone = (t) => setForm2(p => ({ ...p, tones: p.tones.includes(t) ? p.tones.filter(x => x !== t) : [...p.tones, t] }));

  const buildPersonality = async () => {
    setStep(3);
    setLoading(true);
    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `Based on this sender profile — company: ${form1.name}, product: ${form1.description}, target: ${form1.target}, tone: ${form2.tones.join(', ')}, philosophy: ${form2.philosophy}, length: ${form2.length}, CTA: ${form2.cta}, formality: ${form2.formality}/100 — generate an outreach personality card. Return ONLY JSON with these exact keys: voice_summary (2 sentences), dos (array of 5 rules), donts (array of 5 rules), sample_opener (one perfect example opening line), adjectives (array of 5 words).`,
      response_json_schema: {
        type: 'object', properties: {
          voice_summary: { type: 'string' },
          dos: { type: 'array', items: { type: 'string' } },
          donts: { type: 'array', items: { type: 'string' } },
          sample_opener: { type: 'string' },
          adjectives: { type: 'array', items: { type: 'string' } },
        }
      }
    });
    setPersonality(res);
    setLoading(false);
  };

  const handleSave = () => {
    onSave(personality);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-[#0e0e18] border border-[#1e1e2e] rounded-2xl w-full max-w-xl mx-4 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#1e1e2e] flex items-center justify-between shrink-0">
          <div>
            <p className="text-sm font-semibold text-white">My Outreach Identity</p>
            <p className="text-xs text-slate-500">Step {step} of 3</p>
          </div>
          <div className="flex gap-1.5">
            {[1, 2, 3].map(s => (
              <div key={s} className={`w-2 h-2 rounded-full transition-colors ${s <= step ? 'bg-indigo-500' : 'bg-[#2a2a3e]'}`} />
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {/* Step 1 */}
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-6 space-y-4">
                <h2 className="text-xl font-bold text-white">Who Are You?</h2>
                <div>
                  <label className="text-xs text-slate-400 mb-1.5 block">Company / Startup name</label>
                  <Input value={form1.name} onChange={e => setForm1(p => ({ ...p, name: e.target.value }))}
                    placeholder="e.g. FlowReach AI" className="bg-[#0a0a0f] border-[#2a2a3e] text-white" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1.5 block">What you do</label>
                  <Textarea value={form1.description} onChange={e => setForm1(p => ({ ...p, description: e.target.value }))}
                    placeholder="We help B2B companies automate their outreach..." rows={3}
                    className="bg-[#0a0a0f] border-[#2a2a3e] text-white resize-none" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1.5 block">Your target customer</label>
                  <Input value={form1.target} onChange={e => setForm1(p => ({ ...p, target: e.target.value }))}
                    placeholder="e.g. SaaS founders with 10-50 employees" className="bg-[#0a0a0f] border-[#2a2a3e] text-white" />
                </div>
              </motion.div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-6 space-y-5">
                <h2 className="text-xl font-bold text-white">Your Outreach Style</h2>
                <div>
                  <label className="text-xs text-slate-400 mb-2 block">Select your tone (multi-select)</label>
                  <div className="flex flex-wrap gap-2">
                    {TONES.map(t => (
                      <button key={t} onClick={() => toggleTone(t)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${form2.tones.includes(t) ? 'bg-violet-600 border-violet-500 text-white' : 'border-[#2a2a3e] text-slate-400 hover:border-slate-500'}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-2 block">Your outreach philosophy</label>
                  <div className="space-y-2">
                    {PHILOSOPHIES.map(p => (
                      <button key={p} onClick={() => setForm2(prev => ({ ...prev, philosophy: p }))}
                        className={`w-full text-left px-3.5 py-2.5 rounded-xl border text-sm transition-colors ${form2.philosophy === p ? 'border-violet-500 bg-violet-500/10 text-white' : 'border-[#2a2a3e] text-slate-400 hover:border-slate-500'}`}>
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 mb-2 block">Email length</label>
                    <div className="flex gap-1">
                      {['Short', 'Medium', 'Long'].map(l => (
                        <button key={l} onClick={() => setForm2(p => ({ ...p, length: l }))}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-colors ${form2.length === l ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-[#2a2a3e] text-slate-400'}`}>
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 mb-2 block">CTA style</label>
                    <div className="flex gap-1">
                      {['Soft', 'Direct', 'No ask'].map(c => (
                        <button key={c} onClick={() => setForm2(p => ({ ...p, cta: c }))}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-colors ${form2.cta === c ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-[#2a2a3e] text-slate-400'}`}>
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-slate-500 mb-2">
                    <span>Hey [first name]!</span>
                    <span>Formality</span>
                    <span>Dear Mr./Ms. [last name],</span>
                  </div>
                  <Slider value={[form2.formality]} onValueChange={([v]) => setForm2(p => ({ ...p, formality: v }))} max={100} step={1}
                    className="[&_[role=slider]]:bg-white [&_[role=slider]]:border-2 [&_[role=slider]]:border-indigo-500 [&_[role=slider]]:w-5 [&_[role=slider]]:h-5" />
                </div>
              </motion.div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-6">
                {loading ? (
                  <div className="space-y-4">
                    <p className="text-sm text-slate-400 text-center mb-6">Building your personality card...</p>
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-4 bg-[#1a1a28] rounded-lg animate-pulse" style={{ width: `${90 - i * 10}%` }} />
                    ))}
                    <div className="h-20 bg-[#1a1a28] rounded-xl animate-pulse mt-4" />
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <div className="h-32 bg-[#1a1a28] rounded-xl animate-pulse" />
                      <div className="h-32 bg-[#1a1a28] rounded-xl animate-pulse" />
                    </div>
                  </div>
                ) : personality && (
                  <div className="space-y-5">
                    <div>
                      <p className="text-xs text-indigo-400 font-semibold uppercase tracking-wider mb-1">Your Outreach Voice</p>
                      <h2 className="text-xl font-bold text-white mb-3">Personality Card</h2>
                      <div className="bg-[#1a1a28] border border-violet-500/30 rounded-xl px-5 py-4">
                        <p className="text-base text-white italic">"{personality.sample_opener}"</p>
                        <p className="text-xs text-slate-400 mt-2 leading-relaxed">{personality.voice_summary}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-[#0e0e16] border border-emerald-500/20 rounded-xl p-4">
                        <p className="text-xs font-semibold text-emerald-400 mb-2">✅ Always Do</p>
                        <ul className="space-y-1.5">
                          {(personality.dos || []).map((d, i) => (
                            <li key={i} className="text-xs text-slate-300 flex gap-1.5"><span className="text-emerald-500 shrink-0">✓</span>{d}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-[#0e0e16] border border-red-500/20 rounded-xl p-4">
                        <p className="text-xs font-semibold text-red-400 mb-2">❌ Never Do</p>
                        <ul className="space-y-1.5">
                          {(personality.donts || []).map((d, i) => (
                            <li key={i} className="text-xs text-slate-300 flex gap-1.5"><span className="text-red-500 shrink-0">✗</span>{d}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(personality.adjectives || []).map((a, i) => (
                        <span key={i} className="px-3 py-1 rounded-full bg-violet-600/20 border border-violet-500/30 text-xs text-violet-300 font-medium">{a}</span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#1e1e2e] flex justify-between shrink-0">
          <Button variant="ghost" onClick={() => setStep(s => Math.max(1, s - 1))} disabled={step === 1 || loading} className="text-slate-400">
            ← Back
          </Button>
          {step === 1 && <Button onClick={() => setStep(2)} disabled={!canNext1} className="bg-indigo-600 hover:bg-indigo-700">Next →</Button>}
          {step === 2 && <Button onClick={buildPersonality} disabled={!canNext2} className="bg-indigo-600 hover:bg-indigo-700">Next →</Button>}
          {step === 3 && !loading && personality && (
            <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700">Save & Start Outreach</Button>
          )}
        </div>
      </motion.div>
    </div>
  );
}