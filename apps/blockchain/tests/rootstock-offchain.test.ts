import { describe, expect, it } from "vitest";
import {
  moneyOnChainAdapter,
  sovrynAdapter,
  type TreasuryActionIntent,
} from "../rootstock/offchain/src/index.js";

function buildIntent(overrides: Partial<TreasuryActionIntent> = {}): TreasuryActionIntent {
  return {
    vaultId: "vault-rootstock-001",
    companyId: "guards-demo",
    chainId: 31,
    kind: "swap",
    route: {
      protocolId: "money-on-chain",
      sellToken: "RBTC",
      buyToken: "DOC",
      maxNotionalUsd: 25_000,
      slippageBps: 100,
      enabled: true,
    },
    amount: "1000000000000000000",
    minReceive: "1000000000000000000",
    reasonHash: "risk:drawdown",
    requestedAtUs: 1_774_206_000_000_000,
    ...overrides,
  };
}

describe("rootstock protocol adapters", () => {
  it("fails closed on mismatched protocol ids", () => {
    const intent = buildIntent();

    expect(() => sovrynAdapter.prepare(intent)).toThrow(/mismatched protocolId/i);
  });

  it("fails closed on disabled routes", () => {
    const intent = buildIntent({
      route: {
        ...buildIntent().route,
        enabled: false,
      },
    });

    expect(() => moneyOnChainAdapter.prepare(intent)).toThrow(/disabled route/i);
  });

  it("fails closed on unsupported kinds", () => {
    const intent = buildIntent({
      kind: "bridge",
    });

    expect(() => moneyOnChainAdapter.prepare(intent)).toThrow(/does not support intent kind/i);
  });

  it("fails closed on invalid execution caps", () => {
    const invalidNotional = buildIntent({
      route: {
        ...buildIntent().route,
        maxNotionalUsd: 0,
      },
    });
    const invalidSlippage = buildIntent({
      route: {
        ...buildIntent().route,
        slippageBps: 12_000,
      },
    });

    expect(() => moneyOnChainAdapter.prepare(invalidNotional)).toThrow(/maxNotionalUsd/i);
    expect(() => moneyOnChainAdapter.prepare(invalidSlippage)).toThrow(/slippageBps/i);
  });

  it("returns scaffold-only actions with no executable calls", () => {
    const intent = buildIntent();
    const result = moneyOnChainAdapter.prepare(intent);

    expect(result.protocolId).toBe("money-on-chain");
    expect(result.scaffoldOnly).toBe(true);
    expect(result.calls).toEqual([]);
  });

  it("prepares a scaffold-only Sovryn action when the intent is valid", () => {
    const result = sovrynAdapter.prepare(
      buildIntent({
        kind: "rebalance",
        route: {
          ...buildIntent().route,
          protocolId: "sovryn",
        },
      }),
    );

    expect(result.protocolId).toBe("sovryn");
    expect(result.scaffoldOnly).toBe(true);
    expect(result.calls).toEqual([]);
  });
});
