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
    id: "guards-main-treasury",
    companyName: "Guards Treasury Ops",
    vaultName: "Main Treasury",
    chain: "cardano",
    custodyMode: "native",
    governanceWallet: "addr_test1q...governance",
    executionHotWallet: "addr_test1q...hot",
    approvedRouteId: "dexhunter-ada-usdm",
    referenceSymbol: "XAU/USD",
    referencePrice: 4421.412,
    targetOunces: 25,
    useReferenceTarget: true,
  },
  {
    id: "andes-dao-reserve",
    companyName: "Andes DAO",
    vaultName: "Community Reserve",
    chain: "cardano",
    custodyMode: "native",
    governanceWallet: "addr_test1q...andes_governance",
    executionHotWallet: "addr_test1q...andes_hot",
    approvedRouteId: "dexhunter-ada-usdm",
    referenceSymbol: "BTC/USD",
    referencePrice: 67846.32774,
    targetOunces: 2,
    useReferenceTarget: false,
  },
  {
    id: "rioplatense-payments",
    companyName: "Rioplatense Labs",
    vaultName: "Operating Float",
    chain: "cardano",
    custodyMode: "native",
    governanceWallet: "addr_test1q...rio_governance",
    executionHotWallet: "addr_test1q...rio_hot",
    approvedRouteId: "dexhunter-ada-usdm",
    referenceSymbol: "EUR/USD",
    referencePrice: 1.15578,
    targetOunces: 1200,
    useReferenceTarget: false,
  },
];

function resolveReferencePrice(profile: CompanyVaultProfile): number {
  const catalogPrice = referenceAssetOptions.find(
    (option) => option.symbol === profile.referenceSymbol,
  )?.defaultPrice;

  return profile.referencePrice ?? catalogPrice ?? 0;
}

export function applyProfileToDraft(
  baseDraft: VaultBootstrapDraft,
  profile: CompanyVaultProfile,
): VaultBootstrapDraft {
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
