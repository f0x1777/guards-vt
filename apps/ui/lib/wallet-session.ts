import { connectBeexoOrEvmWallet } from "./beexo-connect";

export type WalletSessionChain = "evm";
export type WalletSessionKind = "mock" | "beexo_eip1193" | "eip1193";

export interface WalletSession {
  id: string;
  chain: WalletSessionChain;
  kind: WalletSessionKind;
  label: string;
  address: string;
  connectedAtMs: number;
}

export const WALLET_SESSION_STORAGE_KEY = "guards-wallet-session";

const MOCK_ROOTSTOCK_WALLET_ADDRESS = "0x7e57...guardsMockRootstock";

interface EvmProvider {
  isMetaMask?: boolean;
  request?: (args: { method: string; params?: unknown[] | object }) => Promise<unknown>;
}

interface WalletAvailability {
  evm: boolean;
}

function isEvmProvider(value: unknown): value is EvmProvider {
  return Boolean(value && typeof value === "object" && "request" in value && typeof (value as EvmProvider).request === "function");
}

function getEvmProvider(): EvmProvider | null {
  if (typeof window === "undefined") {
    return null;
  }

  const ethereum = (window as Window & { ethereum?: unknown }).ethereum;
  return isEvmProvider(ethereum) ? ethereum : null;
}

export function createMockWalletSession(): WalletSession {
  return {
    id: "mock-evm",
    chain: "evm",
    kind: "mock",
    label: "Mock Rootstock Wallet",
    address: MOCK_ROOTSTOCK_WALLET_ADDRESS,
    connectedAtMs: Date.now(),
  };
}

export function shortWalletAddress(address: string): string {
  return address.length <= 16 ? address : `${address.slice(0, 8)}...${address.slice(-6)}`;
}

export function hydrateStoredWalletSession(): WalletSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  let raw: string | null;
  try {
    raw = window.localStorage.getItem(WALLET_SESSION_STORAGE_KEY);
  } catch {
    return null;
  }

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<WalletSession>;
    if (
      typeof parsed !== "object" ||
      parsed == null ||
      typeof parsed.id !== "string" ||
      parsed.chain !== "evm" ||
      (parsed.kind !== "mock" && parsed.kind !== "beexo_eip1193" && parsed.kind !== "eip1193") ||
      typeof parsed.label !== "string" ||
      typeof parsed.address !== "string" ||
      typeof parsed.connectedAtMs !== "number"
    ) {
      throw new Error("Invalid stored wallet session shape.");
    }

    return parsed as WalletSession;
  } catch {
    try {
      window.localStorage.removeItem(WALLET_SESSION_STORAGE_KEY);
    } catch {}
    return null;
  }
}

export function persistWalletSession(session: WalletSession | null): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    if (!session) {
      window.localStorage.removeItem(WALLET_SESSION_STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(WALLET_SESSION_STORAGE_KEY, JSON.stringify(session));
  } catch {}
}

export function detectWalletAvailability(): WalletAvailability {
  return {
    evm: Boolean(getEvmProvider()),
  };
}

async function connectEvmWallet(): Promise<WalletSession | null> {
  try {
    const result = await connectBeexoOrEvmWallet();
    if (!result) {
      return null;
    }

    return {
      id: `eip1193-${result.address.toLowerCase()}`,
      chain: "evm",
      kind: "beexo_eip1193",
      label: result.label,
      address: result.address,
      connectedAtMs: Date.now(),
    };
  } catch {
    const provider = getEvmProvider();
    if (!provider?.request) {
      return null;
    }

    try {
      const accounts = await provider.request({ method: "eth_requestAccounts" });
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
        id: `eip1193-${address.toLowerCase()}`,
        chain: "evm",
        kind: "eip1193",
        label: provider.isMetaMask ? "Rootstock EVM Wallet" : "Beexo / EVM Wallet",
        address,
        connectedAtMs: Date.now(),
      };
    } catch {
      return null;
    }
  }
}

export async function connectPreferredWallet(): Promise<WalletSession> {
  return (await connectEvmWallet()) ?? createMockWalletSession();
}
