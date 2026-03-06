import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useDemo } from './DemoContext';
import { MOCK_EMAILS } from '@/utils/sandboxData';

const TONES_REGEN = ['Professional', 'Friendly', 'Direct', 'Consultative', 'Bold'];

export default function Step3Emails({ onNext }) {
  const { demo, update } = useDemo();
  const leads = demo.leads || [];
  const personality = demo.personalityCard;
  const startup = demo.startup;

  const [emails, setEmails] = useState(demo.emails || []);
  const [approved, setApproved] = useState(new Set(demo.approvedEmails || []));
  const [idx, setIdx] = useState(0);
  const [loadingIdx, setLoadingIdx] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editBody, setEditBody] = useState('');
  const [regenOpen, setRegenOpen] = useState(false);
  const [error, setError] = useState('');

  const currentLead = leads[idx];

  const generateEmail = async (leadIdx, tone = null) => {
    if (!leads[leadIdx]) return;
    const lead = leads[leadIdx];
    setLoadingIdx(leadIdx);
    setError('');

    // If we already have a generated email from the backend, use it
    if (lead.generated_email && !tone) {
      const res = {
        subject: lead.generated_email.split('\n')[0].replace('Subject: ', ''),
        body: lead.generated_email,
        tone_reason: "Optimized for target DISC personality.",
        angle_reason: "Generated based on company research.",
        style_reason: "Aligned with your outreach identity."
      };
      
      setEmails(prev => {
        const next = [...prev];
        next[leadIdx] = res;
        update({ emails: next });
        return next;
      });
      setLoadingIdx(null);
      return;
    }

    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `Write email for ${lead.name}`,
        response_json_schema: {
          type: 'object', properties: {
            subject: { type: 'string' }, body: { type: 'string' },
            tone_reason: { type: 'string' }, angle_reason: { type: 'string' }, style_reason: { type: 'string' }
          }
        }
      });
      setEmails(prev => {
        const next = [...prev];
        next[leadIdx] = res;
        update({ emails: next });
        return next;
      });
    } catch (e) {
      console.warn('API Failed, using sandbox email');
      const mock = MOCK_EMAILS[leadIdx % MOCK_EMAILS.length];
      const res = {
        subject: mock.subject.replace('{Company}', lead.company),
        body: mock.body
          .replace('{Name}', lead.name.split(' ')[0])
          .replace('{Company}', lead.company)
          .replace('{Industry}', lead.industry)
          .replace('{User}', startup.signOff || 'Raj'),
        tone_reason: `Adapted for ${lead.disc || 'I'} profile.`,
        angle_reason: `Leveraged insights on ${lead.industry} growth.`,
        style_reason: `Aligned with ${tone || startup.tones?.[0] || 'Professional'} brand voice.`
      };
      setEmails(prev => {
        const next = [...prev];
        next[leadIdx] = res;
        update({ emails: next });
        return next;
      });
    }
    setLoadingIdx(null);
  };

  useEffect(() => {
    if (!emails[idx] && leads[idx]) {
      generateEmail(idx);
    }
  }, [idx, leads.length]);

  const toggleApprove = (i) => {
    const next = new Set(approved);
    if (next.has(i)) next.delete(i); else next.add(i);
    setApproved(next);
    update({ approvedEmails: [...next] });
  };

  const saveEdit = () => {
    setEmails(prev => {
      const next = [...prev];
      next[idx] = { ...next[idx], body: editBody };
      update({ emails: next });
      return next;
    });
    setEditing(false);
  };

  const email = emails[idx];
  const isLoading = loadingIdx === idx;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Read the emails AI wrote</h2>
          <p className="text-slate-400 text-sm">Review and approve emails before sending.</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-white">Lead {idx + 1} of {leads.length}</p>
          <p className="text-xs text-emerald-400">{approved.size} approved</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={() => { setEditing(false); setIdx(i => Math.max(0, i - 1)); }}
          disabled={idx === 0} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#1a1a28] text-slate-400 text-xs disabled:opacity-40 hover:bg-[#2a2a38] hover:text-white transition-colors">
          <ChevronLeft className="w-3.5 h-3.5" /> Prev
        </button>
        <div className="flex-1 flex gap-1 overflow-x-auto py-1">
          {leads.map((l, i) => (
            <button key={i} onClick={() => { setEditing(false); setIdx(i); }}
              className={`shrink-0 px-2.5 py-1 rounded-lg text-[10px] font-medium border transition-all ${i === idx ? 'bg-violet-600 border-violet-500 text-white' : approved.has(i) ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-[#0e0e16] border-[#2a2a3e] text-slate-500 hover:border-violet-500/30'}`}>
              {l.name.split(' ')[0]}
            </button>
          ))}
        </div>
        <button onClick={() => { setEditing(false); setIdx(i => Math.min(leads.length - 1, i + 1)); }}
          disabled={idx === leads.length - 1} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#1a1a28] text-slate-400 text-xs disabled:opacity-40 hover:bg-[#2a2a38] hover:text-white transition-colors">
          Next <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="bg-[#0e0e16] border border-[#2a2a3e] rounded-2xl overflow-hidden">
        <div className="px-5 py-3 border-b border-[#1a1a26] bg-[#111118]">
          <p className="text-xs text-slate-500">TO: <span className="text-slate-300">{currentLead?.name}</span> at <span className="text-slate-300">{currentLead?.company}</span></p>
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-violet-400 mr-2" />
            <span className="text-slate-400 text-sm">AI is writing this email...</span>
          </div>
        ) : email ? (
          <>
            <div className="px-5 py-4 border-b border-[#1a1a26]">
              <p className="text-xs text-slate-500 mb-1">SUBJECT</p>
              <p className="text-base font-bold text-white">{email.subject}</p>
            </div>
            <div className="px-5 py-4 border-b border-[#1a1a26]">
              {editing ? (
                <textarea value={editBody} onChange={e => setEditBody(e.target.value)} rows={10}
                  className="w-full bg-[#0a0a12] border border-violet-500/40 rounded-xl px-4 py-3 text-slate-200 text-sm leading-relaxed font-sans resize-none focus:outline-none" />
              ) : (
                <p className="text-sm text-slate-200 leading-loose whitespace-pre-line font-sans">{email.body}</p>
              )}
              <p className="text-sm text-slate-400 mt-3 font-medium">{startup.signOff || 'Best'},<br /><span className="text-slate-300">{startup.name}</span></p>
            </div>
            <div className="px-5 py-3 bg-[#0a0a12] border-b border-[#1a1a26]">
              <p className="text-xs text-slate-600 font-medium mb-2">Why AI wrote it this way:</p>
              <div className="space-y-1">
                {[['Tone', email.tone_reason], ['Angle', email.angle_reason], ['Style', email.style_reason]].map(([k, v]) => v && (
                  <p key={k} className="text-[11px] text-slate-500"><span className="text-slate-400 font-medium">{k}:</span> {v}</p>
                ))}
              </div>
            </div>
            <div className="px-5 py-3 flex items-center gap-2 flex-wrap">
              <button onClick={() => toggleApprove(idx)}
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${approved.has(idx) ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-600 hover:text-white hover:border-emerald-500'}`}>
                {approved.has(idx) ? '✅ Approved' : '✅ Send This Email'}
              </button>
              <div className="relative">
                <button onClick={() => setRegenOpen(o => !o)}
                  className="px-4 py-2 rounded-xl text-sm font-medium border border-violet-500/40 bg-violet-500/10 text-violet-300 hover:bg-violet-500/20 transition-all">
                  🔄 Regenerate
                </button>
                {regenOpen && (
                  <div className="absolute bottom-full mb-1 left-0 bg-[#1a1a28] border border-[#2a2a3e] rounded-xl overflow-hidden z-10 min-w-36">
                    {TONES_REGEN.map(t => (
                      <button key={t} onClick={() => { setRegenOpen(false); generateEmail(idx, t); }}
                        className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-[#2a2a38] hover:text-white transition-colors">
                        {t}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {editing ? (
                <button onClick={saveEdit}
                  className="px-4 py-2 rounded-xl text-sm font-medium border border-white/20 text-white bg-white/10 hover:bg-white/20 transition-all">
                  💾 Save
                </button>
              ) : (
                <button onClick={() => { setEditBody(email.body); setEditing(true); }}
                  className="px-4 py-2 rounded-xl text-sm font-medium border border-white/20 text-slate-400 hover:bg-white/5 hover:text-white transition-all">
                  ✏️ Edit
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="px-5 py-10 text-center text-slate-500 text-sm">No email yet.</div>
        )}
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      {approved.size > 0 && (
        <button onClick={onNext}
          className="w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base transition-all shadow-xl shadow-emerald-500/20">
          Send All {approved.size} Approved Email{approved.size !== 1 ? 's' : ''} →
        </button>
      )}
    </div>
  );
}