import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Mail, Search, MessageSquare, FileText, Phone, Bot, AlertTriangle, Check, RotateCcw, Zap, TrendingUp, Clock, Target, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCampaign } from '../components/campaign/CampaignContext';

const VALUES = { meetingBooked: 2400, hotLead: 800, reply: 150, hourSaved: 400 };

const dailyData = Array.from({ length: 30 }, (_, i) => ({
  day: `${i + 1}`,
  spend: parseFloat(((i + 1) * 2.1 + Math.random() * 1).toFixed(1)),
  value: parseFloat(((i + 1) * 1280 + Math.random() * 500).toFixed(1)),
}));

const fmt = (n) => `₹${Number(n).toLocaleString('en-IN')}`;

const aiActivity = [
  { icon: Mail, label: 'Emails written and sent', value: 520, growth: '+27%', color: 'from-indigo-500 to-blue-500' },
  { icon: Search, label: 'Companies researched', value: 156, growth: '+30%', color: 'from-blue-500 to-cyan-500' },
  { icon: MessageSquare, label: 'Replies analyzed and routed', value: 68, growth: '+24%', color: 'from-emerald-500 to-teal-500' },
  { icon: FileText, label: 'Proposals generated', value: 5, growth: '+67%', color: 'from-teal-500 to-indigo-500' },
  { icon: Phone, label: 'Call scripts created', value: 28, growth: '+27%', color: 'from-amber-500 to-orange-500' },
];

const ROUTING_STEPS = [
  { profile: 'D', full: 'Dominant', condition: 'Interest > 60 + Growth', model: 'Claude 3 Sonnet', task: 'High Personalization', cost: '₹4.20', badge: 'bg-red-500/10 text-red-500 border-red-500/20' },
  { profile: 'I', full: 'Influential', condition: 'Conversational match', model: 'GPT-4o Mini', task: 'Conversational', cost: '₹0.85', badge: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' },
  { profile: 'S', full: 'Steady', condition: 'Relationship focused', model: 'GPT-4o Mini', task: 'Relationship', cost: '₹0.85', badge: 'bg-green-500/10 text-green-500 border-green-500/20' },
  { profile: 'C', full: 'Conscientious', condition: 'Detailed messaging', model: 'Claude 3 Sonnet', task: 'Detailed Outreach', cost: '₹4.20', badge: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
  { profile: 'ANY', full: 'Generic', condition: 'Research Tasks', model: 'Gemini 1.5 Flash', task: 'Company Research', cost: '₹0.12', badge: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
  { profile: 'ANY', full: 'Generic', condition: 'Interest < 35 OR Nurture', model: 'Mistral Small', task: 'Cost Saver Nurture', cost: '₹0.04', badge: 'bg-slate-500/10 text-slate-400 border-slate-500/20' },
  { profile: 'ANY', full: 'Generic', condition: 'Voice AI Generation', model: 'Llama 3', task: 'Call Scripting', cost: '₹0.17', badge: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
];

export default function ClientROI() {
  const { state, toggleSmartRouting } = useCampaign();
  const { data: leads = [] } = useQuery({ queryKey: ['leads'], queryFn: () => base44.entities.Lead.list('-created_date', 200) });
  const { data: meetings = [] } = useQuery({ queryKey: ['meetings'], queryFn: () => base44.entities.Meeting.list('-scheduled_date', 50) });

  const emailsSent = 520;
  const meetingsBooked = meetings.length || 14;
  const hoursSaved = 66;
  const totalSpendRaw = 64.06;
  const totalValue = 38400;
  const roiMultiple = (totalValue / totalSpendRaw).toFixed(1);

  const isRoutingActive = state?.smartRoutingActive;

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-screen pb-24">
      {/* Banner Card */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-[24px] bg-gradient-to-br from-[#0c2e1f] via-[#051c14] to-[#0c2e1f] border border-emerald-500/20 p-8 flex items-center justify-between shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-emerald-500/10 transition-colors" />
        <div className="relative z-10">
          <h1 className="text-white text-3xl font-bold tracking-tight mb-2">
            This month your <span className="text-emerald-400">₹{totalSpendRaw}</span> spend delivered <span className="text-emerald-400">₹{totalValue.toLocaleString('en-IN')}</span> in value
          </h1>
          <p className="text-emerald-400/80 text-sm font-medium flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            {roiMultiple}× return on your AI spend
          </p>
        </div>
        <div className="text-right flex flex-col items-end relative z-10">
          <p className="text-7xl font-black text-emerald-400 leading-none tracking-tighter">{roiMultiple}x</p>
          <p className="text-white/40 text-[10px] uppercase font-black tracking-widest mt-2">ROI Multiplier</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: What your AI did this month */}
        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
          className="lg:col-span-7 bg-[#0b0b0f] border border-[#1e1e2e] rounded-[24px] overflow-hidden p-6 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold text-white tracking-tight">What your AI did this month</h2>
          </div>
          <div className="space-y-7">
            {aiActivity.map((stat, i) => (
              <div key={stat.label} className="space-y-3 group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#111118] border border-[#1e1e2e] flex items-center justify-center group-hover:border-white/20 transition-colors">
                      <stat.icon className="w-5 h-5 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white tracking-wide">{stat.label}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">vs last month: <span className="text-emerald-400">{stat.growth}</span></p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-black text-white">{stat.value}</span>
                    <span className="text-[10px] px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">{stat.growth}</span>
                  </div>
                </div>
                <div className="h-1.5 w-full bg-[#161621] rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${60 + Math.random() * 30}%` }}
                    transition={{ duration: 1, delay: 0.4 + (i * 0.1) }}
                    className={`h-full bg-gradient-to-r ${stat.color}`} 
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right Column: Insights & Chart */}
        <div className="lg:col-span-5 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="bg-[#0b0b0f] border border-[#1e1e2e] rounded-2xl p-4 group hover:bg-white/[0.02] transition-colors">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Cheapest Win</p>
              <p className="text-2xl font-black text-emerald-400 tracking-tight">₹3.20</p>
              <p className="text-[10px] text-slate-500 mt-1">Zara Khan · BuildFast</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
              className="bg-[#0b0b0f] border border-[#1e1e2e] rounded-2xl p-4 group hover:bg-white/[0.02] transition-colors">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Best ROI Channel</p>
              <p className="text-2xl font-black text-teal-400 tracking-tight">WhatsApp</p>
              <p className="text-[10px] text-slate-500 mt-1">₹1.40 cost per reply</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="bg-[#0b0b0f] border border-[#1e1e2e] rounded-2xl p-4 group hover:bg-white/[0.02] transition-colors">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Cost per Meeting</p>
              <p className="text-2xl font-black text-indigo-400 tracking-tight">₹5</p>
              <p className="text-[10px] text-slate-500 mt-1">vs ₹8,000 agency</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
              className="bg-[#0b0b0f] border border-[#1e1e2e] rounded-2xl p-4 group hover:bg-white/[0.02] transition-colors">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Hours Saved</p>
              <p className="text-2xl font-black text-amber-500 tracking-tight">66h</p>
              <p className="text-[10px] text-slate-500 mt-1">8.3 working days</p>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="bg-[#0b0b0f] border border-[#1e1e2e] rounded-[24px] p-6 h-[260px] flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold text-white tracking-tight">AI Spend vs Value Delivered</h3>
              <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest">
                <span className="flex items-center gap-2 text-slate-500 hover:text-red-400 transition-colors">
                  <span className="w-3 h-0.5 bg-red-400 rounded-full" /> Spend
                </span>
                <span className="flex items-center gap-2 text-slate-500 hover:text-emerald-400 transition-colors">
                  <span className="w-3 h-0.5 bg-emerald-400 rounded-full" /> Value
                </span>
              </div>
            </div>
            <div className="flex-1 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#161621" vertical={false} />
                  <XAxis dataKey="day" hide />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ background: '#111118', border: '1px solid #1e1e2e', borderRadius: 12, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)', fontSize: 10 }}
                    itemStyle={{ padding: '2px 0' }}
                    formatter={(v, n) => [`₹${v}`, n === 'spend' ? 'Spend' : 'Value']} 
                  />
                  <Line type="monotone" dataKey="spend" stroke="#f87171" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                  <Line type="monotone" dataKey="value" stroke="#34d399" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="lg:col-span-8 bg-[#0b0b0f] border border-[#1e1e2e] rounded-[24px] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#1e1e2e] flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <Cpu className="w-4 h-4 text-violet-400" />
              <p className="text-sm font-bold text-white tracking-wide">Multi-Model Usage Breakdown</p>
            </div>
            <div className="flex items-center gap-2">
              <Zap className={`w-3.5 h-3.5 ${isRoutingActive ? 'text-emerald-400 animate-pulse' : 'text-slate-600'}`} />
              <span className={`text-[10px] font-black uppercase tracking-widest ${isRoutingActive ? 'text-emerald-400' : 'text-slate-600'}`}>
                {isRoutingActive ? 'Optimization Engine: ON' : 'Standard Routine'}
              </span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#0e0e16] border-b border-[#1e1e2e] text-[9px] text-slate-500 font-black uppercase tracking-[0.2em] px-6">
                  <th className="px-6 py-4">AI Model</th>
                  <th className="px-6 py-4">Assigned Task</th>
                  <th className="px-6 py-4 text-center">Cost Efficiency</th>
                  <th className="px-6 py-4 text-right">Cost/Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#161621]">
                {ROUTING_STEPS.map((step, i) => (
                  <tr key={i} className="group hover:bg-white/[0.01] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black border ${step.badge} shadow-inner`}>
                          {step.profile}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">{step.model}</p>
                          <p className="text-[9px] text-slate-600 font-medium">Auto-optimized for context</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-400">{step.task}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <div className="w-24 h-1 bg-[#161621] rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500/80" style={{ width: `${95 - i*8}%` }} />
                        </div>
                        <span className="text-[9px] font-black text-emerald-400">{(95 - i*8)}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="text-xs font-mono font-bold text-white">{step.cost}</p>
                      <p className="text-[9px] text-slate-600 mt-1 uppercase tracking-widest">{parseFloat(step.cost.replace('₹', '')) > 1 ? 'High Value' : 'Optimized'}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}
          className="lg:col-span-4 bg-[#0b0b0f] border border-[#1e1e2e] rounded-[24px] p-6 space-y-6">
          <div className="flex items-center gap-3">
            <Target className="w-4 h-4 text-amber-500" />
            <p className="text-sm font-bold text-white tracking-wide">Strategy Control</p>
          </div>
          
          <div className="space-y-4">
            <div className="relative p-5 rounded-2xl bg-[#0e0e16] border border-[#1e1e2e] group overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
              <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1.5">Deployment Mode</p>
              <p className="text-sm text-white font-black">{isRoutingActive ? 'Smart Multi-Model Routing' : 'GPT-4 Heavy (Legacy)'}</p>
            </div>

            {!isRoutingActive && (
              <div className="p-5 rounded-2xl bg-red-500/5 border border-red-500/10 flex items-start gap-4">
                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-red-500 mb-1">Inefficiency Warning</h4>
                  <p className="text-[10px] text-red-400/60 leading-relaxed font-medium">
                    Legacy mode costs <span className="text-white">62% more</span> than Smart Routing with no gain in conversion.
                  </p>
                </div>
              </div>
            )}

            {isRoutingActive && (
              <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex items-start gap-4">
                <Zap className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-emerald-500 mb-1">Routing Active</h4>
                  <p className="text-[10px] text-emerald-400/60 leading-relaxed font-medium">
                    Optimization engine is balancing cost vs quality across 5 different AI providers live.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <Button onClick={() => toggleSmartRouting(true)} 
              className={`w-full h-12 rounded-xl transition-all font-bold text-xs uppercase tracking-widest ${isRoutingActive ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-900/40'}`}>
              <Zap className={`w-4 h-4 mr-2 ${isRoutingActive ? 'fill-indigo-400 text-indigo-400' : ''}`} />
              {isRoutingActive ? 'Engine Active' : 'Activate Routing'}
            </Button>
            <Button onClick={() => toggleSmartRouting(false)} variant="outline" 
              className="w-full h-12 rounded-xl border-[#1e1e2e] text-slate-500 hover:bg-red-500/5 hover:text-red-400 hover:border-red-500/20 font-bold text-xs uppercase tracking-widest transition-all">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset Strategy
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}