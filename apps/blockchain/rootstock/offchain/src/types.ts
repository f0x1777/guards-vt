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

const ROOTSTOCK_TESTNET_CHAIN_ID = 31;

function isPositiveIntegerString(value: string): boolean {
  return /^\d+$/.test(value) && BigInt(value) > 0n;
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

  if (intent.vaultId.trim().length === 0) {
    throw new Error(`Adapter ${adapterId} requires a vaultId`);
  }

  if (intent.companyId.trim().length === 0) {
    throw new Error(`Adapter ${adapterId} requires a companyId`);
  }

  if (!Number.isInteger(intent.chainId) || intent.chainId !== ROOTSTOCK_TESTNET_CHAIN_ID) {
    throw new Error(`Adapter ${adapterId} requires Rootstock testnet chainId ${ROOTSTOCK_TESTNET_CHAIN_ID}`);
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

  if (!isPositiveIntegerString(intent.amount)) {
    throw new Error(`Adapter ${adapterId} requires a positive integer amount`);
  }

  if (intent.minReceive != null && !isPositiveIntegerString(intent.minReceive)) {
    throw new Error(`Adapter ${adapterId} requires minReceive to be a positive integer when present`);
  }

  const sellToken = intent.route.sellToken.trim().toUpperCase();
  if (sellToken.length === 0) {
    throw new Error(`Adapter ${adapterId} requires a sellToken`);
  }

  const buyToken = intent.route.buyToken?.trim().toUpperCase() ?? "";
  if (["swap", "rebalance", "withdraw"].includes(intent.kind) && buyToken.length === 0) {
    throw new Error(`Adapter ${adapterId} requires a buyToken for intent kind ${intent.kind}`);
  }

  if (buyToken.length > 0 && buyToken === sellToken) {
    throw new Error(`Adapter ${adapterId} requires distinct sellToken and buyToken values`);
  }

  if (intent.reasonHash.trim().length === 0) {
    throw new Error(`Adapter ${adapterId} requires a reasonHash`);
  }
}
