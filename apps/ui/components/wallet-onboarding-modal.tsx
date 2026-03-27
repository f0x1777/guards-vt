"use client";

import { Wallet, ChevronRight, X } from "lucide-react";
import type { WalletConnectionOption } from "@/lib/wallet-session";

interface WalletOnboardingModalProps {
  open: boolean;
  connecting: boolean;
  evmDetected: boolean;
  onClose: () => void;
  onSelect: (option: WalletConnectionOption) => void;
}

export function WalletOnboardingModal({
  open,
  connecting,
  evmDetected,
  onClose,
  onSelect,
}: WalletOnboardingModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-[28px] border border-white/10 bg-[#0d0d18] p-6 shadow-[0_32px_120px_rgba(0,0,0,0.45)]">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow">Wallet Onboarding</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-white">
              Rootstock testnet access
            </h3>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/55">
              Guards is currently running on Rootstock testnet. Choose whether you want
              to preview the product with mock data or connect a Beexo-compatible wallet
              to operate from the testnet surface.
            </p>
          </div>
          <button
            type="button"
            aria-label="Close wallet onboarding"
            onClick={onClose}
            className="rounded-full border border-white/10 p-2 text-white/60 transition hover:border-white/20 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mb-4 rounded-2xl border border-[#f0bf5f]/20 bg-[#f0bf5f]/8 px-4 py-3 text-xs leading-relaxed text-[#f0bf5f]">
          Mainnet is not enabled yet. Any live wallet path here should be treated as a testnet operator flow.
        </div>

        <div className="grid gap-3">
          <button
            type="button"
            onClick={() => onSelect("mock")}
            disabled={connecting}
            className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-left transition hover:border-white/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <div>
              <p className="text-sm font-semibold text-white">Preview demo</p>
              <p className="mt-1 text-xs leading-relaxed text-white/55">
                Instant local session for walkthroughs, seeded treasury balances, and interface review.
              </p>
            </div>
            <Wallet className="h-4 w-4 text-white/60" />
          </button>

          <button
            type="button"
            onClick={() => onSelect("beexo")}
            disabled={connecting}
            className="flex items-center justify-between rounded-2xl border border-[#7c6ff7]/30 bg-[#7c6ff7]/8 px-5 py-4 text-left transition hover:border-[#7c6ff7]/55 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <div>
              <p className="text-sm font-semibold text-white">Connect Beexo wallet to operate</p>
              <p className="mt-1 text-xs leading-relaxed text-white/55">
                Preferred Rootstock testnet onboarding flow using `xo-connect` and EIP-1193.
              </p>
            </div>
            <ChevronRight className="h-4 w-4 text-white/60" />
          </button>

          <button
            type="button"
            onClick={() => onSelect("browser_evm")}
            disabled={connecting || !evmDetected}
            className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-left transition hover:border-white/20 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <div>
              <p className="text-sm font-semibold text-white">Existing EVM wallet</p>
              <p className="mt-1 text-xs leading-relaxed text-white/55">
                Use an injected EIP-1193 wallet already present in the browser.
              </p>
            </div>
            <span className="chip">{evmDetected ? "Detected" : "Not detected"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
