"use client";

import { useState } from "react";
import { planSchema } from "@/lib/validation/planSchema";
import { addImplementationPlan, buildTxState, idleTxState } from "@/lib/genlayer/contractService";
import { TransactionCommandBar } from "@/components/transaction/TransactionCommandBar";
import type { PlanFormData, TxState } from "@/types";
import { Loader2 } from "lucide-react";

const EMPTY: PlanFormData = {
  plan_title: "",
  objective: "",
  delivery_phases: "",
  milestones: "",
  responsible_teams: "",
  dependency_map: "",
  training_approach: "",
  communication_approach: "",
  governance_approach: "",
  budget_assumption: "",
  timeline_assumption: "",
  success_criteria: "",
  known_risks: "",
  mitigation_plan: "",
  failure_conditions: "",
};

const INPUT_CSS = `
.plan-input {
  width: 100%;
  padding: 10px 14px;
  border-radius: 9px;
  border: 1.5px solid #C8D2F0;
  background: #FFFFFF;
  font-family: inherit;
  font-size: 13px;
  color: #0F172A;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
  resize: vertical;
}
.plan-input::placeholder { color: #9AAABF; }
.plan-input:focus {
  border-color: #2655FF;
  box-shadow: 0 0 0 3px rgba(38,85,255,0.12);
}
.plan-input.error { border-color: #C24B2A; background: #FFF8F6; }
`;

function Field({
  label, name, value, onChange, placeholder, multiline = true,
  rows = 3, hint, error, required = true,
}: {
  label: string; name: keyof PlanFormData; value: string;
  onChange: (n: keyof PlanFormData, v: string) => void;
  placeholder?: string; multiline?: boolean; rows?: number;
  hint?: string; error?: string; required?: boolean;
}) {
  const cls = `plan-input${error ? " error" : ""}`;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
      <label style={{
        fontSize: "11px", fontWeight: 700, color: "#1E0B3B",
        letterSpacing: "0.06em", textTransform: "uppercase",
      }}>
        {label}
        {required && <span style={{ color: "#2655FF", marginLeft: "3px" }}>*</span>}
      </label>
      {multiline
        ? <textarea rows={rows} value={value} onChange={e => onChange(name, e.target.value)} placeholder={placeholder} className={cls} />
        : <input type="text" value={value} onChange={e => onChange(name, e.target.value)} placeholder={placeholder} className={cls} />
      }
      {hint && !error && <p style={{ fontSize: "11px", color: "#8492B4" }}>{hint}</p>}
      {error && <p style={{ fontSize: "11px", color: "#C24B2A", fontWeight: 600 }}>{error}</p>}
    </div>
  );
}

interface AddPlanFormProps {
  caseId: string;
  onSuccess?: () => void;
}

export function AddPlanForm({ caseId, onSuccess }: AddPlanFormProps) {
  const [form, setForm] = useState<PlanFormData>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof PlanFormData, string>>>({});
  const [tx, setTx] = useState<TxState>(idleTxState());
  const [submitting, setSubmitting] = useState(false);

  const setField = (name: keyof PlanFormData, value: string) => {
    setForm(p => ({ ...p, [name]: value }));
    setErrors(p => ({ ...p, [name]: undefined }));
  };

  const submit = async () => {
    const result = planSchema.safeParse(form);
    if (!result.success) {
      const fe: Partial<Record<keyof PlanFormData, string>> = {};
      for (const issue of result.error.issues) {
        const p = issue.path[0] as keyof PlanFormData;
        if (!fe[p]) fe[p] = issue.message;
      }
      setErrors(fe);
      return;
    }
    setSubmitting(true);
    setTx(buildTxState("signing"));
    try {
      const res = await addImplementationPlan(caseId, form, s => setTx(buildTxState(s)));
      setTx(buildTxState("finalized", res.txHash));
      onSuccess?.();
    } catch (e) {
      setTx(buildTxState("error", null, e instanceof Error ? e.message : "Failed to submit plan"));
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <style>{INPUT_CSS}</style>

      {/* Card: Core Plan */}
      <div style={{ background: "#fff", border: "1px solid #C8D2F0", borderRadius: "16px", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.1rem", boxShadow: "0 1px 8px rgba(30,11,59,0.05)" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "#2655FF", textTransform: "uppercase", letterSpacing: "0.08em", borderBottom: "1px solid #E8EDFF", paddingBottom: "0.75rem", marginBottom: "0.25rem" }}>
          Core Plan
        </div>
        <Field label="Plan Title" name="plan_title" value={form.plan_title} onChange={setField} placeholder="e.g. AI Claims Processing Rollout — Phase 1 to 3" multiline={false} error={errors.plan_title} />
        <Field label="Transformation Objective" name="objective" value={form.objective} onChange={setField} placeholder="What does this implementation plan aim to achieve?" rows={3} error={errors.objective} />
        <Field label="Delivery Phases" name="delivery_phases" value={form.delivery_phases} onChange={setField} placeholder="Phase 1: Pilot (3 months), Phase 2: Regional Expansion (6 months), Phase 3: Full Deployment (9 months)" rows={3} hint="Separate phases with commas or new lines." error={errors.delivery_phases} />
        <Field label="Key Milestones" name="milestones" value={form.milestones} onChange={setField} placeholder="e.g. AI model trained and validated, pilot go-live, first adoption review, full rollout sign-off" rows={3} hint="e.g. Agent training complete, pilot go-live, first adoption review" error={errors.milestones} />
        <Field label="Responsible Teams" name="responsible_teams" value={form.responsible_teams} onChange={setField} placeholder="e.g. IT transformation team, HR business partners, Customer Support leadership, Cognito AI vendor" rows={2} error={errors.responsible_teams} />
        <Field label="Dependency Map" name="dependency_map" value={form.dependency_map} onChange={setField} placeholder="e.g. Data migration from 3 legacy systems, FCA regulatory sign-off, vendor API integration, legacy system decommission freeze until 2026" rows={3} error={errors.dependency_map} />
      </div>

      {/* Card: Approach */}
      <div style={{ background: "#fff", border: "1px solid #C8D2F0", borderRadius: "16px", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.1rem", boxShadow: "0 1px 8px rgba(30,11,59,0.05)" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "#2655FF", textTransform: "uppercase", letterSpacing: "0.08em", borderBottom: "1px solid #E8EDFF", paddingBottom: "0.75rem", marginBottom: "0.25rem" }}>
          Approach & Assumptions
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <Field label="Training Approach" name="training_approach" value={form.training_approach} onChange={setField} placeholder="e.g. Role-based e-learning modules, 2-day adjuster workshops, train-the-trainer programme" rows={3} error={errors.training_approach} />
          <Field label="Communication Approach" name="communication_approach" value={form.communication_approach} onChange={setField} placeholder="e.g. Monthly all-hands updates, manager briefing packs, intranet change hub" rows={3} error={errors.communication_approach} />
          <Field label="Governance Approach" name="governance_approach" value={form.governance_approach} onChange={setField} placeholder="e.g. Transformation Steering Committee meets fortnightly, CTO sponsors, external change manager embedded" rows={3} error={errors.governance_approach} />
          <Field label="Budget Assumption" name="budget_assumption" value={form.budget_assumption} onChange={setField} placeholder="e.g. £4.2M total — Phase 1: £800K, Phase 2: £1.6M, Phase 3: £1.8M" rows={3} error={errors.budget_assumption} />
          <Field label="Timeline Assumption" name="timeline_assumption" value={form.timeline_assumption} onChange={setField} placeholder="e.g. 18 months total — Phase 1: 3 months, Phase 2: 6 months, Phase 3: 9 months" rows={3} error={errors.timeline_assumption} />
          <Field label="Success Criteria" name="success_criteria" value={form.success_criteria} onChange={setField} placeholder="e.g. 90% straight-through processing, claims cycle time under 48 hours, NPS +25 points, adjuster adoption above 80%" rows={3} error={errors.success_criteria} />
        </div>
      </div>

      {/* Card: Risk */}
      <div style={{ background: "#fff", border: "1px solid #C8D2F0", borderRadius: "16px", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.1rem", boxShadow: "0 1px 8px rgba(30,11,59,0.05)" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "#C24B2A", textTransform: "uppercase", letterSpacing: "0.08em", borderBottom: "1px solid #E8EDFF", paddingBottom: "0.75rem", marginBottom: "0.25rem" }}>
          Risk & Failure Conditions
        </div>
        <Field label="Known Risks" name="known_risks" value={form.known_risks} onChange={setField} placeholder="e.g. Adjuster resistance to AI tooling, data quality inconsistencies across 3 legacy systems, FCA approval delays" rows={3} hint="e.g. Agent resistance, weak training ownership, unclear escalation process" error={errors.known_risks} />
        <Field label="Mitigation Plan" name="mitigation_plan" value={form.mitigation_plan} onChange={setField} placeholder="e.g. Change champions embedded in each team, data cleansing sprint in Month 1, FCA pre-submission meetings booked" rows={3} error={errors.mitigation_plan} />
        <Field label="Failure Conditions" name="failure_conditions" value={form.failure_conditions} onChange={setField} placeholder="e.g. If adjuster adoption falls below 50% at 6-month review, or FCA approval not secured by Month 4, pause and replan" rows={2} error={errors.failure_conditions} />
      </div>

      {tx.status !== "idle" && <TransactionCommandBar tx={tx} />}

      <button onClick={submit} disabled={submitting} style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px",
        background: submitting ? "#C8D2F0" : "linear-gradient(135deg, #2655FF 0%, #5046E5 100%)",
        color: submitting ? "#8492B4" : "white",
        fontWeight: 700, fontSize: "13px", padding: "12px 0",
        borderRadius: "10px", cursor: submitting ? "not-allowed" : "pointer",
        width: "100%", border: "none",
        boxShadow: submitting ? "none" : "0 4px 18px rgba(38,85,255,0.3)",
      }}>
        {submitting ? <><Loader2 size={14} className="animate-spin-slow" /> Submitting to GenLayer…</> : "Submit Implementation Plan"}
      </button>
    </div>
  );
}
