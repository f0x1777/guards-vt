export type RootstockProtocolId = "money-on-chain" | "sovryn" | "custom-transfer";

export type TreasuryActionKind =
  | "transfer"
  | "withdraw"
  | "swap"
  | "rebalance"
  | "bridge"
  | "onramp"
  | "offramp";

export interface TreasuryRouteConstraint {
  protocolId: RootstockProtocolId;
  sellToken: string;
  buyToken?: string;
  maxNotionalUsd: number;
  slippageBps: number;
  enabled: boolean;
}

export interface TreasuryActionIntent {
  vaultId: string;
  companyId: string;
  chainId: number;
  kind: TreasuryActionKind;
  route: TreasuryRouteConstraint;
  amount: string;
  destination?: string;
  minReceive?: string;
  reason: string;
  requestedAtIso: string;
}

export interface PreparedProtocolAction {
  protocolId: RootstockProtocolId;
  summary: string;
  approvalSurface: "governance" | "operator" | "keeper";
  calls: Array<{
    target: string;
    data: string;
    value?: string;
  }>;
}

export interface ProtocolAdapter {
  id: RootstockProtocolId;
  label: string;
  supports: TreasuryActionKind[];
  prepare(intent: TreasuryActionIntent): PreparedProtocolAction;
}
