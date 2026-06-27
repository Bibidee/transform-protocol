"use client";

import { useState } from "react";
import { evidenceSchema } from "@/lib/validation/evidenceSchema";
import { addEvidence, buildTxState, idleTxState } from "@/lib/genlayer/contractService";
import { TransactionCommandBar } from "@/components/transaction/TransactionCommandBar";
import type { EvidenceFormData, TxState, EvidenceCategory } from "@/types";
import { AlertTriangle } from "lucide-react";

const CATEGORIES: EvidenceCategory[] = [
  "TRANSFORMATION_ROADMAP", "PROJECT_CHARTER", "STAKEHOLDER_SURVEY",
  "IMPLEMENTATION_MEMO", "ANNUAL_REPORT", "AUDIT_FINDING", "GOVERNANCE_DOCUMENT",
  "TRAINING_PLAN", "COMMUNICATION_PLAN", "VENDOR_PROPOSAL", "ERP_ROLLOUT_RECORD",
  "AI_ADOPTION_FRAMEWORK", "CLOUD_MIGRATION_DOCUMENT", "PROCESS_MATURITY_REPORT",
  "PROCUREMENT_DOCUMENT", "POLICY_DOCUMENT", "CASE_STUDY", "SCENARIO_ANALYSIS", "OTHER",
];

const EVIDENCE_TYPES = [
  "Public Document", "Public Report", "Public Survey Summary", "Public Audit Finding",
  "Public Policy Document", "Public Annual Report", "Public Case Study",
  "Public Vendor Proposal", "Public Implementation Memo", "Public Project Charter",
  "Public Governance Document", "Public Research Paper", "Other Public Document",
];

const EMPTY: EvidenceFormData = {
  title: "", evidence_type: "", url: "", source_name: "",
  credibility_note: "", relevance_note: "", category: "OTHER",
};

interface AddEvidenceFormProps {
  caseId: string;
  onSuccess?: () => void;
}

export function AddEvidenceForm({ caseId, onSuccess }: AddEvidenceFormProps) {
  const [form, setForm] = useState<EvidenceFormData>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof EvidenceFormData, string>>>({});
  const [tx, setTx] = useState<TxState>(idleTxState());
  const [submitting, setSubmitting] = useState(false);

  const setField = (name: keyof EvidenceFormData, value: string) => {
    setForm(p => ({ ...p, [name]: value }));
    setErrors(p => ({ ...p, [name]: undefined }));
  };

  const submit = async () => {
    const result = evidenceSchema.safeParse(form);
    if (!result.success) {
      const fe: Partial<Record<keyof EvidenceFormData, string>> = {};
      for (const issue of result.error.issues) {
        const p = issue.path[0] as keyof EvidenceFormData;
        if (!fe[p]) fe[p] = issue.message;
      }
      setErrors(fe);
      return;
    }
    setSubmitting(true);
    setTx(buildTxState("signing"));
    try {
      const res = await addEvidence(caseId, form, s => setTx(buildTxState(s)));
      setTx(buildTxState("finalized", res.txHash));
      setForm(EMPTY);
      onSuccess?.();
    } catch (e) {
      setTx(buildTxState("error", null, e instanceof Error ? e.message : "Failed to add evidence"));
      setSubmitting(false);
    }
  };

  const inp = (name: keyof EvidenceFormData, label: string, placeholder?: string, multiline?: boolean) => (
    <div>
      <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--color-plum)", marginBottom: "0.35rem" }}>{label}</label>
      {multiline
        ? <textarea rows={2} value={form[name]} onChange={e => setField(name, e.target.value)} placeholder={placeholder}
            style={{ width: "100%", padding: "0.55rem 0.7rem", borderRadius: "8px", border: `1px solid ${errors[name] ? "var(--color-clay)" : "var(--color-sand)"}`, background: "var(--color-glass)", fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--color-ink)", resize: "vertical", outline: "none" }} />
        : <input type="text" value={form[name]} onChange={e => setField(name, e.target.value)} placeholder={placeholder}
            style={{ width: "100%", padding: "0.55rem 0.7rem", borderRadius: "8px", border: `1px solid ${errors[name] ? "var(--color-clay)" : "var(--color-sand)"}`, background: "var(--color-glass)", fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--color-ink)", outline: "none" }} />
      }
      {errors[name] && <p style={{ fontSize: "11px", color: "var(--color-clay)", marginTop: "0.2rem" }}>{errors[name]}</p>}
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Privacy warning */}
      <div className="flex items-start gap-2 px-4 py-3 rounded-lg"
        style={{ background: "var(--color-gold-light)", border: "1px solid rgba(200,155,60,0.25)" }}>
        <AlertTriangle size={14} style={{ color: "var(--color-gold)", flexShrink: 0, marginTop: "1px" }} />
        <p style={{ fontSize: "12px", color: "var(--color-ink)", lineHeight: 1.5 }}>
          <strong>Public URLs only.</strong> Do not submit confidential, private, or restricted organisational documents. Only submit URLs that are intentionally and permanently public. Evidence stored on-chain is immutable.
        </p>
      </div>

      {inp("title", "Evidence Title *", "e.g. AI Adoption Framework — Q1 2026 Public Release")}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--color-plum)", marginBottom: "0.35rem" }}>Evidence Type *</label>
          <select value={form.evidence_type} onChange={e => setField("evidence_type", e.target.value)}
            style={{ width: "100%", padding: "0.55rem 0.7rem", borderRadius: "8px", border: `1px solid ${errors.evidence_type ? "var(--color-clay)" : "var(--color-sand)"}`, background: "var(--color-glass)", fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--color-ink)", outline: "none" }}>
            <option value="">Select…</option>
            {EVIDENCE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          {errors.evidence_type && <p style={{ fontSize: "11px", color: "var(--color-clay)", marginTop: "0.2rem" }}>{errors.evidence_type}</p>}
        </div>
        <div>
          <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--color-plum)", marginBottom: "0.35rem" }}>Category *</label>
          <select value={form.category} onChange={e => setField("category", e.target.value as EvidenceCategory)}
            style={{ width: "100%", padding: "0.55rem 0.7rem", borderRadius: "8px", border: "1px solid var(--color-sand)", background: "var(--color-glass)", fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--color-ink)", outline: "none" }}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c.replace(/_/g, " ")}</option>)}
          </select>
        </div>
      </div>

      {inp("url", "Public Evidence URL *", "https://…")}
      {inp("source_name", "Source Name *", "e.g. McKinsey & Company, ONS, World Bank, Internal PMO")}
      {inp("credibility_note", "Source Credibility Note", "e.g. Published by the organisation's own PMO in March 2026", true)}
      {inp("relevance_note", "Relevance to Transformation Question *", "Why is this evidence relevant to the readiness assessment?", true)}

      <TransactionCommandBar tx={tx} />

      <button onClick={submit} disabled={submitting}
        style={{ background: submitting ? "var(--color-sand)" : "var(--color-plum)", color: submitting ? "var(--color-stone)" : "white",
          fontWeight: 600, fontSize: "13px", padding: "0.6rem 1.5rem", borderRadius: "8px", cursor: submitting ? "not-allowed" : "pointer", width: "100%" }}>
        {submitting ? "Submitting to GenLayer…" : "Register Evidence"}
      </button>
    </div>
  );
}
