import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Calendar, Clock, CheckCircle2, XCircle, FileText, List, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import DiscBadge from '../components/ui-custom/DiscBadge';

const mockMeetings = [
  { id: 1, lead_name: 'Priya Mehta', lead_company: 'TechCorp', lead_title: 'VP Engineering', lead_disc: 'C', scheduled_date: '2026-03-08T15:00:00', status: 'confirmed', meeting_type: 'Discovery Call' },
  { id: 2, lead_name: 'James Lee', lead_company: 'Innovate Inc', lead_title: 'CEO', lead_disc: 'I', scheduled_date: '2026-03-09T10:00:00', status: 'confirmed', meeting_type: 'Product Demo' },
  { id: 3, lead_name: 'Sarah Chen', lead_company: 'GlobalTech', lead_title: 'Head of Sales', lead_disc: 'D', scheduled_date: '2026-03-12T14:30:00', status: 'pending', meeting_type: 'Partnership Discussion' },
  { id: 4, lead_name: 'Rahul Singh', lead_company: 'Acme Corp', lead_title: 'CTO', lead_disc: 'C', scheduled_date: '2026-02-28T11:00:00', status: 'completed', meeting_type: 'Technical Review', outcome: 'Positive — moving to proposal stage' },
  { id: 5, lead_name: 'Maria Santos', lead_company: 'ConstructPro', lead_title: 'Operations Director', lead_disc: 'S', scheduled_date: '2026-02-25T09:00:00', status: 'completed', meeting_type: 'Discovery Call', outcome: 'Needs more info — scheduled follow-up' },
];

const statusConfig = {
  pending: { color: 'text-amber-400 bg-amber-500/10 border-amber-500/20', icon: Clock },
  confirmed: { color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', icon: CheckCircle2 },
  completed: { color: 'text-blue-400 bg-blue-500/10 border-blue-500/20', icon: CheckCircle2 },
  cancelled: { color: 'text-red-400 bg-red-500/10 border-red-500/20', icon: XCircle },
  no_show: { color: 'text-slate-400 bg-slate-500/10 border-slate-500/20', icon: XCircle },
};

export default function ClientMeetings() {
  const upcoming = mockMeetings.filter(m => ['pending', 'confirmed'].includes(m.status));
  const past = mockMeetings.filter(m => ['completed', 'cancelled', 'no_show'].includes(m.status));

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Meetings</h1>
        <p className="text-slate-400 text-sm mt-1">{upcoming.length} upcoming, {past.length} completed</p>
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList className="bg-[#12121a] border border-[#1e1e2e]">
          <TabsTrigger value="upcoming" className="data-[state=active]:bg-teal-500/20 data-[state=active]:text-teal-400">
            <CalendarDays className="w-3.5 h-3.5 mr-1" /> Upcoming
          </TabsTrigger>
          <TabsTrigger value="past" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
            <List className="w-3.5 h-3.5 mr-1" /> Past
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcoming.map((meeting, i) => {
              const cfg = statusConfig[meeting.status];
              const StatusIcon = cfg.icon;
              const date = new Date(meeting.scheduled_date);
              return (
                <motion.div key={meeting.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="glass-card p-5 border-teal-500/20"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-base font-semibold text-white">{meeting.lead_name}</h3>
                      <p className="text-xs text-slate-400">{meeting.lead_title} at {meeting.lead_company}</p>
                    </div>
                    <DiscBadge type={meeting.lead_disc} />
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="flex items-center gap-1 text-sm text-teal-400">
                      <Calendar className="w-3.5 h-3.5" />
                      {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1 text-sm text-slate-300">
                      <Clock className="w-3.5 h-3.5" />
                      {date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mb-3">{meeting.meeting_type}</p>
                  <div className="flex items-center gap-2">
                    <span className={`flex items-center gap-1 px-2 py-0.5 text-xs rounded-full border ${cfg.color}`}>
                      <StatusIcon className="w-3 h-3" /> {meeting.status}
                    </span>
                    <Button variant="ghost" size="sm" className="text-indigo-400 hover:text-indigo-300 text-xs">
                      <FileText className="w-3 h-3 mr-1" /> Prep Brief
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="past" className="mt-4">
          <div className="glass-card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1e1e2e]">
                  {['Lead', 'Type', 'Date', 'Status', 'Outcome'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[10px] font-medium text-slate-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {past.map(m => (
                  <tr key={m.id} className="border-b border-[#1e1e2e]/50 hover:bg-white/[0.02]">
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-white">{m.lead_name}</p>
                      <p className="text-xs text-slate-400">{m.lead_company}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-300">{m.meeting_type}</td>
                    <td className="px-4 py-3 text-sm text-slate-400">{new Date(m.scheduled_date).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 text-xs rounded-full border ${statusConfig[m.status].color}`}>{m.status}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-300">{m.outcome || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}