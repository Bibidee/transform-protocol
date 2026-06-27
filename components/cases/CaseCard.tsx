"use client";

import Link from "next/link";
import { CaseStatusBadge } from "./CaseStatus";
import { shortAddress } from "@/lib/genlayer/explorerUtils";
import { verdictLabelDisplay, latestVerdict } from "@/lib/mappers/contractMapper";
import { VERDICT_LABEL_META } from "@/lib/constants/verdictLabels";
import type { TransformationCase } from "@/types";
import { ArrowRight, Building2, Calendar } from "lucide-react";
import { format } from "date-fns";

interface CaseCardProps {
  caseData: TransformationCase;
  owned?: boolean;
}

const TYPE_COLOR: Record<string, string> = {
  "Digital Transformation": "var(--color-cobalt)",
  "AI Adoption": "var(--color-indigo)",
  "Process Transformation": "var(--color-green)",
  "Organisational Restructuring": "var(--color-clay)",
  "Cultural Transformation": "var(--color-gold)",
};

function typeColor(type: string): string {
  return TYPE_COLOR[type] ?? "var(--color-stone)";
}

export function CaseCard({ caseData, owned }: CaseCardProps) {
  const verdict = latestVerdict(caseData);
  const verdictMeta = verdict ? VERDICT_LABEL_META[verdict.verdict_label] : null;

  const createdDate = (() => {
    try {
      return format(new Date(caseData.created_at), "d MMM yyyy");
    } catch {
      return caseData.created_at;
    }
  })();

  const tc = typeColor(caseData.transformation_type);

  return (
    <Link
      href={`/cases/${caseData.case_id}`}
      className="group block"
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: "14px",
        borderLeft: `4px solid ${tc}`,
        overflow: "hidden",
        textDecoration: "none",
        display: "flex",
        flexDirection: "column",
        transition: "box-shadow 0.2s ease",
        boxShadow: "0 1px 3px rgba(15,23,42,0.04)",
      }}
    >
      <div style={{ padding: "1.25rem 1.25rem 1rem 1.1rem" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", marginBottom: "0.75rem" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "5px", flexWrap: "wrap" }}>
              <CaseStatusBadge status={caseData.status} />
              {owned && (
                <span
                  style={{
                    fontSize: "9px",
                    fontFamily: "var(--font-mono)",
                    color: "var(--color-gold)",
                    background: "var(--color-gold-light)",
                    border: "1px solid rgba(201,154,62,0.2)",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    letterSpacing: "0.04em",
                  }}
                >
                  YOURS
                </span>
              )}
            </div>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--color-aubergine)",
                fontWeight: 700,
                fontSize: "1rem",
                lineHeight: 1.25,
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {caseData.title}
            </h3>
          </div>
          <ArrowRight
            size={15}
            style={{
              color: "var(--color-line)",
              flexShrink: 0,
              marginTop: "6px",
              transition: "color 0.15s ease, transform 0.15s ease",
            }}
            className="group-hover:translate-x-0.5"
          />
        </div>

        {/* Meta */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "0.85rem" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "var(--color-stone)" }}>
            <Building2 size={10} />
            {caseData.organisation}
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "var(--color-stone)" }}>
            <Calendar size={10} />
            {createdDate}
          </span>
          <span
            style={{
              fontSize: "10px",
              fontWeight: 600,
              color: tc,
              background: `${tc}14`,
              border: `1px solid ${tc}28`,
              padding: "1px 7px",
              borderRadius: "4px",
            }}
          >
            {caseData.transformation_type}
          </span>
        </div>

        {/* Business objective */}
        <p
          style={{
            fontSize: "12px",
            color: "var(--color-stone)",
            lineHeight: 1.6,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {caseData.business_objective}
        </p>
      </div>

      {/* Verdict strip */}
      {verdict && verdictMeta ? (
        <div
          style={{
            margin: "0 1.1rem 1rem 1.1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "8px 12px",
            borderRadius: "8px",
            background: verdictMeta.bg,
            border: `1px solid ${verdictMeta.border}`,
          }}
        >
          <span style={{ fontSize: "11px", fontWeight: 700, color: verdictMeta.color }}>
            {verdictLabelDisplay(verdict.verdict_label)}
          </span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: verdictMeta.color }}>
            {verdict.confidence_score}% confidence
          </span>
        </div>
      ) : (
        <div
          style={{
            margin: "0 1.1rem 1rem 1.1rem",
            padding: "6px 12px",
            borderRadius: "8px",
            background: "var(--color-aubergine-light)",
            border: "1px solid rgba(34,21,43,0.08)",
          }}
        >
          <span style={{ fontSize: "11px", color: "var(--color-stone)" }}>No verdict yet</span>
        </div>
      )}

      {/* Footer counters */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 1.25rem 10px 1.25rem",
          borderTop: "1px solid var(--color-border)",
          background: "var(--color-surface-2)",
        }}
      >
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--color-stone)" }}>
          {shortAddress(caseData.owner)}
        </span>
        <div style={{ display: "flex", gap: "12px" }}>
          <span style={{ fontSize: "10px", color: "var(--color-stone)" }}>
            {caseData.signals.length} signals
          </span>
          <span style={{ fontSize: "10px", color: "var(--color-stone)" }}>
            {caseData.evidence.length} evidence
          </span>
        </div>
      </div>
    </Link>
  );
}
