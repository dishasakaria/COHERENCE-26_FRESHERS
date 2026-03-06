import React, { useState, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Loader2, Upload } from 'lucide-react';
import { useDemo } from './DemoContext';

const DISC_LABELS = ['D', 'I', 'S', 'C'];
const PERSONALITY_TYPES = ['Tech Forward', 'Startup Scrappy', 'Enterprise Formal', 'Growth Focused', 'Traditional'];
const discColors = { D: 'bg-red-500/20 text-red-400 border-red-500/30', I: 'bg-amber-500/20 text-amber-400 border-amber-500/30', S: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', C: 'bg-blue-500/20 text-blue-400 border-blue-500/30' };

export default function Step2Leads({ onNext }) {
  const { demo, update } = useDemo();
  const [tab, setTab] = useState('ai');
  const [query, setQuery] = useState('');
  const [leads, setLeads] = useState(demo.leads || []);
  const [loadingLeads, setLoadingLeads] = useState(false);
  const [researchProgress, setResearchProgress] = useState({});
  const [researchDone, setResearchDone] = useState(demo.researchDone || false);
  const [researching, setResearching] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef();

  const findLeads = async () => {
    if (!query.trim()) return;
    setLoadingLeads(true);
    setError('');
    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `Generate 8 realistic but fictional B2B leads matching this description: "${query}".
Return JSON with a "leads" array. Each lead: name (string), company (string), email (string), title (string), industry (string).
Make them realistic with Indian, Western, and Asian names mixed. Companies should be real-sounding startup names.`,
        response_json_schema: {
          type: 'object',
          properties: { leads: { type: 'array', items: { type: 'object', properties: { name: { type: 'string' }, company: { type: 'string' }, email: { type: 'string' }, title: { type: 'string' }, industry: { type: 'string' } } } } }
        }
      });
      setLeads(res.leads || []);
      update({ leads: res.leads || [] });
    } catch (e) {
      setError('Failed to find leads. Please try again.');
    }
    setLoadingLeads(false);
  };

  const handleFile = async (file) => {
    if (!file) return;
    setLoadingLeads(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      const res = await base44.integrations.Core.ExtractDataFromUploadedFile({
        file_url,
        json_schema: { type: 'object', properties: { leads: { type: 'array', items: { type: 'object', properties: { name: { type: 'string' }, company: { type: 'string' }, email: { type: 'string' }, title: { type: 'string' }, industry: { type: 'string' } } } } } }
      });
      const extracted = res.output?.leads || res.output || [];
      setLeads(extracted);
      update({ leads: extracted });
    } catch (e) {
      setError('Failed to parse file. Try a CSV with Name, Company, Email, Title, Industry columns.');
    }
    setLoadingLeads(false);
  };

  const researchAll = async () => {
    if (!leads.length) return;
    setResearching(true);
    const enriched = [...leads];
    for (let i = 0; i < enriched.length; i++) {
      setResearchProgress(p => ({ ...p, [i]: 'loading' }));
      try {
        const res = await base44.integrations.Core.InvokeLLM({
          prompt: `For the company "${enriched[i].company}" in the "${enriched[i].industry}" industry, return:
- personality_type: one of [Tech Forward, Startup Scrappy, Enterprise Formal, Growth Focused, Traditional]  
- disc: one of [D, I, S, C] — the likely DISC style of this company's culture`,
          response_json_schema: { type: 'object', properties: { personality_type: { type: 'string' }, disc: { type: 'string' } } }
        });
        enriched[i] = { ...enriched[i], personality_type: res.personality_type, disc: res.disc };
        setLeads([...enriched]);
        setResearchProgress(p => ({ ...p, [i]: 'done' }));
      } catch {
        setResearchProgress(p => ({ ...p, [i]: 'done' }));
      }
    }
    update({ leads: enriched, researchDone: true });
    setResearchDone(true);
    setResearching(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Who do you want to reach?</h2>
        <p className="text-slate-400 text-sm">Upload a list or let AI find leads for you.</p>
      </div>

      <div className="flex gap-2">
        {[['ai', 'AI Find Leads'], ['upload', 'Upload CSV']].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${tab === key ? 'bg-violet-600 border-violet-500 text-white' : 'bg-[#0e0e16] border-[#2a2a3e] text-slate-400 hover:border-violet-500/30'}`}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'ai' ? (
        <div className="space-y-3">
          <input value={query} onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && findLeads()}
            className="w-full bg-[#0e0e16] border border-[#2a2a3e] rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-violet-500 transition-colors"
            placeholder='e.g. "SaaS founders in Mumbai, 10-50 employees"' />
          <button onClick={findLeads} disabled={loadingLeads || !query.trim()}
            className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50">
            {loadingLeads ? <><Loader2 className="w-4 h-4 animate-spin" /> Finding leads...</> : 'Find Leads →'}
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileRef.current?.click()}
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
          className="border-2 border-dashed border-[#2a2a3e] rounded-xl p-10 text-center cursor-pointer hover:border-violet-500/50 transition-colors">
          {loadingLeads ? <Loader2 className="w-6 h-6 animate-spin text-violet-400 mx-auto mb-2" /> : <Upload className="w-6 h-6 text-slate-500 mx-auto mb-2" />}
          <p className="text-sm text-slate-400">{loadingLeads ? 'Parsing file...' : 'Drop CSV or XLSX here, or click to browse'}</p>
          <p className="text-xs text-slate-600 mt-1">Columns: Name, Company, Email, Title, Industry</p>
          <input ref={fileRef} type="file" accept=".csv,.xlsx" className="hidden" onChange={e => handleFile(e.target.files[0])} />
        </div>
      )}

      {error && <p className="text-red-400 text-sm">{error}</p>}

      {leads.length > 0 && (
        <div className="space-y-4">
          <p className="text-sm text-slate-400">These <span className="text-white font-semibold">{leads.length}</span> leads are ready</p>
          <div className="border border-[#1e1e2e] rounded-xl overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-[#0e0e16] border-b border-[#1e1e2e]">
                  {['Name', 'Company', 'Email', 'Title', 'Industry', 'Profile'].map(h => (
                    <th key={h} className="text-left px-3 py-2 text-slate-500 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a1a26]">
                {leads.map((lead, i) => (
                  <tr key={i} className="hover:bg-white/[0.015] transition-colors">
                    <td className="px-3 py-2.5 text-white font-medium">{lead.name}</td>
                    <td className="px-3 py-2.5 text-slate-300">{lead.company}</td>
                    <td className="px-3 py-2.5 text-slate-400 font-mono text-[10px]">{lead.email}</td>
                    <td className="px-3 py-2.5 text-slate-400">{lead.title}</td>
                    <td className="px-3 py-2.5 text-slate-500">{lead.industry}</td>
                    <td className="px-3 py-2.5">
                      {researchProgress[i] === 'loading' ? (
                        <span className="text-slate-500 animate-pulse">researching...</span>
                      ) : researchProgress[i] === 'done' && lead.disc ? (
                        <div className="flex items-center gap-1.5">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${discColors[lead.disc] || 'bg-slate-500/20 text-slate-400 border-slate-500/30'}`}>{lead.disc}</span>
                          <span className="px-1.5 py-0.5 rounded bg-[#1a1a26] border border-[#2a2a3e] text-slate-400 text-[9px]">{lead.personality_type}</span>
                        </div>
                      ) : <span className="text-slate-700 text-[10px]">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!researchDone && (
            <button onClick={researchAll} disabled={researching}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-60">
              {researching ? <><Loader2 className="w-4 h-4 animate-spin" /> Researching companies...</> : '🔍 AI Research Each Company →'}
            </button>
          )}

          {researchDone && (
            <>
              <p className="text-center text-emerald-400 text-sm font-medium">✅ All {leads.length} companies researched</p>
              <button onClick={onNext}
                className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm transition-all">
                Next →
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}