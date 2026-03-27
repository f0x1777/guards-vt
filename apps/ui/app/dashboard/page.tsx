"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import { MetricCard } from "@/components/metric-card";
import { AccountsTable } from "@/components/accounts-table";
import { RiskLadder } from "@/components/risk-ladder";
import { PolicyCards } from "@/components/policy-cards";
import { ExecutionTimeline } from "@/components/execution-timeline";
import { VaultProfilePanel } from "@/components/vault-profile-panel";
import { SwapPanel } from "@/components/swap-panel";
import { SimulationReplay } from "@/components/simulation-replay";
import { AuditLog } from "@/components/audit-log";
import {
  PreprodWarningModal,
} from "@/components/preprod-warning";
import { VaultBootstrapLab } from "@/components/vault-bootstrap-lab";
import { ScenarioLab } from "@/components/scenario-lab";
import { HistoricalStrategyLab } from "@/components/historical-strategy-lab";
import {
  RuntimeControlPanel,
  type DashboardMode,
} from "@/components/runtime-control-panel";
import {
  TreasuryActionsPanel,
  type TreasuryActionKind,
} from "@/components/treasury-actions-panel";
import { VaultAdminPanel } from "@/components/vault-admin-panel";
import { WalletOnboardingModal } from "@/components/wallet-onboarding-modal";
import type { RiskLadderStep } from "@/lib/types";
import { demoState } from "@/lib/demo-data";
import {
  applyLiveQuotesToDemoState,
  liveReferencePriceForSymbol,
  type LiveQuoteMap,
} from "@/lib/live-prices";
import {
  connectWallet,
  detectWalletAvailability,
  hydrateStoredWalletSession,
  persistWalletSession,
  type WalletConnectionOption,
  type WalletSession,
} from "@/lib/wallet-session";
import {
  mockDatasetOptions,
  type MockDatasetId,
} from "@/lib/mock-backtest";
import {
  buildBootstrapDraft,
  buildPolicyViewFromDraft,
} from "@/lib/vault-lab";
import {
  applyProfileToDraft,
  companyVaultProfiles,
} from "@/lib/company-profiles";

const DASHBOARD_SECTIONS = new Set([
  "overview",
  "accounts",
  "policy",
  "risk",
  "admin",
  "audit",
  "runtime",
]);

const sectionTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.35, ease: "easeOut" as const },
};

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("overview");
  const [mode, setMode] = useState<DashboardMode>("mock");
  const [dataset, setDataset] = useState<MockDatasetId>("ada_flash_crash");
  const [activeProfileId, setActiveProfileId] = useState(companyVaultProfiles[0]?.id ?? "");
  const [walletSession, setWalletSession] = useState<WalletSession | null>(null);
  const [connectingWallet, setConnectingWallet] = useState(false);
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [evmDetected, setEvmDetected] = useState(false);
  const [treasuryActionMessage, setTreasuryActionMessage] = useState<string | null>(null);
  const [liveQuotes, setLiveQuotes] = useState<LiveQuoteMap | null>(null);
  const [liveQuotesError, setLiveQuotesError] = useState<string | null>(null);
  const [liveQuotesPollingEnabled, setLiveQuotesPollingEnabled] = useState(true);
  const [walletSessionHydrated, setWalletSessionHydrated] = useState(false);
  const [bootstrapDraft, setBootstrapDraft] = useState(() =>
    applyProfileToDraft(buildBootstrapDraft(demoState.policy), companyVaultProfiles[0]),
  );

  useEffect(() => {
    setWalletSession(hydrateStoredWalletSession());
    setEvmDetected(detectWalletAvailability().evm);
    setWalletSessionHydrated(true);
  }, []);

  useEffect(() => {
    if (!walletSessionHydrated) {
      return;
    }

    persistWalletSession(walletSession);
  }, [walletSession, walletSessionHydrated]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const requestedSection = params.get("section");
    const requestedEntry = params.get("entry");

    if (requestedSection && DASHBOARD_SECTIONS.has(requestedSection)) {
      setActiveSection(requestedSection);
    }

    if (requestedEntry === "mock") {
      setMode("mock");
    }

    if (requestedEntry === "connect") {
      setMode("testnet_snapshot");
      if (!walletSession) {
        setWalletModalOpen(true);
      }
    }
  }, [walletSessionHydrated]);

  useEffect(() => {
    if (!liveQuotesPollingEnabled) {
      return;
    }

    let cancelled = false;

    async function loadQuotes() {
      try {
        const response = await fetch("/api/oracle/quotes", {
          cache: "no-store",
        });
        const payload = (await response.json()) as {
          ok: boolean;
          error?: string;
          quotes?: LiveQuoteMap;
        };

        if (cancelled) {
          return;
        }

        if (!response.ok || !payload.ok || !payload.quotes) {
          setLiveQuotesError(payload.error ?? "Unable to fetch live quotes.");
          setLiveQuotes(null);
          if (response.status === 503) {
            setLiveQuotesPollingEnabled(false);
          }
          return;
        }

        setLiveQuotes(payload.quotes);
        setLiveQuotesError(null);
      } catch (error) {
        if (cancelled) {
          return;
        }

        setLiveQuotesError(
          error instanceof Error ? error.message : "Unable to fetch live quotes.",
        );
        setLiveQuotes(null);
      }
    }

    void loadQuotes();
    const interval = window.setInterval(() => {
      void loadQuotes();
    }, 60_000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [liveQuotesPollingEnabled]);

  useEffect(() => {
    const profile =
      companyVaultProfiles.find((candidate) => candidate.id === activeProfileId) ??
      companyVaultProfiles[0];
    if (!profile) {
      return;
    }

    setBootstrapDraft((current) => applyProfileToDraft(current, profile));
    setTreasuryActionMessage(null);
  }, [activeProfileId]);

  useEffect(() => {
    const nextReferencePrice = liveReferencePriceForSymbol(
      liveQuotes ?? {},
      bootstrapDraft.referenceSymbol,
      {
        maxStaleUs: demoState.policy.maxStaleUs,
        maxConfidenceBps: demoState.policy.maxConfidenceBps,
      },
    );
    if (!nextReferencePrice || nextReferencePrice === bootstrapDraft.referencePrice) {
      return;
    }

    setBootstrapDraft((current) => ({
      ...current,
      referencePrice: nextReferencePrice,
    }));
  }, [bootstrapDraft.referencePrice, bootstrapDraft.referenceSymbol, liveQuotes]);

  const data = useMemo(
    () => applyLiveQuotesToDemoState(demoState, liveQuotes ?? {}),
    [liveQuotes],
  );
  const liveQuotesEnabled = data.oracle.feedId !== demoState.oracle.feedId;
  const policyView = buildPolicyViewFromDraft(bootstrapDraft);
  const activeProfile =
    companyVaultProfiles.find((candidate) => candidate.id === activeProfileId) ??
    companyVaultProfiles[0];
  const datasetLabel =
    mockDatasetOptions.find((option) => option.id === dataset)?.label ?? dataset;
  const stablePosition = data.positions.find((p) => p.role === "stable");
  const riskPosition = data.positions.find((p) => p.role === "risk");
  const ladderStep: RiskLadderStep = data.vault.ladderStep ?? data.vault.stage;

  async function handleConnectWallet() {
    const availability = detectWalletAvailability();
    setEvmDetected(availability.evm);
    setWalletModalOpen(true);
  }

  async function handleSelectWallet(option: WalletConnectionOption) {
    if (connectingWallet) {
      return;
    }

    setConnectingWallet(true);
    try {
      const session = await connectWallet(option);
      setWalletSession(session);
      setWalletModalOpen(false);
    } finally {
      setConnectingWallet(false);
    }
  }

  function handleTreasuryAction(kind: TreasuryActionKind) {
    const labelMap: Record<typeof kind, string> = {
      send: "Send",
      withdraw: "Withdraw",
      bridge: "Bridge",
      onramp: "Onramp",
      offramp: "Offramp",
    };
    const label = labelMap[kind];
    if (!walletSession) {
      setTreasuryActionMessage(
        `${label} is staged, but no wallet is connected yet. Use the top-right wallet connect or the Runtime demo wallet first.`,
      );
      return;
    }

    setTreasuryActionMessage(
      `${label} flow staged for ${walletSession.label} on ${activeProfile.companyName} · ${bootstrapDraft.vaultName}. Governance model ${activeProfile.governanceModel} (${activeProfile.thresholdLabel}), route ${bootstrapDraft.approvedRouteId}. On-chain tx wiring is the next step.`,
    );
  }

  return (
    <div className="min-h-screen flex relative">
      <PreprodWarningModal />
      <WalletOnboardingModal
        open={walletModalOpen}
        connecting={connectingWallet}
        evmDetected={evmDetected}
        onClose={() => setWalletModalOpen(false)}
        onSelect={handleSelectWallet}
      />
      {/* Ambient background gradient */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse at 30% 20%, rgba(124,111,247,0.04) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(59,130,246,0.03) 0%, transparent 50%)",
        }}
      />

      <Sidebar
        activeSection={activeSection}
        onNavigate={setActiveSection}
        vaultName={bootstrapDraft.vaultName}
        companyName={bootstrapDraft.companyName}
        chain={data.vault.chain}
        stage={data.vault.stage}
        mode={mode}
        datasetLabel={datasetLabel}
        profiles={companyVaultProfiles}
        activeProfileId={activeProfileId}
        onSelectProfile={setActiveProfileId}
      />

      <main className="relative z-10 flex-1 ml-[280px] px-10 py-7 max-w-[1200px]">
        <Topbar
          stage={data.vault.stage}
          chain={data.vault.chain}
          oracleFreshness={data.metrics.oracleFreshness}
          mode={mode}
          liveQuotesError={liveQuotesError}
          liveQuotesEnabled={Boolean(liveQuotes?.rbtc)}
          walletSession={walletSession}
          companyName={bootstrapDraft.companyName}
          vaultName={bootstrapDraft.vaultName}
          connectingWallet={connectingWallet}
          onConnectWallet={handleConnectWallet}
          onDisconnectWallet={() => setWalletSession(null)}
        />
        <AnimatePresence mode="wait">
          {activeSection === "runtime" && (
            <motion.section key="runtime" {...sectionTransition} className="mb-8">
              <RuntimeControlPanel
                mode={mode}
                setMode={setMode}
                dataset={dataset}
                setDataset={setDataset}
                walletSession={walletSession}
                setWalletSession={setWalletSession}
              />
            </motion.section>
          )}
          {/* Overview */}
          {activeSection === "overview" && (
            <motion.section key={activeSection} {...sectionTransition} className="space-y-6 mb-8">
              <>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <MetricCard
                    label="Liquid Value"
                    value={`$${data.metrics.liquidValue.toLocaleString()}`}
                    sub="After haircut"
                    accent="blue"
                  />
                  <MetricCard
                    label="Stable Ratio"
                    value={`${(data.metrics.stableRatio * 100).toFixed(0)}%`}
                    sub={`${stablePosition?.symbol ?? "Stable"} allocation`}
                    accent="green"
                  />
                  <MetricCard
                    label="Drawdown"
                    value={`${data.metrics.drawdownBps} bps`}
                    sub="vs policy baseline"
                    accent={
                      data.metrics.drawdownBps > 700
                        ? "red"
                        : data.metrics.drawdownBps > 300
                        ? "yellow"
                        : "default"
                    }
                  />
                  <MetricCard
                    label="Market Data"
                    value={data.metrics.oracleFreshness}
                    sub={liveQuotesEnabled ? "Live market feed" : "Demo fallback"}
                    accent="green"
                  />
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.4 }}
                  className="glass-panel p-6 relative overflow-hidden"
                >
                  <div
                    className="absolute -top-20 -left-20 w-60 h-60 rounded-full opacity-10 blur-3xl pointer-events-none"
                    style={{ background: "#7c6ff7" }}
                  />
                  <div className="relative flex items-center justify-between mb-5">
                    <div>
                      <h3 className="text-sm font-semibold text-text">
                        Market Feed
                      </h3>
                      <p className="text-xs text-text-muted mt-0.5 font-mono">
                        {data.oracle.feedId}
                      </p>
                    </div>
                    <span className={liveQuotesEnabled ? "chip-green" : "chip-amber"}>
                      <span className="relative flex h-1.5 w-1.5">
                        <span
                          className={
                            "animate-ping motion-reduce:animate-none absolute inline-flex h-full w-full rounded-full opacity-50 " +
                            (liveQuotesEnabled ? "bg-green" : "bg-amber")
                          }
                        />
                        <span
                          className={
                            "relative inline-flex rounded-full h-1.5 w-1.5 " +
                            (liveQuotesEnabled ? "bg-green" : "bg-amber")
                          }
                        />
                      </span>
                      {liveQuotesEnabled ? "Live" : "Demo"}
                    </span>
                  </div>
                  <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <p className="eyebrow">Spot Price</p>
                      <p className="text-lg font-bold font-mono mt-1.5 text-text">
                        ${data.oracle.price.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="eyebrow">Symbol</p>
                      <p className="text-lg font-bold font-mono mt-1.5 text-accent">
                        {data.oracle.symbol}
                      </p>
                    </div>
                    <div>
                      <p className="eyebrow">Feed Status</p>
                      <p className="text-lg font-bold font-mono mt-1.5 text-text">
                        {liveQuotesEnabled ? "Live market data" : "Demo fallback"}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </>
            </motion.section>
          )}

          {activeSection === "accounts" && (
            <motion.section key="accounts" {...sectionTransition} className="space-y-6 mb-8">
              <AccountsTable positions={data.positions} />
              <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
                <TreasuryActionsPanel
                  walletSession={walletSession}
                  actionMessage={treasuryActionMessage}
                  onAction={handleTreasuryAction}
                />
                <SwapPanel
                  riskSymbol={riskPosition?.symbol ?? "RBTC"}
                  stableSymbol={stablePosition?.symbol ?? "DOC"}
                  currentPrice={data.oracle.price}
                  oracleFreshness={data.metrics.oracleFreshness}
                  haircutBps={policyView.haircutBps}
                  routeId={bootstrapDraft.approvedRouteId}
                />
              </div>
              <ExecutionTimeline events={data.events} referenceNowMs={data.nowMs} />
            </motion.section>
          )}

          {/* Policy */}
          {activeSection === "policy" && (
            <motion.section key="policy" {...sectionTransition} className="space-y-6 mb-8">
              <PolicyCards policy={policyView} />
              <VaultBootstrapLab
                draft={bootstrapDraft}
                setDraft={setBootstrapDraft}
                currentRiskPrice={data.oracle.price}
                currentReferencePrice={liveReferencePriceForSymbol(
                  liveQuotes ?? {},
                  bootstrapDraft.referenceSymbol,
                  {
                    maxStaleUs: demoState.policy.maxStaleUs,
                    maxConfidenceBps: demoState.policy.maxConfidenceBps,
                  },
                  )}
              />
            </motion.section>
          )}

          {activeSection === "runtime" && (
            <motion.section key="runtime-spacer" {...sectionTransition} className="mb-0" />
          )}
          {/* Risk Ladder */}
          {activeSection === "risk" && (
            <motion.section key="risk" {...sectionTransition} className="space-y-6 mb-8">
              {mode === "mock" ? (
                <HistoricalStrategyLab
                  draft={bootstrapDraft}
                  dataset={dataset}
                  positions={data.positions}
                  currentRiskPrice={data.oracle.price}
                  currentReferencePrice={liveReferencePriceForSymbol(
                    liveQuotes ?? {},
                    bootstrapDraft.referenceSymbol,
                    {
                      maxStaleUs: demoState.policy.maxStaleUs,
                      maxConfidenceBps: demoState.policy.maxConfidenceBps,
                    },
                  )}
                />
              ) : (
                <SimulationReplay frames={data.frames ?? []} />
              )}
              <ScenarioLab draft={bootstrapDraft} />
              <RiskLadder currentStage={data.vault.stage} activeStep={ladderStep} />
            </motion.section>
          )}

          {/* Execution */}
          {activeSection === "admin" && (
            <motion.section key="admin" {...sectionTransition} className="space-y-6 mb-8">
              <VaultProfilePanel
                draft={bootstrapDraft}
                chain={data.vault.chain}
                walletSession={walletSession}
                activeProfile={activeProfile}
              />
              <VaultAdminPanel profile={activeProfile} />
            </motion.section>
          )}

          {/* Audit */}
          {activeSection === "audit" && (
            <motion.section key="audit" {...sectionTransition} className="space-y-6 mb-8">
              <AuditLog events={data.events} />
            </motion.section>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
