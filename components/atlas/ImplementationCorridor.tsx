"use client";

import type { ImplementationPlan } from "@/types";
import { CheckSquare, AlertTriangle, ChevronRight } from "lucide-react";

interface ImplementationCorridorProps {
  plan: ImplementationPlan;
}

export function ImplementationCorridor({ plan }: ImplementationCorridorProps) {
  const phases = plan.delivery_phases
    .split(/[\n,;]+/)
    .map((p) => p.trim())
    .filter(Boolean);

  const milestones = plan.milestones
    .split(/[\n,;]+/)
    .map((m) => m.trim())
    .filter(Boolean);

  const risks = plan.known_risks
    .split(/[\n,;]+/)
    .map((r) => r.trim())
    .filter(Boolean);

  return (
    <div
      style={{
        background: "linear-gradient(135deg, var(--color-aubergine) 0%, #2A1B3D 100%)",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      {/* Zone header */}
      <div
        style={{
          padding: "1rem 1.5rem 0.85rem",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "9px",
              color: "rgba(255,255,255,0.3)",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: "3px",
            }}
          >
            Zone 04
          </div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "13px",
              fontWeight: 700,
              color: "white",
            }}
          >
            Implementation Corridor
          </div>
        </div>
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "12px",
            color: "var(--color-gold)",
            fontWeight: 600,
            maxWidth: "200px",
            textAlign: "right",
            lineHeight: 1.3,
          }}
        >
          {plan.plan_title}
        </div>
      </div>

      <div style={{ padding: "1.25rem 1.5rem" }}>
        {/* Phases route */}
        {phases.length > 0 && (
          <div style={{ marginBottom: "1.5rem" }}>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "9px",
                color: "rgba(255,255,255,0.3)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: "10px",
              }}
            >
              Delivery Phases
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
              {phases.map((phase, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <div
                    style={{
                      padding: "5px 12px",
                      borderRadius: "100px",
                      background: "rgba(39,76,255,0.2)",
                      border: "1px solid rgba(39,76,255,0.3)",
                      fontSize: "11px",
                      fontWeight: 600,
                      color: "#8BA5FF",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "9px",
                        color: "rgba(139,165,255,0.6)",
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {phase.length > 35 ? phase.slice(0, 35) + "…" : phase}
                  </div>
                  {i < phases.length - 1 && (
                    <ChevronRight size={12} style={{ color: "rgba(255,255,255,0.2)", flexShrink: 0 }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Milestones + Risks */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
          {milestones.length > 0 && (
            <div>
              <div
                style={{
                  fontSize: "9px",
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.35)",
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                  marginBottom: "8px",
                }}
              >
                Key Milestones
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                {milestones.slice(0, 5).map((m, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "7px" }}>
                    <CheckSquare size={11} style={{ color: "var(--color-green)", flexShrink: 0, marginTop: "2px" }} />
                    <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.65)", lineHeight: 1.4 }}>
                      {m}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {risks.length > 0 && (
            <div>
              <div
                style={{
                  fontSize: "9px",
                  fontWeight: 700,
                  color: "rgba(183,92,61,0.8)",
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                  marginBottom: "8px",
                }}
              >
                Risk Fractures
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                {risks.slice(0, 5).map((r, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "7px" }}>
                    <AlertTriangle size={11} style={{ color: "var(--color-clay)", flexShrink: 0, marginTop: "2px" }} />
                    <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.55)", lineHeight: 1.4 }}>
                      {r}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Timeline footer */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1.5rem",
            marginTop: "1.25rem",
            paddingTop: "1rem",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {[
            { label: "Timeline", value: plan.timeline_assumption },
            { label: "Budget Assumption", value: plan.budget_assumption },
          ].map(({ label, value }) => value ? (
            <div key={label}>
              <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "3px" }}>
                {label}
              </div>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>
                {value}
              </div>
            </div>
          ) : null)}
        </div>
      </div>
    </div>
  );
}
