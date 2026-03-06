import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, AlertCircle, Info, X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const initialAlerts = [
  { id: 1, severity: 'critical', title: 'InnovateTech health score below 40', desc: 'Account at churn risk — no login in 12 days, health score at 32.', company: 'InnovateTech', action: 'Contact account manager' },
  { id: 2, severity: 'critical', title: '3 leads with fatigue > 80 still in active sequences', desc: 'Leads at Acme Corp have fatigue scores of 82, 85, 91 but are still being contacted.', company: 'Acme Corp', action: 'Pause affected leads' },
  { id: 3, severity: 'warning', title: 'Payment overdue — InnovateTech', desc: 'Growth plan payment of $199 is 6 days overdue.', company: 'InnovateTech', action: 'Send payment reminder' },
  { id: 4, severity: 'warning', title: 'API rate limit approaching — Twilio', desc: 'Twilio API usage at 87% of daily limit. Voice calls may be throttled.', company: 'Platform', action: 'Review call volume' },
  { id: 5, severity: 'warning', title: 'ScaleUp Labs — leads over limit', desc: '567 leads stored vs 500 limit. Overage charges may apply.', company: 'ScaleUp Labs', action: 'Notify client' },
  { id: 6, severity: 'info', title: 'BuildFast completed onboarding', desc: 'First workflow created, 23 leads imported. Ready for activation.', company: 'BuildFast', action: 'Review and activate' },
  { id: 7, severity: 'info', title: 'Weekly AI performance report ready', desc: 'AI accuracy improved 3.2% this week. 2 flagged actions reviewed.', company: 'Platform', action: 'View report' },
];

const severityConfig = {
  critical: { icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', badge: 'bg-red-500/20 text-red-400' },
  warning: { icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', badge: 'bg-amber-500/20 text-amber-400' },
  info: { icon: Info, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30', badge: 'bg-blue-500/20 text-blue-400' },
};

export default function AdminAlerts() {
  const [alerts, setAlerts] = useState(initialAlerts);
  const dismiss = (id) => setAlerts(prev => prev.filter(a => a.id !== id));

  const criticals = alerts.filter(a => a.severity === 'critical');
  const warnings = alerts.filter(a => a.severity === 'warning');
  const infos = alerts.filter(a => a.severity === 'info');

  const renderSection = (title, items) => (
    items.length > 0 && (
      <div>
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">{title} ({items.length})</h2>
        <div className="space-y-3">
          <AnimatePresence>
            {items.map((alert) => {
              const cfg = severityConfig[alert.severity];
              const Icon = cfg.icon;
              return (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className={`glass-card ${cfg.border} p-4`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${cfg.bg}`}>
                      <Icon className={`w-4 h-4 ${cfg.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${cfg.badge}`}>{alert.severity}</span>
                        <span className="text-xs text-slate-500">{alert.company}</span>
                      </div>
                      <h3 className="text-sm font-medium text-white">{alert.title}</h3>
                      <p className="text-xs text-slate-400 mt-1">{alert.desc}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button variant="ghost" size="sm" className="text-indigo-400 hover:text-indigo-300 text-xs">
                        {alert.action} <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-300 w-7 h-7" onClick={() => dismiss(alert.id)}>
                        <X className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    )
  );

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Alerts & Flags</h1>
        <p className="text-slate-400 text-sm mt-1">{alerts.length} active alerts across the platform</p>
      </div>
      {renderSection('Critical', criticals)}
      {renderSection('Warnings', warnings)}
      {renderSection('Information', infos)}
      {alerts.length === 0 && (
        <div className="glass-card p-12 text-center">
          <p className="text-slate-400">All clear — no active alerts.</p>
        </div>
      )}
    </div>
  );
}