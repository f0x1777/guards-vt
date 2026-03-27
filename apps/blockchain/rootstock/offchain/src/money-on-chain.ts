import {
  validateIntentForAdapter,
  type PreparedProtocolAction,
  type ProtocolAdapter,
  type TreasuryActionIntent,
} from "./types.js";

const MONEY_ON_CHAIN_ID = "money-on-chain" as const;
const MONEY_ON_CHAIN_SUPPORTS = ["swap", "rebalance", "withdraw"] as const;

function formatActionSummary(intent: TreasuryActionIntent): string {
  const pair = intent.route.buyToken ? `${intent.route.sellToken}/${intent.route.buyToken}` : intent.route.sellToken;
  return `Money on Chain guarded ${intent.kind} on ${pair} with max ${intent.route.maxNotionalUsd} USD notional`;
}

export const moneyOnChainAdapter: ProtocolAdapter = {
  id: MONEY_ON_CHAIN_ID,
  label: "Money on Chain",
  supports: [...MONEY_ON_CHAIN_SUPPORTS],
  prepare(intent: TreasuryActionIntent): PreparedProtocolAction {
    validateIntentForAdapter(MONEY_ON_CHAIN_ID, MONEY_ON_CHAIN_SUPPORTS, intent);

    return {
      protocolId: MONEY_ON_CHAIN_ID,
      summary: formatActionSummary(intent),
      approvalSurface: "keeper",
      scaffoldOnly: true,
      calls: [],
    };
  },
};
