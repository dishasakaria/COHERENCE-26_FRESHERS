import { User, HelpCircle, Bell, Upload, Sparkles, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useCampaign } from '../campaign/CampaignContext';

export default function ClientHeader() {
  const { state, setUIState } = useCampaign();
  const companyName = state?.onboarding?.companyData?.companyName || 'FlowReach Client';
  const initials = companyName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <header className="h-16 border-b border-[#18181f] bg-[#09090f]/80 backdrop-blur-md sticky top-0 z-40 px-8 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-[10px] font-black text-white shadow-lg shadow-indigo-500/20"
          >
            {initials}
          </motion.div>
          <div>
            <h2 className="text-xs font-bold text-white tracking-wide">{companyName}</h2>
            <p className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest">Active Workspace</p>
          </div>
        </div>

        <div className="h-6 w-px bg-[#18181f]" />

        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setUIState('showPersonality', true)} 
            className="border-violet-500/30 text-violet-300 hover:bg-violet-500/10 text-[10px] h-8 px-3"
          >
            <User className="w-3 h-3 mr-1.5" /> My Outreach Identity
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setUIState('addMode', state.ui.addMode === 'upload' ? null : 'upload')} 
            className="border-[#1e1e2e] text-slate-400 hover:bg-[#111118] text-[10px] h-8 px-3"
          >
            <Upload className="w-3 h-3 mr-1.5" /> Upload CSV
          </Button>
          <Button 
            size="sm" 
            onClick={() => setUIState('addMode', state.ui.addMode === 'ai' ? null : 'ai')} 
            className="bg-indigo-600 hover:bg-indigo-700 text-[10px] h-8 px-3 shadow-lg shadow-indigo-600/10"
          >
            <Sparkles className="w-3 h-3 mr-1.5" /> AI Find Leads
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={() => setUIState('showHowItWorks', true)}
          className="w-8 h-8 rounded-full border border-[#1e1e2e] text-slate-500 hover:text-white hover:border-slate-400 flex items-center justify-center transition-colors"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
        <button className="p-2 text-slate-500 hover:text-white transition-colors relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full border border-[#09090f]" />
        </button>
        <div className="w-px h-6 bg-[#18181f]" />
        <div className="flex items-center gap-3 pl-1">
          <div className="text-right hidden md:block">
            <p className="text-[10px] font-bold text-white">Admin Access</p>
            <p className="text-[9px] text-slate-500 font-medium truncate max-w-[120px]">{state?.onboarding?.companyData?.workEmail || 'admin@flowreach.ai'}</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-[#111118] border border-[#1e1e2e] flex items-center justify-center text-slate-400">
            <User className="w-4 h-4" />
          </div>
        </div>
      </div>
    </header>
  );
}
