import React, { createContext, useContext, useState } from 'react';

const DemoContext = createContext(null);

export const INITIAL_DEMO = {
  step: 1,
  // Step 1
  startup: { name: '', what: '', target: '', tones: [], style: '', emailLength: 'medium', signOff: '' },
  personalityCard: null,
  // Step 2
  leads: [],
  researchDone: false,
  // Step 3
  emails: [],
  approvedEmails: [],
  // Step 4
  smtpConfig: { email: '', password: '', connected: false },
  sentEmails: [],
  // Step 5
  replyStatuses: [],
  // Step 6 (reflected back to campaign context externally)
};

export function DemoProvider({ children }) {
  const [demo, setDemo] = useState(INITIAL_DEMO);
  const update = (partial) => setDemo(d => ({ ...d, ...partial }));
  const reset = () => setDemo(INITIAL_DEMO);
  return (
    <DemoContext.Provider value={{ demo, update, reset }}>
      {children}
    </DemoContext.Provider>
  );
}

export function useDemo() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error('useDemo must be used inside DemoProvider');
  return ctx;
}