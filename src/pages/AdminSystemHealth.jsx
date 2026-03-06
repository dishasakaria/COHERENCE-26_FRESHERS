import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Server, Wifi, Database, Clock, AlertTriangle, CheckCircle2, Activity } from 'lucide-react';
import StatCard from '../components/ui-custom/StatCard';

const apiData = Array.from({ length: 20 }, (_, i) => ({
  time: `${i}m`,
  claude: Math.floor(Math.random() * 150) + 200,
  email: Math.floor(Math.random() * 50) + 30,
  whatsapp: Math.floor(Math.random() * 80) + 60,
  twilio: Math.floor(Math.random() * 100) + 100,
}));

const services = [
  { name: 'Claude API', status: 'healthy', latency: '245ms', uptime: '99.98%' },
  { name: 'Email Server', status: 'healthy', latency: '42ms', uptime: '99.99%' },
  { name: 'WhatsApp API', status: 'healthy', latency: '78ms', uptime: '99.95%' },
  { name: 'Twilio (Voice/SMS)', status: 'degraded', latency: '312ms', uptime: '99.87%' },
  { name: 'WebSocket Server', status: 'healthy', latency: '12ms', uptime: '100%' },
  { name: 'Database', status: 'healthy', latency: '8ms', uptime: '99.99%' },
];

const errors = [
  { time: '14:32', type: 'API Error', service: 'Twilio', message: 'Rate limit exceeded — retrying in 30s', severity: 'warning' },
  { time: '13:15', type: 'Parse Error', service: 'Claude API', message: 'JSON parse failed on lead analysis — retried successfully', severity: 'info' },
  { time: '11:48', type: 'Send Failed', service: 'Email', message: 'SMTP timeout for batch #2847 — 3 emails deferred', severity: 'warning' },
];

export default function AdminSystemHealth() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">System Health</h1>
          <p className="text-slate-400 text-sm mt-1">Real-time infrastructure monitoring</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-xs font-medium text-amber-400">1 Service Degraded</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Activity} label="Queue Depth" value="47" color="blue" delay={0} />
        <StatCard icon={Wifi} label="WebSocket Conns" value="128" color="green" delay={0.05} />
        <StatCard icon={Database} label="DB Queries/min" value="2.4k" color="purple" delay={0.1} />
        <StatCard icon={Clock} label="Scheduler Jobs" value="12 active" color="teal" delay={0.15} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((svc, i) => (
          <motion.div
            key={svc.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`glass-card p-4 ${svc.status === 'degraded' ? 'border-amber-500/30' : ''}`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-white">{svc.name}</span>
              <div className="flex items-center gap-1.5">
                {svc.status === 'healthy' ? (
                  <><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /><span className="text-xs text-emerald-400">Healthy</span></>
                ) : (
                  <><AlertTriangle className="w-3.5 h-3.5 text-amber-400" /><span className="text-xs text-amber-400">Degraded</span></>
                )}
              </div>
            </div>
            <div className="flex gap-4 text-xs text-slate-400">
              <span>Latency: <span className="text-white">{svc.latency}</span></span>
              <span>Uptime: <span className="text-white">{svc.uptime}</span></span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold text-white mb-4">API Response Times</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={apiData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
            <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={{ fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={{ background: '#12121a', border: '1px solid #1e1e2e', borderRadius: 8, color: '#e2e8f0' }} />
            <Line type="monotone" dataKey="claude" stroke="#8b5cf6" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="email" stroke="#6366f1" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="whatsapp" stroke="#10b981" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="twilio" stroke="#f59e0b" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="px-4 py-3 border-b border-[#1e1e2e]">
          <h3 className="text-sm font-semibold text-white">Recent Errors</h3>
        </div>
        <div className="divide-y divide-[#1e1e2e]/50">
          {errors.map((err, i) => (
            <div key={i} className="px-4 py-3 flex items-center gap-4">
              <span className="text-xs text-slate-500 w-12">{err.time}</span>
              <span className={`px-2 py-0.5 text-[10px] rounded-full font-medium ${err.severity === 'warning' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'}`}>{err.type}</span>
              <span className="text-xs text-slate-400">{err.service}</span>
              <span className="text-xs text-slate-300 flex-1">{err.message}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}