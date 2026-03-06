import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Home, Users, GitBranch, Radio, AlertTriangle, Settings, LogOut, Zap, Thermometer, Target, BarChart3, DollarSign } from 'lucide-react';
import { useCampaign } from '../campaign/CampaignContext';

const navItems = [
  { icon: Home, label: 'Dashboard', page: 'ClientDashboard' },
  { icon: Users, label: 'Leads & Pipeline', page: 'ClientLeads' },
  { icon: GitBranch, label: 'Workflows', page: 'ClientWorkflows' },
  { icon: Radio, label: 'Live AI Feed', page: 'ClientLiveFeed' },
  { icon: Thermometer, label: 'Lead Heatmap', page: 'ClientHeatmap' },
  { icon: BarChart3, label: 'Analytics', page: 'ClientAnalytics' },
  { icon: AlertTriangle, label: 'Interventions', page: 'ClientIntervention' },
  { icon: DollarSign, label: 'My ROI', page: 'ClientROI' },
  { icon: Settings, label: 'Settings', page: 'ClientSettings' },
];

const BADGE_PAGES = ['ClientIntervention', 'ClientLiveFeed', 'ClientLeads'];

export default function ClientSidebar({ currentPage }) {
  const { state, clearBadge } = useCampaign();
  const campaignStatus = state?.campaign?.status;
  const pageBadges = state?.pageBadges || {};

  useEffect(() => {
    if (BADGE_PAGES.includes(currentPage)) {
      clearBadge(currentPage);
    }
  }, [currentPage, clearBadge]);

  return (
    <aside className="w-56 h-screen fixed left-0 top-0 bg-[#0c0c13] border-r border-[#18181f] flex flex-col z-50">
      <div className="p-5 border-b border-[#18181f]">
        <Link to={createPageUrl('ClientDashboard')} className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-xs font-bold text-white tracking-wide">FlowReach AI</h1>
            <p className="text-[10px] text-slate-500 font-medium">CLIENT PORTAL</p>
          </div>
          {campaignStatus === 'active' && (
            <div className="w-2 h-2 rounded-full bg-emerald-500 pulse-green shrink-0" title="Campaign active" />
          )}
          {campaignStatus === 'paused' && (
            <div className="w-2 h-2 rounded-full bg-amber-500 shrink-0" title="Campaign paused" />
          )}
        </Link>
      </div>

      <nav className="flex-1 py-3 px-2.5 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = currentPage === item.page;
          return (
            <Link
              key={item.page}
              to={createPageUrl(item.page)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-indigo-500/10 text-indigo-400'
                  : 'text-slate-500 hover:text-slate-200 hover:bg-white/[0.04]'
              }`}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span className="flex-1 truncate">{item.label}</span>
              {BADGE_PAGES.includes(item.page) && pageBadges[item.page] && currentPage !== item.page && (
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-2.5 border-t border-[#18181f]">
        <Link
          to={createPageUrl('RoleSelect')}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-300 hover:bg-white/[0.04] transition-all"
        >
          <LogOut className="w-4 h-4" />
          Switch Role
        </Link>
      </div>
    </aside>
  );
}