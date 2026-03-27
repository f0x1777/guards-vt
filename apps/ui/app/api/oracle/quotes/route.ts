import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const REQUEST_TIMEOUT_MS = 5_000;
const QUOTE_CACHE_TTL_MS = 60_000;
const EMA_SMOOTHING_WINDOW_MS = 30 * 60 * 1000;

interface MarketQuote {
  feedId: string;
  symbol: string;
  price: number;
  emaPrice: number;
  confidence: number;
  updatedAtMs: number;
  publisherCount?: number;
}

interface CoinGeckoSimplePriceResponse {
  bitcoin?: { usd?: number };
  solana?: { usd?: number };
}

interface GoldApiResponse {
  price?: number;
  updatedAt?: string;
}

interface FrankfurterResponse {
  rates?: {
    USD?: number;
  };
}

interface QuotesResponseBody {
  ok: boolean;
  source: "market_live";
  quotes: Partial<{
    rbtc: MarketQuote;
    btc: MarketQuote;
    sol: MarketQuote;
    xau: MarketQuote;
    eur: MarketQuote;
  }>;
  sourceErrors?: string[];
}

interface QuoteCacheEntry {
  expiresAtMs: number;
  body: QuotesResponseBody;
}

interface EmaCacheEntry {
  emaPrice: number;
  updatedAtMs: number;
}

let quoteCache: QuoteCacheEntry | null = null;
const emaCache = new Map<string, EmaCacheEntry>();

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    method: "GET",
    cache: "force-cache",
    headers: {
      accept: "application/json",
    },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`Market data request failed (${response.status}) for ${url}`);
  }

  return (await response.json()) as T;
}

function finiteOrNull(value: number | undefined): number | null {
  return Number.isFinite(value) && value !== undefined ? value : null;
}

function nextEmaPrice(feedId: string, price: number, updatedAtMs: number): number {
  const previous = emaCache.get(feedId);
  if (!previous || updatedAtMs <= previous.updatedAtMs) {
    emaCache.set(feedId, {
      emaPrice: price,
      updatedAtMs,
    });
    return price;
  }

  const elapsedMs = Math.max(1, updatedAtMs - previous.updatedAtMs);
  const alpha = 1 - Math.exp(-elapsedMs / EMA_SMOOTHING_WINDOW_MS);
  const emaPrice = Number(
    (previous.emaPrice + (price - previous.emaPrice) * alpha).toFixed(6),
  );
  emaCache.set(feedId, {
    emaPrice,
    updatedAtMs,
  });
  return emaPrice;
}

function buildQuote(
  feedId: string,
  symbol: string,
  price: number,
  updatedAtMs: number,
  confidenceRatio: number,
): MarketQuote {
  return {
    feedId,
    symbol,
    price,
    emaPrice: nextEmaPrice(feedId, price, updatedAtMs),
    confidence: Number((price * confidenceRatio).toFixed(6)),
    updatedAtMs,
  };
}

export async function GET() {
  const nowMs = Date.now();
  if (quoteCache && quoteCache.expiresAtMs > nowMs) {
    return NextResponse.json(quoteCache.body);
  }

  const [coingeckoResult, goldResult, eurResult] = await Promise.allSettled([
    fetchJson<CoinGeckoSimplePriceResponse>(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,solana&vs_currencies=usd",
    ),
    fetchJson<GoldApiResponse>("https://api.gold-api.com/price/XAU"),
    fetchJson<FrankfurterResponse>("https://api.frankfurter.app/latest?from=EUR&to=USD"),
  ]);

  const sourceErrors: string[] = [];
  const quotes: QuotesResponseBody["quotes"] = {};

  if (coingeckoResult.status === "fulfilled") {
    const coingecko = coingeckoResult.value;
    const btcUsd = finiteOrNull(coingecko.bitcoin?.usd);
    const solUsd = finiteOrNull(coingecko.solana?.usd);
    if (btcUsd !== null) {
      quotes.rbtc = buildQuote("market-rbtc-usd", "RBTC/USD", btcUsd, nowMs, 0.0012);
      quotes.btc = buildQuote("market-btc-usd", "BTC/USD", btcUsd, nowMs, 0.0012);
    } else {
      sourceErrors.push("coingecko: missing bitcoin.usd (affects rbtc and btc quotes)");
    }
    if (solUsd !== null) {
      quotes.sol = buildQuote("market-sol-usd", "SOL/USD", solUsd, nowMs, 0.0018);
    } else {
      sourceErrors.push("coingecko: missing solana.usd");
    }
  } else {
    sourceErrors.push(
      `coingecko: ${coingeckoResult.reason instanceof Error ? coingeckoResult.reason.message : "fetch failed"}`,
    );
  }

  if (goldResult.status === "fulfilled") {
    const gold = goldResult.value;
    const xauUsd = finiteOrNull(gold.price);
    if (xauUsd !== null) {
      const goldUpdatedAtMs = (() => {
        if (!gold.updatedAt) return nowMs;
        const parsed = Date.parse(gold.updatedAt);
        return Number.isFinite(parsed) ? parsed : nowMs;
      })();
      quotes.xau = buildQuote("market-xau-usd", "XAU/USD", xauUsd, goldUpdatedAtMs, 0.0008);
    } else {
      sourceErrors.push("gold-api: missing price");
    }
  } else {
    sourceErrors.push(
      `gold-api: ${goldResult.reason instanceof Error ? goldResult.reason.message : "fetch failed"}`,
    );
  }

  if (eurResult.status === "fulfilled") {
    const eur = eurResult.value;
    const eurUsd = finiteOrNull(eur.rates?.USD);
    if (eurUsd !== null) {
      quotes.eur = buildQuote("market-eur-usd", "EUR/USD", eurUsd, nowMs, 0.0002);
    } else {
      sourceErrors.push("frankfurter: missing rates.USD");
    }
  } else {
    sourceErrors.push(
      `frankfurter: ${eurResult.reason instanceof Error ? eurResult.reason.message : "fetch failed"}`,
    );
  }

  if (Object.keys(quotes).length === 0) {
    return NextResponse.json(
      {
        ok: false,
        error: `All market data sources failed: ${sourceErrors.join("; ")}`,
      },
      { status: 502 },
    );
  }

  const body: QuotesResponseBody = {
    ok: true,
    source: "market_live",
    quotes,
    ...(sourceErrors.length > 0 && { sourceErrors }),
  };
  quoteCache = {
    expiresAtMs: nowMs + QUOTE_CACHE_TTL_MS,
    body,
  };

  return NextResponse.json(body);
}
