import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ChannelIcon from '../components/ui-custom/ChannelIcon';
import DiscBadge from '../components/ui-custom/DiscBadge';

const queue = [
  { id: 1, lead: 'Rahul Singh', company: 'Acme Corp', disc: 'D', channel: 'email', action: 'Follow-up email #3', time: 'Today, 2:17 PM', delay: '45 min' },
  { id: 2, lead: 'Priya Mehta', company: 'TechCorp', disc: 'C', channel: 'whatsapp', action: 'WhatsApp check-in', time: 'Today, 3:42 PM', delay: '2h 10m' },
  { id: 3, lead: 'James Lee', company: 'Innovate Inc', disc: 'I', channel: 'linkedin', action: 'LinkedIn value-add DM', time: 'Today, 4:08 PM', delay: '2h 36m' },
  { id: 4, lead: 'Chen Wei', company: 'ByteForce', disc: 'C', channel: 'email', action: 'Case study email', time: 'Tomorrow, 9:23 AM', delay: '20h' },
  { id: 5, lead: 'Maria Santos', company: 'ConstructPro', disc: 'S', channel: 'call', action: 'AI voice call — demo offer', time: 'Tomorrow, 10:47 AM', delay: '21h' },
  { id: 6, lead: 'Alex Kim', company: 'DataDriven', disc: 'D', channel: 'sms', action: 'Meeting reminder SMS', time: 'Tomorrow, 2:00 PM', delay: '1d 30m' },
];

export default function ClientScheduledQueue() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Scheduled Queue</h1>
        <p className="text-slate-400 text-sm mt-1">{queue.length} actions queued with human-randomized timing</p>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1e1e2e]">
                {['Channel', 'Lead', 'DISC', 'Action', 'Scheduled Time', 'In', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] font-medium text-slate-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {queue.map((item, i) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-[#1e1e2e]/50 hover:bg-white/[0.02]"
                >
                  <td className="px-4 py-3"><ChannelIcon channel={item.channel} showBg /></td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-white">{item.lead}</p>
                    <p className="text-xs text-slate-400">{item.company}</p>
                  </td>
                  <td className="px-4 py-3"><DiscBadge type={item.disc} /></td>
                  <td className="px-4 py-3 text-sm text-slate-300">{item.action}</td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-white">{item.time}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1 text-xs text-amber-400">
                      <Clock className="w-3 h-3" /> {item.delay}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="w-7 h-7 text-slate-500 hover:text-white"><Eye className="w-3.5 h-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="w-7 h-7 text-slate-500 hover:text-indigo-400"><Edit className="w-3.5 h-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="w-7 h-7 text-slate-500 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}