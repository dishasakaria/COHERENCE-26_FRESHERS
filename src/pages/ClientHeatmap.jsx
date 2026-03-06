import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis } from 'recharts';
import DiscBadge from '../components/ui-custom/DiscBadge';
import { useCampaign } from '../components/campaign/CampaignContext';

import { generateMockLeads } from '@/utils/mockLeads';

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  return (
    <div className="bg-[#111118] border border-[#1e1e2e] rounded-xl p-3 text-xs space-y-1 min-w-[150px]">
      <p className="text-white font-semibold">{data.name}</p>
      <p className="text-slate-400">{data.company}</p>
      <div className="flex items-center gap-2"><DiscBadge type={data.disc_category || data.disc_type} /></div>
      <p>Interest: <span className="text-indigo-400 font-bold">{data.interest_score}</span></p>
      <p>Trust: <span className="text-emerald-400 font-bold">{data.trust_score}</span></p>
      <p>Fatigue: <span className="text-red-400 font-bold">{data.fatigue_score}</span></p>
      {data.isHot && <div className="mt-1 text-[10px] text-emerald-400 animate-pulse font-bold">● LIVE ACTIVITY</div>}
    </div>
  );
};

export default function ClientHeatmap() {
  const { state } = useCampaign();
  const [mockLeads] = React.useState(() => generateMockLeads());
  const { data: realLeads = [] } = useQuery({
    queryKey: ['leads'],
    queryFn: () => base44.entities.Lead.list('-created_date', 200),
  });

  const leads = realLeads.length > 0 ? realLeads : mockLeads;
  const isActive = state?.campaign?.status === 'active';
  const feed = state?.feed || [];

  const getColor = (lead) => {
    if (lead.stage === 'meeting_scheduled' || lead.stage === 'converted') return '#14b8a6';
    if (lead.stage === 'hot') return '#f59e0b';
    if ((lead.interest_score || 0) > 60 && (lead.trust_score || 0) > 40) return '#10b981';
    if ((lead.interest_score || 0) > 30) return '#f59e0b';
    if ((lead.fatigue_score || 0) > 70) return '#6b7280';
    return '#ef4444';
  };

  const chartData = leads.map(l => {
    // Check if this lead is in the most recent feed items
    const feedItem = feed.find(f => f.lead === l.name);
    const isHot = !!feedItem;
    
    return {
      ...l,
      x: l.trust_score || 0,
      y: l.interest_score || 0,
      z: Math.max(l.fatigue_score || 5, 5),
      fill: isHot ? '#fff' : getColor(l),
      isHot,
      feedDetail: feedItem?.detail
    };
  });

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Lead Heatmap</h1>
          <p className="text-slate-500 text-sm mt-1">X: Trust · Y: Interest · Size: Fatigue</p>
        </div>
        {isActive && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <div className="w-2 h-2 rounded-full bg-emerald-500 pulse-green" />
            <span className="text-xs font-semibold text-emerald-400">Live Simulation Mode</span>
          </div>
        )}
      </div>

      <div className="flex gap-4 text-xs">
        {[
          { color: 'bg-emerald-500', label: 'Hot' },
          { color: 'bg-amber-500', label: 'Warm' },
          { color: 'bg-red-500', label: 'Cold' },
          { color: 'bg-slate-500', label: 'Burnt' },
          { color: 'bg-teal-500', label: 'Meeting/Converted' },
        ].map(l => (
          <div key={l.label} className="flex items-center gap-1.5">
            <div className={`w-2.5 h-2.5 rounded-full ${l.color}`} />
            <span className="text-slate-400">{l.label}</span>
          </div>
        ))}
      </div>

      <div className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-5 relative">
        <div className="absolute text-xs font-medium text-emerald-400/30 select-none" style={{ left: '60%', top: '15%' }}>Hot Zone 🔥</div>
        <div className="absolute text-xs font-medium text-amber-400/30 select-none" style={{ left: '60%', top: '65%' }}>Warm Zone</div>
        <div className="absolute text-xs font-medium text-blue-400/30 select-none" style={{ left: '10%', top: '15%' }}>Nurture Zone</div>
        <div className="absolute text-xs font-medium text-red-400/30 select-none" style={{ left: '10%', top: '65%' }}>Cold Zone</div>
        <ResponsiveContainer width="100%" height={500}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 30, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
            <XAxis type="number" dataKey="x" name="Trust" domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 10 }}
              label={{ value: 'Trust Score', fill: '#64748b', fontSize: 11, position: 'bottom', offset: 10 }} />
            <YAxis type="number" dataKey="y" name="Interest" domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 10 }}
              label={{ value: 'Interest Score', fill: '#64748b', fontSize: 11, angle: -90, position: 'insideLeft' }} />
            <ZAxis type="number" dataKey="z" range={[40, 400]} />
            <Tooltip content={<CustomTooltip />} />
            <Scatter data={chartData} shape={(props) => {
              const { cx, cy, payload } = props;
              const r = Math.max((payload.z || 5) / 8, 4);
              return <circle cx={cx} cy={cy} r={r} fill={payload.fill} fillOpacity={0.75} stroke={payload.fill} strokeWidth={1} />;
            }} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}