import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Home, Building2, BarChart3, Bot, Server, CreditCard, Bell, Settings, LogOut, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { icon: Home, label: 'Overview', page: 'AdminOverview' },
  { icon: Building2, label: 'Companies', page: 'AdminCompanies' },
  { icon: BarChart3, label: 'Analytics', page: 'AdminAnalytics' },
  { icon: Bot, label: 'AI Monitor', page: 'AdminAIMonitor' },
  { icon: Server, label: 'System Health', page: 'AdminSystemHealth' },
  { icon: CreditCard, label: 'Billing', page: 'AdminBilling' },
  { icon: Bell, label: 'Alerts', page: 'AdminAlerts' },
  { icon: Settings, label: 'Settings', page: 'AdminSettings' },
];

export default function AdminSidebar({ currentPage }) {
  return (
    <aside className="w-64 h-screen fixed left-0 top-0 bg-[#0c0c14] border-r border-[#1e1e2e] flex flex-col z-50">
      <div className="p-5 border-b border-[#1e1e2e]">
        <Link to={createPageUrl('AdminOverview')} className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white">FlowReach AI</h1>
            <p className="text-[10px] text-indigo-400 font-medium">ADMIN CONSOLE</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = currentPage === item.page;
          return (
            <Link
              key={item.page}
              to={createPageUrl(item.page)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-[#1e1e2e]">
        <Link
          to={createPageUrl('RoleSelect')}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/5 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Switch Role
        </Link>
      </div>
    </aside>
  );
}