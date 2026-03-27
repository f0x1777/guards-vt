import { PolicyConfig } from "@/lib/types";

interface PolicyCardsProps {
  policy: PolicyConfig;
}

export function PolicyCards({ policy }: PolicyCardsProps) {
  const cards = [
    {
      label: "Protected Floor",
      value: `$${policy.portfolioFloorFiat.toLocaleString()}`,
      description: `Hard stop at $${policy.emergencyPortfolioFloorFiat.toLocaleString()}.`,
      accent: "accent" as const,
    },
    {
      label: "Watch -> Partial",
      value: `${policy.watchDrawdownBps} / ${policy.partialDrawdownBps} bps`,
      description: "When Guards starts monitoring closely and then de-risking.",
      accent: "yellow" as const,
    },
    {
      label: "Full Exit -> Re-Entry",
      value: `${policy.fullExitDrawdownBps} / ${Math.abs(policy.reentryDrawdownBps)} bps`,
      description: "Emergency exit level and recovery needed before re-entry.",
      accent: "red" as const,
    },
    {
      label: "Oracle Guard",
      value: `${policy.maxStaleUs / 1_000_000}s / ${policy.maxConfidenceBps} bps`,
      description: "Freeze execution when data is stale or confidence is too wide.",
      accent: "green" as const,
    },
    {
      label: "Execution Haircut",
      value: `${(policy.haircutBps / 100).toFixed(1)}%`,
      description: "Safety discount applied before sizing and authorizing swaps.",
      accent: "default" as const,
    },
    {
      label: "Approved Route",
      value: policy.approvedRouteIds[0] ?? "—",
      description: "Current route allowlist used by the execution bucket.",
      accent: "default" as const,
    },
  ];

  const accentBorder: Record<string, string> = {
    accent: "border-accent/15",
    green: "border-green/15",
    yellow: "border-yellow/15",
    red: "border-red/15",
    default: "border-line",
  };

  const accentText: Record<string, string> = {
    accent: "text-accent",
    green: "text-green",
    yellow: "text-yellow",
    red: "text-red",
    default: "text-text",
  };

  return (
    <div className="glass-panel overflow-hidden">
      <div className="px-5 py-4 border-b border-line">
        <h3 className="text-sm font-semibold text-text">Policy Summary</h3>
        <p className="text-xs text-text-muted mt-1">
          What Guards protects, what triggers escalation, and what execution is allowed.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-px bg-line-soft">
        {cards.map((card) => (
          <div
            key={card.label}
            className={`bg-panel border p-4 space-y-1.5 hover:bg-panel-hover transition-colors ${accentBorder[card.accent]}`}
          >
            <p className="eyebrow">{card.label}</p>
            <p
              className={`text-lg font-bold font-mono ${accentText[card.accent]}`}
            >
              {card.value}
            </p>
            <p className="text-[0.65rem] text-text-muted leading-relaxed">
              {card.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
