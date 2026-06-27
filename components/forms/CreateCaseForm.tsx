"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { caseSchema } from "@/lib/validation/caseSchema";
import { createCase, buildTxState, idleTxState } from "@/lib/genlayer/contractService";
import { TransactionCommandBar } from "@/components/transaction/TransactionCommandBar";
import { INDUSTRIES, TRANSFORMATION_TYPES } from "@/lib/constants/config";
import type { CaseFormData, TxState } from "@/types";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";

const STEPS = [
  { id: "org",       label: "Organisation",    num: "01" },
  { id: "transform", label: "Transformation",  num: "02" },
  { id: "context",   label: "Context & Submit", num: "03" },
];

const EMPTY: CaseFormData = {
  title: "", organisation: "", industry: "", transformation_type: "",
  current_state: "", target_state: "", business_objective: "", scope: "",
  implementation_timeline: "", decision_deadline: "", stakeholder_groups: "",
  known_constraints: "", risk_hypothesis: "", evidence_summary: "",
};

/* Shared field wrapper */
function FieldWrap({ label, required, error, hint, children }: {
  label: string; required?: boolean; error?: string; hint?: string; children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
      <label style={{
        fontSize: "11px", fontWeight: 700, color: "#1E0B3B",
        letterSpacing: "0.06em", textTransform: "uppercase",
      }}>
        {label}{required && <span style={{ color: "#2655FF", marginLeft: "3px" }}>*</span>}
      </label>
      {children}
      {hint && !error && <p style={{ fontSize: "11px", color: "#8492B4" }}>{hint}</p>}
      {error && <p style={{ fontSize: "11px", color: "#C24B2A", fontWeight: 600 }}>{error}</p>}
    </div>
  );
}

/* Shared input CSS — rendered as a <style> tag so :focus works */
const INPUT_CSS = `
.tp-input {
  width: 100%;
  padding: 10px 14px;
  border-radius: 9px;
  border: 1.5px solid #C8D2F0;
  background: #FFFFFF;
  font-family: inherit;
  font-size: 14px;
  color: #0F172A;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
  appearance: auto;
}
.tp-input::placeholder { color: #9AAABF; }
.tp-input:focus {
  border-color: #2655FF;
  box-shadow: 0 0 0 3px rgba(38,85,255,0.13);
}
.tp-input.has-error { border-color: #C24B2A; background: #FFF8F6; }
.tp-input.has-error:focus { box-shadow: 0 0 0 3px rgba(194,75,42,0.12); }
`;

function Field({ label, name, value, onChange, placeholder, required, multiline, rows = 3, hint, error }: {
  label: string; name: keyof CaseFormData; value: string;
  onChange: (n: keyof CaseFormData, v: string) => void;
  placeholder?: string; required?: boolean; multiline?: boolean;
  rows?: number; hint?: string; error?: string;
}) {
  const cls = `tp-input${error ? " has-error" : ""}`;
  return (
    <FieldWrap label={label} required={required} error={error} hint={hint}>
      {multiline
        ? <textarea rows={rows} value={value} onChange={e => onChange(name, e.target.value)} placeholder={placeholder} className={cls} style={{ resize: "vertical" }} />
        : <input type="text" value={value} onChange={e => onChange(name, e.target.value)} placeholder={placeholder} className={cls} />
      }
    </FieldWrap>
  );
}

function SelectField({ label, name, value, onChange, options, required, error }: {
  label: string; name: keyof CaseFormData; value: string;
  onChange: (n: keyof CaseFormData, v: string) => void;
  options: string[]; required?: boolean; error?: string;
}) {
  const cls = `tp-input${error ? " has-error" : ""}`;
  return (
    <FieldWrap label={label} required={required} error={error}>
      <select value={value} onChange={e => onChange(name, e.target.value)} className={cls}>
        <option value="">Select…</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </FieldWrap>
  );
}

export function CreateCaseForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<CaseFormData>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof CaseFormData, string>>>({});
  const [tx, setTx] = useState<TxState>(idleTxState());
  const [submitting, setSubmitting] = useState(false);

  const setField = (name: keyof CaseFormData, value: string) => {
    setForm(p => ({ ...p, [name]: value }));
    setErrors(p => ({ ...p, [name]: undefined }));
  };

  const stepFields: (keyof CaseFormData)[][] = [
    ["title", "organisation", "industry", "transformation_type"],
    ["current_state", "target_state", "business_objective", "scope", "implementation_timeline", "decision_deadline"],
    ["stakeholder_groups", "risk_hypothesis", "evidence_summary"],
  ];

  const validateStep = (s: number): boolean => {
    const result = caseSchema.safeParse(form);
    if (result.success) return true;
    const fieldErrors: Partial<Record<keyof CaseFormData, string>> = {};
    for (const issue of result.error.issues) {
      const path = issue.path[0] as keyof CaseFormData;
      if (!fieldErrors[path]) fieldErrors[path] = issue.message;
    }
    const relevant: Partial<Record<keyof CaseFormData, string>> = {};
    for (const f of stepFields[s]) {
      if (fieldErrors[f]) relevant[f] = fieldErrors[f];
    }
    setErrors(relevant);
    return Object.keys(relevant).length === 0;
  };

  const next = () => { if (validateStep(step)) setStep(p => p + 1); };
  const back = () => setStep(p => p - 1);

  const submit = async () => {
    const result = caseSchema.safeParse(form);
    if (!result.success) {
      const fe: Partial<Record<keyof CaseFormData, string>> = {};
      for (const issue of result.error.issues) {
        const path = issue.path[0] as keyof CaseFormData;
        if (!fe[path]) fe[path] = issue.message;
      }
      setErrors(fe);
      return;
    }
    setSubmitting(true);
    setTx(buildTxState("signing"));
    try {
      const res = await createCase(form, status => setTx(buildTxState(status)));
      setTx(buildTxState("finalized", res.txHash));
      setTimeout(() => router.push(`/cases/${res.caseId}`), 1500);
    } catch (e) {
      setTx(buildTxState("error", null, e instanceof Error ? e.message : "Failed to create case"));
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Inject scoped CSS for inputs */}
      <style>{INPUT_CSS}</style>

      {/* Step indicator */}
      <div style={{
        display: "flex", gap: "4px", marginBottom: "1.75rem",
        background: "#FFFFFF", border: "1px solid #C8D2F0",
        borderRadius: "14px", padding: "4px",
        boxShadow: "0 1px 4px rgba(30,11,59,0.06)",
      }}>
        {STEPS.map((s, i) => {
          const done   = i < step;
          const active = i === step;
          return (
            <div key={s.id} style={{
              flex: 1, display: "flex", alignItems: "center", gap: "9px",
              padding: "10px 16px", borderRadius: "10px",
              background: active ? "#1E0B3B" : done ? "#EEF1FF" : "transparent",
              transition: "background 0.2s",
            }}>
              <div style={{
                width: "22px", height: "22px", borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                background: active ? "rgba(255,255,255,0.15)" : done ? "#2655FF" : "#C8D2F0",
              }}>
                {done
                  ? <Check size={11} style={{ color: "#fff" }} />
                  : <span style={{ fontFamily: "var(--font-mono)", fontSize: "9px", fontWeight: 700, color: active ? "#fff" : "#8492B4" }}>{s.num}</span>
                }
              </div>
              <span style={{ fontSize: "13px", fontWeight: 600, color: active ? "#fff" : done ? "#2655FF" : "#8492B4" }}>
                {s.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Form card */}
      <div style={{
        background: "#FFFFFF",
        border: "1px solid #C8D2F0",
        borderRadius: "18px",
        padding: "2rem 2.25rem",
        display: "flex", flexDirection: "column", gap: "1.4rem",
        boxShadow: "0 2px 16px rgba(30,11,59,0.07)",
      }}>
        {/* Step heading */}
        <div style={{ borderBottom: "1px solid #E8EDFF", paddingBottom: "1rem" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "#2655FF", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "4px" }}>
            Step {STEPS[step].num}
          </div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: 700, color: "#1E0B3B" }}>
            {step === 0 ? "Organisation & Type" : step === 1 ? "Movement Definition" : "Context & Evidence"}
          </div>
        </div>

        {/* Step 0 */}
        {step === 0 && <>
          <Field label="Dossier Title" name="title" value={form.title} onChange={setField} placeholder="e.g. AI Customer Support Readiness Assessment" required hint="A clear, descriptive title for this transformation dossier" error={errors.title} />
          <Field label="Organisation Name" name="organisation" value={form.organisation} onChange={setField} placeholder="e.g. Meridian Health Group" required error={errors.organisation} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.1rem" }}>
            <SelectField label="Industry" name="industry" value={form.industry} onChange={setField} options={INDUSTRIES} required error={errors.industry} />
            <SelectField label="Transformation Type" name="transformation_type" value={form.transformation_type} onChange={setField} options={TRANSFORMATION_TYPES} required error={errors.transformation_type} />
          </div>
        </>}

        {/* Step 1 */}
        {step === 1 && <>
          <Field label="Current State" name="current_state" value={form.current_state} onChange={setField} placeholder="Describe the organisation's current operating reality" required multiline rows={3} error={errors.current_state} />
          <Field label="Target State" name="target_state" value={form.target_state} onChange={setField} placeholder="Describe the desired future operating state" required multiline rows={3} error={errors.target_state} />
          <Field label="Movement Objective" name="business_objective" value={form.business_objective} onChange={setField} placeholder="What is the core business objective driving this transformation?" required multiline rows={3} error={errors.business_objective} />
          <Field label="Transformation Scope" name="scope" value={form.scope} onChange={setField} placeholder="What is in and out of scope?" required multiline rows={2} error={errors.scope} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.1rem" }}>
            <Field label="Implementation Timeline" name="implementation_timeline" value={form.implementation_timeline} onChange={setField} placeholder="e.g. 18 months" required error={errors.implementation_timeline} />
            <Field label="Decision Deadline" name="decision_deadline" value={form.decision_deadline} onChange={setField} placeholder="e.g. End of Q2 2026" required error={errors.decision_deadline} />
          </div>
        </>}

        {/* Step 2 */}
        {step === 2 && <>
          <Field label="Key Stakeholder Groups" name="stakeholder_groups" value={form.stakeholder_groups} onChange={setField} placeholder="e.g. Executive sponsors, middle management, frontline staff, IT team" required multiline rows={2} error={errors.stakeholder_groups} />
          <Field label="Known Constraints" name="known_constraints" value={form.known_constraints} onChange={setField} placeholder="Budget limits, regulatory constraints, legacy dependencies…" multiline rows={2} error={errors.known_constraints} />
          <Field label="Risk Hypothesis" name="risk_hypothesis" value={form.risk_hypothesis} onChange={setField} placeholder="What might cause this transformation to fail? What are the primary readiness risks?" required multiline rows={3} error={errors.risk_hypothesis} />
          <Field label="Evidence Summary" name="evidence_summary" value={form.evidence_summary} onChange={setField} placeholder="Briefly describe the public evidence you intend to submit — documents, surveys, reports, frameworks" required multiline rows={3} error={errors.evidence_summary} />
        </>}
      </div>

      {/* TX bar */}
      {tx.status !== "idle" && (
        <div style={{ marginTop: "1rem" }}>
          <TransactionCommandBar tx={tx} />
        </div>
      )}

      {/* Nav buttons */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.25rem" }}>
        {step > 0
          ? <button onClick={back} disabled={submitting} style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "10px 20px", borderRadius: "10px", border: "1.5px solid #C8D2F0", background: "#fff", color: "#4B5675", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
              <ArrowLeft size={14} /> Back
            </button>
          : <div />
        }
        {step < STEPS.length - 1
          ? <button onClick={next} style={{ display: "inline-flex", alignItems: "center", gap: "7px", padding: "11px 24px", borderRadius: "10px", background: "#1E0B3B", color: "#fff", fontSize: "13px", fontWeight: 700, cursor: "pointer", border: "none", boxShadow: "0 4px 14px rgba(30,11,59,0.25)" }}>
              Next <ArrowRight size={14} />
            </button>
          : <button onClick={submit} disabled={submitting} style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "11px 26px", borderRadius: "10px", background: submitting ? "#C8D2F0" : "linear-gradient(135deg, #2655FF 0%, #5046E5 100%)", color: submitting ? "#8492B4" : "#fff", fontSize: "13px", fontWeight: 700, cursor: submitting ? "not-allowed" : "pointer", border: "none", boxShadow: submitting ? "none" : "0 4px 18px rgba(38,85,255,0.35)" }}>
              {submitting ? <><Loader2 size={14} className="animate-spin-slow" /> Submitting…</> : "Open Transformation Dossier"}
            </button>
        }
      </div>
    </div>
  );
}
