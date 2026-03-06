import React, { useState, useRef, useCallback } from 'react';
import { Play, Sparkles, Users, Mail, Linkedin, MessageCircle, Phone, MessageSquare, Clock, GitBranch, Bot, Calendar, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { useCampaign } from '../components/campaign/CampaignContext';

const NODE_DEFS = {
  email:       { icon: Mail,          label: 'Send Email',       sub: 'Send Email',       border: '#6366f1', bg: '#1a1a35', text: '#a5b4fc' },
  linkedin:    { icon: Linkedin,      label: 'LinkedIn Connect', sub: 'LinkedIn Connect', border: '#3b82f6', bg: '#0f1e35', text: '#93c5fd' },
  linkedin_dm: { icon: Linkedin,      label: 'LinkedIn DM',      sub: 'LinkedIn DM',      border: '#60a5fa', bg: '#0f1e35', text: '#bfdbfe' },
  whatsapp:    { icon: MessageCircle, label: 'WhatsApp',         sub: 'WhatsApp',         border: '#10b981', bg: '#0a2a1e', text: '#6ee7b7' },
  sms:         { icon: MessageSquare, label: 'SMS',              sub: 'SMS',              border: '#14b8a6', bg: '#0a2525', text: '#5eead4' },
  call:        { icon: Phone,         label: 'AI Call',          sub: 'Call',             border: '#f59e0b', bg: '#1f1500', text: '#fcd34d' },
  delay:       { icon: Clock,         label: 'Delay',            sub: 'Delay',            border: '#64748b', bg: '#161b22', text: '#94a3b8' },
  condition:   { icon: GitBranch,     label: 'Condition',        sub: 'Condition',        border: '#eab308', bg: '#1a1400', text: '#fde047' },
  ai_decision: { icon: Bot,           label: 'AI Decision',      sub: 'AI Decision',      border: '#8b5cf6', bg: '#160f2a', text: '#c4b5fd' },
  meeting:     { icon: Calendar,      label: 'Schedule Meeting', sub: 'Meeting',          border: '#2dd4bf', bg: '#0a2020', text: '#99f6e4' },
  end:         { icon: XCircle,       label: 'End',              sub: 'End',              border: '#ef4444', bg: '#1f0a0a', text: '#fca5a5' },
};

const INITIAL_NODES = [
  { id: 1, type: 'email',      label: 'Initial Outreach',    leads: 34, x: 300, y: 20  },
  { id: 2, type: 'delay',      label: 'Wait 2 Days',         leads: 34, x: 300, y: 130 },
  { id: 3, type: 'condition',  label: 'Email Opened?',       leads: 28, x: 300, y: 240 },
  { id: 4, type: 'email',      label: 'Follow-up Email',     leads: 22, x: 80,  y: 360 },
  { id: 5, type: 'whatsapp',   label: 'WhatsApp Message',    leads: 6,  x: 520, y: 360 },
  { id: 6, type: 'linkedin',   label: 'Connect on LinkedIn', leads: 6,  x: 300, y: 480 },
  { id: 7, type: 'ai_decision',label: 'AI Evaluates',        leads: 18, x: 300, y: 590 },
];

const EDGES = [
  { from: 1, to: 2 },
  { from: 2, to: 3 },
  { from: 3, to: 4, label: 'Yes' },
  { from: 3, to: 5, label: 'No' },
  { from: 4, to: 6 },
  { from: 5, to: 6 },
  { from: 6, to: 7 },
];

const NW = 200;
const NH = 64;

function getAnchor(node, side = 'right') {
  if (side === 'right') return { x: node.x + NW, y: node.y + NH / 2 };
  if (side === 'left')  return { x: node.x,      y: node.y + NH / 2 };
  if (side === 'bottom')return { x: node.x + NW / 2, y: node.y + NH };
  return { x: node.x + NW / 2, y: node.y };
}

function EdgePath({ from, to, label }) {
  const fx = from.x + NW / 2, fy = from.y + NH;
  const tx = to.x + NW / 2,   ty = to.y;
  const cx1 = fx, cy1 = fy + (ty - fy) * 0.5;
  const cx2 = tx, cy2 = fy + (ty - fy) * 0.5;
  const mx = (fx + tx) / 2, my = (fy + ty) / 2;
  return (
    <g>
      <path d={`M${fx},${fy} C${cx1},${cy1} ${cx2},${cy2} ${tx},${ty}`}
        stroke="#3a3a5e" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
      {label && (
        <text x={mx} y={my - 6} fill="#64748b" fontSize="10" textAnchor="middle">{label}</text>
      )}
    </g>
  );
}

function WorkflowNode({ node, onDrag }) {
  const def = NODE_DEFS[node.type] || NODE_DEFS.email;
  const Icon = def.icon;

  const handleMouseDown = (e) => {
    e.preventDefault();
    const ox = e.clientX - node.x, oy = e.clientY - node.y;
    const onMove = (mv) => onDrag(node.id, mv.clientX - ox, mv.clientY - oy);
    const onUp = () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  return (
    <foreignObject x={node.x} y={node.y} width={NW} height={NH} style={{ cursor: 'grab', overflow: 'visible' }} onMouseDown={handleMouseDown}>
      <div style={{ background: def.bg, border: `1.5px solid ${def.border}40`, borderRadius: 14, height: NH, display: 'flex', alignItems: 'center', gap: 10, padding: '0 12px', userSelect: 'none', position: 'relative', boxShadow: `0 0 12px ${def.border}20` }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: `${def.border}18`, border: `1px solid ${def.border}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, position: 'relative' }}>
          <Icon size={14} color={def.text} />
          {['email','linkedin','linkedin_dm','whatsapp','sms','call'].includes(node.type) && (
            <div title="Safety checks applied before this action:
✅ DNC list checked
✅ Quiet hours respected
✅ Rate limit verified
✅ Fatigue score checked
✅ Opt-out keywords scanned"
              style={{ position: 'absolute', top: -6, right: -6, width: 14, height: 14, borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, cursor: 'help' }}>
              🛡
            </div>
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: '#fff', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{node.label}</div>
          <div style={{ color: def.text, fontSize: 10, opacity: 0.8 }}>{def.sub}</div>
        </div>
        <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: '#fff', fontWeight: 700, flexShrink: 0 }}>
          {node.leads}
        </div>
      </div>
    </foreignObject>
  );
}

export default function ClientWorkflows() {
  const [workflowName, setWorkflowName] = useState('Multi-Channel Outreach v2');
  const [nodes, setNodes] = useState(INITIAL_NODES);
  const { state, updateCampaignStatus } = useCampaign();

  const handleDrag = useCallback((id, x, y) => {
    setNodes(prev => prev.map(n => n.id === id ? { ...n, x: Math.max(0, x), y: Math.max(0, y) } : n));
  }, []);

  const addNode = (type) => {
    const newNode = {
      id: Date.now(),
      type,
      label: NODE_DEFS[type].label,
      leads: 0,
      x: 100,
      y: 100
    };
    setNodes([...nodes, newNode]);
  };

  const nodeMap = Object.fromEntries(nodes.map(n => [n.id, n]));

  const isLaunching = state?.campaign?.status === 'active';

  return (
    <div className="p-6 h-screen flex flex-col gap-4 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-semibold text-white">Workflow Builder</h1>
          <p className="text-slate-500 text-sm mt-0.5">Design and manage your outreach sequences</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="border-violet-500/40 text-violet-300 hover:bg-violet-500/10">
            <Sparkles className="w-4 h-4 mr-2" /> AI Draft Workflow
          </Button>
          <Button 
            onClick={() => updateCampaignStatus(isLaunching ? 'paused' : 'active')}
            className={isLaunching ? "bg-amber-600 hover:bg-amber-700" : "bg-emerald-600 hover:bg-emerald-700"}
          >
            <Play className="w-4 h-4 mr-2" /> {isLaunching ? 'Pause Sequence' : 'Launch Sequence'}
          </Button>
        </div>
      </div>

      {/* Meta bar */}
      <div className="bg-[#111118] border border-[#1e1e2e] rounded-2xl px-5 py-3 flex items-center gap-4 shrink-0">
        <Input value={workflowName} onChange={e => setWorkflowName(e.target.value)}
          className="bg-[#0a0a0f] border-[#2a2a3e] text-white font-medium rounded-xl max-w-xs" />
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 shrink-0">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 pulse-green" />
          <span className="text-xs text-emerald-400 font-medium">Active</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500 shrink-0">
          <Users className="w-3.5 h-3.5" /> 34 leads
        </div>
      </div>

      {/* Node palette */}
      <div className="flex flex-wrap gap-2 shrink-0 overflow-x-auto pb-1">
        {Object.entries(NODE_DEFS).map(([key, def]) => {
          const Icon = def.icon;
          return (
            <button key={key} onClick={() => addNode(key)} style={{ borderColor: `${def.border}50`, color: def.text, background: def.bg }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium hover:opacity-80 transition-opacity shrink-0">
              <Icon size={12} /> {def.label}
            </button>
          );
        })}
      </div>

      {/* Canvas */}
      <div className="flex-1 min-h-0 bg-[#070710] border border-[#1e1e2e] rounded-2xl overflow-y-auto overflow-x-hidden relative"
        style={{ backgroundImage: 'radial-gradient(circle, #1e1e2e 1px, transparent 1px)', backgroundSize: '28px 28px' }}>
        <svg style={{ width: '100%', minHeight: 750, display: 'block' }}>
          <defs>
            <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill="#3a3a5e" />
            </marker>
          </defs>
          {EDGES.map((edge, i) => {
            const fn = nodeMap[edge.from], tn = nodeMap[edge.to];
            if (!fn || !tn) return null;
            return <EdgePath key={i} from={fn} to={tn} label={edge.label} />;
          })}
          {nodes.map(node => (
            <WorkflowNode key={node.id} node={node} onDrag={handleDrag} />
          ))}
        </svg>
      </div>
    </div>
  );
}