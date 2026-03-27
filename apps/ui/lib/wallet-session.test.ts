import { afterEach, describe, expect, it } from "vitest";
import {
  WALLET_SESSION_STORAGE_KEY,
  connectWallet,
  createMockWalletSession,
  detectWalletAvailability,
  hydrateStoredWalletSession,
  persistWalletSession,
  shortWalletAddress,
} from "./wallet-session";

function installWindowMock(initialStorage: Record<string, string> = {}, ethereum?: unknown) {
  const storage = new Map(Object.entries(initialStorage));

  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      ethereum,
      localStorage: {
        getItem(key: string) {
          return storage.has(key) ? storage.get(key)! : null;
        },
        setItem(key: string, value: string) {
          storage.set(key, value);
        },
        removeItem(key: string) {
          storage.delete(key);
        },
      },
    },
  });

  return storage;
}

afterEach(() => {
  Reflect.deleteProperty(globalThis, "window");
});

describe("wallet session helpers", () => {
  it("builds a mock Rootstock wallet session", () => {
    const session = createMockWalletSession();

    expect(session.chain).toBe("evm");
    expect(session.kind).toBe("mock");
    expect(session.label).toContain("Rootstock");
  });

  it("truncates long wallet addresses", () => {
    expect(shortWalletAddress("0x1234567890abcdef1234567890abcdef12345678")).toBe(
      "0x123456...345678",
    );
  });

  it("persists and hydrates a wallet session", () => {
    const storage = installWindowMock();
    const session = createMockWalletSession();

    persistWalletSession(session);

    expect(storage.get(WALLET_SESSION_STORAGE_KEY)).toBeTruthy();
    expect(hydrateStoredWalletSession()).toEqual(session);
  });

  it("drops invalid stored sessions", () => {
    const storage = installWindowMock({
      [WALLET_SESSION_STORAGE_KEY]: JSON.stringify({ id: "broken" }),
    });

    expect(hydrateStoredWalletSession()).toBeNull();
    expect(storage.has(WALLET_SESSION_STORAGE_KEY)).toBe(false);
  });

  it("detects browser wallet availability", () => {
    installWindowMock({}, { request: async () => [] });

    expect(detectWalletAvailability()).toEqual({
      beexo: true,
      evm: true,
    });
  });

  it("returns a mock wallet when explicitly requested", async () => {
    const session = await connectWallet("mock");

    expect(session.kind).toBe("mock");
    expect(session.chain).toBe("evm");
  });
});
