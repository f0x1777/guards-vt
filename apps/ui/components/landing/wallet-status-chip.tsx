"use client";

import { useEffect, useState } from "react";
import { Wallet } from "lucide-react";
import {
  hydrateStoredWalletSession,
  shortWalletAddress,
  type WalletSession,
} from "@/lib/wallet-session";

export function WalletStatusChip() {
  const [walletSession, setWalletSession] = useState<WalletSession | null>(null);

  useEffect(() => {
    setWalletSession(hydrateStoredWalletSession());
  }, []);

  if (!walletSession) {
    return (
      <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-medium text-white/55">
        <Wallet className="h-3.5 w-3.5" />
        No wallet connected
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[#7c6ff7]/30 bg-[#7c6ff7]/8 px-4 py-2 text-xs font-medium text-white">
      <Wallet className="h-3.5 w-3.5" />
      {walletSession.label} · {shortWalletAddress(walletSession.address)}
    </span>
  );
}
