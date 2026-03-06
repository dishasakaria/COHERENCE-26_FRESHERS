import React from 'react';
import { Mail, Linkedin, MessageCircle, Phone, MessageSquare } from 'lucide-react';

const channelConfig = {
  email: { icon: Mail, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
  linkedin: { icon: Linkedin, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  whatsapp: { icon: MessageCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  sms: { icon: MessageSquare, color: 'text-teal-400', bg: 'bg-teal-500/10' },
  call: { icon: Phone, color: 'text-amber-400', bg: 'bg-amber-500/10' },
};

export default function ChannelIcon({ channel, size = 16, showBg = false }) {
  const cfg = channelConfig[channel] || channelConfig.email;
  const Icon = cfg.icon;
  
  if (showBg) {
    return (
      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg ${cfg.bg}`}>
        <Icon size={size} className={cfg.color} />
      </span>
    );
  }
  return <Icon size={size} className={cfg.color} />;
}