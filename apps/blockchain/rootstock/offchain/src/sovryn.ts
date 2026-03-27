import type { PreparedProtocolAction, ProtocolAdapter, TreasuryActionIntent } from "./types";

function formatSwapSummary(intent: TreasuryActionIntent): string {
  const pair = intent.route.buyToken ? `${intent.route.sellToken}/${intent.route.buyToken}` : intent.route.sellToken;
  return `Sovryn guarded ${intent.kind} on ${pair} with capped slippage ${intent.route.slippageBps} bps`;
}

export const sovrynAdapter: ProtocolAdapter = {
  id: "sovryn",
  label: "Sovryn",
  supports: ["swap", "rebalance", "bridge"],
  prepare(intent: TreasuryActionIntent): PreparedProtocolAction {
    return {
      protocolId: "sovryn",
      summary: formatSwapSummary(intent),
      approvalSurface: "keeper",
      calls: [
        {
          target: "0x0000000000000000000000000000000000000000",
          data: "0x",
        },
      ],
    };
  },
};
