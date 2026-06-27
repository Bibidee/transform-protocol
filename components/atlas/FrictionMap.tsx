"use client";

import type { TransformationCase, StakeholderSignal } from "@/types";
import { ShieldAlert, AlertTriangle, TrendingDown } from "lucide-react";

const RESISTANCE_COLOR: Record<string, string> = {
  NONE: "var(--color-green)",
  LOW: "var(--color-gold)",
  MODERATE: "var(--color-cobalt)",
  HIGH: "var(--color-clay)",
  BLOCKING: "#991b1b",
};

const RESISTANCE_WEIGHT: Record<string, number> = {
  NONE: 0, LOW: 1, MODERATE: 2, HIGH: 3, BLOCKING: 4,
};

function resistanceSorted(signals: StakeholderSignal[]): StakeholderSignal[] {
  return [...signals].sort(
    (a, b) =>
      (RESISTANCE_WEIGHT[b.resistance_level] ?? 0) -
      (RESISTANCE_WEIGHT[a.resistance_level] ?? 0)
  );
}

interface FrictionMapProps {
  caseData: TransformationCase;
}

export function FrictionMap({ caseData }: FrictionMapProps) {
  const sorted = resistanceSorted(caseData.signals);
  const hotspots = sorted.filter(
    (s) => s.resistance_level === "HIGH" || s.resistance_level === "BLOCKING"
  );
  const evidenceGaps = (() => {
    const submittedDomains = new Set(caseData.domains.map((d) => d.domain_name));
    const signalDomains = new Set(caseData.signals.map((s) => s.related_domain).filter(Boolean));
    return (["LEADERSHIP_ALIGNMENT", "INCENTIVE_ALIGNMENT", "CULTURE_READINESS", "DELIVERY_CAPACITY"] as const)
      .filter((d) => !submittedDomains.has(d) && !signalDomains.has(d))
      .map((d) => d.replace(/_/g, " "));
  })();

  return (
    <div
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: "12px",
        overflow: "hidden",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "1rem 1.25rem 0.85rem",
          borderBottom: "1px solid var(--color-border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: hotspots.length > 0 ? "rgba(183,92,61,0.04)" : undefined,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "9px",
              color: "var(--color-stone)",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: "3px",
            }}
          >
            Zone 03
          </div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "13px",
              fontWeight: 700,
              color: hotspots.length > 0 ? "var(--color-clay)" : "var(--color-aubergine)",
            }}
          >
            Friction Field
          </div>
        </div>
        {hotspots.length > 0 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              color: "var(--color-clay)",
              background: "var(--color-clay-light)",
              border: "1px solid rgba(183,92,61,0.2)",
              padding: "3px 8px",
              borderRadius: "6px",
            }}
          >
            <ShieldAlert size={10} />
            {hotspots.length} hotspot{hotspots.length > 1 ? "s" : ""}
          </div>
        )}
      </div>

      <div style={{ flex: 1, padding: "1rem 1.25rem", overflow: "auto" }}>
        {caseData.signals.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "2rem 0",
              color: "var(--color-stone)",
              fontSize: "12px",
              lineHeight: 1.6,
            }}
          >
            <TrendingDown size={24} style={{ color: "var(--color-border)", margin: "0 auto 8px" }} />
            No signals registered yet.
            <br />
            <span style={{ fontSize: "11px" }}>Add stakeholder signals to see resistance patterns.</span>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {/* Resistance hotspots */}
            {hotspots.length > 0 && (
              <div>
                <div
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    color: "var(--color-clay)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: "8px",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <ShieldAlert size={11} />
                  Resistance Hotspots
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {hotspots.map((sig) => (
                    <div
                      key={sig.signal_id}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "8px",
                        padding: "9px 10px",
                        borderRadius: "8px",
                        background: "rgba(183,92,61,0.06)",
                        border: "1px solid rgba(183,92,61,0.16)",
                        borderLeft: `3px solid ${RESISTANCE_COLOR[sig.resistance_level] ?? "var(--color-stone)"}`,
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--color-aubergine)", lineHeight: 1.3 }}>
                          {sig.title}
                        </div>
                        <div style={{ fontSize: "10px", color: "var(--color-stone)", marginTop: "2px" }}>
                          {sig.stakeholder_group}
                        </div>
                      </div>
                      <span
                        style={{
                          fontSize: "9px",
                          fontWeight: 700,
                          fontFamily: "var(--font-mono)",
                          color: RESISTANCE_COLOR[sig.resistance_level] ?? "var(--color-stone)",
                          whiteSpace: "nowrap",
                          flexShrink: 0,
                        }}
                      >
                        {sig.resistance_level}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* All signals */}
            <div>
              <div
                style={{
                  fontSize: "10px",
                  fontWeight: 600,
                  color: "var(--color-stone)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: "6px",
                }}
              >
                Signal Register
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                {sorted.map((sig) => (
                  <div
                    key={sig.signal_id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "8px",
                      padding: "6px 10px",
                      borderRadius: "6px",
                      background: "var(--color-surface-2)",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "11px",
                        color: "var(--color-ink)",
                        flex: 1,
                        minWidth: 0,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {sig.title}
                    </span>
                    <span
                      style={{
                        fontSize: "9px",
                        fontWeight: 700,
                        fontFamily: "var(--font-mono)",
                        color: RESISTANCE_COLOR[sig.resistance_level] ?? "var(--color-stone)",
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                      }}
                    >
                      {sig.resistance_level}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Evidence gaps */}
            {evidenceGaps.length > 0 && (
              <div
                style={{
                  padding: "10px 12px",
                  borderRadius: "8px",
                  background: "var(--color-lavender)",
                  border: "1px solid rgba(75,63,143,0.12)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    fontSize: "10px",
                    fontWeight: 700,
                    color: "var(--color-indigo)",
                    marginBottom: "6px",
                  }}
                >
                  <AlertTriangle size={11} />
                  Evidence Gaps
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                  {evidenceGaps.map((g) => (
                    <div key={g} style={{ fontSize: "11px", color: "var(--color-stone)" }}>
                      · {g}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
