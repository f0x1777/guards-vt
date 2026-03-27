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
  isXOConnect?: boolean;
}

export function isUnknownChainError(error: unknown): boolean {
  if (typeof error === "object" && error !== null && "code" in error && (error as { code?: unknown }).code === 4902) {
    return true;
  }
  const message = error instanceof Error ? error.message : String(error);
  return message.includes("4902") || message.toLowerCase().includes("unrecognized chain");
}

export function parseChainIdHex(chainIdHex: unknown): number | null {
  if (typeof chainIdHex !== "string") {
    return null;
  }
  const parsed = Number.parseInt(chainIdHex, 16);
  return Number.isNaN(parsed) ? null : parsed;
}

export async function ensureRootstockTestnet(provider: Eip1193Provider): Promise<void> {
  try {
    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: ROOTSTOCK_TESTNET.chainIdHex }],
    });
    return;
  } catch (error) {
    if (!isUnknownChainError(error)) {
      throw error;
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
