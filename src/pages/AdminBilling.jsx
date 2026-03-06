import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { DollarSign, TrendingUp, TrendingDown, UserPlus } from 'lucide-react';
import StatCard from '../components/ui-custom/StatCard';

const clients = [
  { name: 'Acme Corp', plan: 'Enterprise', cost: 499, emails: 4320, limit: 5000, apiCalls: 12400, apiLimit: 15000, leads: 342, leadLimit: 500, payment: 'paid', renewal: '2026-04-15' },
  { name: 'TechFlow', plan: 'Growth', cost: 199, emails: 890, limit: 2000, apiCalls: 4200, apiLimit: 5000, leads: 156, leadLimit: 200, payment: 'paid', renewal: '2026-04-01' },
  { name: 'BuildFast', plan: 'Starter', cost: 49, emails: 45, limit: 500, apiCalls: 320, apiLimit: 1000, leads: 23, leadLimit: 100, payment: 'paid', renewal: '2026-03-10' },
  { name: 'ScaleUp Labs', plan: 'Enterprise', cost: 499, emails: 4320, limit: 5000, apiCalls: 14200, apiLimit: 15000, leads: 567, leadLimit: 500, payment: 'due', renewal: '2026-03-20' },
  { name: 'InnovateTech', plan: 'Growth', cost: 199, emails: 320, limit: 2000, apiCalls: 1800, apiLimit: 5000, leads: 89, leadLimit: 200, payment: 'overdue', renewal: '2026-02-28' },
  { name: 'StartupXYZ', plan: 'Starter', cost: 49, emails: 178, limit: 500, apiCalls: 890, apiLimit: 1000, leads: 45, leadLimit: 100, payment: 'paid', renewal: '2026-04-22' },
];

const revByPlan = [
  { name: 'Starter', value: 98, color: '#64748b' },
  { name: 'Growth', value: 398, color: '#6366f1' },
  { name: 'Enterprise', value: 998, color: '#8b5cf6' },
];

const paymentColors = { paid: 'text-emerald-400', due: 'text-amber-400', overdue: 'text-red-400' };

export default function AdminBilling() {
  const mrr = clients.reduce((s, c) => s + c.cost, 0);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Billing & Usage</h1>
        <p className="text-slate-400 text-sm mt-1">Revenue and client usage tracking</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={DollarSign} label="MRR" value={`$${mrr.toLocaleString()}`} color="green" delay={0} />
        <StatCard icon={TrendingUp} label="New Signups" value="2" color="blue" delay={0.05} />
        <StatCard icon={TrendingDown} label="Churn" value="0" color="red" delay={0.1} />
        <StatCard icon={UserPlus} label="Active Clients" value="5" color="purple" delay={0.15} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card overflow-hidden">
          <div className="px-4 py-3 border-b border-[#1e1e2e]">
            <h3 className="text-sm font-semibold text-white">Client Usage</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1e1e2e]">
                  {['Client', 'Plan', 'Cost', 'Emails', 'API Calls', 'Leads', 'Payment', 'Renewal'].map(h => (
                    <th key={h} className="text-left px-4 py-2 text-[10px] font-medium text-slate-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {clients.map((c, i) => (
                  <tr key={i} className="border-b border-[#1e1e2e]/50 hover:bg-white/[0.02]">
                    <td className="px-4 py-3 text-sm font-medium text-white">{c.name}</td>
                    <td className="px-4 py-3 text-xs text-slate-400">{c.plan}</td>
                    <td className="px-4 py-3 text-sm text-white">${c.cost}/mo</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${c.emails / c.limit > 0.8 ? 'bg-red-500' : 'bg-indigo-500'}`} style={{ width: `${Math.min((c.emails / c.limit) * 100, 100)}%` }} />
                        </div>
                        <span className="text-[10px] text-slate-500">{c.emails}/{c.limit}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${c.apiCalls / c.apiLimit > 0.8 ? 'bg-red-500' : 'bg-violet-500'}`} style={{ width: `${Math.min((c.apiCalls / c.apiLimit) * 100, 100)}%` }} />
                        </div>
                        <span className="text-[10px] text-slate-500">{(c.apiCalls/1000).toFixed(1)}k/{(c.apiLimit/1000)}k</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${c.leads / c.leadLimit > 0.8 ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min((c.leads / c.leadLimit) * 100, 100)}%` }} />
                        </div>
                        <span className="text-[10px] text-slate-500">{c.leads}/{c.leadLimit}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3"><span className={`text-xs font-medium capitalize ${paymentColors[c.payment]}`}>{c.payment}</span></td>
                    <td className="px-4 py-3 text-xs text-slate-500">{c.renewal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Revenue by Plan</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={revByPlan} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: $${value}`}>
                {revByPlan.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}