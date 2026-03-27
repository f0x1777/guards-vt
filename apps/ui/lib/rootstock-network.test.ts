import { describe, expect, it, vi } from "vitest";
import {
  ROOTSTOCK_TESTNET,
  ensureRootstockTestnet,
  isUnknownChainError,
  parseChainIdHex,
  type Eip1193Provider,
} from "./rootstock-network";
import { connectBeexoOrEvmWalletWithProvider } from "./beexo-connect";

function createProvider(
  requestImpl: Eip1193Provider["request"],
): Eip1193Provider {
  return { request: requestImpl };
}

describe("rootstock network helpers", () => {
  it("parses the expected Rootstock chain id", () => {
    expect(parseChainIdHex(ROOTSTOCK_TESTNET.chainIdHex)).toBe(31);
    expect(parseChainIdHex("0xzz")).toBeNull();
  });

  it("detects unknown-chain errors by code and message", () => {
    expect(isUnknownChainError({ code: 4902 })).toBe(true);
    expect(isUnknownChainError(new Error("Unrecognized chain"))).toBe(true);
    expect(isUnknownChainError(new Error("User rejected"))).toBe(false);
  });

  it("switches successfully when the wallet already supports Rootstock", async () => {
    const request = vi.fn(async () => null);
    await ensureRootstockTestnet(createProvider(request));

    expect(request).toHaveBeenCalledTimes(1);
    expect(request).toHaveBeenCalledWith({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: ROOTSTOCK_TESTNET.chainIdHex }],
    });
  });

  it("adds the chain when switch fails with unknown-chain", async () => {
    const request = vi
      .fn()
      .mockRejectedValueOnce({ code: 4902 })
      .mockResolvedValueOnce(null);

    await ensureRootstockTestnet(createProvider(request));

    expect(request).toHaveBeenNthCalledWith(1, {
      method: "wallet_switchEthereumChain",
      params: [{ chainId: ROOTSTOCK_TESTNET.chainIdHex }],
    });
    expect(request).toHaveBeenNthCalledWith(2, {
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
  });

  it("propagates non-unknown switch failures", async () => {
    const request = vi.fn().mockRejectedValue(new Error("User rejected"));

    await expect(ensureRootstockTestnet(createProvider(request))).rejects.toThrow(
      "User rejected",
    );
  });

  it("returns null when the wallet is not actually on Rootstock", async () => {
    const request = vi.fn(async ({ method }: { method: string }) => {
      if (method === "wallet_switchEthereumChain") return null;
      if (method === "eth_requestAccounts") return ["0xabc"];
      if (method === "eth_chainId") return "0x89";
      return null;
    });

    const result = await connectBeexoOrEvmWalletWithProvider(createProvider(request));
    expect(result).toBeNull();
  });

  it("returns null when the wallet does not provide a usable account", async () => {
    const request = vi.fn(async ({ method }: { method: string }) => {
      if (method === "wallet_switchEthereumChain") return null;
      if (method === "eth_requestAccounts") return [""];
      if (method === "eth_chainId") return ROOTSTOCK_TESTNET.chainIdHex;
      return null;
    });

    const result = await connectBeexoOrEvmWalletWithProvider(createProvider(request));
    expect(result).toBeNull();
  });
});
