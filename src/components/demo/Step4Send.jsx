import React, { useState } from 'react';
import { Loader2, Eye, EyeOff, CheckCircle2, XCircle } from 'lucide-react';
import { useDemo } from './DemoContext';
import { useCampaign } from '../campaign/CampaignContext';

export default function Step4Send({ onNext }) {
  const { demo, update } = useDemo();
  const { state, updateCampaignStatus } = useCampaign();
  const leads = demo.leads || [];
  const emails = demo.emails || [];
  const approvedSet = new Set(demo.approvedEmails || []);
  const approvedLeads = leads.filter((_, i) => approvedSet.has(i)).map((l, _, arr) => {
    const origIdx = leads.indexOf(l);
    return { ...l, email_data: emails[leads.indexOf(l)] };
  });

  const [smtpEmail, setSmtpEmail] = useState('');
  const [smtpPass, setSmtpPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [connected, setConnected] = useState(false);
  const [testStatus, setTestStatus] = useState(null);
  const [testing, setTesting] = useState(false);
  const [sendStatus, setSendStatus] = useState({});
  const [sending, setSending] = useState(false);
  const [allSent, setAllSent] = useState(false);

  const testConnection = async () => {
    if (!smtpEmail || !smtpPass) return;
    setTesting(true);
    await new Promise(r => setTimeout(r, 1500));
    // Simulate success (real SMTP requires backend)
    setTestStatus('success');
    setConnected(true);
    setTesting(false);
  };

  const sendAll = async () => {
    setSending(true);
    const approved = approvedLeads;
    for (let i = 0; i < approved.length; i++) {
      const lead = approved[i];
      setSendStatus(s => ({ ...s, [i]: 'sending' }));
      await new Promise(r => setTimeout(r, 800 + Math.random() * 600));
      setSendStatus(s => ({ ...s, [i]: 'sent' }));
      // Push to campaign context feed
    }
    // Update campaign context
    update({ sentEmails: approved });
    updateCampaignStatus('active');
    setAllSent(true);
    setSending(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Send your emails</h2>
        <p className="text-slate-400 text-sm">Connect your email to send {approvedLeads.length} approved emails.</p>
      </div>

      {/* SMTP Form */}
      <div className="bg-[#0e0e16] border border-[#2a2a3e] rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-white">Connect your email</p>
          <button onClick={() => { setSmtpEmail('raj@flowreach.ai'); setSmtpPass('demo-flow-safe'); }}
            className="text-[10px] text-violet-400 hover:text-violet-300 transition-colors uppercase font-bold tracking-widest">
            Auto-fill Sandbox
          </button>
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-1.5">Your email</label>
          <input type="email" value={smtpEmail} onChange={e => setSmtpEmail(e.target.value)}
            className="w-full bg-[#111118] border border-[#2a2a3e] rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-violet-500 transition-colors"
            placeholder="you@gmail.com" />
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-1.5">App password
            <span className="ml-2 text-slate-600">Gmail → Settings → Security → App Passwords</span>
          </label>
          <div className="relative">
            <input type={showPass ? 'text' : 'password'} value={smtpPass} onChange={e => setSmtpPass(e.target.value)}
              className="w-full bg-[#111118] border border-[#2a2a3e] rounded-xl px-4 py-2.5 pr-10 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-violet-500 transition-colors"
              placeholder="xxxx xxxx xxxx xxxx" />
            <button onClick={() => setShowPass(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <button onClick={testConnection} disabled={testing || !smtpEmail || !smtpPass || connected}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1a1a28] border border-[#2a2a3e] text-sm text-slate-300 hover:bg-[#2a2a38] hover:text-white transition-all disabled:opacity-50">
          {testing ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Testing...</> :
            testStatus === 'success' ? <><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Connected ✓</> :
            testStatus === 'error' ? <><XCircle className="w-3.5 h-3.5 text-red-400" /> Failed — retry</> :
            'Test Connection'}
        </button>
      </div>

      {/* Approved emails list */}
      {connected && (
        <div className="space-y-4">
          <div className="border border-[#1e1e2e] rounded-2xl overflow-hidden">
            <div className="bg-[#0e0e16] px-4 py-2.5 border-b border-[#1e1e2e] flex items-center justify-between">
              <p className="text-xs font-medium text-slate-400">{approvedLeads.length} emails ready to send</p>
            </div>
            <div className="divide-y divide-[#1a1a26]">
              {approvedLeads.map((lead, i) => (
                <div key={i} className="px-4 py-3 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium">{lead.name}</p>
                    <p className="text-xs text-slate-500 truncate">{lead.company} · {lead.email_data?.subject || 'No subject'}</p>
                  </div>
                  <div className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-semibold border ${
                    sendStatus[i] === 'sent' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                    sendStatus[i] === 'sending' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                    'bg-[#1a1a26] text-slate-500 border-[#2a2a3e]'
                  }`}>
                    {sendStatus[i] === 'sent' ? '✅ Sent' : sendStatus[i] === 'sending' ? <span className="flex items-center gap-1"><Loader2 className="w-2.5 h-2.5 animate-spin" />Sending...</span> : 'Ready'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {!allSent ? (
            <button onClick={sendAll} disabled={sending}
              className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-60">
              {sending ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : `Send ${approvedLeads.length} Emails Now →`}
            </button>
          ) : (
            <div className="space-y-3">
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-center">
                <p className="text-emerald-400 font-semibold">✅ All emails sent — watching for replies...</p>
              </div>
              <button onClick={onNext}
                className="w-full py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm transition-all">
                Next →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}