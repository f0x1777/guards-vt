export const runtimeAvailability = {
  rootstockNetworkLabel: "Rootstock Testnet",
  rootstockNetworkId: "rootstock-testnet",
  mainnetAvailable: false,
  walletConnectAvailable: true,
  policyEditorAvailable: true,
  vaultBootstrapAvailable: true,
  warningTitle: "Testnet only",
  warningBody:
    "Guards is being adapted for Rootstock testnet. Mainnet is disabled while the first GuardedTreasuryVault contract, Beexo wallet flow, and treasury action paths are being wired.",
} as const;
