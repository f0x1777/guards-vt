import {
  connectBeexoWallet,
  connectInjectedEvmWallet,
} from "./beexo-connect";

export type WalletSessionChain = "evm";
export type WalletSessionKind = "mock" | "beexo_eip1193" | "eip1193";
export type WalletConnectionOption = "beexo" | "browser_evm" | "mock";

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
  beexo: boolean;
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
    beexo: typeof window !== "undefined",
    evm: Boolean(getEvmProvider()),
  };
}

function buildEvmWalletSession(
  address: string,
  kind: WalletSessionKind,
  label: string,
): WalletSession {
  return {
    id: `${kind}-${address.toLowerCase()}`,
    chain: "evm",
    kind,
    label,
    address,
    connectedAtMs: Date.now(),
  };
}

async function connectBeexoWalletSession(): Promise<WalletSession | null> {
  const result = await connectBeexoWallet();
  if (!result) {
    return null;
  }

  return buildEvmWalletSession(result.address, "beexo_eip1193", result.label);
}

async function connectInjectedEvmWalletSession(): Promise<WalletSession | null> {
  try {
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

      return buildEvmWalletSession(
        address,
        "eip1193",
        provider.isMetaMask ? "Rootstock EVM Wallet" : "Beexo / EVM Wallet",
      );
    } catch {
      return null;
    }
  } catch {
    return null;
  }
}

export async function connectWallet(option: WalletConnectionOption): Promise<WalletSession> {
  if (option === "mock") {
    return createMockWalletSession();
  }

  if (option === "beexo") {
    return (await connectBeexoWalletSession()) ?? createMockWalletSession();
  }

  return (await connectInjectedEvmWalletSession()) ?? createMockWalletSession();
}

export async function connectPreferredWallet(): Promise<WalletSession> {
  return (
    (await connectBeexoWalletSession()) ??
    (await connectInjectedEvmWalletSession()) ??
    createMockWalletSession()
  );
}
