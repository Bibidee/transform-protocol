"use client";

import { useState } from "react";
import { evidenceSchema } from "@/lib/validation/evidenceSchema";
import { addEvidence, buildTxState, idleTxState } from "@/lib/genlayer/contractService";
import { TransactionCommandBar } from "@/components/transaction/TransactionCommandBar";
import type { EvidenceFormData, TxState, EvidenceCategory } from "@/types";
import { AlertTriangle, Loader2 } from "lucide-react";

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

const INPUT_CSS = `
.ev-input {
  width: 100%; padding: 10px 14px; border-radius: 9px;
  border: 1.5px solid #C8D2F0; background: #FFFFFF;
  font-family: inherit; font-size: 13px; color: #0F172A;
  outline: none; transition: border-color 0.15s, box-shadow 0.15s; resize: vertical;
}
.ev-input::placeholder { color: #9AAABF; }
.ev-input:focus { border-color: #2655FF; box-shadow: 0 0 0 3px rgba(38,85,255,0.12); }
.ev-input.err { border-color: #C24B2A; background: #FFF8F6; }
`;

function Label({ text, required }: { text: string; required?: boolean }) {
  return (
    <label style={{ fontSize: "11px", fontWeight: 700, color: "#1E0B3B", letterSpacing: "0.06em", textTransform: "uppercase" as const, display: "block", marginBottom: "5px" }}>
      {text}{required && <span style={{ color: "#2655FF", marginLeft: "3px" }}>*</span>}
    </label>
  );
}

interface AddEvidenceFormProps { caseId: string; onSuccess?: () => void; }

export function AddEvidenceForm({ caseId, onSuccess }: AddEvidenceFormProps) {
  const [form, setForm] = useState<EvidenceFormData>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof EvidenceFormData, string>>>({});
  const [tx, setTx] = useState<TxState>(idleTxState());
  const [submitting, setSubmitting] = useState(false);

  const set = (name: keyof EvidenceFormData, value: string) => {
    setForm(p => ({ ...p, [name]: value }));
    setErrors(p => ({ ...p, [name]: undefined }));
  };

  const submit = async () => {
    const result = evidenceSchema.safeParse(form);
    if (!result.success) {
      const fe: Partial<Record<keyof EvidenceFormData, string>> = {};
      for (const issue of result.error.issues) { const p = issue.path[0] as keyof EvidenceFormData; if (!fe[p]) fe[p] = issue.message; }
      setErrors(fe); return;
    }
    setSubmitting(true); setTx(buildTxState("signing"));
    try {
      const res = await addEvidence(caseId, form, s => setTx(buildTxState(s)));
      setTx(buildTxState("finalized", res.txHash));
      setForm(EMPTY); onSuccess?.();
    } catch (e) {
      setTx(buildTxState("error", null, e instanceof Error ? e.message : "Failed to add evidence"));
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
      <style>{INPUT_CSS}</style>

      {/* Warning */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", padding: "12px 14px", borderRadius: "10px", background: "rgba(212,144,10,0.07)", border: "1px solid rgba(212,144,10,0.25)" }}>
        <AlertTriangle size={14} style={{ color: "#D4900A", flexShrink: 0, marginTop: "1px" }} />
        <p style={{ fontSize: "12px", color: "#4B5675", lineHeight: 1.55 }}>
          <strong style={{ color: "#1E0B3B" }}>Public URLs only.</strong> Do not submit confidential, private, or restricted documents. Only submit URLs that are intentionally and permanently public. Evidence stored on-chain is immutable.
        </p>
      </div>

      {/* Title */}
      <div>
        <Label text="Evidence Title" required />
        <input type="text" value={form.title} onChange={e => set("title", e.target.value)} placeholder="e.g. McKinsey AI in Insurance Claims Report 2024" className={`ev-input${errors.title ? " err" : ""}`} />
        {errors.title && <p style={{ fontSize: "11px", color: "#C24B2A", fontWeight: 600, marginTop: "4px" }}>{errors.title}</p>}
      </div>

      {/* Type + Category */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div>
          <Label text="Evidence Type" required />
          <select value={form.evidence_type} onChange={e => set("evidence_type", e.target.value)} className={`ev-input${errors.evidence_type ? " err" : ""}`}>
            <option value="">Select…</option>
            {EVIDENCE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          {errors.evidence_type && <p style={{ fontSize: "11px", color: "#C24B2A", fontWeight: 600, marginTop: "4px" }}>{errors.evidence_type}</p>}
        </div>
        <div>
          <Label text="Category" required />
          <select value={form.category} onChange={e => set("category", e.target.value as EvidenceCategory)} className="ev-input">
            {CATEGORIES.map(c => <option key={c} value={c}>{c.replace(/_/g, " ")}</option>)}
          </select>
        </div>
      </div>

      {/* URL */}
      <div>
        <Label text="Public Evidence URL" required />
        <input type="text" value={form.url} onChange={e => set("url", e.target.value)} placeholder="https://…" className={`ev-input${errors.url ? " err" : ""}`} />
        {errors.url && <p style={{ fontSize: "11px", color: "#C24B2A", fontWeight: 600, marginTop: "4px" }}>{errors.url}</p>}
      </div>

      {/* Source name */}
      <div>
        <Label text="Source Name" required />
        <input type="text" value={form.source_name} onChange={e => set("source_name", e.target.value)} placeholder="e.g. McKinsey & Company, ONS, World Bank, Gartner" className={`ev-input${errors.source_name ? " err" : ""}`} />
        {errors.source_name && <p style={{ fontSize: "11px", color: "#C24B2A", fontWeight: 600, marginTop: "4px" }}>{errors.source_name}</p>}
      </div>

      {/* Credibility note */}
      <div>
        <Label text="Source Credibility Note" />
        <textarea rows={2} value={form.credibility_note} onChange={e => set("credibility_note", e.target.value)} placeholder="e.g. Published by McKinsey Global Institute, peer-reviewed, publicly accessible" className="ev-input" />
      </div>

      {/* Relevance */}
      <div>
        <Label text="Relevance to Transformation Question" required />
        <textarea rows={3} value={form.relevance_note} onChange={e => set("relevance_note", e.target.value)} placeholder="Why is this evidence relevant to the readiness assessment? What does it support or demonstrate?" className={`ev-input${errors.relevance_note ? " err" : ""}`} />
        {errors.relevance_note && <p style={{ fontSize: "11px", color: "#C24B2A", fontWeight: 600, marginTop: "4px" }}>{errors.relevance_note}</p>}
      </div>

      {tx.status !== "idle" && <TransactionCommandBar tx={tx} />}

      <button onClick={submit} disabled={submitting} style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px",
        background: submitting ? "#C8D2F0" : "linear-gradient(135deg, #D4900A 0%, #C24B2A 100%)",
        color: submitting ? "#8492B4" : "white",
        fontWeight: 700, fontSize: "13px", padding: "11px 0",
        borderRadius: "10px", cursor: submitting ? "not-allowed" : "pointer",
        width: "100%", border: "none",
        boxShadow: submitting ? "none" : "0 4px 16px rgba(212,144,10,0.3)",
      }}>
        {submitting ? <><Loader2 size={14} className="animate-spin-slow" /> Submitting to GenLayer…</> : "Register Evidence"}
      </button>
    </div>
  );
}
