"use client";

import type { TransformationCase } from "@/types";
import { latestVerdict } from "@/lib/mappers/contractMapper";
import { VERDICT_LABEL_META } from "@/lib/constants/verdictLabels";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";

interface MeridianNode {
  id: string;
  label: string;
  sublabel: string;
  status: "done" | "active" | "pending";
  color?: string;
}

function buildMeridian(caseData: TransformationCase): MeridianNode[] {
  const hasPlan = !!caseData.implementation_plan;
  const hasSignals = caseData.signals.length > 0;
  const hasEvidence = caseData.evidence.length > 0;
  const hasVerdict = caseData.verdicts.length > 0;
  const verdict = latestVerdict(caseData);
  const underReview = caseData.status === "UNDER_REVIEW";

  return [
    {
      id: "current",
      label: "Current State",
      sublabel: caseData.current_state || "Baseline defined",
      status: "done",
      color: "var(--color-cobalt)",
    },
    {
      id: "plan",
      label: "Implementation Route",
      sublabel: hasPlan ? caseData.implementation_plan!.plan_title : "Plan not registered",
      status: hasPlan ? "done" : caseData.status === "OPEN" ? "active" : "pending",
      color: "var(--color-cobalt)",
    },
    {
      id: "signals",
      label: "Stakeholder Signals",
      sublabel: hasSignals ? `${caseData.signals.length} signals registered` : "No signals yet",
      status: hasSignals ? "done" : hasPlan ? "active" : "pending",
      color: "var(--color-indigo)",
    },
    {
      id: "evidence",
      label: "Evidence Registry",
      sublabel: hasEvidence ? `${caseData.evidence.length} evidence items` : "No evidence yet",
      status: hasEvidence ? "done" : hasSignals ? "active" : "pending",
      color: "var(--color-gold)",
    },
    {
      id: "consensus",
      label: "Consensus Review",
      sublabel: underReview
        ? "GenLayer validators evaluating…"
        : hasVerdict
        ? `${caseData.verdicts.length} verdict${caseData.verdicts.length > 1 ? "s" : ""} issued`
        : "Not yet triggered",
      status: underReview ? "active" : hasVerdict ? "done" : "pending",
      color: underReview ? "var(--color-gold)" : "var(--color-gold)",
    },
    {
      id: "verdict",
      label: "Readiness Verdict",
      sublabel: verdict ? verdict.verdict_label.replace(/_/g, " ") : "Awaiting consensus",
      status: hasVerdict ? "done" : "pending",
      color: verdict ? VERDICT_LABEL_META[verdict.verdict_label]?.color : undefined,
    },
    {
      id: "target",
      label: "Target State",
      sublabel: caseData.target_state || "Target defined",
      status: hasVerdict && verdict?.verdict_label === "READY_TO_PROCEED" ? "done" : "pending",
      color: "var(--color-green)",
    },
  ];
}

export function TransformationSpine({ caseData }: { caseData: TransformationCase }) {
  const nodes = buildMeridian(caseData);

  return (
    <div
      style={{
        background: "var(--color-aubergine)",
        borderRadius: "12px",
        padding: "1.25rem",
        height: "100%",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "1.25rem" }}>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "9px",
            color: "rgba(255,255,255,0.3)",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: "4px",
          }}
        >
          Zone 01
        </div>
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "13px",
            fontWeight: 700,
            color: "white",
            letterSpacing: "-0.01em",
          }}
        >
          Movement Meridian
        </div>
      </div>

      {/* Route nodes */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        {nodes.map((node, i) => {
          const isLast = i === nodes.length - 1;
          const connectorColor =
            node.status === "done"
              ? "rgba(201,154,62,0.4)"
              : "rgba(255,255,255,0.08)";

          return (
            <div key={node.id} style={{ display: "flex", gap: "10px", position: "relative" }}>
              {/* Connector */}
              {!isLast && (
                <div
                  style={{
                    position: "absolute",
                    left: "11px",
                    top: "24px",
                    width: "2px",
                    height: "calc(100% - 4px)",
                    background: connectorColor,
                    borderRadius: "1px",
                  }}
                />
              )}

              {/* Node indicator */}
              <div style={{ flexShrink: 0, width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {node.status === "done" ? (
                  <CheckCircle2
                    size={16}
                    style={{ color: node.color ?? "var(--color-gold)" }}
                  />
                ) : node.status === "active" ? (
                  <div
                    style={{
                      width: "16px",
                      height: "16px",
                      borderRadius: "50%",
                      border: `2px solid ${node.color ?? "var(--color-cobalt)"}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    className="animate-pulse-cobalt"
                  >
                    {node.id === "consensus" ? (
                      <Loader2 size={8} style={{ color: node.color ?? "var(--color-gold)" }} className="animate-spin-slow" />
                    ) : (
                      <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: node.color ?? "var(--color-cobalt)" }} />
                    )}
                  </div>
                ) : (
                  <Circle size={14} style={{ color: "rgba(255,255,255,0.12)" }} />
                )}
              </div>

              {/* Content */}
              <div style={{ flex: 1, paddingBottom: isLast ? 0 : "18px", minWidth: 0 }}>
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    lineHeight: 1.3,
                    color:
                      node.status === "done"
                        ? node.color ?? "rgba(255,255,255,0.85)"
                        : node.status === "active"
                        ? node.color ?? "rgba(255,255,255,0.85)"
                        : "rgba(255,255,255,0.3)",
                  }}
                >
                  {node.label}
                </div>
                <div
                  style={{
                    fontSize: "10px",
                    color: node.status === "pending" ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.45)",
                    marginTop: "2px",
                    lineHeight: 1.4,
                    wordBreak: "break-word",
                  }}
                >
                  {node.sublabel}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
