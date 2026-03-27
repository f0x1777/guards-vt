"use client";

import { useEffect, useRef, useState } from "react";
import { AlertTriangle, ShieldAlert } from "lucide-react";
import { runtimeAvailability } from "@/lib/runtime";

const STORAGE_KEY = "guards-testnet-warning-dismissed";

export function PreprodWarningModal() {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (
      runtimeAvailability.mainnetAvailable ||
      runtimeAvailability.rootstockNetworkId !== "rootstock-testnet"
    ) {
      setOpen(false);
      return;
    }

    if (typeof window === "undefined") {
      return;
    }

    const dismissed = window.sessionStorage.getItem(STORAGE_KEY);
    setOpen(dismissed !== "true");
  }, []);

  useEffect(() => {
    if (open) {
      dialogRef.current?.focus();
    }
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 px-6 backdrop-blur-md"
      role="presentation"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="testnet-warning-title"
        aria-describedby="testnet-warning-description"
        tabIndex={-1}
        className="glass-panel max-w-xl border border-[rgba(240,191,95,0.22)] bg-[linear-gradient(135deg,rgba(26,19,12,0.94),rgba(15,14,28,0.96))] p-6 shadow-2xl shadow-black/50"
      >
        <div className="flex items-start gap-4">
          <div className="mt-1 rounded-full bg-[rgba(240,191,95,0.14)] p-2 text-[#f0bf5f]">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="chip-yellow">Rootstock testnet only</div>
              <h2
                id="testnet-warning-title"
                className="text-xl font-semibold text-text"
              >
                {runtimeAvailability.warningTitle}
              </h2>
              <p
                id="testnet-warning-description"
                className="text-sm leading-relaxed text-text-secondary"
              >
                {runtimeAvailability.warningBody}
              </p>
            </div>
            <div className="grid gap-2 text-sm text-text-secondary">
              <p>
                <strong className="text-text">What works now:</strong> dashboard flows, profile switching,
                treasury action staging, and demo-first wallet connectivity for the Rootstock adaptation.
              </p>
              <p>
                <strong className="text-text">What does not work yet:</strong> mainnet
                execution, on-chain vault creation, and the first deployable Rootstock contract flow.
              </p>
              <p>
                <strong className="text-text">Next for testnet:</strong> deploy the first
                `GuardedTreasuryVault`, wire Beexo Connect, and validate a real Rootstock treasury action.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  window.sessionStorage.setItem(STORAGE_KEY, "true");
                  setOpen(false);
                }}
                className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#070612] transition hover:bg-white/90"
              >
                Continue in testnet
              </button>
              <span className="inline-flex items-center gap-2 text-xs text-text-muted">
                <AlertTriangle className="h-3.5 w-3.5 text-[#f0bf5f]" />
                Mainnet pending
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PreprodWarningBanner() {
  if (
    runtimeAvailability.mainnetAvailable ||
    runtimeAvailability.rootstockNetworkId !== "rootstock-testnet"
  ) {
    return null;
  }

  return (
    <div className="glass-panel border border-[rgba(240,191,95,0.18)] bg-[linear-gradient(135deg,rgba(26,19,12,0.9),rgba(12,11,24,0.94))] p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <div className="chip-yellow">{runtimeAvailability.rootstockNetworkLabel}</div>
          <p className="text-sm font-medium text-text">
            Guards is currently restricted to Rootstock testnet.
          </p>
          <p className="text-sm text-text-secondary">
            Mainnet execution is disabled. Vault bootstrap still requires a deployed Rootstock contract,
            funded governance and operator wallets, and connected EVM wallet flows.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-text-muted">
          <span className="chip">No mainnet</span>
          <span className="chip">Wallet connect beta</span>
          <span className="chip">Browser policy lab</span>
        </div>
      </div>
    </div>
  );
}
