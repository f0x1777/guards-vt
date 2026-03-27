import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    method: "GET",
    cache: "no-store",
    headers: {
      accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Market data request failed (${response.status}) for ${url}`);
  }

  return (await response.json()) as T;
}

function requireNumber(value: number | undefined, label: string): number {
  if (!Number.isFinite(value)) {
    throw new Error(`Market data response is missing numeric field ${label}`);
  }

  return value as number;
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
    emaPrice: price,
    confidence: Number((price * confidenceRatio).toFixed(6)),
    updatedAtMs,
  };
}

export async function GET() {
  try {
    const [coingecko, gold, eur] = await Promise.all([
      fetchJson<CoinGeckoSimplePriceResponse>(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,solana&vs_currencies=usd",
      ),
      fetchJson<GoldApiResponse>("https://api.gold-api.com/price/XAU"),
      fetchJson<FrankfurterResponse>("https://api.frankfurter.app/latest?from=EUR&to=USD"),
    ]);

    const nowMs = Date.now();
    const goldUpdatedAtMs = gold.updatedAt ? Date.parse(gold.updatedAt) : nowMs;

    const btcUsd = requireNumber(coingecko.bitcoin?.usd, "bitcoin.usd");
    const solUsd = requireNumber(coingecko.solana?.usd, "solana.usd");
    const xauUsd = requireNumber(gold.price, "xau.price");
    const eurUsd = requireNumber(eur.rates?.USD, "eur.usd");

    return NextResponse.json({
      ok: true,
      source: "market_live",
      quotes: {
        rbtc: buildQuote("market-rbtc-usd", "RBTC/USD", btcUsd, nowMs, 0.0012),
        btc: buildQuote("market-btc-usd", "BTC/USD", btcUsd, nowMs, 0.0012),
        sol: buildQuote("market-sol-usd", "SOL/USD", solUsd, nowMs, 0.0018),
        xau: buildQuote("market-xau-usd", "XAU/USD", xauUsd, goldUpdatedAtMs, 0.0008),
        eur: buildQuote("market-eur-usd", "EUR/USD", eurUsd, nowMs, 0.0002),
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to fetch live market quotes.",
      },
      { status: 502 },
    );
  }
}
