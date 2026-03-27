import {
  validateIntentForAdapter,
  type PreparedProtocolAction,
  type ProtocolAdapter,
  type TreasuryActionIntent,
} from "./types.js";

const SOVRYN_ID = "sovryn" as const;
const SOVRYN_SUPPORTS = ["swap", "rebalance", "bridge"] as const;

function formatActionSummary(intent: TreasuryActionIntent): string {
  const pair = intent.route.buyToken ? `${intent.route.sellToken}/${intent.route.buyToken}` : intent.route.sellToken;
  return `Sovryn guarded ${intent.kind} on ${pair} with capped slippage ${intent.route.slippageBps} bps`;
}

export const sovrynAdapter: ProtocolAdapter = {
  id: SOVRYN_ID,
  label: "Sovryn",
  supports: [...SOVRYN_SUPPORTS],
  prepare(intent: TreasuryActionIntent): PreparedProtocolAction {
    validateIntentForAdapter(SOVRYN_ID, SOVRYN_SUPPORTS, intent);

    return {
      protocolId: SOVRYN_ID,
      summary: formatActionSummary(intent),
      approvalSurface: "keeper",
      scaffoldOnly: true,
      calls: [],
    };
  },
};
