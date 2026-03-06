import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import StatCard from '../components/ui-custom/StatCard';
import { TrendingUp, Mail, Users, Percent } from 'lucide-react';

const volumeData = Array.from({ length: 30 }, (_, i) => ({
  day: `D${i + 1}`,
  emails: Math.floor(Math.random() * 200) + 100,
  linkedin: Math.floor(Math.random() * 80) + 20,
  whatsapp: Math.floor(Math.random() * 60) + 10,
}));

const industryReply = [
  { name: 'SaaS', rate: 22 }, { name: 'FinTech', rate: 18 }, { name: 'AI/ML', rate: 25 },
  { name: 'HealthTech', rate: 12 }, { name: 'EdTech', rate: 15 }, { name: 'E-commerce', rate: 19 },
];

const channelData = [
  { name: 'Email', rate: 16.5 }, { name: 'LinkedIn', rate: 22.3 }, { name: 'WhatsApp', rate: 28.1 },
  { name: 'SMS', rate: 8.4 }, { name: 'Call', rate: 35.2 },
];

const discDist = [
  { name: 'D', value: 28, color: '#ef4444' }, { name: 'I', value: 32, color: '#f59e0b' },
  { name: 'S', value: 22, color: '#10b981' }, { name: 'C', value: 18, color: '#6366f1' },
];

const funnelData = [
  { stage: 'Leads', value: 1222 }, { stage: 'Hot', value: 64 },
  { stage: 'Meeting', value: 38 }, { stage: 'Converted', value: 14 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload) return null;
  return (
    <div className="glass-card p-3 text-xs">
      <p className="text-white font-medium mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

export default function AdminAnalytics() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Platform Analytics</h1>
        <p className="text-slate-400 text-sm mt-1">Aggregate performance across all clients</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Mail} label="Total Outreach" value="8,743" color="blue" delay={0} />
        <StatCard icon={Percent} label="Avg Reply Rate" value="16.8%" color="green" delay={0.05} />
        <StatCard icon={Users} label="Total Leads" value="1,222" color="purple" delay={0.1} />
        <StatCard icon={TrendingUp} label="Conversions" value="38" color="teal" delay={0.15} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Outreach Volume (30 Days)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={volumeData}>
              <defs>
                <linearGradient id="emailGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
              <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 10 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 10 }} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="emails" stroke="#6366f1" fill="url(#emailGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="linkedin" stroke="#8b5cf6" fill="none" strokeWidth={2} />
              <Area type="monotone" dataKey="whatsapp" stroke="#10b981" fill="none" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Reply Rate by Industry</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={industryReply}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 10 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="rate" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Reply Rate by Channel</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={channelData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
              <XAxis type="number" tick={{ fill: '#64748b', fontSize: 10 }} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} width={70} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="rate" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-4">DISC Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={discDist} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {discDist.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass-card p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Conversion Funnel</h3>
        <div className="flex items-end justify-center gap-8 h-48">
          {funnelData.map((item, i) => (
            <div key={item.stage} className="flex flex-col items-center gap-2">
              <span className="text-lg font-bold text-white">{item.value.toLocaleString()}</span>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(item.value / funnelData[0].value) * 160}px` }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
                className="w-20 rounded-t-lg bg-gradient-to-t from-indigo-600 to-violet-500"
                style={{ minHeight: 20 }}
              />
              <span className="text-xs text-slate-400">{item.stage}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}