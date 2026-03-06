import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CampaignContext = createContext(null);

const INITIAL_STATE = {
  campaign: {
    id: 'camp_001',
    name: 'Q1 2026 Outreach',
    status: 'active', // active | paused | complete | null
    startTime: Date.now() - 3 * 60 * 60 * 1000,
    leadsCount: 132,
    channels: ['email', 'linkedin', 'whatsapp'],
  },
  stats: {
    emailsSent: 847,
    emailsOpened: 312,
    emailsClicked: 89,
    repliesReceived: 68,
    hotLeads: 8,
    meetings: 14,
    conversions: 3,
    aiDecisions: 1243,
    callsMade: 28,
    proposalsGenerated: 5,
  },
  throttle: {
    emailsThisHour: 32,
    emailsToday: 156,
    touchesPerLeadThisWeek: 3,
    nextSendIn: 47,
    limitReached: false,
    hourlyLimit: 50,
  },
  feed: [
    { id: 1, type: 'email_sent', lead: 'Rahul Singh', detail: 'Follow-up: Quick question about ROI', color: 'blue', time: 'Just now' },
    { id: 2, type: 'email_opened', lead: 'Priya Mehta', detail: 'Interest +5', color: 'blue', time: '2m ago' },
    { id: 3, type: 'ai_decision', lead: 'James Lee', detail: 'Switch to LinkedIn — email saturated (88% conf)', color: 'purple', time: '5m ago' },
    { id: 4, type: 'hot_lead', lead: 'Aisha Patel', detail: 'Moved to hot pipeline', color: 'orange', time: '8m ago' },
    { id: 5, type: 'safety_triggered', lead: 'Chen Wei', detail: 'Fatigue threshold reached — sequence paused', color: 'red', time: '12m ago' },
  ],
  interventions: { notInterested: 2, lowConfidence: 3, paused: 1, takenOver: 1 },
  roi: {
    totalSpend: 126.85, totalValue: 38200, multiplier: 301.1,
    emailsWritten: 847, companiesResearched: 156, repliesAnalyzed: 68,
    proposalsGenerated: 5, callScripts: 28,
  },
  pageBadges: { ClientIntervention: false, ClientLiveFeed: false, ClientLeads: false },
  smartRoutingActive: false,
  onboarding: {
    complete: false,
    companyData: null,
    integrations: {
      gmail: false,
      linkedin: false,
      whatsapp: false,
      sms: false,
    }
  },
  ui: {
    showPersonality: false,
    showHowItWorks: false,
    addMode: null, // 'ai' | 'upload' | null
  }
};

export function CampaignProvider({ children }) {
  const [state, setState] = useState(INITIAL_STATE);

  useEffect(() => {
    const countdown = setInterval(() => {
      setState(s => ({
        ...s,
        throttle: { ...s.throttle, nextSendIn: s.throttle.nextSendIn <= 0 ? 60 : s.throttle.nextSendIn - 1 },
      }));
    }, 1000);

    const leadsArray = ['Rahul Singh', 'Priya Mehta', 'James Lee', 'Chen Wei', 'Maria Santos', 'Aisha Patel'];
    const statBump = setInterval(() => {
      setState(s => {
        if (s.campaign.status !== 'active') return s;
        const roll = Math.random();
        const lead = leadsArray[Math.floor(Math.random() * leadsArray.length)];
        if (roll < 0.35) {
          return { ...s, stats: { ...s.stats, emailsSent: s.stats.emailsSent + 1 },
            feed: [{ id: Date.now(), type: 'email_sent', lead, detail: 'Outreach email sent', color: 'blue', time: 'Just now' }, ...s.feed.slice(0, 9)],
            pageBadges: { ...s.pageBadges, ClientLiveFeed: true } };
        } else if (roll < 0.55) {
          return { ...s, stats: { ...s.stats, emailsOpened: s.stats.emailsOpened + 1 },
            feed: [{ id: Date.now(), type: 'email_opened', lead, detail: 'Interest +5', color: 'blue', time: 'Just now' }, ...s.feed.slice(0, 9)] };
        } else if (roll < 0.70) {
          return { ...s, stats: { ...s.stats, repliesReceived: s.stats.repliesReceived + 1 },
            feed: [{ id: Date.now(), type: 'reply_received', lead, detail: 'Positive reply — sentiment: interested', color: 'green', time: 'Just now' }, ...s.feed.slice(0, 9)],
            pageBadges: { ...s.pageBadges, ClientLiveFeed: true } };
        } else if (roll < 0.80) {
          return { ...s, stats: { ...s.stats, aiDecisions: s.stats.aiDecisions + 1 },
            feed: [{ id: Date.now(), type: 'ai_decision', lead, detail: 'Next action queued (91% conf)', color: 'purple', time: 'Just now' }, ...s.feed.slice(0, 9)] };
        }
        return s;
      });
    }, 7000);

    return () => { clearInterval(countdown); clearInterval(statBump); };
  }, []);

  const updateCampaignStatus = useCallback((status) => {
    setState(s => ({ ...s, campaign: { ...s.campaign, status } }));
  }, []);

  const toggleSmartRouting = useCallback((active) => {
    setState(s => ({ ...s, smartRoutingActive: typeof active === 'boolean' ? active : !s.smartRoutingActive }));
  }, []);

  const setOnboardingData = useCallback((data) => {
    setState(s => ({ ...s, onboarding: { ...s.onboarding, companyData: data } }));
  }, []);

  const setIntegrationStatus = useCallback((channel, status) => {
    setState(s => ({ ...s, onboarding: { ...s.onboarding, integrations: { ...s.onboarding.integrations, [channel]: status } } }));
  }, []);

  const completeOnboarding = useCallback(() => {
    setState(s => ({ ...s, onboarding: { ...s.onboarding, complete: true } }));
  }, []);

  const clearBadge = useCallback((page) => {
    setState(s => ({ ...s, pageBadges: { ...s.pageBadges, [page]: false } }));
  }, []);

  const setUIState = useCallback((key, value) => {
    setState(s => ({ ...s, ui: { ...s.ui, [key]: value } }));
  }, []);

  return (
    <CampaignContext.Provider value={{
      state,
      updateCampaignStatus,
      toggleSmartRouting,
      setOnboardingData,
      setIntegrationStatus,
      completeOnboarding,
      clearBadge,
      setUIState,
    }}>
      {children}
    </CampaignContext.Provider>
  );
}

export function useCampaign() {
  const ctx = useContext(CampaignContext);
  if (!ctx) return { state: INITIAL_STATE, updateCampaignStatus: () => {}, clearBadge: () => {} };
  return ctx;
}