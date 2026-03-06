import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const steps = [
  {
    title: "You tell us who you are",
    caption: "Your tone, style, and philosophy become the foundation of every message",
    visual: (
      <div className="flex items-center justify-center gap-6">
        <div className="bg-[#1a1a28] border border-[#2a2a3e] rounded-xl p-4 w-44">
          <div className="text-xs text-slate-500 mb-2">Personality Builder</div>
          <div className="space-y-1.5">
            {['Direct & Data-driven', 'Lead with value', 'Short emails'].map(t => (
              <div key={t} className="px-2 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300">{t}</div>
            ))}
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-slate-600" />
        <div className="bg-violet-500/10 border border-violet-500/30 rounded-xl p-4 w-44">
          <div className="text-xs text-violet-400 font-semibold mb-2">Personality Card</div>
          <p className="text-[10px] text-slate-300 italic">"Gets straight to the ROI. No fluff."</p>
          <div className="flex gap-1 mt-2 flex-wrap">
            {['Bold', 'Direct', 'Data'].map(a => (
              <span key={a} className="px-1.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 text-[9px]">{a}</span>
            ))}
          </div>
        </div>
      </div>
    )
  },
  {
    title: "We research who you're contacting",
    caption: "The AI scans each company's website, LinkedIn, news, and founder profile before writing a single word",
    visual: (
      <div className="flex items-center justify-center gap-3">
        {['🌐 Website', '💼 LinkedIn', '📰 News', '👤 Founder', '🧠 Profile'].map((step, i) => (
          <div key={step} className="flex items-center gap-3">
            <div className="flex flex-col items-center gap-1">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-sm">{step.split(' ')[0]}</div>
              <span className="text-[9px] text-slate-500">{step.split(' ')[1]}</span>
            </div>
            {i < 4 && <ChevronRight className="w-3 h-3 text-slate-700 shrink-0" />}
          </div>
        ))}
      </div>
    )
  },
  {
    title: "AI writes personalized outreach",
    caption: "Every message is written for one specific person at one specific company — never a template",
    visual: (
      <div className="bg-[#0e0e16] border border-[#1e1e2e] rounded-xl p-4 max-w-sm mx-auto">
        <p className="text-xs text-slate-400 italic mb-2">"Hi James, noticed ByteForce is expanding into Southeast Asia — teams at that scale usually hit this bottleneck..."</p>
        <div className="border-t border-[#1e1e2e] pt-2 mt-2">
          <p className="text-[10px] text-violet-400 font-semibold mb-1">Why the AI wrote it this way:</p>
          <p className="text-[10px] text-slate-500">• Tone: Direct & data-driven — matches C-type DISC</p>
          <p className="text-[10px] text-slate-500">• Angle: Expansion pain point from recent news</p>
          <p className="text-[10px] text-slate-500">• Length: Under 5 lines — matches your style</p>
        </div>
      </div>
    )
  },
  {
    title: "We detect interest and adapt",
    caption: "The AI reads every reply and automatically routes each lead to the right next step",
    visual: (
      <div className="flex items-center justify-center gap-4">
        <div className="bg-[#1a1a28] border border-[#2a2a3e] rounded-lg px-3 py-2 text-xs text-white">Lead Replies</div>
        <div className="flex flex-col gap-2">
          {[
            { label: 'Interested', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', action: '→ Proposal + Call' },
            { label: 'Lukewarm', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30', action: '→ Multi-channel' },
            { label: 'Not interested', color: 'bg-red-500/20 text-red-400 border-red-500/30', action: '→ Intervention' },
          ].map(p => (
            <div key={p.label} className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs ${p.color}`}>
              <span>{p.label}</span><span className="text-slate-500">{p.action}</span>
            </div>
          ))}
        </div>
      </div>
    )
  },
  {
    title: "You stay in control",
    caption: "You see everything the AI does, can edit any message, override any decision, or take over any lead at any time",
    visual: (
      <div className="bg-[#111118] border border-[#1e1e2e] rounded-xl p-4 max-w-sm mx-auto space-y-2">
        {[
          { icon: '✅', label: 'Approve AI Action', color: 'bg-emerald-600' },
          { icon: '🔄', label: 'Manual Override', color: 'bg-indigo-600' },
          { icon: '⏸', label: 'Pause Lead', color: 'bg-[#2a2a3e]' },
        ].map(btn => (
          <div key={btn.label} className={`${btn.color} rounded-lg px-4 py-2 text-xs text-white text-center`}>
            {btn.icon} {btn.label}
          </div>
        ))}
      </div>
    )
  }
];

export default function HowItWorksModal({ onClose }) {
  const [step, setStep] = useState(0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-[#0e0e18] border border-[#1e1e2e] rounded-2xl w-full max-w-2xl mx-4 overflow-hidden">
        <div className="px-6 py-5 border-b border-[#1e1e2e] flex items-center justify-between">
          <p className="text-sm font-semibold text-white">How FlowReach AI Works</p>
          <div className="flex items-center gap-4">
            <div className="flex gap-1.5">
              {steps.map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full transition-colors ${i === step ? 'bg-indigo-500' : 'bg-[#2a2a3e]'}`} />
              ))}
            </div>
            <button onClick={onClose} className="text-slate-500 hover:text-white"><X className="w-4 h-4" /></button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="p-8">
            <p className="text-xs font-semibold text-indigo-400 mb-1">Step {step + 1} of {steps.length}</p>
            <h2 className="text-xl font-bold text-white mb-2">{steps[step].title}</h2>
            <p className="text-sm text-slate-400 mb-8">{steps[step].caption}</p>
            <div className="min-h-[120px] flex items-center justify-center">
              {steps[step].visual}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="px-6 py-4 border-t border-[#1e1e2e] flex items-center justify-between">
          <Button variant="ghost" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} className="text-slate-400">
            <ChevronLeft className="w-4 h-4 mr-1" /> Previous
          </Button>
          {step < steps.length - 1 ? (
            <Button onClick={() => setStep(s => s + 1)} className="bg-indigo-600 hover:bg-indigo-700">
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button onClick={onClose} className="bg-emerald-600 hover:bg-emerald-700">Got it!</Button>
          )}
        </div>
      </motion.div>
    </div>
  );
}