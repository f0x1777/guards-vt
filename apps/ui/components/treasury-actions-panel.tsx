"use client";

import type { ReactNode } from "react";
import { ArrowUpRight, ArrowDownLeft, Landmark, Waypoints } from "lucide-react";
import type { WalletSession } from "@/lib/wallet-session";

export type TreasuryActionKind =
  | "send"
  | "withdraw"
  | "onramp"
  | "offramp"
  | "bridge";

interface TreasuryActionsPanelProps {
  walletSession: WalletSession | null;
  actionMessage: string | null;
  onAction: (kind: TreasuryActionKind) => void;
}

function ActionCard({
  icon,
  label,
  description,
  enabled,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  description: string;
  enabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!enabled}
      className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
        enabled
          ? "border-line bg-bg-soft hover:border-accent/25"
          : "border-line bg-bg-soft opacity-65"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-text-secondary">
          {icon}
          {label}
        </div>
        <span className="chip">{enabled ? "Stage" : "Queued"}</span>
      </div>
      <p className="mt-2 text-xs text-text-muted">{description}</p>
    </button>
  );
}

export function TreasuryActionsPanel({
  walletSession,
  actionMessage,
  onAction,
}: TreasuryActionsPanelProps) {
  return (
    <div className="glass-panel overflow-hidden">
      <div className="border-b border-line px-5 py-4">
        <h3 className="text-sm font-semibold text-text">Treasury Actions</h3>
        <p className="mt-1 text-xs text-text-muted">
          Operator actions for treasury companies and DAOs. All actions stage the next step for the connected wallet and treasury rail.
        </p>
      </div>
      <div className="space-y-3 p-5">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <ActionCard
            icon={<ArrowUpRight className="h-4 w-4 text-text-muted" />}
            label="Send"
            description="Stage an outbound treasury transfer from the active operator rail."
            enabled
            onClick={() => onAction("send")}
          />
          <ActionCard
            icon={<ArrowDownLeft className="h-4 w-4 text-text-muted" />}
            label="Withdraw"
            description="Stage a governance-controlled withdrawal from the vault."
            enabled
            onClick={() => onAction("withdraw")}
          />
          <ActionCard
            icon={<Landmark className="h-4 w-4 text-text-muted" />}
            label="Onramp"
            description="Stage a fiat-to-stable treasury funding request for the active company."
            enabled
            onClick={() => onAction("onramp")}
          />
          <ActionCard
            icon={<Landmark className="h-4 w-4 text-text-muted" />}
            label="Offramp"
            description="Stage a stable-to-fiat payout or treasury cash-out request."
            enabled
            onClick={() => onAction("offramp")}
          />
          <ActionCard
            icon={<Waypoints className="h-4 w-4 text-text-muted" />}
            label="Bridge"
            description="Stage a cross-chain treasury movement through the configured bridge rail."
            enabled
            onClick={() => onAction("bridge")}
          />
        </div>
        <div className="rounded-2xl border border-line bg-bg-soft px-4 py-3 text-xs text-text-muted">
          <span className="font-semibold text-text-secondary">Wallet session:</span>{" "}
          {walletSession ? walletSession.label : "No wallet connected. Connect a real wallet or use the demo wallet from Runtime."}
        </div>
        {actionMessage && (
          <div className="rounded-2xl border border-accent/15 bg-accent/8 px-4 py-3 text-sm text-text">
            {actionMessage}
          </div>
        )}
      </div>
    </div>
  );
}
