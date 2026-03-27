import type { DemoState, OracleSnapshot } from "./types";

export interface LiveQuote extends OracleSnapshot {}

export interface LiveQuoteMap {
  rbtc?: LiveQuote;
  ada?: LiveQuote;
  xau?: LiveQuote;
  btc?: LiveQuote;
  sol?: LiveQuote;
  eur?: LiveQuote;
}

interface OracleGuardrails {
  maxStaleUs: number;
  maxConfidenceBps: number;
}

function fallbackStablePrice(_assetId: string): number {
  return 1;
}

function baseOracleForState(
  state: DemoState,
  quotes: LiveQuoteMap,
): OracleSnapshot {
  const riskQuote =
    (state.policy.primaryAssetId === "rbtc" ? quotes.rbtc : undefined) ??
    (state.policy.primaryAssetId === "ada" ? quotes.ada : undefined) ??
    quotes.rbtc ??
    quotes.ada;

  if (!riskQuote) {
    return state.oracle;
  }

  const nowMs = Date.now();
  if (!quotePassesGuardrails(riskQuote, state.policy, nowMs)) {
    return state.oracle;
  }

  return riskQuote;
}

function positionPrice(
  state: DemoState,
  position: DemoState["positions"][number],
  oracle: OracleSnapshot,
): number {
  if (position.assetId === state.policy.primaryAssetId || position.role === "risk") {
    return oracle.price;
  }

  return fallbackStablePrice(position.assetId);
}

function revalueFrames(
  frames: DemoState["frames"],
  baseDisplayValue: number,
  nextDisplayValue: number,
): DemoState["frames"] {
  if (!frames || frames.length === 0 || baseDisplayValue <= 0 || nextDisplayValue <= 0) {
    return frames;
  }

  const multiplier = nextDisplayValue / baseDisplayValue;
  return frames.map((frame) => ({
    ...frame,
    balance: Number((frame.balance * multiplier).toFixed(2)),
  }));
}

function formatOracleFreshness(nowMs: number, updatedAtMs: number): string {
  const seconds = Math.max(0, Math.round((nowMs - updatedAtMs) / 1000));
  if (seconds < 60) {
    return `${seconds}s ago`;
  }

  const minutes = Math.round(seconds / 60);
  return `${minutes}m ago`;
}

function computeDrawdownBps(price: number, emaPrice: number): number {
  if (emaPrice <= 0 || price >= emaPrice) {
    return 0;
  }

  return Math.round(((emaPrice - price) / emaPrice) * 10_000);
}

function computeConfidenceBps(price: number, confidence: number): number {
  if (!Number.isFinite(price) || price <= 0 || !Number.isFinite(confidence) || confidence < 0) {
    return Number.POSITIVE_INFINITY;
  }

  return (confidence / price) * 10_000;
}

function quotePassesGuardrails(
  quote: LiveQuote,
  guardrails: OracleGuardrails,
  nowMs = Date.now(),
): boolean {
  const updatedAgoMs = Math.max(0, nowMs - quote.updatedAtMs);
  const confidenceBps = computeConfidenceBps(quote.price, quote.confidence);

  if (guardrails.maxStaleUs > 0 && updatedAgoMs > guardrails.maxStaleUs / 1000) {
    return false;
  }

  if (
    guardrails.maxConfidenceBps > 0 &&
    confidenceBps > guardrails.maxConfidenceBps
  ) {
    return false;
  }

  return true;
}

export function applyLiveQuotesToDemoState(
  state: DemoState,
  quotes: LiveQuoteMap,
): DemoState {
  const nowMs = Date.now();
  const oracle = baseOracleForState(state, quotes);
  const baseDisplayValue = state.positions.reduce((sum, position) => sum + position.fiatValue, 0);

  const nextPositions = state.positions.map((position) => {
    const price = positionPrice(state, position, oracle);
    return {
      ...position,
      fiatValue: Number((position.amount * price).toFixed(2)),
      weight: 0,
    };
  });

  const totalDisplayValue = nextPositions.reduce((sum, position) => sum + position.fiatValue, 0);
  const stableFiatValue = nextPositions
    .filter((position) => position.role === "stable")
    .reduce((sum, position) => sum + position.fiatValue, 0);
  const riskFiatValue = nextPositions
    .filter((position) => position.role === "risk")
    .reduce((sum, position) => sum + position.fiatValue, 0);
  const liquidRiskValue = riskFiatValue * (1 - state.policy.haircutBps / 10_000);
  const liquidValue = liquidRiskValue + stableFiatValue;
  const stableRatio = liquidValue <= 0 ? 0 : stableFiatValue / liquidValue;

  return {
    ...state,
    nowMs,
    oracle,
    positions: nextPositions.map((position) => ({
      ...position,
      weight: totalDisplayValue <= 0 ? 0 : position.fiatValue / totalDisplayValue,
    })),
    metrics: {
      liquidValue,
      stableRatio,
      drawdownBps: computeDrawdownBps(oracle.price, oracle.emaPrice),
      oracleFreshness: formatOracleFreshness(nowMs, oracle.updatedAtMs),
    },
    frames: revalueFrames(state.frames, baseDisplayValue, totalDisplayValue),
  };
}

export function liveReferencePriceForSymbol(
  quotes: LiveQuoteMap,
  symbol: string,
  guardrails?: OracleGuardrails,
): number | undefined {
  const quote = (() => {
  switch (symbol) {
    case "XAU/USD":
        return quotes.xau;
    case "BTC/USD":
        return quotes.btc;
    case "SOL/USD":
        return quotes.sol;
    case "EUR/USD":
        return quotes.eur;
    default:
        return undefined;
    }
  })();

  if (!quote) {
    return undefined;
  }

  if (guardrails && !quotePassesGuardrails(quote, guardrails)) {
    return undefined;
  }

  return quote.price;
}
