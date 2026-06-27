import type { VerdictLabel, RiskLevel, AlignmentLevel, QualityLevel } from "@/types";

export const VERDICT_LABEL_META: Record<VerdictLabel, {
  label: string;
  color: string;
  bg: string;
  border: string;
  icon: string;
  description: string;
}> = {
  READY_TO_PROCEED: {
    label: "Ready to Proceed",
    color: "#2F855A",
    bg: "rgba(47,133,90,0.08)",
    border: "rgba(47,133,90,0.25)",
    icon: "check-circle",
    description: "Evidence and signals indicate sufficient readiness for full rollout.",
  },
  READY_AFTER_READINESS_SPRINT: {
    label: "Ready After Readiness Sprint",
    color: "#C89B3C",
    bg: "rgba(200,155,60,0.08)",
    border: "rgba(200,155,60,0.25)",
    icon: "clock",
    description: "Ready to proceed after targeted readiness actions are completed.",
  },
  CONDITIONALLY_READY: {
    label: "Conditionally Ready",
    color: "#2457FF",
    bg: "rgba(36,87,255,0.08)",
    border: "rgba(36,87,255,0.20)",
    icon: "alert-circle",
    description: "Conditionally ready, subject to specific conditions being met.",
  },
  NOT_READY_REDESIGN_REQUIRED: {
    label: "Not Ready — Redesign Required",
    color: "#B65A3C",
    bg: "rgba(182,90,60,0.08)",
    border: "rgba(182,90,60,0.25)",
    icon: "x-circle",
    description: "Significant readiness gaps require programme redesign before proceeding.",
  },
  INSUFFICIENT_EVIDENCE: {
    label: "Insufficient Evidence",
    color: "#78716C",
    bg: "rgba(120,113,108,0.08)",
    border: "rgba(120,113,108,0.25)",
    icon: "help-circle",
    description: "Insufficient evidence to produce a defensible readiness verdict.",
  },
};

export const RISK_LEVEL_COLORS: Record<RiskLevel, string> = {
  LOW: "#2F855A",
  MEDIUM: "#C89B3C",
  MEDIUM_HIGH: "#B65A3C",
  HIGH: "#991b1b",
  CRITICAL: "#7f1d1d",
};

export const RISK_LEVEL_BG: Record<RiskLevel, string> = {
  LOW: "rgba(47,133,90,0.08)",
  MEDIUM: "rgba(200,155,60,0.10)",
  MEDIUM_HIGH: "rgba(182,90,60,0.10)",
  HIGH: "rgba(153,27,27,0.08)",
  CRITICAL: "rgba(127,29,29,0.10)",
};

export const ALIGNMENT_COLORS: Record<AlignmentLevel, string> = {
  STRONG: "#2F855A",
  MODERATE: "#C89B3C",
  PARTIAL: "#2457FF",
  WEAK: "#B65A3C",
  ABSENT: "#78716C",
};

export const QUALITY_COLORS: Record<QualityLevel, string> = {
  HIGH: "#2F855A",
  MEDIUM_HIGH: "#C89B3C",
  MEDIUM: "#2457FF",
  LOW: "#B65A3C",
  INSUFFICIENT: "#78716C",
};

export function formatRisk(r: RiskLevel | string): string {
  return (r || "").replace(/_/g, "-");
}

export function formatAlignment(a: AlignmentLevel | string): string {
  return (a || "").charAt(0).toUpperCase() + (a || "").slice(1).toLowerCase();
}
