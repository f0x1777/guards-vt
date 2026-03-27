"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FadeUp } from "./animations";

const ladderStages = [
  { name: "Healthy", trigger: "Treasury inside policy bounds", action: "Operate normally and keep monitoring balances, counterparties, and limits.", color: "#22c55e" },
  { name: "Watch", trigger: "Balance drift, policy breach risk, or market deterioration", action: "Raise operator awareness and prepare the next treasury action.", color: "#f0bf5f" },
  { name: "Restricted", trigger: "A protected limit is crossed", action: "Only bounded actions remain available until governance restores the expected treasury envelope.", color: "#ef6f6c" },
  { name: "Paused", trigger: "Governance pause or unsafe operating conditions", action: "Execution halts until an authorized actor restores the vault state.", color: "#ef4444" },
];

export function RiskLadderSection() {
  const [activeLadder, setActiveLadder] = useState<number | null>(null);
  const reduceMotion = useReducedMotion();

  return (
    <section id="risk-ladder" className="relative py-32 bg-[#0a0b14]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <FadeUp>
          <div className="rounded-2xl border border-white/6 bg-[#0a0b14] p-8 md:p-10">
            <div className="mb-10">
              <p className="text-[#7c6ff7] text-sm font-mono font-medium tracking-widest uppercase mb-3">Operating States</p>
              <h3 className="text-2xl md:text-3xl font-medium text-white mb-4">Simple treasury states, explicit operator actions.</h3>
              <p className="text-white/40 text-base leading-relaxed max-w-3xl">
                The Rootstock version of Guards should keep treasury decisions deterministic. Each state implies a smaller or larger operating envelope, not arbitrary behavior.
              </p>
            </div>
            <div className="space-y-2">
              {ladderStages.map((stage, i) => (
                <motion.div key={stage.name} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={reduceMotion ? { duration: 0 } : { delay: i * 0.08, duration: 0.4 }}>
                  <button type="button" onClick={() => setActiveLadder(activeLadder === i ? null : i)} className="w-full text-left cursor-pointer" aria-expanded={activeLadder === i} aria-controls={activeLadder === i ? `risk-ladder-panel-${i}` : undefined}>
                    <div className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-[250ms] ${activeLadder === i ? "border-white/10 bg-white/[0.03]" : "border-transparent hover:bg-white/[0.02]"}`}>
                      <div className="flex items-center gap-3 min-w-[140px]">
                        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: stage.color }} />
                        <span className="text-xs font-mono text-white/30">{String(i + 1).padStart(2, "0")}</span>
                        <span className="text-sm font-semibold" style={{ color: stage.color }}>{stage.name}</span>
                      </div>
                      <span className="text-sm text-white/35 flex-1 hidden md:block">{stage.trigger}</span>
                      <motion.svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/20 flex-shrink-0" animate={{ rotate: activeLadder === i ? 180 : 0 }} transition={reduceMotion ? { duration: 0 } : { duration: 0.2 }}>
                        <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
                      </motion.svg>
                    </div>
                  </button>
                  <AnimatePresence>
                    {activeLadder === i && (
                      <motion.div id={`risk-ladder-panel-${i}`} initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={reduceMotion ? { duration: 0 } : { duration: 0.25 }} className="overflow-hidden">
                        <div className="pl-[52px] pr-4 pb-4 pt-1">
                          <div className="rounded-xl bg-white/[0.02] border border-white/5 p-4 space-y-3">
                            <div><p className="text-[0.65rem] font-mono text-white/25 uppercase tracking-widest mb-1">Trigger</p><p className="text-sm text-white/60">{stage.trigger}</p></div>
                            <div><p className="text-[0.65rem] font-mono text-white/25 uppercase tracking-widest mb-1">Action</p><p className="text-sm text-white/60">{stage.action}</p></div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
