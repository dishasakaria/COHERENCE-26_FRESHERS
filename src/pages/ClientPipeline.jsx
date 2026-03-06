import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Edit3, Check, X } from 'lucide-react';
import DiscBadge from '../components/ui-custom/DiscBadge';
import ScoreBar from '../components/ui-custom/ScoreBar';

const stages = [
  { key: 'new', label: 'New', color: 'border-slate-500/30 text-slate-400', badge: 'bg-slate-500/10 text-slate-400 border-slate-500/20' },
  { key: 'in_sequence', label: 'In Sequence', color: 'border-indigo-500/30 text-indigo-400', badge: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
  { key: 'engaged', label: 'Engaged', color: 'border-violet-500/30 text-violet-400', badge: 'bg-violet-500/10 text-violet-400 border-violet-500/20' },
  { key: 'hot', label: 'Hot 🔥', color: 'border-orange-500/30 text-orange-400', badge: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
  { key: 'replied', label: 'Replied', color: 'border-emerald-500/30 text-emerald-400', badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  { key: 'meeting_scheduled', label: 'Meeting Scheduled', color: 'border-teal-500/30 text-teal-400', badge: 'bg-teal-500/10 text-teal-400 border-teal-500/20' },
  { key: 'converted', label: 'Converted ✓', color: 'border-green-500/30 text-green-400', badge: 'bg-green-500/10 text-green-400 border-green-500/20' },
  { key: 'nurture', label: 'Nurture', color: 'border-amber-500/30 text-amber-400', badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
];

function LeadCard({ lead, stages, onMoveStage }) {
  const [editing, setEditing] = useState(false);
  const [selectedStage, setSelectedStage] = useState(lead.stage);

  const handleSave = () => {
    onMoveStage(lead.id, selectedStage);
    setEditing(false);
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
      className="bg-[#0e0e16] border border-[#1a1a26] rounded-xl p-3 hover:border-[#2a2a3e] transition-colors">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="w-7 h-7 rounded-full bg-[#1a1a28] flex items-center justify-center text-xs font-bold text-slate-300 shrink-0">
            {lead.name?.[0]}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">{lead.name}</p>
            <p className="text-[11px] text-slate-500 truncate">{lead.company}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <DiscBadge type={lead.disc_type} />
          <button onClick={() => setEditing(!editing)} className="ml-1 p-1 rounded hover:bg-white/10 text-slate-600 hover:text-slate-300">
            <Edit3 className="w-3 h-3" />
          </button>
        </div>
      </div>
      <div className="space-y-1 mb-2">
        <ScoreBar value={lead.interest_score || 0} color="blue" />
        <ScoreBar value={lead.trust_score || 0} color="green" />
      </div>
      {editing && (
        <div className="mt-2 p-2 bg-[#111118] rounded-lg border border-[#1e1e2e]">
          <p className="text-[10px] text-slate-500 mb-1.5">Move to stage:</p>
          <select value={selectedStage} onChange={e => setSelectedStage(e.target.value)}
            className="w-full text-xs bg-[#0a0a0f] border border-[#2a2a3e] text-white rounded-lg px-2 py-1.5 mb-2">
            {stages.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
          </select>
          <div className="flex gap-1">
            <button onClick={handleSave} className="flex-1 flex items-center justify-center gap-1 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-[11px] text-white">
              <Check className="w-3 h-3" /> Save
            </button>
            <button onClick={() => setEditing(false)} className="flex-1 flex items-center justify-center gap-1 py-1 rounded-lg bg-[#1a1a28] hover:bg-[#2a2a38] text-[11px] text-slate-400">
              <X className="w-3 h-3" /> Cancel
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default function ClientPipeline() {
  const queryClient = useQueryClient();
  const { data: leads = [] } = useQuery({
    queryKey: ['leads'],
    queryFn: () => base44.entities.Lead.list('-created_date', 200),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, stage }) => base44.entities.Lead.update(id, { stage }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['leads'] }),
  });

  return (
    <div className="p-8 space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-semibold text-white">Pipeline</h1>
        <p className="text-slate-500 text-sm mt-1">Manage leads across all stages</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stages.map((stage) => {
          const stageLeads = leads.filter(l => l.stage === stage.key);
          return (
            <div key={stage.key} className={`bg-[#111118] border rounded-2xl overflow-hidden ${stage.color.split(' ')[0]}`}>
              <div className="px-4 py-3 border-b border-[#1a1a26] flex items-center justify-between">
                <span className={`text-xs font-semibold ${stage.color.split(' ')[1]}`}>{stage.label}</span>
                <span className="text-[10px] text-slate-600 bg-[#1a1a26] px-2 py-0.5 rounded-full">{stageLeads.length}</span>
              </div>
              <div className="p-3 space-y-2 min-h-[120px]">
                {stageLeads.length === 0 ? (
                  <p className="text-[11px] text-slate-700 text-center py-6">Empty</p>
                ) : stageLeads.slice(0, 5).map(lead => (
                  <LeadCard key={lead.id} lead={lead} stages={stages} onMoveStage={(id, stage) => updateMutation.mutate({ id, stage })} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}