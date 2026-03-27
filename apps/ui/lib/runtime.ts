export const runtimeAvailability = {
  rootstockNetworkLabel: "Rootstock Testnet",
  rootstockNetworkId: "rootstock-testnet",
  mainnetAvailable: false,
  walletConnectAvailable: true,
  policyEditorAvailable: true,
  vaultBootstrapAvailable: true,
  warningTitle: "Testnet only",
  warningBody:
    "Guards is currently running on Rootstock testnet. Mainnet remains disabled while the first GuardedTreasuryVault contract, Beexo wallet flow, and treasury action paths are finalized.",
} as const;
