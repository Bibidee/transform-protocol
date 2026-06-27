"use client";

import type { TransformationVerdict } from "@/types";
import { VERDICT_LABEL_META, RISK_LEVEL_COLORS, ALIGNMENT_COLORS, QUALITY_COLORS } from "@/lib/constants/verdictLabels";
import { ExplorerAuditLink } from "@/components/transaction/ExplorerAuditLink";
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import { format } from "date-fns";

interface ReadinessVerdictCardProps {
  verdict: TransformationVerdict;
  round?: number;
  txHash?: string;
}

function AlignmentDot({ level }: { level: string }) {
  const color = ALIGNMENT_COLORS[level as keyof typeof ALIGNMENT_COLORS] ?? "var(--color-stone)";
  return (
    <span
      className="inline-flex items-center gap-1"
      style={{ fontSize: "12px", color, fontWeight: 500 }}
    >
      <span
        className="w-2 h-2 rounded-full"
        style={{ background: color }}
      />
      {level.charAt(0) + level.slice(1).toLowerCase()}
    </span>
  );
}

export function ReadinessVerdictCard({ verdict, round, txHash }: ReadinessVerdictCardProps) {
  const meta = VERDICT_LABEL_META[verdict.verdict_label] ?? VERDICT_LABEL_META.INSUFFICIENT_EVIDENCE;
  const implRiskColor = RISK_LEVEL_COLORS[verdict.implementation_risk] ?? "var(--color-stone)";
  const adoptRiskColor = RISK_LEVEL_COLORS[verdict.adoption_risk] ?? "var(--color-stone)";

  const verdictDate = (() => {
    try { return format(new Date(verdict.verdict_at), "d MMM yyyy, HH:mm"); }
    catch { return verdict.verdict_at; }
  })();

  return (
    <div
      className="rounded-2xl overflow-hidden animate-verdict"
      style={{
        border: `1px solid ${meta.border}`,
        background: "var(--color-glass)",
      }}
    >
      {/* Verdict header */}
      <div
        className="px-6 py-5"
        style={{ background: meta.bg, borderBottom: `1px solid ${meta.border}` }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            {round !== undefined && (
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "10px",
                  color: "var(--color-stone)",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                Verdict Round {round}
              </span>
            )}
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.5rem",
                fontWeight: 700,
                color: meta.color,
                lineHeight: 1.2,
                marginTop: "0.25rem",
              }}
            >
              {verdict.readiness_verdict}
            </h2>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                color: meta.color,
                opacity: 0.8,
                marginTop: "0.25rem",
                letterSpacing: "0.04em",
              }}
            >
              {verdict.verdict_label}
            </p>
          </div>
          <div className="text-right">
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "2.5rem",
                fontWeight: 700,
                color: meta.color,
                lineHeight: 1,
              }}
            >
              {verdict.confidence_score}%
            </div>
            <div style={{ fontSize: "11px", color: "var(--color-stone)", marginTop: "2px" }}>
              confidence
            </div>
          </div>
        </div>

        {/* Risk bands */}
        <div className="flex gap-4 mt-4">
          <div
            className="flex-1 px-3 py-2 rounded-lg"
            style={{
              background: "rgba(255,252,247,0.7)",
              border: "1px solid var(--color-sand)",
            }}
          >
            <div style={{ fontSize: "10px", color: "var(--color-stone)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Implementation Risk
            </div>
            <div style={{ color: implRiskColor, fontWeight: 600, fontSize: "13px", marginTop: "2px" }}>
              {verdict.implementation_risk?.replace(/_/g, "-") ?? "—"}
            </div>
          </div>
          <div
            className="flex-1 px-3 py-2 rounded-lg"
            style={{
              background: "rgba(255,252,247,0.7)",
              border: "1px solid var(--color-sand)",
            }}
          >
            <div style={{ fontSize: "10px", color: "var(--color-stone)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Adoption Risk
            </div>
            <div style={{ color: adoptRiskColor, fontWeight: 600, fontSize: "13px", marginTop: "2px" }}>
              {verdict.adoption_risk?.replace(/_/g, "-") ?? "—"}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-6 py-5 space-y-6">
        {/* Reasoning */}
        <div>
          <h4
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: "13px",
              color: "var(--color-plum)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "0.5rem",
            }}
          >
            Reasoning
          </h4>
          <p style={{ fontSize: "14px", color: "var(--color-ink)", lineHeight: 1.6 }}>
            {verdict.short_reasoning}
          </p>
        </div>

        {/* Recommended action */}
        <div
          className="px-4 py-3 rounded-xl"
          style={{
            background: "var(--color-gold-light)",
            border: "1px solid rgba(200,155,60,0.2)",
          }}
        >
          <div style={{ fontSize: "10px", color: "var(--color-gold)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>
            Recommended Next Action
          </div>
          <p style={{ fontSize: "14px", color: "var(--color-ink)", marginTop: "0.25rem", fontWeight: 500 }}>
            {verdict.recommended_next_action}
          </p>
        </div>

        {/* Alignment grid */}
        <div>
          <h4
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: "13px",
              color: "var(--color-plum)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "0.75rem",
            }}
          >
            Alignment Assessment
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              ["Leadership Alignment", verdict.leadership_alignment],
              ["Mid-Management", verdict.middle_management_alignment],
              ["Incentive Alignment", verdict.incentive_alignment],
              ["Culture Readiness", verdict.culture_readiness],
              ["Delivery Capacity", verdict.delivery_capacity],
              ["Timeline Realism", verdict.timeline_realism],
            ].map(([label, level]) => (
              <div
                key={label}
                className="px-3 py-2 rounded-lg"
                style={{
                  background: "var(--color-canvas)",
                  border: "1px solid var(--color-sand)",
                }}
              >
                <div style={{ fontSize: "10px", color: "var(--color-stone)", marginBottom: "3px" }}>
                  {label}
                </div>
                <AlignmentDot level={level ?? "ABSENT"} />
              </div>
            ))}
          </div>
        </div>

        {/* Quality assessment */}
        <div className="grid grid-cols-3 gap-3">
          {[
            ["Mitigation Quality", verdict.mitigation_quality, QUALITY_COLORS],
            ["Evidence Quality", verdict.evidence_quality, QUALITY_COLORS],
            ["Source Credibility", verdict.source_credibility, QUALITY_COLORS],
          ].map(([label, level]) => {
            const c = QUALITY_COLORS[level as keyof typeof QUALITY_COLORS] ?? "var(--color-stone)";
            return (
              <div
                key={label as string}
                className="px-3 py-2 rounded-lg text-center"
                style={{ background: "var(--color-canvas)", border: "1px solid var(--color-sand)" }}
              >
                <div style={{ fontSize: "10px", color: "var(--color-stone)", marginBottom: "4px" }}>
                  {label as string}
                </div>
                <div style={{ color: c, fontWeight: 600, fontSize: "12px" }}>
                  {(level as string)?.replace(/_/g, "-") ?? "—"}
                </div>
              </div>
            );
          })}
        </div>

        {/* Blockers */}
        {verdict.key_blockers?.length > 0 && (
          <div>
            <h4
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: "13px",
                color: "var(--color-clay)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: "0.5rem",
              }}
            >
              Key Blockers
            </h4>
            <ul className="space-y-1.5">
              {verdict.key_blockers.map((b, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2"
                  style={{ fontSize: "13px", color: "var(--color-ink)" }}
                >
                  <XCircle size={14} style={{ color: "var(--color-clay)", flexShrink: 0, marginTop: "2px" }} />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Required actions */}
        {verdict.required_readiness_actions?.length > 0 && (
          <div>
            <h4
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: "13px",
                color: "var(--color-plum)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: "0.5rem",
              }}
            >
              Required Readiness Actions
            </h4>
            <ul className="space-y-1.5">
              {verdict.required_readiness_actions.map((a, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2"
                  style={{ fontSize: "13px", color: "var(--color-ink)" }}
                >
                  <CheckCircle size={14} style={{ color: "var(--color-cobalt)", flexShrink: 0, marginTop: "2px" }} />
                  {a}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Follow-up evidence */}
        {verdict.follow_up_evidence_needed?.length > 0 && (
          <div
            className="px-4 py-3 rounded-xl"
            style={{
              background: "var(--color-lilac)",
              border: "1px solid rgba(33,20,45,0.1)",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                color: "var(--color-plum)",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: "0.5rem",
              }}
            >
              Follow-Up Evidence Needed
            </div>
            <ul className="space-y-1">
              {verdict.follow_up_evidence_needed.map((f, i) => (
                <li key={i} style={{ fontSize: "12px", color: "var(--color-ink)" }}>
                  · {f}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Footer */}
        <div
          className="flex items-center justify-between pt-3"
          style={{ borderTop: "1px solid var(--color-sand)" }}
        >
          <span style={{ fontSize: "11px", color: "var(--color-stone)" }}>
            {verdictDate}
          </span>
          {txHash && <ExplorerAuditLink txHash={txHash} label="View on GenLayer Explorer" />}
        </div>
      </div>
    </div>
  );
}
