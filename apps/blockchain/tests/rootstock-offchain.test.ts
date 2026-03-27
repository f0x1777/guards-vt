import { describe, expect, it } from "vitest";
import {
  createMoneyOnChainAdapter,
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
  const moneyOnChainAdapter = createMoneyOnChainAdapter({
    mocAddress: "0x1111111111111111111111111111111111111111",
    vendorAddress: "0x2222222222222222222222222222222222222222",
  });

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

  it("prepares executable Money on Chain mint calls for RBTC -> DOC", () => {
    const intent = buildIntent();
    const result = moneyOnChainAdapter.prepare(intent);

    expect(result.protocolId).toBe("money-on-chain");
    expect(result.scaffoldOnly).toBeUndefined();
    expect(result.calls).toHaveLength(1);
    expect(result.calls[0]?.target).toBe("0x1111111111111111111111111111111111111111");
    expect(result.calls[0]?.value).toBe(intent.amount);
    expect(result.calls[0]?.data.startsWith("0x")).toBe(true);
  });

  it("prepares executable Money on Chain redeem calls for DOC -> RBTC", () => {
    const result = moneyOnChainAdapter.prepare(
      buildIntent({
        kind: "withdraw",
        route: {
          ...buildIntent().route,
          sellToken: "DOC",
          buyToken: "RBTC",
        },
      }),
    );

    expect(result.protocolId).toBe("money-on-chain");
    expect(result.approvalSurface).toBe("governance");
    expect(result.calls).toHaveLength(1);
    expect(result.calls[0]?.value).toBeUndefined();
    expect(result.calls[0]?.data.startsWith("0x")).toBe(true);
  });

  it("rejects unsupported Money on Chain pairs in the MVP", () => {
    expect(() =>
      moneyOnChainAdapter.prepare(
        buildIntent({
          route: {
            ...buildIntent().route,
            sellToken: "DOC",
            buyToken: "USDT",
          },
        }),
      ),
    ).toThrow(/supports only RBTC\/DOC and DOC\/RBTC/i);
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
