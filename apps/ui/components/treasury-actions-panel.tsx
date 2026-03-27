"use client";

import type { ReactNode } from "react";
import { ArrowUpRight, ArrowDownLeft, Landmark, Waypoints } from "lucide-react";
import type { WalletSession } from "@/lib/wallet-session";

interface TreasuryActionsPanelProps {
  walletSession: WalletSession | null;
  actionMessage: string | null;
  onSend: () => void;
  onWithdraw: () => void;
}

function TodoAction({
  icon,
  label,
}: {
  icon: ReactNode;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-line bg-bg-soft px-4 py-3 opacity-65">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-text-secondary">
          {icon}
          {label}
        </div>
        <span className="chip">Coming soon</span>
      </div>
    </div>
  );
}

export function TreasuryActionsPanel({
  walletSession,
  actionMessage,
  onSend,
  onWithdraw,
}: TreasuryActionsPanelProps) {
  return (
    <div className="glass-panel overflow-hidden">
      <div className="border-b border-line px-5 py-4">
        <h3 className="text-sm font-semibold text-text">Treasury Actions</h3>
        <p className="mt-1 text-xs text-text-muted">
          Operator actions for treasury companies and DAOs. Send and withdraw are staged for the connected wallet flow; bridge and on/off ramp remain queued.
        </p>
      </div>
      <div className="space-y-3 p-5">
        <div className="grid gap-3 md:grid-cols-2">
          <button type="button" onClick={onSend} className="btn-primary justify-center">
            <ArrowUpRight className="h-4 w-4" />
            Send
          </button>
          <button type="button" onClick={onWithdraw} className="btn-secondary justify-center">
            <ArrowDownLeft className="h-4 w-4" />
            Withdraw
          </button>
        </div>
        <TodoAction
          icon={<Landmark className="h-4 w-4 text-text-muted" />}
          label="On / Off Ramp"
        />
        <TodoAction
          icon={<Waypoints className="h-4 w-4 text-text-muted" />}
          label="Bridge"
        />
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
