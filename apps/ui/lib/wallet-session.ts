export type WalletSessionChain = "evm" | "svm" | "cardano";
export type WalletSessionKind = "mock" | "beexo_eip1193" | "eip1193" | "cip30" | "wallet_standard";

export interface WalletSession {
  id: string;
  chain: WalletSessionChain;
  kind: WalletSessionKind;
  label: string;
  address: string;
  connectedAtMs: number;
}

export const WALLET_SESSION_STORAGE_KEY = "guards-wallet-session";

const MOCK_WALLET_ADDRESSES: Record<WalletSessionChain, string> = {
  evm: "0x7e57...guardsMockEvm",
  cardano: "addr_test1qpz7...guards_mock",
  svm: "6w4F...guardsMockSvm",
};

interface Cip30WalletApi {
  getChangeAddress?: () => Promise<string>;
  getUsedAddresses?: () => Promise<string[]>;
}
interface Cip30Provider { name?: string; enable?: () => Promise<Cip30WalletApi>; }
interface SvmProvider { isPhantom?: boolean; publicKey?: { toString?: () => string }; connect?: () => Promise<{ publicKey?: { toString?: () => string } }>; }
interface EvmProvider {
  isMetaMask?: boolean;
  request?: (args: { method: string; params?: unknown[] | object }) => Promise<unknown>;
}
interface WalletAvailability { evm: boolean; cardano: boolean; svm: boolean; }

function normalizeCardanoDisplayAddress(address: string): string { return address.startsWith("addr") ? address : "cardano-cip30-connected"; }
function isSvmProvider(value: unknown): value is SvmProvider { return Boolean(value && typeof value === "object" && "connect" in value && typeof (value as SvmProvider).connect === "function"); }
function isEvmProvider(value: unknown): value is EvmProvider { return Boolean(value && typeof value === "object" && "request" in value && typeof (value as EvmProvider).request === "function"); }

export function createMockWalletSession(chain: WalletSessionChain): WalletSession {
  return { id: `mock-${chain}`, chain, kind: "mock", label: chain === "evm" ? "Mock Rootstock Wallet" : chain === "cardano" ? "Mock Cardano Wallet" : "Mock SVM Wallet", address: MOCK_WALLET_ADDRESSES[chain], connectedAtMs: Date.now() };
}
export function shortWalletAddress(address: string): string { return address.length <= 16 ? address : `${address.slice(0, 8)}...${address.slice(-6)}`; }

export function hydrateStoredWalletSession(): WalletSession | null {
  if (typeof window === "undefined") return null;
  let raw: string | null;
  try { raw = window.localStorage.getItem(WALLET_SESSION_STORAGE_KEY); } catch { return null; }
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<WalletSession>;
    if (typeof parsed !== "object" || parsed == null || typeof parsed.id !== "string" || (parsed.chain !== "evm" && parsed.chain !== "cardano" && parsed.chain !== "svm") || (parsed.kind !== "mock" && parsed.kind !== "beexo_eip1193" && parsed.kind !== "eip1193" && parsed.kind !== "cip30" && parsed.kind !== "wallet_standard") || typeof parsed.label !== "string" || typeof parsed.address !== "string" || typeof parsed.connectedAtMs !== "number") {
      throw new Error("Invalid stored wallet session shape.");
    }
    return parsed as WalletSession;
  } catch {
    try { window.localStorage.removeItem(WALLET_SESSION_STORAGE_KEY); } catch {}
    return null;
  }
}

export function persistWalletSession(session: WalletSession | null): void {
  if (typeof window === "undefined") return;
  try {
    if (!session) { window.localStorage.removeItem(WALLET_SESSION_STORAGE_KEY); return; }
    window.localStorage.setItem(WALLET_SESSION_STORAGE_KEY, JSON.stringify(session));
  } catch {}
}

function getCardanoProviders(): Array<[string, Cip30Provider]> {
  if (typeof window === "undefined") return [];
  const cardano = (window as Window & { cardano?: Record<string, unknown> }).cardano;
  if (!cardano || typeof cardano !== "object") return [];
  return Object.entries(cardano).filter((entry): entry is [string, Cip30Provider] => Boolean(entry[1] && typeof entry[1] === "object" && typeof (entry[1] as Cip30Provider).enable === "function"));
}
function getSvmProvider(): SvmProvider | null {
  if (typeof window === "undefined") return null;
  const browser = window as Window & { solana?: SvmProvider; phantom?: { solana?: SvmProvider } | SvmProvider };
  if (browser.solana && typeof browser.solana.connect === "function") return browser.solana;
  const phantomContainer = browser.phantom;
  const phantom = phantomContainer && typeof phantomContainer === "object" && "solana" in phantomContainer ? phantomContainer.solana : phantomContainer;
  return isSvmProvider(phantom) ? phantom : null;
}
function getEvmProvider(): EvmProvider | null {
  if (typeof window === "undefined") return null;
  const ethereum = (window as Window & { ethereum?: unknown }).ethereum;
  return isEvmProvider(ethereum) ? ethereum : null;
}

export function detectWalletAvailability(): WalletAvailability {
  return { evm: Boolean(getEvmProvider()), cardano: getCardanoProviders().length > 0, svm: Boolean(getSvmProvider()) };
}

async function connectEvmWallet(): Promise<WalletSession | null> {
  try {
    const result = await connectBeexoOrEvmWallet();
    if (!result) return null;
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
    if (!provider?.request) return null;
    try {
      const accounts = await provider.request({ method: "eth_requestAccounts" });
      const address = Array.isArray(accounts) && typeof accounts[0] === "string" && accounts[0].length > 0 ? accounts[0] : "0x-rootstock-wallet";
      return { id: `eip1193-${address.toLowerCase()}`, chain: "evm", kind: "eip1193", label: provider.isMetaMask ? "EVM Wallet" : "Beexo / EVM Wallet", address, connectedAtMs: Date.now() };
    } catch { return null; }
  }
}
async function connectCardanoWallet(): Promise<WalletSession | null> {
  const [providerKey, provider] = getCardanoProviders()[0] ?? [];
  if (!providerKey || !provider?.enable) return null;
  let walletApi: Cip30WalletApi;
  try { walletApi = await provider.enable(); } catch { return null; }
  let address = "cardano-cip30-connected";
  if (walletApi.getChangeAddress) { try { const raw = await walletApi.getChangeAddress(); if (typeof raw === "string" && raw.length > 0) address = normalizeCardanoDisplayAddress(raw); } catch {} }
  if (address === "cardano-cip30-connected" && walletApi.getUsedAddresses) { try { const used = await walletApi.getUsedAddresses(); if (Array.isArray(used) && typeof used[0] === "string" && used[0].length > 0) address = normalizeCardanoDisplayAddress(used[0]); } catch {} }
  return { id: `cip30-${providerKey}`, chain: "cardano", kind: "cip30", label: provider.name ? `${provider.name} Cardano` : `${providerKey} Cardano`, address, connectedAtMs: Date.now() };
}
async function connectSvmWallet(): Promise<WalletSession | null> {
  const provider = getSvmProvider();
  if (!provider?.connect) return null;
  let response: Awaited<ReturnType<NonNullable<SvmProvider["connect"]>>>;
  try { response = await provider.connect(); } catch { return null; }
  const address = provider.publicKey?.toString?.() ?? response.publicKey?.toString?.() ?? "svm-wallet-connected";
  return { id: `wallet-standard-${address}`, chain: "svm", kind: "wallet_standard", label: provider.isPhantom ? "Phantom" : "SVM Wallet", address, connectedAtMs: Date.now() };
}

export async function connectPreferredWallet(chain: WalletSessionChain): Promise<WalletSession> {
  if (chain === "evm") return (await connectEvmWallet()) ?? createMockWalletSession("evm");
  if (chain === "cardano") return (await connectCardanoWallet()) ?? createMockWalletSession("cardano");
  return (await connectSvmWallet()) ?? createMockWalletSession("svm");
}
