import { XOConnectProvider } from "xo-connect";
import {
  ROOTSTOCK_TESTNET,
  ensureRootstockTestnet,
  parseChainIdHex,
  type Eip1193Provider,
} from "./rootstock-network";

export interface BeexoConnectionResult {
  address: string;
  label: string;
  chainId: number;
}

function getEthereumProvider(): Eip1193Provider | null {
  if (typeof window === "undefined") {
    return null;
  }

  const ethereum = (window as Window & { ethereum?: unknown }).ethereum;
  if (!ethereum || typeof ethereum !== "object") {
    return null;
  }

  if (!("request" in ethereum) || typeof (ethereum as Eip1193Provider).request !== "function") {
    return null;
  }

  return ethereum as Eip1193Provider;
}

function getBeexoProvider(): Eip1193Provider | null {
  if (typeof window === "undefined") {
    return null;
  }

  return new XOConnectProvider({
    rpcs: {
      [ROOTSTOCK_TESTNET.chainIdHex]: ROOTSTOCK_TESTNET.rpcUrls[0],
    },
    defaultChainId: ROOTSTOCK_TESTNET.chainIdHex,
  }) as Eip1193Provider;
}

export async function connectBeexoOrEvmWalletWithProvider(
  provider: Eip1193Provider,
): Promise<BeexoConnectionResult | null> {
  await ensureRootstockTestnet(provider);

  const accounts = await provider.request({ method: "eth_requestAccounts" });
  const chainIdHex = await provider.request({ method: "eth_chainId" });

  const chainId = parseChainIdHex(chainIdHex);
  if (chainId !== ROOTSTOCK_TESTNET.chainId) {
    return null;
  }

  const address =
    Array.isArray(accounts) &&
    typeof accounts[0] === "string" &&
    accounts[0].length > 0
      ? accounts[0]
      : null;
  if (address === null) {
    return null;
  }

  return {
    address,
    label: provider.isMetaMask ? "EVM Wallet" : "Beexo Connect",
    chainId,
  };
}

export async function connectBeexoOrEvmWallet(): Promise<BeexoConnectionResult | null> {
  const provider = getBeexoProvider() ?? getEthereumProvider();
  if (!provider) {
    return null;
  }

  return connectBeexoOrEvmWalletWithProvider(provider);
}
