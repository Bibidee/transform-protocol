"use client";

import type { TransformationVerdict } from "@/types";
import { VERDICT_LABEL_META, RISK_LEVEL_COLORS, ALIGNMENT_COLORS, QUALITY_COLORS } from "@/lib/constants/verdictLabels";
import { ExplorerAuditLink } from "@/components/transaction/ExplorerAuditLink";
import { CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";

interface ReadinessVerdictCardProps {
  verdict: TransformationVerdict;
  round?: number;
  txHash?: string;
}

function AlignmentDot({ level }: { level: string }) {
  const color = ALIGNMENT_COLORS[level as keyof typeof ALIGNMENT_COLORS] ?? "#8492B4";
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "12px", color, fontWeight: 600 }}>
      <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: color, display: "inline-block", flexShrink: 0 }} />
      {level.charAt(0) + level.slice(1).toLowerCase()}
    </span>
  );
}

function SectionLabel({ text, color = "#1E0B3B" }: { text: string; color?: string }) {
  return (
    <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", fontWeight: 700, color, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "10px" }}>
      {text}
    </div>
  );
}

export function ReadinessVerdictCard({ verdict, round, txHash }: ReadinessVerdictCardProps) {
  const meta = VERDICT_LABEL_META[verdict.verdict_label] ?? VERDICT_LABEL_META.INSUFFICIENT_EVIDENCE;
  const implRiskColor = RISK_LEVEL_COLORS[verdict.implementation_risk] ?? "#8492B4";
  const adoptRiskColor = RISK_LEVEL_COLORS[verdict.adoption_risk] ?? "#8492B4";

  const verdictDate = (() => {
    try { return format(new Date(verdict.verdict_at), "d MMM yyyy, HH:mm"); }
    catch { return verdict.verdict_at; }
  })();

  return (
    <div style={{ borderRadius: "14px", overflow: "hidden", border: `1.5px solid ${meta.border}`, background: "#FFFFFF" }}>

      {/* Header */}
      <div style={{ padding: "1.25rem 1.5rem", background: meta.bg, borderBottom: `1px solid ${meta.border}` }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem" }}>
          <div style={{ flex: 1 }}>
            {round !== undefined && (
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "#8492B4", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "6px" }}>
                Verdict Round {round}
              </div>
            )}
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.35rem", fontWeight: 700, color: meta.color, lineHeight: 1.25, marginBottom: "4px" }}>
              {verdict.readiness_verdict}
            </h2>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: meta.color, opacity: 0.75, letterSpacing: "0.04em" }}>
              {verdict.verdict_label}
            </div>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "2.25rem", fontWeight: 700, color: meta.color, lineHeight: 1 }}>
              {verdict.confidence_score}%
            </div>
            <div style={{ fontSize: "10px", color: "#8492B4", marginTop: "2px", letterSpacing: "0.04em" }}>confidence</div>
          </div>
        </div>

        {/* Risk bands */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "14px" }}>
          {[["Implementation Risk", verdict.implementation_risk, implRiskColor], ["Adoption Risk", verdict.adoption_risk, adoptRiskColor]].map(([label, val, color]) => (
            <div key={label as string} style={{ padding: "10px 12px", borderRadius: "9px", background: "rgba(255,255,255,0.6)", border: "1px solid rgba(200,210,240,0.5)" }}>
              <div style={{ fontSize: "10px", color: "#8492B4", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "3px" }}>{label as string}</div>
              <div style={{ color: color as string, fontWeight: 700, fontSize: "13px" }}>{(val as string)?.replace(/_/g, "-") ?? "—"}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>

        {/* Reasoning */}
        <div>
          <SectionLabel text="Reasoning" color="#1E0B3B" />
          <p style={{ fontSize: "13.5px", color: "#0F172A", lineHeight: 1.65 }}>{verdict.short_reasoning}</p>
        </div>

        {/* Recommended action */}
        <div style={{ padding: "12px 14px", borderRadius: "10px", background: "rgba(212,144,10,0.06)", border: "1px solid rgba(212,144,10,0.2)" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "#D4900A", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>
            Recommended Next Action
          </div>
          <p style={{ fontSize: "13.5px", color: "#0F172A", fontWeight: 500, lineHeight: 1.6 }}>{verdict.recommended_next_action}</p>
        </div>

        {/* Alignment Assessment */}
        <div>
          <SectionLabel text="Alignment Assessment" color="#1E0B3B" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
            {[
              ["Leadership Alignment", verdict.leadership_alignment],
              ["Mid-Management", verdict.middle_management_alignment],
              ["Incentive Alignment", verdict.incentive_alignment],
              ["Culture Readiness", verdict.culture_readiness],
              ["Delivery Capacity", verdict.delivery_capacity],
              ["Timeline Realism", verdict.timeline_realism],
            ].map(([label, level]) => (
              <div key={label as string} style={{ padding: "10px 12px", borderRadius: "9px", background: "#F5F7FF", border: "1px solid #E8EDFF" }}>
                <div style={{ fontSize: "10px", color: "#8492B4", marginBottom: "5px", letterSpacing: "0.03em" }}>{label as string}</div>
                <AlignmentDot level={(level as string) ?? "ABSENT"} />
              </div>
            ))}
          </div>
        </div>

        {/* Quality */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
          {[
            ["Mitigation Quality", verdict.mitigation_quality],
            ["Evidence Quality", verdict.evidence_quality],
            ["Source Credibility", verdict.source_credibility],
          ].map(([label, level]) => {
            const c = QUALITY_COLORS[level as keyof typeof QUALITY_COLORS] ?? "#8492B4";
            return (
              <div key={label as string} style={{ padding: "10px 12px", borderRadius: "9px", background: "#F5F7FF", border: "1px solid #E8EDFF", textAlign: "center" }}>
                <div style={{ fontSize: "10px", color: "#8492B4", marginBottom: "5px", letterSpacing: "0.03em" }}>{label as string}</div>
                <div style={{ color: c, fontWeight: 700, fontSize: "12px" }}>{(level as string)?.replace(/_/g, "-") ?? "—"}</div>
              </div>
            );
          })}
        </div>

        {/* Key Blockers */}
        {verdict.key_blockers?.length > 0 && (
          <div>
            <SectionLabel text="Key Blockers" color="#C24B2A" />
            <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
              {verdict.key_blockers.map((b, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "13px", color: "#0F172A", lineHeight: 1.55 }}>
                  <XCircle size={14} style={{ color: "#C24B2A", flexShrink: 0, marginTop: "2px" }} />
                  {b}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Required Readiness Actions */}
        {verdict.required_readiness_actions?.length > 0 && (
          <div>
            <SectionLabel text="Required Readiness Actions" color="#1E0B3B" />
            <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
              {verdict.required_readiness_actions.map((a, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "13px", color: "#0F172A", lineHeight: 1.55 }}>
                  <CheckCircle size={14} style={{ color: "#2655FF", flexShrink: 0, marginTop: "2px" }} />
                  {a}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Follow-up Evidence */}
        {verdict.follow_up_evidence_needed?.length > 0 && (
          <div style={{ padding: "12px 14px", borderRadius: "10px", background: "#EEF1FF", border: "1px solid #C8D2F0" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "#5046E5", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>
              Follow-Up Evidence Needed
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              {verdict.follow_up_evidence_needed.map((f, i) => (
                <div key={i} style={{ fontSize: "12px", color: "#0F172A", lineHeight: 1.55 }}>· {f}</div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "12px", borderTop: "1px solid #E8EDFF" }}>
          <span style={{ fontSize: "11px", color: "#8492B4" }}>{verdictDate}</span>
          {txHash && <ExplorerAuditLink txHash={txHash} label="View on GenLayer Explorer" />}
        </div>
      </div>
    </div>
  );
}
