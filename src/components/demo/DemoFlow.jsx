import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { DemoProvider } from './DemoContext';
import DemoProgressBar from './DemoProgressBar';
import Step1Personality from './Step1Personality';
import Step2Leads from './Step2Leads';
import Step3Emails from './Step3Emails';
import Step4Send from './Step4Send';
import Step5Replies from './Step5Replies';

export default function DemoFlow({ onClose }) {
  const [step, setStep] = useState(1);

  const next = () => setStep(s => Math.min(6, s + 1));

  return (
    <DemoProvider>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-[#09090f] overflow-y-auto"
      >
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-[#09090f]/95 backdrop-blur border-b border-[#1e1e2e] px-6 py-4">
          <div className="max-w-2xl mx-auto flex items-center gap-4">
            <button onClick={onClose}
              className="flex items-center gap-1.5 text-slate-500 hover:text-white text-sm transition-colors shrink-0">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <div className="flex-1">
              <DemoProgressBar current={step} />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-2xl mx-auto px-6 py-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.2 }}
            >
              {step === 1 && <Step1Personality onNext={next} />}
              {step === 2 && <Step2Leads onNext={next} />}
              {step === 3 && <Step3Emails onNext={next} />}
              {step === 4 && <Step4Send onNext={next} />}
              {step === 5 && <Step5Replies onDone={onClose} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </DemoProvider>
  );
}