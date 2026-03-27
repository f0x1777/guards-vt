export const ROOTSTOCK_TESTNET = {
  chainId: 31,
  chainIdHex: "0x1f",
  chainName: "Rootstock Testnet",
  nativeCurrency: {
    name: "Rootstock Bitcoin",
    symbol: "tRBTC",
    decimals: 18,
  },
  rpcUrls: ["https://public-node.testnet.rsk.co"],
  blockExplorerUrls: ["https://explorer.testnet.rootstock.io"],
} as const;

export interface Eip1193Provider {
  request: (args: { method: string; params?: unknown[] | object }) => Promise<unknown>;
  isMetaMask?: boolean;
}

export async function ensureRootstockTestnet(provider: Eip1193Provider): Promise<void> {
  try {
    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: ROOTSTOCK_TESTNET.chainIdHex }],
    });
    return;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const unknownChain = message.includes("4902") || message.toLowerCase().includes("unrecognized chain");
    if (!unknownChain) {
      return;
    }
  }

  await provider.request({
    method: "wallet_addEthereumChain",
    params: [
      {
        chainId: ROOTSTOCK_TESTNET.chainIdHex,
        chainName: ROOTSTOCK_TESTNET.chainName,
        nativeCurrency: ROOTSTOCK_TESTNET.nativeCurrency,
        rpcUrls: [...ROOTSTOCK_TESTNET.rpcUrls],
        blockExplorerUrls: [...ROOTSTOCK_TESTNET.blockExplorerUrls],
      },
    ],
  });
}
