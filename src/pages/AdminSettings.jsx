import React from 'react';
import { Settings, Shield, Globe, Bell, Database } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function AdminSettings() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Admin Settings</h1>
        <p className="text-slate-400 text-sm mt-1">Platform configuration and preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-5 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-white">Security</h3>
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-sm text-slate-300">Two-factor authentication</Label>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-sm text-slate-300">IP whitelist enforcement</Label>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-sm text-slate-300">Audit logging</Label>
            <Switch defaultChecked />
          </div>
        </div>

        <div className="glass-card p-5 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Bell className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-white">Notifications</h3>
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-sm text-slate-300">Critical alerts via email</Label>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-sm text-slate-300">Daily summary report</Label>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-sm text-slate-300">Churn risk notifications</Label>
            <Switch defaultChecked />
          </div>
        </div>

        <div className="glass-card p-5 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-white">Platform</h3>
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-sm text-slate-300">Maintenance mode</Label>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-sm text-slate-300">New signups enabled</Label>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-sm text-slate-300">AI auto-scaling</Label>
            <Switch defaultChecked />
          </div>
        </div>

        <div className="glass-card p-5 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Database className="w-4 h-4 text-violet-400" />
            <h3 className="text-sm font-semibold text-white">Data</h3>
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-sm text-slate-300">Auto backups</Label>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-sm text-slate-300">Data retention (90 days)</Label>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-sm text-slate-300">Export logging</Label>
            <Switch />
          </div>
        </div>
      </div>
    </div>
  );
}