"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { FadeUp } from "./animations";

const steps = [
  {
    number: "01",
    title: "Connect",
    description: "Connect a treasury operator wallet and enter the correct Rootstock environment.",
    detail: "Beexo Connect is the target UX path for onboarding and wallet session management.",
    accent: "#7c6ff7",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 8V6a3 3 0 013-3h8a3 3 0 013 3v12a3 3 0 01-3 3H8a3 3 0 01-3-3v-2"/><path d="M13 12H4"/><path d="M8 8l-4 4 4 4"/></svg>
    ),
  },
  {
    number: "02",
    title: "Configure",
    description: "Set treasury bounds, allowed destinations, vault operators, and execution rules.",
    detail: "The Rootstock version is aimed at bounded treasury operations, not open-ended trading.",
    accent: "#3b82f6",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16"/><path d="M7 12h10"/><path d="M10 20h4"/><circle cx="15" cy="4" r="2" fill="currentColor" stroke="none"/><circle cx="9" cy="12" r="2" fill="currentColor" stroke="none"/><circle cx="12" cy="20" r="2" fill="currentColor" stroke="none"/></svg>
    ),
  },
  {
    number: "03",
    title: "Authorize",
    description: "Create a bounded treasury action with governance-defined limits and clear operator scope.",
    detail: "The first Rootstock contract should enforce roles, caps, and destination allowlists.",
    accent: "#22c55e",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L20 7v5c0 5-3.5 9.5-8 11-4.5-1.5-8-6-8-11V7l8-5z" /><path d="M9 12l2 2 4-4" /></svg>
    ),
  },
  {
    number: "04",
    title: "Operate",
    description: "Execute transfers, withdrawals, or protected treasury actions on Rootstock.",
    detail: "History and audit surfaces remain central so treasury operations stay explainable and reviewable.",
    accent: "#f0bf5f",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
    ),
  },
];

export function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);
  const reduceMotion = useReducedMotion();

  return (
    <section id="how-it-works" className="relative py-32 bg-[#070612]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <FadeUp>
          <p className="text-[#7c6ff7] text-sm font-mono font-medium tracking-widest uppercase mb-4">
            How It Works
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-white leading-tight max-w-3xl">
            From Treasury Setup to Rootstock Execution.
          </h2>
          <p className="mt-6 text-white/45 text-base md:text-lg leading-relaxed max-w-2xl">
            Guards connects a treasury wallet, enforces bounded rules, and turns Rootstock treasury operations into
            something a company or DAO can actually run and audit.
          </p>
        </FadeUp>

        <div className="mt-20 grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-12 items-start">
          <div className="space-y-3">
            {steps.map((step, i) => (
              <motion.button key={step.number} type="button" onClick={() => setActiveStep(i)} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={reduceMotion ? { duration: 0 } : { delay: i * 0.1, duration: 0.4 }} aria-pressed={activeStep === i} aria-label={`Select step ${step.number}: ${step.title}`} className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 cursor-pointer group ${activeStep === i ? "border-white/10 bg-white/[0.04]" : "border-transparent hover:border-white/5 hover:bg-white/[0.02]"}`}>
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${activeStep === i ? "opacity-100" : "opacity-30 group-hover:opacity-50"}`} style={{ background: `${step.accent}15`, color: step.accent }}>
                    {step.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs font-mono font-bold" style={{ color: activeStep === i ? step.accent : "#5e5c72" }}>{step.number}</span>
                      <h3 className="text-base font-semibold transition-colors duration-300" style={{ color: activeStep === i ? step.accent : "#9896aa" }}>{step.title}</h3>
                    </div>
                    <p className={`text-sm leading-relaxed transition-colors duration-300 ${activeStep === i ? "text-white/50" : "text-white/25"}`}>{step.description}</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          <div className="lg:sticky lg:top-32">
            <AnimatePresence mode="wait">
              <motion.div key={activeStep} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={reduceMotion ? { duration: 0 } : { duration: 0.3 }} className="rounded-2xl border border-white/8 bg-white/[0.02] p-8 relative overflow-hidden">
                <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-10 blur-3xl pointer-events-none" style={{ background: steps[activeStep].accent }} />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${steps[activeStep].accent}15`, color: steps[activeStep].accent }}>
                      {steps[activeStep].icon}
                    </div>
                    <div>
                      <span className="text-xs font-mono" style={{ color: steps[activeStep].accent }}>Step {steps[activeStep].number}</span>
                      <h3 className="text-xl font-semibold text-white">{steps[activeStep].title}</h3>
                    </div>
                  </div>
                  <p className="text-white/60 text-base leading-relaxed mb-6">{steps[activeStep].detail}</p>
                  <div className="flex gap-2">
                    {steps.map((step, i) => (
                      <button key={i} type="button" onClick={() => setActiveStep(i)} aria-label={`Go to step ${step.number}: ${step.title}`} aria-pressed={i === activeStep} className="cursor-pointer">
                        <div className={`h-1 rounded-full transition-all duration-300 ${i === activeStep ? "w-8" : "w-2"}`} style={{ background: i === activeStep ? steps[activeStep].accent : "#2a2940" }} />
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
