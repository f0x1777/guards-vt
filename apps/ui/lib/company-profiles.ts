import type { ChainId } from "./types";
import { referenceAssetOptions } from "./vault-lab";
import type { CustodyMode, VaultBootstrapDraft } from "./vault-lab";

export interface CompanyVaultProfile {
  id: string;
  companyName: string;
  vaultName: string;
  chain: ChainId;
  custodyMode: CustodyMode;
  governanceModel: string;
  thresholdLabel: string;
  governanceWallet: string;
  executionHotWallet: string;
  approvedRouteId: string;
  referenceSymbol: string;
  referencePrice?: number;
  targetOunces: number;
  useReferenceTarget: boolean;
  members: Array<{
    id: string;
    name: string;
    role: string;
    address: string;
  }>;
  treasuryRails: Array<{
    id: string;
    label: string;
    address: string;
    purpose: string;
  }>;
}

export const companyVaultProfiles: CompanyVaultProfile[] = [
  {
    id: "guards-rbtc-core",
    companyName: "Guards Treasury Ops",
    vaultName: "RBTC Core Reserve",
    chain: "evm",
    custodyMode: "safe",
    governanceModel: "Safe",
    thresholdLabel: "3 / 5",
    governanceWallet: "0x9cF3...governance",
    executionHotWallet: "0x4a11...hot",
    approvedRouteId: "rootstock-sovryn-rbtc-doc",
    referenceSymbol: "BTC/USD",
    referencePrice: 67846.32774,
    targetOunces: 1,
    useReferenceTarget: true,
    members: [
      { id: "m1", name: "Nico", role: "Treasury Lead", address: "0x9cF3...a11c" },
      { id: "m2", name: "Juani", role: "Operator", address: "0x4a11...b0b0" },
      { id: "m3", name: "Carla", role: "Signer", address: "0x22F1...cafe" },
      { id: "m4", name: "Pedro", role: "Signer", address: "0x8e7A...d00d" },
      { id: "m5", name: "Mica", role: "Risk", address: "0x1bc0...f00d" },
    ],
    treasuryRails: [
      { id: "gov", label: "Governance", address: "0x9cF3...governance", purpose: "policy and admin" },
      { id: "ops", label: "Operator", address: "0x4a11...hot", purpose: "bounded execution" },
      { id: "payout", label: "Payout", address: "0x8140...pay", purpose: "vendors and payroll" },
    ],
  },
  {
    id: "latam-payments-doc",
    companyName: "LatAm Treasury Co",
    vaultName: "Operating DOC Reserve",
    chain: "evm",
    custodyMode: "safe",
    governanceModel: "Safe",
    thresholdLabel: "2 / 3",
    governanceWallet: "0x3bA1...paymentsGov",
    executionHotWallet: "0x8e10...paymentsOps",
    approvedRouteId: "rootstock-moc-rbtc-doc",
    referenceSymbol: "EUR/USD",
    referencePrice: 1.15578,
    targetOunces: 250000,
    useReferenceTarget: false,
    members: [
      { id: "m1", name: "Laura", role: "Finance", address: "0x3bA1...1111" },
      { id: "m2", name: "Martin", role: "Operator", address: "0x8e10...2222" },
      { id: "m3", name: "Sofi", role: "Signer", address: "0x95B2...3333" },
    ],
    treasuryRails: [
      { id: "gov", label: "Governance", address: "0x3bA1...paymentsGov", purpose: "policy and admin" },
      { id: "ops", label: "Operator", address: "0x8e10...paymentsOps", purpose: "execution bucket" },
      { id: "settlement", label: "Settlement", address: "0x8890...settle", purpose: "merchant flows" },
    ],
  },
  {
    id: "bitcoin-growth-vault",
    companyName: "Andes Growth DAO",
    vaultName: "Bitcoin Growth Vault",
    chain: "evm",
    custodyMode: "safe",
    governanceModel: "Safe",
    thresholdLabel: "4 / 7",
    governanceWallet: "0x1d92...andesGov",
    executionHotWallet: "0xb271...andesOps",
    approvedRouteId: "rootstock-sovryn-doc-rbtc",
    referenceSymbol: "XAU/USD",
    referencePrice: 4421.412,
    targetOunces: 25,
    useReferenceTarget: false,
    members: [
      { id: "m1", name: "Lucho", role: "Governor", address: "0x1d92...1111" },
      { id: "m2", name: "Gabi", role: "Governor", address: "0xb271...2222" },
      { id: "m3", name: "Paz", role: "Risk", address: "0x7e12...3333" },
      { id: "m4", name: "Noe", role: "Signer", address: "0x6e81...4444" },
      { id: "m5", name: "Tomi", role: "Signer", address: "0x5f13...5555" },
      { id: "m6", name: "Ana", role: "Signer", address: "0x8d11...6666" },
      { id: "m7", name: "Rama", role: "Operator", address: "0x1c18...7777" },
    ],
    treasuryRails: [
      { id: "gov", label: "Governance", address: "0x1d92...andesGov", purpose: "multisig control" },
      { id: "ops", label: "Operator", address: "0xb271...andesOps", purpose: "bounded execution" },
      { id: "bridge", label: "Bridge Rail", address: "0x7710...bridge", purpose: "cross-chain treasury ops" },
    ],
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
