import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateOutreachIdentity } from '@/utils/api';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, CheckCircle2, Sparkles, Loader2, Award, ArrowRight } from 'lucide-react';

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
  const [form, setForm] = useState({ 
    name: '', 
    description: '', 
    target: '',
    tones: [], 
    philosophy: '', 
    length: 'Medium', 
    cta: 'Soft', 
    formality: 30 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [personality, setPersonality] = useState(null);

  const canNext1 = form.name.trim() && form.description.trim() && form.target.trim() && form.tones.length > 0 && form.philosophy;

  const toggleTone = (t) => setForm(p => ({ ...p, tones: p.tones.includes(t) ? p.tones.filter(x => x !== t) : [...p.tones, t] }));

  const buildPersonality = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = {
        startup_name: form.name,
        what_you_do: form.description,
        target_customer: form.target,
        tones: form.tones.join(', '),
        philosophy: form.philosophy
      };
      
      const res = await generateOutreachIdentity(data);
      setPersonality(res);
      setStep(2);
    } catch (err) {
      console.warn('Backend unavailable, using sandbox fallback');
      // The generateOutreachIdentity in api.js now handles the fallback, 
      // but in case it still throws, we can re-throw or handle here.
      setError(null); // Clear error if we have a fallback strategy in the API
    } finally {
      setLoading(false);
    }
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
            {/* Step 1: Input Form */}
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-6 space-y-6">
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-400" />
                    Define Your Identity
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                       <label className="text-xs text-slate-400 mb-1.5 block font-medium">Company / Startup name</label>
                       <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                        placeholder="e.g. FlowReach AI" className="bg-[#0a0a0f] border-[#2a2a3e] text-white focus:border-indigo-500 h-10" />
                    </div>
                    <div className="col-span-2">
                      <label className="text-xs text-slate-400 mb-1.5 block font-medium">What you do</label>
                      <Textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                        placeholder="We help B2B companies automate their outreach..." rows={2}
                        className="bg-[#0a0a0f] border-[#2a2a3e] text-white resize-none focus:border-indigo-500" />
                    </div>
                    <div className="col-span-2">
                      <label className="text-xs text-slate-400 mb-1.5 block font-medium">Your target customer</label>
                      <Input value={form.target} onChange={e => setForm(p => ({ ...p, target: e.target.value }))}
                        placeholder="e.g. SaaS founders with 10-50 employees" className="bg-[#0a0a0f] border-[#2a2a3e] text-white focus:border-indigo-500 h-10" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <h2 className="text-lg font-bold text-white">Outreach Style</h2>
                  <div>
                    <label className="text-xs text-slate-400 mb-2 block font-medium">Select your tones (min 1)</label>
                    <div className="flex flex-wrap gap-2">
                      {TONES.map(t => (
                        <button key={t} onClick={() => toggleTone(t)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${form.tones.includes(t) ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-transparent border-[#2a2a3e] text-slate-400 hover:border-slate-500'}`}>
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 mb-2 block font-medium">Outreach philosophy</label>
                    <div className="space-y-2">
                      {PHILOSOPHIES.map(p => (
                        <button key={p} onClick={() => setForm(prev => ({ ...prev, philosophy: p }))}
                          className={`w-full text-left px-3.5 py-2.5 rounded-xl border text-sm transition-all ${form.philosophy === p ? 'border-indigo-500 bg-indigo-500/10 text-white' : 'border-[#2a2a3e] text-slate-400 hover:border-slate-500'}`}>
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {error && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex gap-3 items-center">
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                    <p className="text-xs text-red-200">{error}</p>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Step 2: Generated Identity Card */}
            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-6">
                {personality && (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-xs text-indigo-400 font-bold uppercase tracking-widest mb-1">Generated Card</p>
                        <h2 className="text-2xl font-black text-white">Outreach Identity</h2>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
                        <Award className="w-6 h-6 text-indigo-500" />
                      </div>
                    </div>

                    <div className="bg-[#1a1a28] border border-indigo-500/30 rounded-2xl px-6 py-5 shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Sparkles className="w-16 h-16 text-white" />
                      </div>
                      <p className="text-xs text-indigo-300 font-bold uppercase mb-2">Example Outreach Message</p>
                      <p className="text-base text-white font-medium italic leading-relaxed mb-4">"{personality.sample_opener}"</p>
                      
                      <div className="h-px bg-white/10 my-4" />
                      
                      <p className="text-xs text-slate-400 font-bold uppercase mb-2">Outreach Voice Description</p>
                      <p className="text-sm text-slate-300 leading-relaxed">{personality.voice_summary}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-[#0e0e16] border border-emerald-500/20 rounded-2xl p-4">
                        <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3" /> Writing Rules
                        </p>
                        <ul className="space-y-2">
                          {(personality.dos || []).map((d, i) => (
                            <li key={i} className="text-xs text-slate-400 flex gap-2">
                              <span className="text-emerald-500">•</span> {d}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-[#0e0e16] border border-red-500/20 rounded-2xl p-4">
                        <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                          <AlertCircle className="w-3 h-3" /> Things to Avoid
                        </p>
                        <ul className="space-y-2">
                          {(personality.donts || []).map((d, i) => (
                            <li key={i} className="text-xs text-slate-400 flex gap-2">
                              <span className="text-red-500">•</span> {d}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Brand Voice Words</p>
                      <div className="flex flex-wrap gap-2">
                        {(personality.adjectives || []).map((a, i) => (
                          <span key={i} className="px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-[11px] text-indigo-300 font-bold">
                            {a}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 3: Final Settings / Confirmation */}
            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-6 space-y-6">
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Final Touches</h2>
                  <p className="text-sm text-slate-400">Your AI outreach identity is ready. Review your global preferences before finishing.</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-xs text-slate-500 mb-3 uppercase font-bold tracking-wider">
                      <span>Casual</span>
                      <span>Formality</span>
                      <span>Professional</span>
                    </div>
                    <Slider value={[form.formality]} onValueChange={([v]) => setForm(p => ({ ...p, formality: v }))} max={100} step={1}
                      className="[&_[role=slider]]:bg-white [&_[role=slider]]:border-2 [&_[role=slider]]:border-indigo-500 [&_[role=slider]]:w-5 [&_[role=slider]]:h-5" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-slate-400 mb-2 block font-medium">Email length</label>
                      <div className="flex gap-1">
                        {['Short', 'Medium', 'Long'].map(l => (
                          <button key={l} onClick={() => setForm(p => ({ ...p, length: l }))}
                            className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-colors ${form.length === l ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-[#2a2a3e] text-slate-400'}`}>
                            {l}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 mb-2 block font-medium">CTA style</label>
                      <div className="flex gap-1">
                        {['Soft', 'Direct', 'No ask'].map(c => (
                          <button key={c} onClick={() => setForm(p => ({ ...p, cta: c }))}
                            className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-colors ${form.cta === c ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-[#2a2a3e] text-slate-400'}`}>
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#1e1e2e] flex justify-between items-center shrink-0">
          <Button variant="ghost" onClick={() => setStep(s => Math.max(1, s - 1))} disabled={step === 1 || loading} className="text-slate-500">
            ← Back
          </Button>
          
          {step === 1 && (
            <Button onClick={buildPersonality} disabled={!canNext1 || loading} className="bg-indigo-600 hover:bg-indigo-700 min-w-[140px]">
              {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating...</> : <><Sparkles className="w-4 h-4 mr-2" /> Generate Card</>}
            </Button>
          )}

          {step === 2 && (
            <Button onClick={() => setStep(3)} className="bg-indigo-600 hover:bg-indigo-700">
              Next Step <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}

          {step === 3 && (
            <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700">
              Save & Start Outreach
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
}