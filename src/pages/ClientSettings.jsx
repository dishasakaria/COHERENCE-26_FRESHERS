import React, { useState } from 'react';
import { Shield, Settings, Activity, Save, AlertOctagon, Mail, Linkedin, MessageCircle, MessageSquare, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';

function BigToggle({ checked, onChange, label, description }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[#1a1a26] last:border-0">
      <div className="flex-1 pr-3">
        <p className="text-sm font-medium text-white">{label}</p>
        {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
      </div>
      <button onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${checked ? 'bg-indigo-600' : 'bg-[#2a2a3e]'}`}>
        <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </button>
    </div>
  );
}

function SliderRow({ label, description, value, onChange, max, step, unit }) {
  return (
    <div className="py-3 border-b border-[#1e1e2e] last:border-0">
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-sm font-medium text-white">{label}</p>
          {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
        </div>
        <span className="text-sm font-bold text-indigo-400 ml-3">{value}{unit}</span>
      </div>
      <Slider value={[value]} onValueChange={([v]) => onChange(v)} max={max} step={step}
        className="w-full [&_[role=slider]]:bg-white [&_[role=slider]]:border-2 [&_[role=slider]]:border-indigo-500 [&_[role=slider]]:w-5 [&_[role=slider]]:h-5" />
    </div>
  );
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function ClientSettings() {
  const [safety, setSafety] = useState({ maxEmailsPerWeek: 3, fatigueThreshold: 75, maxDailyOutreach: 2 });
  const [behavior, setBehavior] = useState({ humanTiming: true, businessHours: true, staggerSends: true, weekendPause: false, reviewMode: false });
  const [channels, setChannels] = useState({ email: true, linkedin: true, whatsapp: true, sms: false, call: false });
  const [saved, setSaved] = useState(false);
  const [emergencyStop, setEmergencyStop] = useState(false);
  const [confirmStop, setConfirmStop] = useState(false);

  // Safety & throttle state
  const [throttle, setThrottle] = useState({ maxEmailsPerHour: 50, maxEmailsPerDay: 200, maxTouchesPerWeek: 5, maxCallsPerHour: 10, maxCallAttempts: 3, staggerMin: 30, staggerMax: 90 });
  const [timeWindow, setTimeWindow] = useState({ quietFrom: '21:00', quietTo: '08:00', quietEnabled: true, activeDays: ['Mon','Tue','Wed','Thu','Fri'], callFrom: '09:00', callTo: '18:00', callHoursEnabled: true, timezone: 'lead' });
  const [contentSafety, setContentSafety] = useState({ optOutEnabled: true, optOutKeywords: ['unsubscribe','stop','remove me','not interested','do not contact','opt out'], blacklistDomains: [], dncNumbers: '', maxFollowUps: 3 });
  const [autoPause, setAutoPause] = useState({ fatigue: true, negativeSentiment: true, noOpen: true, callNotAnswered: true, competitor: true, highValueReview: true, highValueThreshold: 80 });

  const [newKeyword, setNewKeyword] = useState('');
  const [newDomain, setNewDomain] = useState('');

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

  const handleEmergencyStop = () => {
    if (!confirmStop) { setConfirmStop(true); return; }
    setEmergencyStop(true); setConfirmStop(false);
  };

  const toggleDay = (day) => {
    setTimeWindow(prev => ({ ...prev, activeDays: prev.activeDays.includes(day) ? prev.activeDays.filter(d => d !== day) : [...prev.activeDays, day] }));
  };

  const addKeyword = () => {
    if (newKeyword.trim()) { setContentSafety(prev => ({ ...prev, optOutKeywords: [...prev.optOutKeywords, newKeyword.trim()] })); setNewKeyword(''); }
  };
  const addDomain = () => {
    if (newDomain.trim()) { setContentSafety(prev => ({ ...prev, blacklistDomains: [...prev.blacklistDomains, newDomain.trim()] })); setNewDomain(''); }
  };

  const cardClass = "bg-[#111118] border border-[#1e1e2e] rounded-2xl overflow-hidden";
  const sectionTitle = (icon, title) => (
    <div className="px-5 py-3.5 border-b border-[#1e1e2e] flex items-center gap-2.5">{icon}<p className="text-sm font-semibold text-white">{title}</p></div>
  );

  return (
    <div className="p-6 overflow-y-auto max-h-screen">
      {emergencyStop && (
        <div className="sticky top-0 z-50 bg-red-600 border-b border-red-500 px-6 py-2.5 flex items-center justify-between mb-4 -mx-6 -mt-6">
          <span className="text-white text-sm font-semibold">⚠️ All AI activity paused — emergency stop active</span>
          <button onClick={() => setEmergencyStop(false)} className="px-3 py-1 rounded-lg bg-white/20 text-white text-xs hover:bg-white/30">Resume</button>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-white">Settings</h1>
        <Button onClick={handleSave} size="lg" className={`px-6 font-semibold text-white ${saved ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
          <Save className="w-4 h-4 mr-2" /> {saved ? 'Saved!' : 'Save Changes'}
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* LEFT COLUMN — Safety & Limits */}
        <div className="space-y-5">
          {/* Safety & Throttle header */}
          <div className={`${cardClass} border-red-500/20`}>
            <div className="px-5 py-4 border-b border-[#1e1e2e] bg-red-500/5">
              <div className="flex items-center gap-2 mb-1">
                <Shield className="w-5 h-5 text-red-400" />
                <p className="text-sm font-bold text-white">🛡️ Safety & Throttle Controls</p>
              </div>
              <p className="text-xs text-red-400/70">These rules are enforced before every AI action — no exceptions.</p>
            </div>

            {/* Sub A — Send Rate */}
            <div className="px-5 py-4 border-b border-[#1e1e2e]">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">A — Send Rate Limits</p>
              <div className="space-y-3">
                {[
                  { label: 'Max emails / hour', key: 'maxEmailsPerHour', max: 200, helper: 'AI pauses if this limit is hit' },
                  { label: 'Max emails / day', key: 'maxEmailsPerDay', max: 1000 },
                  { label: 'Max touches / lead / week', key: 'maxTouchesPerWeek', max: 14, helper: 'All channels combined' },
                  { label: 'Max calls / hour', key: 'maxCallsPerHour', max: 50 },
                  { label: 'Max call attempts / lead', key: 'maxCallAttempts', max: 5 },
                ].map(item => (
                  <div key={item.key}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-white">{item.label}</p>
                        {item.helper && <p className="text-[10px] text-slate-600">{item.helper}</p>}
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => setThrottle(p => ({ ...p, [item.key]: Math.max(1, p[item.key] - 1) }))} className="w-5 h-5 rounded bg-[#2a2a3e] text-slate-400 text-xs hover:bg-[#3a3a4e]">−</button>
                        <span className="w-8 text-center text-sm font-bold text-indigo-400">{throttle[item.key]}</span>
                        <button onClick={() => setThrottle(p => ({ ...p, [item.key]: Math.min(item.max, p[item.key] + 1) }))} className="w-5 h-5 rounded bg-[#2a2a3e] text-slate-400 text-xs hover:bg-[#3a3a4e]">+</button>
                      </div>
                    </div>
                  </div>
                ))}
                <div>
                  <p className="text-xs font-medium text-white mb-1.5">Stagger delay between sends</p>
                  <div className="flex items-center gap-2">
                    <Input type="number" value={throttle.staggerMin} onChange={e => setThrottle(p => ({ ...p, staggerMin: +e.target.value }))} className="bg-[#0a0a0f] border-[#2a2a3e] text-white w-16 h-7 text-xs" />
                    <span className="text-xs text-slate-500">to</span>
                    <Input type="number" value={throttle.staggerMax} onChange={e => setThrottle(p => ({ ...p, staggerMax: +e.target.value }))} className="bg-[#0a0a0f] border-[#2a2a3e] text-white w-16 h-7 text-xs" />
                    <span className="text-xs text-slate-500">seconds</span>
                  </div>
                  <p className="text-[10px] text-slate-600 mt-1">Random wait between each send</p>
                </div>
                <div className="pt-2 border-t border-[#1a1a26] text-[10px] text-slate-500">
                  Current rate: <span className="text-indigo-400 font-medium">32 emails</span> in last hour | <span className="text-emerald-400 font-medium">156 leads</span> touched today
                </div>
              </div>
            </div>

            {/* Sub D — Auto-Pause */}
            <div className="px-5 py-4">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">D — Auto-Pause Triggers</p>
              <div className="space-y-1">
                <BigToggle checked={autoPause.fatigue} onChange={v => setAutoPause(p => ({ ...p, fatigue: v }))} label="Fatigue score exceeds threshold" description="AI pauses and flags for review" />
                {autoPause.fatigue && (
                  <div className="pb-2">
                    <SliderRow label="Threshold" value={safety.fatigueThreshold} onChange={v => setSafety(p => ({ ...p, fatigueThreshold: v }))} max={100} step={5} unit="%" />
                  </div>
                )}
                <BigToggle checked={autoPause.negativeSentiment} onChange={v => setAutoPause(p => ({ ...p, negativeSentiment: v }))} label="Reply contains negative sentiment" description="Routes to Interventions immediately" />
                <BigToggle checked={autoPause.noOpen} onChange={v => setAutoPause(p => ({ ...p, noOpen: v }))} label="3 consecutive sends with no open" description="Lead may have wrong email" />
                <BigToggle checked={autoPause.callNotAnswered} onChange={v => setAutoPause(p => ({ ...p, callNotAnswered: v }))} label="Call not answered 3 times" description="Switches to email/LinkedIn only" />
                <BigToggle checked={autoPause.competitor} onChange={v => setAutoPause(p => ({ ...p, competitor: v }))} label="Lead marked as competitor" description="Removes from all sequences" />
                <BigToggle checked={autoPause.highValueReview} onChange={v => setAutoPause(p => ({ ...p, highValueReview: v }))} label="Human review for high-value leads" description="Queues action pending your approval" />
                {autoPause.highValueReview && (
                  <div className="flex items-center gap-2 py-2">
                    <span className="text-xs text-slate-400">Interest &gt;</span>
                    <Input type="number" value={autoPause.highValueThreshold} onChange={e => setAutoPause(p => ({ ...p, highValueThreshold: +e.target.value }))} className="bg-[#0a0a0f] border-[#2a2a3e] text-white w-16 h-7 text-xs" />
                    <span className="text-xs text-slate-400">requires approval</span>
                  </div>
                )}
              </div>

              {/* Emergency Stop */}
              <div className="mt-4">
                {confirmStop ? (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3">
                    <p className="text-xs text-red-300 mb-2">This will stop ALL active sequences. Are you sure?</p>
                    <div className="flex gap-2">
                      <button onClick={handleEmergencyStop} className="flex-1 py-2 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-700">Confirm Stop</button>
                      <button onClick={() => setConfirmStop(false)} className="flex-1 py-2 rounded-lg bg-[#2a2a3e] text-slate-400 text-xs hover:bg-[#3a3a4e]">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={handleEmergencyStop} className="w-full py-2.5 rounded-xl bg-red-600/10 border border-red-500/30 text-red-400 text-sm font-semibold hover:bg-red-600/20 transition-colors">
                    ⛔ PAUSE ALL AI ACTIVITY
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Existing safety sliders */}
          <div className={cardClass}>
            {sectionTitle(<Shield className="w-4 h-4 text-red-400" />, 'Send Limits')}
            <div className="px-5">
              <SliderRow label="Max emails per lead per week" value={safety.maxEmailsPerWeek} onChange={v => setSafety(p => ({ ...p, maxEmailsPerWeek: v }))} max={10} step={1} unit="" />
              <SliderRow label="Max daily touchpoints per lead" value={safety.maxDailyOutreach} onChange={v => setSafety(p => ({ ...p, maxDailyOutreach: v }))} max={5} step={1} unit="" />
            </div>
          </div>
        </div>

        {/* CENTER COLUMN — Time Windows & Channels */}
        <div className="space-y-5">
          {/* Time Window Controls */}
          <div className={cardClass}>
            <div className="px-5 py-4 border-b border-[#1e1e2e] bg-amber-500/5">
              <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-0.5">B — Time Window Controls</p>
            </div>
            <div className="px-5 py-4 space-y-4">
              {/* Quiet hours */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-white">Quiet hours</p>
                  <button onClick={() => setTimeWindow(p => ({ ...p, quietEnabled: !p.quietEnabled }))}
                    className={`relative w-9 h-5 rounded-full transition-colors ${timeWindow.quietEnabled ? 'bg-indigo-600' : 'bg-[#2a2a3e]'}`}>
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${timeWindow.quietEnabled ? 'translate-x-4' : 'translate-x-0.5'}`} />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <Input type="time" value={timeWindow.quietFrom} onChange={e => setTimeWindow(p => ({ ...p, quietFrom: e.target.value }))} className="bg-[#0a0a0f] border-[#2a2a3e] text-white h-7 text-xs flex-1" />
                  <span className="text-xs text-slate-500">to</span>
                  <Input type="time" value={timeWindow.quietTo} onChange={e => setTimeWindow(p => ({ ...p, quietTo: e.target.value }))} className="bg-[#0a0a0f] border-[#2a2a3e] text-white h-7 text-xs flex-1" />
                </div>
              </div>

              {/* Active days */}
              <div>
                <p className="text-sm font-medium text-white mb-2">Active days</p>
                <div className="flex gap-1 flex-wrap">
                  {DAYS.map(day => (
                    <button key={day} onClick={() => toggleDay(day)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${timeWindow.activeDays.includes(day) ? 'bg-indigo-600 text-white' : 'bg-[#1a1a28] text-slate-500 hover:bg-[#2a2a38]'}`}>
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              {/* Business hours for calls */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-white">Call hours only</p>
                  <button onClick={() => setTimeWindow(p => ({ ...p, callHoursEnabled: !p.callHoursEnabled }))}
                    className={`relative w-9 h-5 rounded-full transition-colors ${timeWindow.callHoursEnabled ? 'bg-indigo-600' : 'bg-[#2a2a3e]'}`}>
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${timeWindow.callHoursEnabled ? 'translate-x-4' : 'translate-x-0.5'}`} />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <Input type="time" value={timeWindow.callFrom} onChange={e => setTimeWindow(p => ({ ...p, callFrom: e.target.value }))} className="bg-[#0a0a0f] border-[#2a2a3e] text-white h-7 text-xs flex-1" />
                  <span className="text-xs text-slate-500">to</span>
                  <Input type="time" value={timeWindow.callTo} onChange={e => setTimeWindow(p => ({ ...p, callTo: e.target.value }))} className="bg-[#0a0a0f] border-[#2a2a3e] text-white h-7 text-xs flex-1" />
                </div>
              </div>

              {/* Timezone */}
              <div>
                <p className="text-sm font-medium text-white mb-1">Timezone</p>
                <select value={timeWindow.timezone} onChange={e => setTimeWindow(p => ({ ...p, timezone: e.target.value }))}
                  className="w-full bg-[#0a0a0f] border border-[#2a2a3e] text-white text-xs rounded-lg px-2.5 py-1.5">
                  <option value="lead">Use lead's local timezone when known</option>
                  <option value="sender">Use sender's timezone</option>
                  <option value="utc">UTC</option>
                </select>
              </div>
            </div>
          </div>

          {/* Content Safety */}
          <div className={cardClass}>
            <div className="px-5 py-3.5 border-b border-[#1e1e2e] bg-blue-500/5">
              <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider">C — Content Safety Rules</p>
            </div>
            <div className="px-5 py-4 space-y-4">
              {/* Opt-out keywords */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-white">Auto-detect opt-out keywords</p>
                  <button onClick={() => setContentSafety(p => ({ ...p, optOutEnabled: !p.optOutEnabled }))}
                    className={`relative w-9 h-5 rounded-full transition-colors ${contentSafety.optOutEnabled ? 'bg-indigo-600' : 'bg-[#2a2a3e]'}`}>
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${contentSafety.optOutEnabled ? 'translate-x-4' : 'translate-x-0.5'}`} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {contentSafety.optOutKeywords.map((kw, i) => (
                    <span key={i} className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-[10px] text-red-400">
                      {kw}
                      <button onClick={() => setContentSafety(p => ({ ...p, optOutKeywords: p.optOutKeywords.filter((_, j) => j !== i) }))} className="hover:text-red-300">×</button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-1.5">
                  <Input placeholder="Add keyword..." value={newKeyword} onChange={e => setNewKeyword(e.target.value)} onKeyDown={e => e.key === 'Enter' && addKeyword()}
                    className="bg-[#0a0a0f] border-[#2a2a3e] text-white h-7 text-xs flex-1" />
                  <button onClick={addKeyword} className="px-2.5 rounded-lg bg-[#2a2a3e] text-slate-400 text-xs hover:bg-[#3a3a4e]">Add</button>
                </div>
              </div>

              {/* Blacklisted domains */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-sm font-medium text-white">Blacklisted domains</p>
                  <span className="text-[10px] text-slate-500">{contentSafety.blacklistDomains.length} domains</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {contentSafety.blacklistDomains.map((d, i) => (
                    <span key={i} className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#1a1a28] border border-[#2a2a3e] text-[10px] text-slate-400">
                      {d}
                      <button onClick={() => setContentSafety(p => ({ ...p, blacklistDomains: p.blacklistDomains.filter((_, j) => j !== i) }))} className="hover:text-white">×</button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-1.5">
                  <Input placeholder="example.com" value={newDomain} onChange={e => setNewDomain(e.target.value)} onKeyDown={e => e.key === 'Enter' && addDomain()}
                    className="bg-[#0a0a0f] border-[#2a2a3e] text-white h-7 text-xs flex-1" />
                  <button onClick={addDomain} className="px-2.5 rounded-lg bg-[#2a2a3e] text-slate-400 text-xs hover:bg-[#3a3a4e]">Add</button>
                </div>
              </div>

              {/* Max follow-ups */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">Max follow-ups after no response</p>
                  <p className="text-[10px] text-slate-600">Then move to Nurture</p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => setContentSafety(p => ({ ...p, maxFollowUps: Math.max(1, p.maxFollowUps - 1) }))} className="w-6 h-6 rounded bg-[#2a2a3e] text-slate-400 text-xs hover:bg-[#3a3a4e]">−</button>
                  <span className="w-6 text-center text-sm font-bold text-indigo-400">{contentSafety.maxFollowUps}</span>
                  <button onClick={() => setContentSafety(p => ({ ...p, maxFollowUps: Math.min(7, p.maxFollowUps + 1) }))} className="w-6 h-6 rounded bg-[#2a2a3e] text-slate-400 text-xs hover:bg-[#3a3a4e]">+</button>
                </div>
              </div>
            </div>
          </div>

          {/* Behavior */}
          <div className={cardClass}>
            {sectionTitle(<Activity className="w-4 h-4 text-amber-400" />, 'Behavior Simulation')}
            <div className="px-5">
              <BigToggle checked={behavior.humanTiming} onChange={v => setBehavior(p => ({ ...p, humanTiming: v }))} label="Human-like random timing" description="Adds ±15 min variance to all sends" />
              <BigToggle checked={behavior.staggerSends} onChange={v => setBehavior(p => ({ ...p, staggerSends: v }))} label="Stagger bulk sends" description="Spread over 2–4 hours" />
              <BigToggle checked={behavior.reviewMode} onChange={v => setBehavior(p => ({ ...p, reviewMode: v }))} label="Review mode" description="Every action requires approval" />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN — Channels & API */}
        <div className="space-y-5">
          {/* Channel Enablement */}
          <div className={cardClass}>
            {sectionTitle(<Settings className="w-4 h-4 text-indigo-400" />, 'Channel Enablement')}
            <div className="px-5">
              {[
                { key: 'email', label: 'Email', icon: Mail, color: 'text-indigo-400' },
                { key: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: 'text-blue-400' },
                { key: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, color: 'text-emerald-400' },
                { key: 'sms', label: 'SMS', icon: MessageSquare, color: 'text-teal-400' },
                { key: 'call', label: 'AI Voice Call', icon: Phone, color: 'text-amber-400' },
              ].map(({ key, label, icon: Icon, color }) => (
                <div key={key} className="flex items-center justify-between py-3 border-b border-[#1a1a26] last:border-0">
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${color}`} />
                    <p className="text-sm font-medium text-white">{label}</p>
                  </div>
                  <button onClick={() => setChannels(p => ({ ...p, [key]: !p[key] }))}
                    className={`relative w-11 h-6 rounded-full transition-colors ${channels[key] ? 'bg-indigo-600' : 'bg-[#2a2a3e]'}`}>
                    <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${channels[key] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* API Connections */}
          <div className={cardClass}>
            {sectionTitle(<Settings className="w-4 h-4 text-slate-400" />, 'API Connections')}
            <div className="px-5 py-4 space-y-3">
              {[
                { label: 'Claude API Key', placeholder: 'sk-ant-...' },
                { label: 'Twilio SID', placeholder: 'AC...' },
                { label: 'Twilio Auth Token', placeholder: '••••••••' },
                { label: 'From Number', placeholder: '+1234567890' },
              ].map(item => (
                <div key={item.label}>
                  <label className="text-xs text-slate-500 mb-1 block">{item.label}</label>
                  <div className="flex gap-1.5">
                    <Input type="password" placeholder={item.placeholder} className="bg-[#0a0a0f] border-[#2a2a3e] text-white h-7 text-xs flex-1" />
                    <button className="px-2.5 rounded-lg bg-[#2a2a3e] text-slate-400 text-xs hover:bg-[#3a3a4e]">Test</button>
                    <div className="w-2 h-2 rounded-full bg-emerald-500 self-center shrink-0" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Meeting Preferences */}
          <div className={cardClass}>
            {sectionTitle(<Settings className="w-4 h-4 text-teal-400" />, 'Meeting Preferences')}
            <div className="px-5 py-4 space-y-4">
              <div>
                <p className="text-xs text-slate-500 mb-2">Duration</p>
                <div className="flex gap-1.5">
                  {[15, 30, 45, 60].map(d => (
                    <button key={d} className="flex-1 py-1.5 rounded-lg text-xs font-medium bg-[#1a1a28] border border-[#2a2a3e] text-slate-400 hover:bg-indigo-600/20 hover:text-indigo-300 transition-colors">{d} min</button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-2">Platform</p>
                <div className="flex gap-1.5">
                  {['Zoom', 'Google Meet', 'Phone'].map(p => (
                    <button key={p} className="flex-1 py-1.5 rounded-lg text-xs font-medium bg-[#1a1a28] border border-[#2a2a3e] text-slate-400 hover:bg-indigo-600/20 hover:text-indigo-300 transition-colors">{p}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}