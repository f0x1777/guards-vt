import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { demoState } from "./demo-data";
import {
  applyLiveQuotesToDemoState,
  liveReferencePriceForSymbol,
  type LiveQuoteMap,
} from "./live-prices";
import type { DemoState } from "./types";

const nowMs = Date.parse("2026-03-22T19:00:00.000Z");

function cloneState(): DemoState {
  return {
    ...demoState,
    positions: demoState.positions.map((position) => ({ ...position })),
    oracle: { ...demoState.oracle },
    policy: { ...demoState.policy },
    metrics: { ...demoState.metrics },
  };
}

describe("applyLiveQuotesToDemoState", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(nowMs);
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it("revalues positions from the base oracle when no live quote is present", () => {
    const state = cloneState();
    const nextState = applyLiveQuotesToDemoState(state, {});

    expect(nextState.positions.find((position) => position.role === "risk")?.fiatValue).toBeCloseTo(
      Number((0.825 * demoState.oracle.price).toFixed(2)),
      2,
    );
    expect(nextState.metrics.liquidValue).toBeGreaterThan(0);
  });

  it("rejects stale or low-confidence quotes using policy guardrails", () => {
    const expected = applyLiveQuotesToDemoState(cloneState(), {});
    const staleQuote: LiveQuoteMap = {
      rbtc: {
        ...stateOracle(),
        updatedAtMs: nowMs - demoState.policy.maxStaleUs / 1000 - 1,
      },
    };
    const wideConfidenceQuote: LiveQuoteMap = {
      rbtc: {
        ...stateOracle(),
        confidence: 2_000,
      },
    };

    expect(applyLiveQuotesToDemoState(cloneState(), staleQuote)).toEqual(expected);
    expect(applyLiveQuotesToDemoState(cloneState(), wideConfidenceQuote)).toEqual(expected);
  });

  it("recomputes liquid value, stable ratio, and weights when RBTC price changes", () => {
    const state = applyLiveQuotesToDemoState(cloneState(), {
      rbtc: {
        ...stateOracle(),
        price: 70_000,
        emaPrice: 71_000,
      },
    });

    const riskPosition = state.positions.find((position) => position.role === "risk");
    const stablePosition = state.positions.find((position) => position.role === "stable");
    const expectedRiskFiat = 0.825 * 70_000;
    const expectedTotal = expectedRiskFiat + 36_000;
    const expectedLiquid = expectedRiskFiat * (1 - demoState.policy.haircutBps / 10_000) + 36_000;

    expect(riskPosition?.fiatValue).toBeCloseTo(expectedRiskFiat, 6);
    expect(riskPosition?.weight).toBeCloseTo(expectedRiskFiat / expectedTotal, 6);
    expect(stablePosition?.weight).toBeCloseTo(36_000 / expectedTotal, 6);
    expect(state.metrics.liquidValue).toBeCloseTo(expectedLiquid, 6);
    expect(state.metrics.stableRatio).toBeCloseTo(36_000 / expectedLiquid, 6);
    expect(state.metrics.drawdownBps).toBe(141);
  });

  it("returns guarded live reference prices by symbol", () => {
    const quotes: LiveQuoteMap = {
      xau: {
        feedId: "market-xau-usd",
        symbol: "XAU/USD",
        price: 4405.12,
        emaPrice: 4398,
        confidence: 0.35,
        updatedAtMs: nowMs - 1_000,
        publisherCount: 12,
      },
      btc: {
        feedId: "market-btc-usd",
        symbol: "BTC/USD",
        price: 84500,
        emaPrice: 84400,
        confidence: 4,
        updatedAtMs: nowMs - 1_000,
        publisherCount: 12,
      },
    };

    expect(
      liveReferencePriceForSymbol(quotes, "XAU/USD", {
        maxStaleUs: demoState.policy.maxStaleUs,
        maxConfidenceBps: demoState.policy.maxConfidenceBps,
      }),
    ).toBeCloseTo(4405.12, 6);
    expect(
      liveReferencePriceForSymbol(quotes, "BTC/USD", {
        maxStaleUs: demoState.policy.maxStaleUs,
        maxConfidenceBps: demoState.policy.maxConfidenceBps,
      }),
    ).toBeCloseTo(84500, 6);
    expect(
      liveReferencePriceForSymbol(quotes, "EUR/USD", {
        maxStaleUs: demoState.policy.maxStaleUs,
        maxConfidenceBps: demoState.policy.maxConfidenceBps,
      }),
    ).toBeUndefined();
  });

  it("rejects stale reference quotes", () => {
    const quotes: LiveQuoteMap = {
      xau: {
        feedId: "market-xau-usd",
        symbol: "XAU/USD",
        price: 4405.12,
        emaPrice: 4398,
        confidence: 0.35,
        updatedAtMs: nowMs - demoState.policy.maxStaleUs / 1000 - 1,
        publisherCount: 12,
      },
    };

    expect(
      liveReferencePriceForSymbol(quotes, "XAU/USD", {
        maxStaleUs: demoState.policy.maxStaleUs,
        maxConfidenceBps: demoState.policy.maxConfidenceBps,
      }),
    ).toBeUndefined();
  });
});

function stateOracle() {
  return {
    feedId: "market-rbtc-usd",
    symbol: "RBTC/USD",
    price: 68_000,
    emaPrice: 68_220,
    confidence: 48,
    updatedAtMs: nowMs - 1_000,
    publisherCount: 12,
  };
}
