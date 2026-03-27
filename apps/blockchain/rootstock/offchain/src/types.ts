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
  reasonHash: string;
  requestedAtUs: number;
}

export interface PreparedProtocolAction {
  protocolId: RootstockProtocolId;
  summary: string;
  approvalSurface: "governance" | "operator" | "keeper";
  scaffoldOnly?: boolean;
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

export function validateIntentForAdapter(
  adapterId: RootstockProtocolId,
  supports: readonly TreasuryActionKind[],
  intent: TreasuryActionIntent,
): void {
  if (intent.route.protocolId !== adapterId) {
    throw new Error(`Adapter ${adapterId} received mismatched protocolId ${intent.route.protocolId}`);
  }

  if (!intent.route.enabled) {
    throw new Error(`Adapter ${adapterId} received a disabled route`);
  }

  if (!supports.includes(intent.kind)) {
    throw new Error(`Adapter ${adapterId} does not support intent kind ${intent.kind}`);
  }

  if (!Number.isFinite(intent.route.maxNotionalUsd) || intent.route.maxNotionalUsd <= 0) {
    throw new Error(`Adapter ${adapterId} requires a positive maxNotionalUsd`);
  }

  if (
    !Number.isFinite(intent.route.slippageBps) ||
    intent.route.slippageBps < 0 ||
    intent.route.slippageBps > 10_000
  ) {
    throw new Error(`Adapter ${adapterId} received invalid slippageBps ${intent.route.slippageBps}`);
  }

  if (!Number.isFinite(intent.requestedAtUs) || intent.requestedAtUs <= 0) {
    throw new Error(`Adapter ${adapterId} requires a positive requestedAtUs`);
  }

  if (intent.reasonHash.trim().length === 0) {
    throw new Error(`Adapter ${adapterId} requires a reasonHash`);
  }
}
