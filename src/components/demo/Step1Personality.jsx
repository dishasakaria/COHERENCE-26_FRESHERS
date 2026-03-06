import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Loader2 } from 'lucide-react';
import { useDemo } from './DemoContext';
import { MOCK_PERSONALITY } from '@/utils/sandboxData';

const TONES = ['Confident', 'Direct', 'Warm', 'Witty', 'Formal', 'Conversational', 'Bold', 'Data-driven'];
const STYLES = [
  { key: 'value', label: 'Lead with value', desc: 'Start by showing what they gain' },
  { key: 'pain', label: 'Lead with pain', desc: 'Open by naming their problem' },
  { key: 'curiosity', label: 'Lead with curiosity', desc: 'Hook them with a question' },
  { key: 'brevity', label: 'Lead with brevity', desc: 'Short, punchy, no fluff' },
];

export default function Step1Personality({ onNext }) {
  const { demo, update } = useDemo();
  const [form, setForm] = useState(demo.startup);
  const [loading, setLoading] = useState(false);
  const [card, setCard] = useState(demo.personalityCard);
  const [error, setError] = useState('');

  const toggleTone = (t) => {
    setForm(f => ({ ...f, tones: f.tones.includes(t) ? f.tones.filter(x => x !== t) : [...f.tones, t] }));
  };

  const buildCard = async () => {
    if (!form.name || !form.what || !form.target) { setError('Please fill in startup name, what you do, and target customer.'); return; }
    setError('');
    setLoading(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a B2B outreach strategist. Create an outreach personality card for this startup:
Name: ${form.name}
What they do: ${form.what}
Target customer: ${form.target}
Tone: ${form.tones.join(', ') || 'Professional'}
Style: ${form.style || 'Lead with value'}
Email length: ${form.emailLength}
Sign-off: ${form.signOff || 'Best'}

Return a JSON object with:
- opener: (string) A large italic sample opener sentence for a cold email (1–2 sentences, compelling)
- dos: (array of 4 strings) Things to always do in outreach
- donts: (array of 4 strings) Things to never do in outreach  
- adjectives: (array of 5 strings) Tone adjectives that describe this voice`,
        response_json_schema: {
          type: 'object',
          properties: {
            opener: { type: 'string' },
            dos: { type: 'array', items: { type: 'string' } },
            donts: { type: 'array', items: { type: 'string' } },
            adjectives: { type: 'array', items: { type: 'string' } },
          }
        }
      });
      setCard(result);
      update({ startup: form, personalityCard: result });
    } catch (e) {
      console.warn('API Failed, using sandbox fallback');
      const fallback = {
        ...MOCK_PERSONALITY,
        opener: MOCK_PERSONALITY.opener.replace('APAC market', `${form.target} sector`)
      };
      setCard(fallback);
      update({ startup: form, personalityCard: fallback });
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Who is your startup?</h2>
        <p className="text-slate-400 text-sm">Tell us about yourself so AI can write in your voice.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="text-sm font-medium text-slate-300 block mb-1.5">Your startup name</label>
          <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            className="w-full bg-[#0e0e16] border border-[#2a2a3e] rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-violet-500 transition-colors"
            placeholder="e.g. Acme AI" />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-300 block mb-1.5">What you do</label>
          <textarea value={form.what} onChange={e => setForm(f => ({ ...f, what: e.target.value }))}
            rows={2}
            className="w-full bg-[#0e0e16] border border-[#2a2a3e] rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-violet-500 transition-colors resize-none"
            placeholder="e.g. We help SaaS companies automate their outbound sales with AI..." />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-300 block mb-1.5">Your target customer</label>
          <input value={form.target} onChange={e => setForm(f => ({ ...f, target: e.target.value }))}
            className="w-full bg-[#0e0e16] border border-[#2a2a3e] rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-violet-500 transition-colors"
            placeholder="e.g. Heads of Sales at B2B SaaS companies, 50–500 employees" />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-300 block mb-2">Your tone <span className="text-slate-600 font-normal">(pick all that apply)</span></label>
          <div className="flex flex-wrap gap-2">
            {TONES.map(t => (
              <button key={t} onClick={() => toggleTone(t)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${form.tones.includes(t) ? 'bg-violet-600 border-violet-500 text-white' : 'bg-[#0e0e16] border-[#2a2a3e] text-slate-400 hover:border-violet-500/50 hover:text-slate-200'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-300 block mb-2">Your outreach style</label>
          <div className="grid grid-cols-2 gap-2">
            {STYLES.map(s => (
              <button key={s.key} onClick={() => setForm(f => ({ ...f, style: s.key }))}
                className={`p-3 rounded-xl border text-left transition-all ${form.style === s.key ? 'bg-violet-600/10 border-violet-500 text-white' : 'bg-[#0e0e16] border-[#2a2a3e] text-slate-400 hover:border-violet-500/30'}`}>
                <p className="text-sm font-medium">{s.label}</p>
                <p className="text-xs mt-0.5 opacity-70">{s.desc}</p>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-300 block mb-2">Email length</label>
          <div className="flex gap-2">
            {['short', 'medium', 'long'].map(l => (
              <button key={l} onClick={() => setForm(f => ({ ...f, emailLength: l }))}
                className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-all capitalize ${form.emailLength === l ? 'bg-violet-600 border-violet-500 text-white' : 'bg-[#0e0e16] border-[#2a2a3e] text-slate-400 hover:border-violet-500/30'}`}>
                {l}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-300 block mb-1.5">Your sign-off</label>
          <input value={form.signOff} onChange={e => setForm(f => ({ ...f, signOff: e.target.value }))}
            className="w-full bg-[#0e0e16] border border-[#2a2a3e] rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-violet-500 transition-colors"
            placeholder='e.g. "Best, Raj" or "Cheers, Priya"' />
        </div>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <button onClick={buildCard} disabled={loading}
        className="w-full py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-60">
        {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Building your personality...</> : '✨ Build My Personality →'}
      </button>

      {card && (
        <div className="border border-violet-500/40 rounded-2xl p-5 bg-violet-950/20 space-y-4">
          <h3 className="text-lg font-bold text-white">Your Outreach Voice</h3>
          <p className="text-base italic text-violet-200 leading-relaxed">"{card.opener}"</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">DOs</p>
              {(card.dos || []).map((d, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-300"><span className="text-emerald-400 shrink-0">✅</span>{d}</div>
              ))}
            </div>
            <div className="space-y-2">
              <p className="text-xs font-semibold text-red-400 uppercase tracking-wide">DON'Ts</p>
              {(card.donts || []).map((d, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-300"><span className="text-red-400 shrink-0">❌</span>{d}</div>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {(card.adjectives || []).map((a, i) => (
              <span key={i} className="px-2.5 py-1 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-300 text-xs font-medium">{a}</span>
            ))}
          </div>
          <button onClick={onNext}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-all mt-2">
            Looks good — Next →
          </button>
        </div>
      )}
    </div>
  );
}