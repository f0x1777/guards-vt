import { Interface, getAddress, isAddress } from "ethers";
import {
  validateIntentForAdapter,
  type PreparedProtocolAction,
  type ProtocolAdapter,
  type TreasuryActionIntent,
} from "./types.js";

const MONEY_ON_CHAIN_ID = "money-on-chain" as const;
const MONEY_ON_CHAIN_SUPPORTS = ["swap", "rebalance", "withdraw"] as const;
const MONEY_ON_CHAIN_ABI = new Interface([
  "function mintDoc(uint256 btcToMint) payable",
  "function mintDocVendors(uint256 btcToMint, address vendorAccount) payable",
  "function redeemFreeDoc(uint256 docAmount)",
  "function redeemFreeDocVendors(uint256 docAmount, address vendorAccount)",
]);

export interface MoneyOnChainAdapterConfig {
  mocAddress: string;
  vendorAddress?: string | null;
}

function requireAddress(label: string, value: string | null | undefined): string {
  if (!value || !isAddress(value)) {
    throw new Error(`Money on Chain requires a valid ${label}`);
  }

  return getAddress(value);
}

function requirePositiveAmount(label: string, amount: string): bigint {
  if (!/^\d+$/.test(amount)) {
    throw new Error(`Money on Chain requires an integer ${label}`);
  }

  const parsed = BigInt(amount);
  if (parsed <= 0n) {
    throw new Error(`Money on Chain requires a positive ${label}`);
  }

  return parsed;
}

function normalizeSymbol(value: string | undefined): string {
  return (value ?? "").trim().toUpperCase();
}

function formatActionSummary(intent: TreasuryActionIntent): string {
  const pair = intent.route.buyToken ? `${intent.route.sellToken}/${intent.route.buyToken}` : intent.route.sellToken;
  return `Money on Chain guarded ${intent.kind} on ${pair} with max ${intent.route.maxNotionalUsd} USD notional`;
}

function encodeRbtcToDoc(amount: bigint, vendorAddress: string | null): { data: string; value: string } {
  return {
    data: vendorAddress
      ? MONEY_ON_CHAIN_ABI.encodeFunctionData("mintDocVendors", [amount, vendorAddress])
      : MONEY_ON_CHAIN_ABI.encodeFunctionData("mintDoc", [amount]),
    value: amount.toString(),
  };
}

function encodeDocToRbtc(amount: bigint, vendorAddress: string | null): { data: string } {
  return {
    data: vendorAddress
      ? MONEY_ON_CHAIN_ABI.encodeFunctionData("redeemFreeDocVendors", [amount, vendorAddress])
      : MONEY_ON_CHAIN_ABI.encodeFunctionData("redeemFreeDoc", [amount]),
  };
}

export function createMoneyOnChainAdapter(config: MoneyOnChainAdapterConfig): ProtocolAdapter {
  const mocAddress = requireAddress("mocAddress", config.mocAddress);
  const vendorAddress = config.vendorAddress ? requireAddress("vendorAddress", config.vendorAddress) : null;

  return {
    id: MONEY_ON_CHAIN_ID,
    label: "Money on Chain",
    supports: [...MONEY_ON_CHAIN_SUPPORTS],
    prepare(intent: TreasuryActionIntent): PreparedProtocolAction {
      validateIntentForAdapter(MONEY_ON_CHAIN_ID, MONEY_ON_CHAIN_SUPPORTS, intent);

      const sellToken = normalizeSymbol(intent.route.sellToken);
      const buyToken = normalizeSymbol(intent.route.buyToken);
      const amount = requirePositiveAmount("amount", intent.amount);

      if (sellToken === "RBTC" && buyToken === "DOC") {
        const call = encodeRbtcToDoc(amount, vendorAddress);
        return {
          protocolId: MONEY_ON_CHAIN_ID,
          summary: formatActionSummary(intent),
          approvalSurface: "keeper",
          calls: [
            {
              target: mocAddress,
              data: call.data,
              value: call.value,
            },
          ],
        };
      }

      if (sellToken === "DOC" && buyToken === "RBTC") {
        const call = encodeDocToRbtc(amount, vendorAddress);
        return {
          protocolId: MONEY_ON_CHAIN_ID,
          summary: formatActionSummary(intent),
          approvalSurface: intent.kind === "withdraw" ? "governance" : "keeper",
          calls: [
            {
              target: mocAddress,
              data: call.data,
            },
          ],
        };
      }

      throw new Error("Money on Chain MVP supports only RBTC/DOC and DOC/RBTC guarded actions");
    },
  };
}

function readDefaultConfigFromEnv(): MoneyOnChainAdapterConfig {
  const mocAddress = process.env.ROOTSTOCK_MOC_CONTRACT_ADDRESS;
  const vendorAddress = process.env.ROOTSTOCK_MOC_VENDOR_ADDRESS ?? null;

  return {
    mocAddress: requireAddress("mocAddress", mocAddress),
    vendorAddress: vendorAddress ? requireAddress("vendorAddress", vendorAddress) : null,
  };
}

export const moneyOnChainAdapter: ProtocolAdapter = {
  id: MONEY_ON_CHAIN_ID,
  label: "Money on Chain",
  supports: [...MONEY_ON_CHAIN_SUPPORTS],
  prepare(intent: TreasuryActionIntent): PreparedProtocolAction {
    return createMoneyOnChainAdapter(readDefaultConfigFromEnv()).prepare(intent);
  },
};
