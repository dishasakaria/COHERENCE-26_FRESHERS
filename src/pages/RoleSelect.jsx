import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Shield, Building2, Zap, ArrowRight } from 'lucide-react';
import { useCampaign } from '@/components/campaign/CampaignContext';

export default function RoleSelect() {
  const navigate = useNavigate();
  const { state } = useCampaign();

  const handleClientPortalClick = () => {
    if (state.onboarding.complete) {
      navigate(createPageUrl('ClientDashboard'));
    } else {
      navigate(createPageUrl('ClientOnboarding'));
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-6">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-2xl w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mx-auto mb-6">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">FlowReach AI</h1>
          <p className="text-slate-400 text-lg">AI-Powered Sales Outreach Platform</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            onClick={() => navigate(createPageUrl('AdminOverview'))}
            className="glass-card p-8 text-left group hover:border-indigo-500/40 transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-5 group-hover:bg-indigo-500/20 transition-colors">
              <Shield className="w-6 h-6 text-indigo-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">FlowReach Admin</h2>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              God-mode view. Monitor all client companies, system health, billing, and AI activity.
            </p>
            <div className="flex items-center text-indigo-400 text-sm font-medium group-hover:gap-3 gap-2 transition-all">
              Enter Admin Console <ArrowRight className="w-4 h-4" />
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            onClick={handleClientPortalClick}
            className="glass-card p-8 text-left group hover:border-emerald-500/40 transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-5 group-hover:bg-emerald-500/20 transition-colors">
              <Building2 className="w-6 h-6 text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Client Company</h2>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              Your AI command center. Full transparency and control over every outreach action.
            </p>
            <div className="flex items-center text-emerald-400 text-sm font-medium group-hover:gap-3 gap-2 transition-all">
              Enter Client Portal <ArrowRight className="w-4 h-4" />
            </div>
          </motion.button>
        </div>
      </div>
    </div>
  );
}