"use client";

import { Shield, Users, Waypoints } from "lucide-react";
import {
  getTreasuryRail,
  type CompanyVaultProfile,
} from "@/lib/company-profiles";
import { shortWalletAddress } from "@/lib/wallet-session";

interface VaultAdminPanelProps {
  profile: CompanyVaultProfile;
}

export function VaultAdminPanel({ profile }: VaultAdminPanelProps) {
  const governanceRail = getTreasuryRail(profile, "governance");
  const executionRail = getTreasuryRail(profile, "execution");

  return (
    <div className="glass-panel overflow-hidden">
      <div className="border-b border-line px-5 py-4">
        <h3 className="text-sm font-semibold text-text">Vault Admin</h3>
        <p className="mt-1 text-xs text-text-muted">
          Governance structure, signer threshold, and treasury rails for the active Rootstock vault.
        </p>
      </div>
      <div className="grid gap-6 p-5 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-4">
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-line bg-bg-soft px-4 py-4">
              <p className="eyebrow">Custody</p>
              <p className="mt-2 text-sm font-semibold text-text">{profile.governanceModel}</p>
            </div>
            <div className="rounded-2xl border border-line bg-bg-soft px-4 py-4">
              <p className="eyebrow">Threshold</p>
              <p className="mt-2 text-sm font-semibold text-text">{profile.thresholdLabel}</p>
            </div>
            <div className="rounded-2xl border border-line bg-bg-soft px-4 py-4">
              <p className="eyebrow">Members</p>
              <p className="mt-2 text-sm font-semibold text-text">{profile.members.length}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-bg-soft p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-text">
              <Users className="h-4 w-4 text-accent" />
              Multisig Members
            </div>
            <div className="space-y-2">
              {profile.members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-line-soft px-3 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-text">{member.name}</p>
                    <p className="mt-0.5 text-xs text-text-muted">{member.role}</p>
                  </div>
                  <span className="font-mono text-xs text-text-secondary">
                    {shortWalletAddress(member.address)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-line bg-bg-soft p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-text">
              <Shield className="h-4 w-4 text-accent" />
              Governance Rails
            </div>
            <div className="space-y-2">
              <div className="rounded-xl border border-line-soft px-3 py-3">
                <p className="eyebrow">Governance wallet</p>
                <p className="mt-2 font-mono text-xs text-text">
                  {governanceRail ? shortWalletAddress(governanceRail.address) : "Unconfigured"}
                </p>
              </div>
              <div className="rounded-xl border border-line-soft px-3 py-3">
                <p className="eyebrow">Execution hot wallet</p>
                <p className="mt-2 font-mono text-xs text-text">
                  {executionRail ? shortWalletAddress(executionRail.address) : "Unconfigured"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-bg-soft p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-text">
              <Waypoints className="h-4 w-4 text-accent" />
              Treasury Rails
            </div>
            <div className="space-y-2">
              {profile.treasuryRails.map((rail) => (
                <div
                  key={rail.id}
                  className="rounded-xl border border-line-soft px-3 py-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-text">{rail.label}</p>
                    <span className="chip">{rail.purpose}</span>
                  </div>
                  <p className="mt-2 font-mono text-xs text-text-secondary">
                    {shortWalletAddress(rail.address)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
