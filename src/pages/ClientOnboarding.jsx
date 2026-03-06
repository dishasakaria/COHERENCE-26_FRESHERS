import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCampaign } from '@/components/campaign/CampaignContext';
import { Building2, Mail, Globe, Users, Briefcase, MapPin, Zap, Check, ArrowRight, Loader2, Linkedin, MessageCircle, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createPageUrl } from '@/utils';

const STEPS = [
  { id: 1, title: 'Company Signup', description: 'Tell us about your business' },
  { id: 2, title: 'Integrations', description: 'Connect your outreach channels' },
];

export default function ClientOnboarding() {
  const navigate = useNavigate();
  const { state, setOnboardingData, setIntegrationStatus, completeOnboarding } = useCampaign();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    founderName: '',
    workEmail: '',
    contactEmail: '',
    website: '',
    industry: '',
    companySize: '',
    targetCustomer: '',
    region: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      setIsSubmitting(true);
      setTimeout(() => {
        setOnboardingData(formData);
        setIsSubmitting(false);
        setCurrentStep(2);
      }, 1500);
    } else {
      completeOnboarding();
      navigate(createPageUrl('ClientDashboard'));
    }
  };

  const toggleIntegration = (channel) => {
    const currentStatus = state.onboarding.integrations[channel];
    setIntegrationStatus(channel, !currentStatus);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px]" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 max-w-2xl w-full bg-[#111118]/80 backdrop-blur-xl border border-[#1e1e2e] rounded-3xl overflow-hidden shadow-2xl shadow-black/50"
      >
        {/* Header */}
        <div className="p-8 border-b border-[#1e1e2e]">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white tracking-tight">FlowReach Onboarding</h1>
            </div>
            <div className="flex items-center gap-2">
              {STEPS.map(step => (
                <div 
                  key={step.id}
                  className={`h-1.5 rounded-full transition-all duration-500 ${currentStep === step.id ? 'w-8 bg-indigo-500' : 'w-4 bg-[#1e1e2e]'}`}
                />
              ))}
            </div>
          </div>
          
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-white">{STEPS[currentStep-1].title}</h2>
            <p className="text-slate-400 text-sm tracking-wide">{STEPS[currentStep-1].description}</p>
          </div>
        </div>

        <div className="p-8 pb-4">
          <AnimatePresence mode="wait">
            {currentStep === 1 ? (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4"
              >
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 block">Company Name</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      placeholder="e.g. Acme SaaS" 
                      className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500/50 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 block">Founder Name</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      name="founderName"
                      value={formData.founderName}
                      onChange={handleInputChange}
                      placeholder="e.g. John Doe" 
                      className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500/50 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 block">Work Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      name="workEmail"
                      type="email"
                      value={formData.workEmail}
                      onChange={handleInputChange}
                      placeholder="john@company.com" 
                      className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500/50 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 block">Contact Email (Personal)</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      name="contactEmail"
                      type="email"
                      value={formData.contactEmail}
                      onChange={handleInputChange}
                      placeholder="john.personal@gmail.com" 
                      className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500/50 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 block">Website</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      placeholder="https://company.com" 
                      className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-xl pl-10 pr-4 py-3 text-sm text-white outline-none focus:border-indigo-500/50 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 block">Industry</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <select 
                      name="industry"
                      value={formData.industry}
                      onChange={handleInputChange}
                      className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-xl pl-10 pr-4 py-3 text-sm text-white outline-none focus:border-indigo-500/50 appearance-none transition-colors"
                    >
                      <option value="">Select Industry</option>
                      <option value="SaaS">SaaS</option>
                      <option value="Fintech">Fintech</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="E-commerce">E-commerce</option>
                      <option value="Agency">Agency</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 block">Company Size</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <select 
                      name="companySize"
                      value={formData.companySize}
                      onChange={handleInputChange}
                      className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-xl pl-10 pr-4 py-3 text-sm text-white outline-none focus:border-indigo-500/50 appearance-none transition-colors"
                    >
                      <option value="">Select Size</option>
                      <option value="1-10">1-10 Employees</option>
                      <option value="11-50">11-50 Employees</option>
                      <option value="51-200">51-200 Employees</option>
                      <option value="200+">200+ Employees</option>
                    </select>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 block">Target Customer</label>
                  <textarea 
                    name="targetCustomer"
                    value={formData.targetCustomer}
                    onChange={handleInputChange}
                    placeholder="e.g. CMOs at B2B Tech companies with $10M+ ARR" 
                    rows={2}
                    className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500/50 resize-none transition-colors"
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 block">Region</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      name="region"
                      value={formData.region}
                      onChange={handleInputChange}
                      placeholder="e.g. North America, India, Europe" 
                      className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-xl pl-10 pr-4 py-3 text-sm text-white outline-none focus:border-indigo-500/50 transition-colors"
                    />
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { id: 'gmail', label: 'Gmail / Google Workspace', icon: Mail, purpose: 'Send outreach emails from your mailbox', color: 'indigo' },
                    { id: 'linkedin', label: 'LinkedIn', icon: Linkedin, purpose: 'Send connection requests and messages', color: 'blue' },
                    { id: 'whatsapp', label: 'WhatsApp Business', icon: MessageCircle, purpose: 'Send outreach via WhatsApp', color: 'emerald' },
                    { id: 'sms', label: 'SMS Provider', icon: MessageSquare, purpose: 'Send cold outreach SMS messages', color: 'amber' },
                  ].map(platform => {
                    const isConnected = state.onboarding.integrations[platform.id];
                    return (
                      <div 
                        key={platform.id}
                        className={`p-5 rounded-2xl border transition-all duration-300 flex items-center justify-between group
                          ${isConnected ? 'bg-indigo-500/5 border-indigo-500/30' : 'bg-[#0a0a0f] border-[#1e1e2e] hover:border-[#2a2a3e]'}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors
                            ${isConnected ? 'bg-indigo-500/10 text-indigo-400' : 'bg-[#111118] text-slate-500 group-hover:text-slate-300'}`}>
                            <platform.icon className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white">{platform.label}</p>
                            <p className="text-[10px] text-slate-500 mt-0.5">{platform.purpose}</p>
                          </div>
                        </div>
                        <Button 
                          size="sm"
                          onClick={() => toggleIntegration(platform.id)}
                          className={`h-9 px-4 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all
                            ${isConnected ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20' : 'bg-[#111118] text-slate-300 border border-[#1e1e2e] hover:bg-white/5'}`}
                        >
                          {isConnected ? (
                            <span className="flex items-center gap-1.5"><Check className="w-3 h-3" /> Connected</span>
                          ) : (
                            `Connect ${platform.id.charAt(0).toUpperCase() + platform.id.slice(1)}`
                          )}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-8 bg-[#0a0a0f]/50 border-t border-[#1e1e2e] flex items-center justify-between">
          <p className="text-[10px] text-slate-500 font-medium">
            {currentStep === 1 ? 'Personalize your AI context' : 'Authorize outreach channels'}
          </p>
          <Button 
            disabled={isSubmitting || (currentStep === 1 && !formData.companyName)}
            onClick={handleNextStep}
            className="bg-indigo-600 hover:bg-indigo-700 h-12 px-8 rounded-xl font-bold text-xs uppercase tracking-widest group shadow-lg shadow-indigo-900/20"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                {currentStep === 1 ? 'Provision Workspace' : 'Launch Client Portal'}
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
