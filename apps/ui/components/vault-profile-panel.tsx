import type { ReactNode } from "react";
import { Building2, Landmark, Route, Wallet } from "lucide-react";
import { runtimeAvailability } from "@/lib/runtime";
import { shortWalletAddress, type WalletSession } from "@/lib/wallet-session";
import type { ChainId } from "@/lib/types";
import type { VaultBootstrapDraft } from "@/lib/vault-lab";
import type { CompanyVaultProfile } from "@/lib/company-profiles";

interface VaultProfilePanelProps {
  draft: VaultBootstrapDraft;
  chain: ChainId;
  walletSession: WalletSession | null;
  activeProfile: CompanyVaultProfile;
}

function chainLabel(_chain: ChainId): string {
  return runtimeAvailability.rootstockNetworkLabel;
}

function ProfileRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-line bg-bg-soft px-4 py-3">
      <div className="mt-0.5 text-accent">{icon}</div>
      <div>
        <p className="eyebrow">{label}</p>
        <p className="mt-1 text-sm text-text-secondary">{value}</p>
      </div>
    </div>
  );
}

export function VaultProfilePanel({
  draft,
  chain,
  walletSession,
  activeProfile,
}: VaultProfilePanelProps) {
  return (
    <div className="glass-panel overflow-hidden">
      <div className="border-b border-line px-5 py-4">
        <h3 className="text-sm font-semibold text-text">Vault Profile</h3>
        <p className="mt-1 text-xs text-text-muted">
          Company, vault scope, execution route, and active operator context.
        </p>
      </div>
      <div className="space-y-3 p-5">
        <ProfileRow
          icon={<Building2 className="h-4 w-4" />}
          label="Company"
          value={draft.companyName}
        />
        <ProfileRow
          icon={<Landmark className="h-4 w-4" />}
          label="Vault"
          value={`${draft.vaultName} · ${chainLabel(chain)}`}
        />
        <ProfileRow
          icon={<Building2 className="h-4 w-4" />}
          label="Profile Access"
          value={`${activeProfile.companyName} · ${activeProfile.vaultName}`}
        />
        <ProfileRow
          icon={<Route className="h-4 w-4" />}
          label="Execution route"
          value={draft.approvedRouteId}
        />
        <ProfileRow
          icon={<Wallet className="h-4 w-4" />}
          label="Connected operator"
          value={
            walletSession
              ? `${walletSession.label} · ${shortWalletAddress(walletSession.address)}`
              : shortWalletAddress(draft.executionHotWallet)
          }
        />
        {draft.useReferenceTarget && (
          <ProfileRow
            icon={<Route className="h-4 w-4" />}
            label="Reference target"
            value={`${draft.referenceSymbol} · ${draft.targetOunces} target units`}
          />
        )}
      </div>
    </div>
  );
}
