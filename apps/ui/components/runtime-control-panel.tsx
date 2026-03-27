"use client";

import { useEffect, useState } from "react";
import { Layers3, Wallet } from "lucide-react";
import { mockDatasetOptions, type MockDatasetId } from "@/lib/mock-backtest";
import {
  detectWalletAvailability,
  createMockWalletSession,
  shortWalletAddress,
  type WalletSession,
} from "@/lib/wallet-session";

export type DashboardMode = "mock" | "testnet_snapshot";

interface RuntimeControlPanelProps {
  mode: DashboardMode;
  setMode: (mode: DashboardMode) => void;
  dataset: MockDatasetId;
  setDataset: (dataset: MockDatasetId) => void;
  walletSession: WalletSession | null;
  setWalletSession: (session: WalletSession | null) => void;
}

export function RuntimeControlPanel({
  mode,
  setMode,
  dataset,
  setDataset,
  walletSession,
  setWalletSession,
}: RuntimeControlPanelProps) {
  const [evmDetected, setEvmDetected] = useState(false);
  const [beexoAvailable, setBeexoAvailable] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const availability = detectWalletAvailability();
    setEvmDetected(availability.evm);
    setBeexoAvailable(availability.beexo);
  }, []);

  return (
    <div className="glass-panel overflow-hidden">
      <div className="border-b border-line px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-text">Runtime Control</h3>
            <p className="mt-1 text-xs text-text-muted">
              Toggle between mock replay and the current Rootstock-oriented dashboard snapshot.
              Use Beexo or another Rootstock-compatible wallet when available, or fall back to the demo wallet for staging.
            </p>
          </div>
          <span className="chip-accent">Demo-first</span>
        </div>
      </div>
      <div className="grid gap-5 p-5 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-text">
            <Layers3 className="h-4 w-4 text-accent" />
            Mode
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <button
              type="button"
              onClick={() => setMode("mock")}
              className={`rounded-2xl border p-4 text-left transition ${
                mode === "mock"
                  ? "border-accent bg-accent/8"
                  : "border-line bg-bg-soft hover:border-accent/25"
              }`}
            >
              <p className="text-sm font-semibold text-text">Mock replay</p>
              <p className="mt-2 text-xs leading-relaxed text-text-muted">
                7d history at 15-minute intervals. Run strategies, inspect executions, and debug edge cases.
              </p>
            </button>
            <button
              type="button"
              onClick={() => setMode("testnet_snapshot")}
              className={`rounded-2xl border p-4 text-left transition ${
                mode === "testnet_snapshot"
                  ? "border-accent bg-accent/8"
                  : "border-line bg-bg-soft hover:border-accent/25"
              }`}
            >
              <p className="text-sm font-semibold text-text">Rootstock snapshot</p>
              <p className="mt-2 text-xs leading-relaxed text-text-muted">
                Use the current Rootstock-oriented operator view and policy labs without the historical backtest loop.
              </p>
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-text">
            <Layers3 className="h-4 w-4 text-accent" />
            Dataset
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {mockDatasetOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setDataset(option.id)}
                className={`rounded-2xl border p-4 text-left transition ${
                  dataset === option.id
                    ? "border-accent bg-accent/8"
                    : "border-line bg-bg-soft hover:border-accent/25"
                }`}
              >
                <p className="text-sm font-semibold text-text">{option.label}</p>
                <p className="mt-2 text-xs leading-relaxed text-text-muted">
                  {option.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-text">
            <Wallet className="h-4 w-4 text-accent" />
            Wallet connect
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <button
              type="button"
              onClick={() => setWalletSession(createMockWalletSession())}
              className="rounded-2xl border border-line bg-bg-soft p-4 text-left transition hover:border-accent/25"
            >
              <p className="text-sm font-semibold text-text">Mock Rootstock</p>
              <p className="mt-2 text-xs text-text-muted">Instant demo session for Rootstock / Beexo-style treasury flows.</p>
            </button>
            <div className="rounded-2xl border border-line bg-bg-soft p-4 text-left md:col-span-2">
              <p className="text-sm font-semibold text-text">Beexo / EVM connector</p>
              <div className="mt-2 space-y-1 text-xs text-text-muted">
                <p>Beexo available: {beexoAvailable ? "yes" : "no"}</p>
                <p>EVM provider detected: {evmDetected ? "yes" : "no"}</p>
                <p>Top-right connect opens a wallet selector for Beexo, existing EIP-1193 wallets, or the demo wallet.</p>
                <p>If no provider is available, you can still run the full product flow in demo mode.</p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-bg-soft px-4 py-3 text-sm text-text-secondary">
            <span className="chip">{walletSession ? walletSession.label : "No treasury wallet connected"}</span>
            {walletSession && (
              <>
                <span className="font-mono text-xs text-text">{shortWalletAddress(walletSession.address)}</span>
                <button
                  type="button"
                  onClick={() => setWalletSession(null)}
                  className="btn-ghost !px-2 !py-1"
                >
                  Disconnect
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
