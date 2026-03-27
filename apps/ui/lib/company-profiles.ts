import type { ChainId } from "./types";
import { referenceAssetOptions } from "./vault-lab";
import type { CustodyMode, VaultBootstrapDraft } from "./vault-lab";

export interface CompanyVaultProfile {
  id: string;
  companyName: string;
  vaultName: string;
  chain: ChainId;
  custodyMode: CustodyMode;
  governanceWallet: string;
  executionHotWallet: string;
  approvedRouteId: string;
  referenceSymbol: string;
  referencePrice?: number;
  targetOunces: number;
  useReferenceTarget: boolean;
}

export const companyVaultProfiles: CompanyVaultProfile[] = [
  {
    id: "guards-rbtc-core",
    companyName: "Guards Treasury Ops",
    vaultName: "RBTC Core Reserve",
    chain: "evm",
    custodyMode: "safe",
    governanceWallet: "0x9cF3...governance",
    executionHotWallet: "0x4a11...hot",
    approvedRouteId: "rootstock-sovryn-rbtc-doc",
    referenceSymbol: "BTC/USD",
    referencePrice: 67846.32774,
    targetOunces: 1,
    useReferenceTarget: true,
  },
  {
    id: "latam-payments-doc",
    companyName: "LatAm Treasury Co",
    vaultName: "Operating DOC Reserve",
    chain: "evm",
    custodyMode: "safe",
    governanceWallet: "0x3bA1...paymentsGov",
    executionHotWallet: "0x8e10...paymentsOps",
    approvedRouteId: "rootstock-moc-rbtc-doc",
    referenceSymbol: "EUR/USD",
    referencePrice: 1.15578,
    targetOunces: 250000,
    useReferenceTarget: false,
  },
  {
    id: "bitcoin-growth-vault",
    companyName: "Andes Growth DAO",
    vaultName: "Bitcoin Growth Vault",
    chain: "evm",
    custodyMode: "safe",
    governanceWallet: "0x1d92...andesGov",
    executionHotWallet: "0xb271...andesOps",
    approvedRouteId: "rootstock-sovryn-doc-rbtc",
    referenceSymbol: "XAU/USD",
    referencePrice: 4421.412,
    targetOunces: 25,
    useReferenceTarget: false,
  },
];

function resolveReferencePrice(profile: CompanyVaultProfile): number {
  const catalogPrice = referenceAssetOptions.find((option) => option.symbol === profile.referenceSymbol)?.defaultPrice;
  return profile.referencePrice ?? catalogPrice ?? 0;
}

export function applyProfileToDraft(baseDraft: VaultBootstrapDraft, profile: CompanyVaultProfile): VaultBootstrapDraft {
  return {
    ...baseDraft,
    companyName: profile.companyName,
    vaultName: profile.vaultName,
    custodyMode: profile.custodyMode,
    governanceWallet: profile.governanceWallet,
    executionHotWallet: profile.executionHotWallet,
    approvedRouteId: profile.approvedRouteId,
    referenceSymbol: profile.referenceSymbol,
    referencePrice: resolveReferencePrice(profile),
    targetOunces: profile.targetOunces,
    useReferenceTarget: profile.useReferenceTarget,
  };
}
