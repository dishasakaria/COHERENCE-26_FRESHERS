import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Download } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const WELCOME = { role: 'ai', text: "Hi! I'm your AI assistant. Ask me anything about your campaign, or say **generate report** for a full summary." };

export default function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text }]);
    setLoading(true);

    const isReport = /report|summary|generate/i.test(text);
    const prompt = isReport
      ? `Generate a detailed AI campaign performance report. Include: total outreach sent (847), reply rate (8.1%), meetings booked (14), active leads (132), top performing channels, notable replies, leads flagged for fatigue, and recommended next actions. Be insightful and specific.`
      : `You are a sales AI assistant for FlowReach AI platform. The user asks: "${text}". The platform manages multi-channel outreach campaigns. Answer helpfully and concisely.`;

    const res = await base44.integrations.Core.InvokeLLM({ prompt });
    setMessages(prev => [...prev, { role: 'ai', text: res, isReport }]);
    setLoading(false);
  };

  const handleKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } };

  const downloadReport = (text) => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'ai-report.txt'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* Floating button */}
      <button onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-13 h-13 rounded-full bg-indigo-600 hover:bg-indigo-500 shadow-xl flex items-center justify-center transition-all"
        style={{ width: 52, height: 52 }}>
        <Bot className="w-6 h-6 text-white" />
        <span className="absolute top-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#09090f]" />
      </button>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-20 right-6 z-50 w-[380px] bg-[#0e0e18] border border-[#1e1e2e] rounded-2xl shadow-2xl flex flex-col"
            style={{ height: 500 }}>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#1e1e2e] shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-violet-500/15 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-violet-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">AI Assistant</p>
                  <p className="text-[10px] text-emerald-400">Online</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-3 py-2.5 text-sm leading-relaxed
                    ${msg.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-sm'
                      : 'bg-[#161622] border border-[#1e1e2e] text-slate-300 rounded-bl-sm'}`}>
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    {msg.isReport && (
                      <button onClick={() => downloadReport(msg.text)}
                        className="mt-2 flex items-center gap-1.5 text-xs text-indigo-300 hover:text-white transition-colors">
                        <Download className="w-3 h-3" /> Download Report
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-[#161622] border border-[#1e1e2e] rounded-2xl rounded-bl-sm px-4 py-3">
                    <div className="flex gap-1.5">
                      {[0,1,2].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: `${i*0.15}s` }} />)}
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-[#1e1e2e] shrink-0">
              <div className="flex items-center gap-2 bg-[#111118] border border-[#2a2a3e] rounded-xl px-3 py-2">
                <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey}
                  placeholder="Ask anything or say 'generate report'..."
                  className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-600 outline-none" />
                <button onClick={send} disabled={!input.trim() || loading}
                  className="w-7 h-7 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 flex items-center justify-center transition-colors">
                  <Send className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}