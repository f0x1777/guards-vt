import { ROOTSTOCK_TESTNET, ensureRootstockTestnet, type Eip1193Provider } from "./rootstock-network";

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

export async function connectBeexoOrEvmWallet(): Promise<BeexoConnectionResult | null> {
  const provider = getEthereumProvider();
  if (!provider) {
    return null;
  }

  await ensureRootstockTestnet(provider);

  const accounts = await provider.request({ method: "eth_requestAccounts" });
  const chainIdHex = await provider.request({ method: "eth_chainId" });

  const address = Array.isArray(accounts) && typeof accounts[0] === "string" ? accounts[0] : "0x-rootstock-wallet";
  const chainId = typeof chainIdHex === "string" ? Number.parseInt(chainIdHex, 16) : ROOTSTOCK_TESTNET.chainId;

  return {
    address,
    label: provider.isMetaMask ? "EVM Wallet" : "Beexo / EVM Wallet",
    chainId,
  };
}
