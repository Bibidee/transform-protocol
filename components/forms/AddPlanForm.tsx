"use client";

import { useState } from "react";
import { planSchema } from "@/lib/validation/planSchema";
import { addImplementationPlan, buildTxState, idleTxState } from "@/lib/genlayer/contractService";
import { TransactionCommandBar } from "@/components/transaction/TransactionCommandBar";
import type { PlanFormData, TxState } from "@/types";

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

function Field({
  label, name, value, onChange, placeholder, multiline = true, rows = 3, hint, error,
}: {
  label: string; name: keyof PlanFormData; value: string;
  onChange: (n: keyof PlanFormData, v: string) => void;
  placeholder?: string; multiline?: boolean; rows?: number; hint?: string; error?: string;
}) {
  const sharedStyle = {
    width: "100%", padding: "0.6rem 0.75rem", borderRadius: "8px",
    border: `1px solid ${error ? "var(--color-clay)" : "var(--color-sand)"}`,
    background: "var(--color-glass)", fontFamily: "var(--font-body)",
    fontSize: "13px", color: "var(--color-ink)", outline: "none",
  };
  return (
    <div>
      <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--color-plum)", marginBottom: "0.35rem" }}>
        {label} <span style={{ color: "var(--color-clay)" }}>*</span>
      </label>
      {multiline
        ? <textarea rows={rows} value={value} onChange={e => onChange(name, e.target.value)} placeholder={placeholder} style={{ ...sharedStyle, resize: "vertical" }} />
        : <input type="text" value={value} onChange={e => onChange(name, e.target.value)} placeholder={placeholder} style={sharedStyle} />
      }
      {hint && !error && <p style={{ fontSize: "11px", color: "var(--color-stone)", marginTop: "0.2rem" }}>{hint}</p>}
      {error && <p style={{ fontSize: "11px", color: "var(--color-clay)", marginTop: "0.2rem" }}>{error}</p>}
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
    <div className="space-y-5">
      <Field label="Plan Title" name="plan_title" value={form.plan_title} onChange={setField} placeholder="e.g. AI Customer Support Rollout Plan — Phase 1 to 3" multiline={false} error={errors.plan_title} />
      <Field label="Transformation Objective" name="objective" value={form.objective} onChange={setField} placeholder="What does this plan aim to achieve?" error={errors.objective} />
      <Field label="Delivery Phases" name="delivery_phases" value={form.delivery_phases} onChange={setField} placeholder="Describe each phase (comma or line-separated). e.g. Phase 1: Pilot, Phase 2: Regional Expansion, Phase 3: Full Deployment" rows={3} hint="Separate phases with commas or new lines." error={errors.delivery_phases} />
      <Field label="Key Milestones" name="milestones" value={form.milestones} onChange={setField} placeholder="List the key milestones (comma or line-separated)" rows={3} hint="e.g. Agent training complete, pilot go-live, first adoption review" error={errors.milestones} />
      <Field label="Responsible Teams" name="responsible_teams" value={form.responsible_teams} onChange={setField} placeholder="e.g. IT transformation team, HR business partners, Customer Support leadership" rows={2} error={errors.responsible_teams} />
      <Field label="Dependency Map" name="dependency_map" value={form.dependency_map} onChange={setField} placeholder="What are the critical dependencies? Data migration, legacy system retirement, vendor delivery, regulatory sign-off…" rows={3} error={errors.dependency_map} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Training Approach" name="training_approach" value={form.training_approach} onChange={setField} placeholder="How will staff be trained?" rows={3} error={errors.training_approach} />
        <Field label="Communication Approach" name="communication_approach" value={form.communication_approach} onChange={setField} placeholder="How will change be communicated?" rows={3} error={errors.communication_approach} />
        <Field label="Governance Approach" name="governance_approach" value={form.governance_approach} onChange={setField} placeholder="How is this transformation governed?" rows={3} error={errors.governance_approach} />
        <Field label="Budget Assumption" name="budget_assumption" value={form.budget_assumption} onChange={setField} placeholder="e.g. £2.4M total; Phase 1 allocation £600K" rows={3} error={errors.budget_assumption} />
        <Field label="Timeline Assumption" name="timeline_assumption" value={form.timeline_assumption} onChange={setField} placeholder="e.g. 18 months. Phase 1: 6 months, Phase 2: 6 months, Phase 3: 6 months" rows={3} error={errors.timeline_assumption} />
        <Field label="Success Criteria" name="success_criteria" value={form.success_criteria} onChange={setField} placeholder="How will success be measured?" rows={3} error={errors.success_criteria} />
      </div>

      <Field label="Known Risks" name="known_risks" value={form.known_risks} onChange={setField} placeholder="What are the known implementation risks? (comma or line-separated)" rows={3} hint="e.g. Agent resistance, weak training ownership, unclear escalation process" error={errors.known_risks} />
      <Field label="Mitigation Plan" name="mitigation_plan" value={form.mitigation_plan} onChange={setField} placeholder="How are the known risks being mitigated?" rows={3} error={errors.mitigation_plan} />
      <Field label="Failure Conditions" name="failure_conditions" value={form.failure_conditions} onChange={setField} placeholder="Under what conditions should this transformation be paused or stopped?" rows={2} error={errors.failure_conditions} />

      <TransactionCommandBar tx={tx} />

      <button
        onClick={submit}
        disabled={submitting}
        style={{
          background: submitting ? "var(--color-sand)" : "var(--color-plum)",
          color: submitting ? "var(--color-stone)" : "white",
          fontWeight: 600, fontSize: "13px", padding: "0.6rem 1.5rem",
          borderRadius: "8px", cursor: submitting ? "not-allowed" : "pointer", width: "100%",
        }}
      >
        {submitting ? "Submitting to GenLayer…" : "Submit Implementation Plan"}
      </button>
    </div>
  );
}
