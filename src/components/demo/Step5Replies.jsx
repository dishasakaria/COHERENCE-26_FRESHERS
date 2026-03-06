import React, { useState, useEffect, useRef } from 'react';
import { Loader2, RefreshCw } from 'lucide-react';
import { useDemo } from './DemoContext';
import { useCampaign } from '../campaign/CampaignContext';

const SENTIMENT_COLORS = {
  Interested: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Lukewarm: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  'Not Interested': 'bg-red-500/10 text-red-400 border-red-500/20',
};
const SENTIMENTS = ['Interested', 'Interested', 'Interested', 'Lukewarm', 'Lukewarm', 'Not Interested'];
const SAMPLE_REPLIES = [
  "Hi, thanks for reaching out! This actually sounds relevant to what we're working on. Can we hop on a quick call this week?",
  "Interesting timing — we've been evaluating options in this space. Would love to learn more.",
  "Thanks for the note. I'm not the right person but I'm forwarding this to our head of sales.",
  "We're currently tied up with other priorities, but keep us in mind for Q3.",
  "Not something we're looking for right now, but appreciate you reaching out.",
];

function EmailStatusBadge({ status }) {
  const map = { sent: ['bg-blue-500/10 text-blue-400 border-blue-500/20', 'Sent'], opened: ['bg-violet-500/10 text-violet-400 border-violet-500/20', 'Opened'], clicked: ['bg-amber-500/10 text-amber-400 border-amber-500/20', 'Clicked'], replied: ['bg-emerald-500/10 text-emerald-400 border-emerald-500/20', 'Replied'] };
  const [cls, label] = map[status] || map.sent;
  return <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${cls}`}>{label}</span>;
}

export default function Step5Replies({ onDone }) {
  const { demo } = useDemo();
  const { state } = useCampaign();
  const sent = demo.sentEmails || demo.leads?.slice(0, (demo.approvedEmails?.length || 3)) || [];

  const [rows, setRows] = useState(() => sent.map((l, i) => ({
    ...l, emailStatus: 'sent', reply: null, sentiment: null, confidence: null, interest: 30 + Math.floor(Math.random() * 20), trust: 20 + Math.floor(Math.random() * 20), fatigue: 5 + Math.floor(Math.random() * 10),
  })));
  const [refreshing, setRefreshing] = useState(false);
  const [miniEvents, setMiniEvents] = useState([]);
  const tickRef = useRef(null);

  const simulateProgress = () => {
    setRows(prev => prev.map((r, i) => {
      const roll = Math.random();
      if (r.emailStatus === 'sent' && roll < 0.4) {
        setMiniEvents(e => [{ text: `${r.name} opened your email`, color: 'blue', ts: 'just now' }, ...e.slice(0, 2)]);
        return { ...r, emailStatus: 'opened', interest: Math.min(100, r.interest + 10), trust: Math.min(100, r.trust + 5) };
      }
      if (r.emailStatus === 'opened' && roll < 0.3) {
        setMiniEvents(e => [{ text: `${r.name} clicked a link`, color: 'violet', ts: 'just now' }, ...e.slice(0, 2)]);
        return { ...r, emailStatus: 'clicked', interest: Math.min(100, r.interest + 15) };
      }
      if ((r.emailStatus === 'clicked' || r.emailStatus === 'opened') && roll < 0.25 && !r.reply) {
        const sentiment = SENTIMENTS[Math.floor(Math.random() * SENTIMENTS.length)];
        const replyText = SAMPLE_REPLIES[Math.floor(Math.random() * SAMPLE_REPLIES.length)];
        const conf = 75 + Math.floor(Math.random() * 20);
        const intBoost = sentiment === 'Interested' ? 30 : sentiment === 'Lukewarm' ? 5 : -15;
        setMiniEvents(e => [{ text: `${r.name} replied — ${sentiment}`, color: sentiment === 'Interested' ? 'green' : sentiment === 'Lukewarm' ? 'yellow' : 'red', ts: 'just now' }, ...e.slice(0, 2)]);
        return { ...r, emailStatus: 'replied', reply: replyText, sentiment, confidence: conf, interest: Math.min(100, Math.max(0, r.interest + intBoost)), trust: Math.min(100, r.trust + (sentiment === 'Interested' ? 15 : 0)) };
      }
      return r;
    }));
  };

  useEffect(() => {
    tickRef.current = setInterval(simulateProgress, 4000);
    return () => clearInterval(tickRef.current);
  }, []);

  const refresh = () => {
    setRefreshing(true);
    simulateProgress();
    setTimeout(() => setRefreshing(false), 600);
  };

  const ScoreBar = ({ val, color }) => (
    <div className="flex items-center gap-1.5">
      <div className="flex-1 h-1 bg-[#1a1a26] rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color} score-bar transition-all duration-700`} style={{ width: `${val}%` }} />
      </div>
      <span className="text-[9px] text-slate-600 w-5 text-right">{val}</span>
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Watching for replies</h2>
          <p className="text-slate-400 text-sm">Live monitoring — polling every 2 minutes.</p>
        </div>
        <button onClick={refresh} disabled={refreshing}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1a1a28] border border-[#2a2a3e] text-xs text-slate-400 hover:text-white hover:bg-[#2a2a38] transition-all">
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} /> Refresh Inbox
        </button>
      </div>

      <div className="space-y-3">
        {rows.map((row, i) => (
          <div key={i} className={`border rounded-2xl overflow-hidden transition-all duration-500 ${row.emailStatus === 'replied' && row.sentiment === 'Interested' ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-[#1e1e2e] bg-[#0e0e16]'}`}>
            <div className="px-4 py-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-violet-600/20 border border-violet-500/20 flex items-center justify-center text-violet-300 font-bold text-sm shrink-0">
                {row.name?.[0] || '?'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">{row.name} <span className="text-slate-500 font-normal">·</span> <span className="text-slate-400 font-normal">{row.company}</span></p>
                <div className="flex items-center gap-2 mt-0.5">
                  <EmailStatusBadge status={row.emailStatus} />
                  {row.sentiment && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${SENTIMENT_COLORS[row.sentiment] || ''}`}>
                      {row.sentiment === 'Interested' ? '🟢' : row.sentiment === 'Lukewarm' ? '🟡' : '🔴'} {row.sentiment} · {row.confidence}%
                    </span>
                  )}
                </div>
              </div>
              <div className="shrink-0 w-28 space-y-1">
                <ScoreBar val={row.interest} color="bg-blue-500" />
                <ScoreBar val={row.trust} color="bg-emerald-500" />
                <ScoreBar val={row.fatigue} color="bg-amber-500" />
              </div>
            </div>
            {row.reply && (
              <div className="px-4 pb-3 pt-0">
                <div className="bg-[#0a0a12] border border-[#1a1a26] rounded-xl px-4 py-3">
                  <p className="text-xs text-slate-400 mb-1.5 font-medium">Reply from {row.name}:</p>
                  <p className="text-sm text-slate-200 italic">"{row.reply}"</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Mini event feed */}
      {miniEvents.length > 0 && (
        <div className="bg-[#0a0a12] border border-[#1a1a26] rounded-xl p-3 space-y-1.5">
          {miniEvents.map((e, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${e.color === 'green' ? 'bg-emerald-500' : e.color === 'blue' ? 'bg-blue-500' : e.color === 'violet' ? 'bg-violet-500' : e.color === 'yellow' ? 'bg-amber-500' : 'bg-red-500'}`} />
              <span className="text-xs text-slate-400">{e.text}</span>
              <span className="text-[10px] text-slate-600 ml-auto">{e.ts}</span>
            </div>
          ))}
        </div>
      )}

      <button onClick={onDone}
        className="w-full py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm transition-all">
        Go to Full Dashboard →
      </button>
    </div>
  );
}