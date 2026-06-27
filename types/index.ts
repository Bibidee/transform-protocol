// ============================================================
// Transform Protocol — Core Types
// ============================================================

export type CaseStatus =
  | "OPEN"
  | "UNDER_REVIEW"
  | "VERDICT_ISSUED";

export type VerdictLabel =
  | "READY_TO_PROCEED"
  | "READY_AFTER_READINESS_SPRINT"
  | "CONDITIONALLY_READY"
  | "NOT_READY_REDESIGN_REQUIRED"
  | "INSUFFICIENT_EVIDENCE";

export type RiskLevel = "LOW" | "MEDIUM" | "MEDIUM_HIGH" | "HIGH" | "CRITICAL";

export type AlignmentLevel = "STRONG" | "MODERATE" | "PARTIAL" | "WEAK" | "ABSENT";

export type QualityLevel = "HIGH" | "MEDIUM_HIGH" | "MEDIUM" | "LOW" | "INSUFFICIENT";

export type ContradictionLevel = "NONE" | "LOW" | "MODERATE" | "HIGH" | "IRRECONCILABLE";

// ============================================================
// Transformation Case
// ============================================================

export interface TransformationCase {
  case_id: string;
  title: string;
  organisation: string;
  industry: string;
  transformation_type: string;
  current_state: string;
  target_state: string;
  business_objective: string;
  scope: string;
  implementation_timeline: string;
  decision_deadline: string;
  stakeholder_groups: string;
  known_constraints: string;
  risk_hypothesis: string;
  evidence_summary: string;
  status: CaseStatus;
  owner: string;
  created_at: string;
  implementation_plan: ImplementationPlan | null;
  signals: StakeholderSignal[];
  domains: ReadinessDomain[];
  evidence: EvidenceRecord[];
  verdicts: TransformationVerdict[];
}

// ============================================================
// Implementation Plan
// ============================================================

export interface ImplementationPlan {
  plan_title: string;
  objective: string;
  delivery_phases: string;
  milestones: string;
  responsible_teams: string;
  dependency_map: string;
  training_approach: string;
  communication_approach: string;
  governance_approach: string;
  budget_assumption: string;
  timeline_assumption: string;
  success_criteria: string;
  known_risks: string;
  mitigation_plan: string;
  failure_conditions: string;
  added_at: string;
  added_by: string;
}

// ============================================================
// Stakeholder Signal
// ============================================================

export type ResistanceLevel = "NONE" | "LOW" | "MODERATE" | "HIGH" | "BLOCKING";
export type SignalConfidence = "LOW" | "MEDIUM" | "HIGH" | "VERY_HIGH";

export interface StakeholderSignal {
  signal_id: string;
  title: string;
  stakeholder_group: string;
  signal_type: string;
  readiness_implication: string;
  resistance_level: ResistanceLevel;
  confidence_level: SignalConfidence;
  evidence_url: string;
  source_credibility_note: string;
  related_domain: string;
  added_at: string;
  added_by: string;
}

// ============================================================
// Readiness Domain
// ============================================================

export type ReadinessDomainName =
  | "LEADERSHIP_ALIGNMENT"
  | "MIDDLE_MANAGEMENT_ALIGNMENT"
  | "STAKEHOLDER_RESISTANCE"
  | "INCENTIVE_ALIGNMENT"
  | "CULTURE_READINESS"
  | "PROCESS_MATURITY"
  | "DATA_READINESS"
  | "TECHNOLOGY_READINESS"
  | "TRAINING_READINESS"
  | "COMMUNICATION_READINESS"
  | "DELIVERY_CAPACITY";

export interface ReadinessDomain {
  domain_name: ReadinessDomainName;
  self_assessed_level: AlignmentLevel;
  evidence_url: string;
  notes: string;
  added_at: string;
  added_by: string;
}

// ============================================================
// Evidence
// ============================================================

export type EvidenceCategory =
  | "TRANSFORMATION_ROADMAP"
  | "PROJECT_CHARTER"
  | "STAKEHOLDER_SURVEY"
  | "IMPLEMENTATION_MEMO"
  | "ANNUAL_REPORT"
  | "AUDIT_FINDING"
  | "GOVERNANCE_DOCUMENT"
  | "TRAINING_PLAN"
  | "COMMUNICATION_PLAN"
  | "VENDOR_PROPOSAL"
  | "ERP_ROLLOUT_RECORD"
  | "AI_ADOPTION_FRAMEWORK"
  | "CLOUD_MIGRATION_DOCUMENT"
  | "PROCESS_MATURITY_REPORT"
  | "PROCUREMENT_DOCUMENT"
  | "POLICY_DOCUMENT"
  | "CASE_STUDY"
  | "SCENARIO_ANALYSIS"
  | "OTHER";

export interface EvidenceRecord {
  evidence_id: string;
  title: string;
  evidence_type: string;
  url: string;
  hash: string;
  source_name: string;
  credibility_note: string;
  relevance_note: string;
  related_signal_ids: string[];
  related_plan_ids: string[];
  category: EvidenceCategory;
  submitted_at: string;
  submitter: string;
}

// ============================================================
// Transformation Verdict
// ============================================================

export interface TransformationVerdict {
  round: number;
  readiness_verdict: string;
  verdict_label: VerdictLabel;
  confidence_score: number;
  implementation_risk: RiskLevel;
  adoption_risk: RiskLevel;
  leadership_alignment: AlignmentLevel;
  middle_management_alignment: AlignmentLevel;
  incentive_alignment: AlignmentLevel;
  culture_readiness: AlignmentLevel;
  delivery_capacity: AlignmentLevel;
  timeline_realism: AlignmentLevel;
  mitigation_quality: QualityLevel;
  evidence_quality: QualityLevel;
  source_credibility: QualityLevel;
  contradiction_level: ContradictionLevel;
  recommended_next_action: string;
  key_blockers: string[];
  required_readiness_actions: string[];
  short_reasoning: string;
  supporting_evidence_ids: string[];
  contradictory_evidence_ids: string[];
  follow_up_evidence_needed: string[];
  verdict_at: string;
  triggered_by: string;
}

// ============================================================
// Protocol Stats
// ============================================================

export interface ProtocolStats {
  total_cases: number;
  total_verdicts: number;
  total_signals: number;
  total_evidence: number;
}

// ============================================================
// Transaction State
// ============================================================

export type TxStatus =
  | "idle"
  | "signing"
  | "pending"
  | "proposing"
  | "committing"
  | "revealing"
  | "accepted"
  | "finalized"
  | "error"
  | "cancelled";

export interface TxState {
  status: TxStatus;
  hash: `0x${string}` | null;
  error: string | null;
  explorerUrl: string | null;
}

// ============================================================
// Form Types
// ============================================================

export interface CaseFormData {
  title: string;
  organisation: string;
  industry: string;
  transformation_type: string;
  current_state: string;
  target_state: string;
  business_objective: string;
  scope: string;
  implementation_timeline: string;
  decision_deadline: string;
  stakeholder_groups: string;
  known_constraints: string;
  risk_hypothesis: string;
  evidence_summary: string;
}

export interface PlanFormData {
  plan_title: string;
  objective: string;
  delivery_phases: string;
  milestones: string;
  responsible_teams: string;
  dependency_map: string;
  training_approach: string;
  communication_approach: string;
  governance_approach: string;
  budget_assumption: string;
  timeline_assumption: string;
  success_criteria: string;
  known_risks: string;
  mitigation_plan: string;
  failure_conditions: string;
}

export interface SignalFormData {
  title: string;
  stakeholder_group: string;
  signal_type: string;
  readiness_implication: string;
  resistance_level: ResistanceLevel;
  confidence_level: SignalConfidence;
  evidence_url: string;
  source_credibility_note: string;
  related_domain: string;
}

export interface EvidenceFormData {
  title: string;
  evidence_type: string;
  url: string;
  source_name: string;
  credibility_note: string;
  relevance_note: string;
  category: EvidenceCategory;
}

export interface DomainFormData {
  domain_name: ReadinessDomainName;
  self_assessed_level: AlignmentLevel;
  evidence_url: string;
  notes: string;
}
