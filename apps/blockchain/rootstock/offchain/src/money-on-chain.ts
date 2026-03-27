import type { PreparedProtocolAction, ProtocolAdapter, TreasuryActionIntent } from "./types";

function formatSwapSummary(intent: TreasuryActionIntent): string {
  const pair = intent.route.buyToken ? `${intent.route.sellToken}/${intent.route.buyToken}` : intent.route.sellToken;
  return `Money on Chain guarded ${intent.kind} on ${pair} with max ${intent.route.maxNotionalUsd} USD notional`;
}

export const moneyOnChainAdapter: ProtocolAdapter = {
  id: "money-on-chain",
  label: "Money on Chain",
  supports: ["swap", "rebalance", "withdraw"],
  prepare(intent: TreasuryActionIntent): PreparedProtocolAction {
    return {
      protocolId: "money-on-chain",
      summary: formatSwapSummary(intent),
      approvalSurface: "keeper",
      calls: [
        {
          target: "0x0000000000000000000000000000000000000000",
          data: "0x",
          value: intent.kind === "withdraw" ? intent.amount : undefined,
        },
      ],
    };
  },
};
