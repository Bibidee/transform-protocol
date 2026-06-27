import type {
  TransformationCase,
  TransformationVerdict,
  VerdictLabel,
} from "@/types";

export function safeParseCase(raw: unknown): TransformationCase | null {
  if (!raw || typeof raw !== "object") return null;
  const c = raw as Record<string, unknown>;
  return {
    case_id: String(c.case_id ?? ""),
    title: String(c.title ?? ""),
    organisation: String(c.organisation ?? ""),
    industry: String(c.industry ?? ""),
    transformation_type: String(c.transformation_type ?? ""),
    current_state: String(c.current_state ?? ""),
    target_state: String(c.target_state ?? ""),
    business_objective: String(c.business_objective ?? ""),
    scope: String(c.scope ?? ""),
    implementation_timeline: String(c.implementation_timeline ?? ""),
    decision_deadline: String(c.decision_deadline ?? ""),
    stakeholder_groups: String(c.stakeholder_groups ?? ""),
    known_constraints: String(c.known_constraints ?? ""),
    risk_hypothesis: String(c.risk_hypothesis ?? ""),
    evidence_summary: String(c.evidence_summary ?? ""),
    status: (c.status as TransformationCase["status"]) ?? "OPEN",
    owner: String(c.owner ?? ""),
    created_at: String(c.created_at ?? ""),
    implementation_plan: c.implementation_plan
      ? (c.implementation_plan as TransformationCase["implementation_plan"])
      : null,
    signals: Array.isArray(c.signals) ? c.signals : [],
    domains: Array.isArray(c.domains) ? c.domains : [],
    evidence: Array.isArray(c.evidence) ? c.evidence : [],
    verdicts: Array.isArray(c.verdicts) ? c.verdicts : [],
  } as TransformationCase;
}

export function latestVerdict(
  c: TransformationCase
): TransformationVerdict | null {
  if (!c.verdicts || c.verdicts.length === 0) return null;
  return c.verdicts[c.verdicts.length - 1];
}

export function verdictLabelDisplay(label: VerdictLabel | string): string {
  const map: Record<string, string> = {
    READY_TO_PROCEED: "Ready to Proceed",
    READY_AFTER_READINESS_SPRINT: "Ready After Sprint",
    CONDITIONALLY_READY: "Conditionally Ready",
    NOT_READY_REDESIGN_REQUIRED: "Redesign Required",
    INSUFFICIENT_EVIDENCE: "Insufficient Evidence",
  };
  return map[label] ?? label;
}

export function caseStatusDisplay(status: string): string {
  const map: Record<string, string> = {
    OPEN: "Open",
    UNDER_REVIEW: "Under Review",
    VERDICT_ISSUED: "Verdict Issued",
  };
  return map[status] ?? status;
}

export function canAddPlan(c: TransformationCase, walletAddress: string | null): boolean {
  return (
    !!walletAddress &&
    c.owner.toLowerCase() === walletAddress.toLowerCase() &&
    !c.implementation_plan
  );
}

export function canRequestConsensus(
  c: TransformationCase,
  walletAddress: string | null
): boolean {
  return (
    !!walletAddress &&
    c.owner.toLowerCase() === walletAddress.toLowerCase() &&
    !!c.implementation_plan &&
    c.signals.length >= 1 &&
    c.evidence.length >= 1 &&
    c.status !== "UNDER_REVIEW"
  );
}
