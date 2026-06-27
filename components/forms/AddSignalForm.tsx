"use client";

import { useState } from "react";
import { signalSchema } from "@/lib/validation/signalSchema";
import { addSignal, buildTxState, idleTxState } from "@/lib/genlayer/contractService";
import { TransactionCommandBar } from "@/components/transaction/TransactionCommandBar";
import { SIGNAL_TYPES, STAKEHOLDER_GROUPS } from "@/lib/constants/config";
import { READINESS_DOMAINS } from "@/lib/constants/domains";
import type { SignalFormData, TxState } from "@/types";
import { Loader2 } from "lucide-react";

const EMPTY: SignalFormData = {
  title: "", stakeholder_group: "", signal_type: "", readiness_implication: "",
  resistance_level: "NONE", confidence_level: "MEDIUM",
  evidence_url: "", source_credibility_note: "", related_domain: "",
};

const INPUT_CSS = `
.sig-input {
  width: 100%; padding: 10px 14px; border-radius: 9px;
  border: 1.5px solid #C8D2F0; background: #FFFFFF;
  font-family: inherit; font-size: 13px; color: #0F172A;
  outline: none; transition: border-color 0.15s, box-shadow 0.15s; resize: vertical;
}
.sig-input::placeholder { color: #9AAABF; }
.sig-input:focus { border-color: #2655FF; box-shadow: 0 0 0 3px rgba(38,85,255,0.12); }
.sig-input.err { border-color: #C24B2A; }
`;

const RESISTANCE_COLORS: Record<string, string> = {
  NONE: "#1A7A4A", LOW: "#D4900A", MODERATE: "#2655FF", HIGH: "#C24B2A", BLOCKING: "#991b1b",
};

function Label({ children }: { children: React.ReactNode }) {
  return <label style={{ fontSize: "11px", fontWeight: 700, color: "#1E0B3B", letterSpacing: "0.06em", textTransform: "uppercase" as const, display: "block", marginBottom: "5px" }}>{children}</label>;
}
function Err({ msg }: { msg?: string }) {
  return msg ? <p style={{ fontSize: "11px", color: "#C24B2A", fontWeight: 600, marginTop: "4px" }}>{msg}</p> : null;
}
function Hint({ msg }: { msg?: string }) {
  return msg ? <p style={{ fontSize: "11px", color: "#8492B4", marginTop: "4px" }}>{msg}</p> : null;
}

interface AddSignalFormProps { caseId: string; onSuccess?: () => void; }

export function AddSignalForm({ caseId, onSuccess }: AddSignalFormProps) {
  const [form, setForm] = useState<SignalFormData>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof SignalFormData, string>>>({});
  const [tx, setTx] = useState<TxState>(idleTxState());
  const [submitting, setSubmitting] = useState(false);

  const set = (name: keyof SignalFormData, value: string) => {
    setForm(p => ({ ...p, [name]: value }));
    setErrors(p => ({ ...p, [name]: undefined }));
  };

  const submit = async () => {
    const result = signalSchema.safeParse(form);
    if (!result.success) {
      const fe: Partial<Record<keyof SignalFormData, string>> = {};
      for (const issue of result.error.issues) { const p = issue.path[0] as keyof SignalFormData; if (!fe[p]) fe[p] = issue.message; }
      setErrors(fe); return;
    }
    setSubmitting(true); setTx(buildTxState("signing"));
    try {
      const res = await addSignal(caseId, form, s => setTx(buildTxState(s)));
      setTx(buildTxState("finalized", res.txHash));
      setForm(EMPTY); onSuccess?.();
    } catch (e) {
      setTx(buildTxState("error", null, e instanceof Error ? e.message : "Failed to add signal"));
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
      <style>{INPUT_CSS}</style>

      {/* Title */}
      <div>
        <Label>Signal Title <span style={{ color: "#2655FF" }}>*</span></Label>
        <input type="text" value={form.title} onChange={e => set("title", e.target.value)} placeholder="e.g. Senior adjusters resistant to AI oversight tools" className={`sig-input${errors.title ? " err" : ""}`} />
        <Err msg={errors.title} />
      </div>

      {/* Group + Type */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div>
          <Label>Stakeholder Group <span style={{ color: "#2655FF" }}>*</span></Label>
          <select value={form.stakeholder_group} onChange={e => set("stakeholder_group", e.target.value)} className={`sig-input${errors.stakeholder_group ? " err" : ""}`}>
            <option value="">Select…</option>
            {STAKEHOLDER_GROUPS.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
          <Err msg={errors.stakeholder_group} />
        </div>
        <div>
          <Label>Signal Type <span style={{ color: "#2655FF" }}>*</span></Label>
          <select value={form.signal_type} onChange={e => set("signal_type", e.target.value)} className={`sig-input${errors.signal_type ? " err" : ""}`}>
            <option value="">Select…</option>
            {SIGNAL_TYPES.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
          <Err msg={errors.signal_type} />
        </div>
      </div>

      {/* Readiness implication */}
      <div>
        <Label>Readiness Implication <span style={{ color: "#2655FF" }}>*</span></Label>
        <textarea rows={3} value={form.readiness_implication} onChange={e => set("readiness_implication", e.target.value)} placeholder="What does this signal mean for transformation readiness?" className={`sig-input${errors.readiness_implication ? " err" : ""}`} />
        <Err msg={errors.readiness_implication} />
      </div>

      {/* Resistance level */}
      <div>
        <Label>Resistance Level</Label>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {(["NONE", "LOW", "MODERATE", "HIGH", "BLOCKING"] as const).map(lvl => {
            const active = form.resistance_level === lvl;
            const color = RESISTANCE_COLORS[lvl];
            return (
              <button key={lvl} type="button" onClick={() => set("resistance_level", lvl)} style={{
                padding: "6px 14px", borderRadius: "8px", fontSize: "11px", fontWeight: 700,
                background: active ? color + "18" : "#F5F7FF",
                border: `1.5px solid ${active ? color : "#C8D2F0"}`,
                color: active ? color : "#8492B4", cursor: "pointer",
              }}>{lvl}</button>
            );
          })}
        </div>
      </div>

      {/* Confidence level */}
      <div>
        <Label>Confidence Level</Label>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {(["LOW", "MEDIUM", "HIGH", "VERY_HIGH"] as const).map(lvl => {
            const active = form.confidence_level === lvl;
            return (
              <button key={lvl} type="button" onClick={() => set("confidence_level", lvl)} style={{
                padding: "6px 14px", borderRadius: "8px", fontSize: "11px", fontWeight: 700,
                background: active ? "rgba(38,85,255,0.1)" : "#F5F7FF",
                border: `1.5px solid ${active ? "#2655FF" : "#C8D2F0"}`,
                color: active ? "#2655FF" : "#8492B4", cursor: "pointer",
              }}>{lvl.replace("_", " ")}</button>
            );
          })}
        </div>
      </div>

      {/* Related domain */}
      <div>
        <Label>Related Readiness Domain</Label>
        <select value={form.related_domain} onChange={e => set("related_domain", e.target.value)} className="sig-input">
          <option value="">Select domain (optional)…</option>
          {READINESS_DOMAINS.map(d => <option key={d.name} value={d.name}>{d.name.replace(/_/g, " ")}</option>)}
        </select>
      </div>

      {/* Evidence URL */}
      <div>
        <Label>Evidence URL</Label>
        <input type="text" value={form.evidence_url} onChange={e => set("evidence_url", e.target.value)} placeholder="https://… public URL supporting this signal" className="sig-input" />
        <Hint msg="Must be a publicly accessible URL" />
      </div>

      {/* Credibility note */}
      <div>
        <Label>Source Credibility Note</Label>
        <input type="text" value={form.source_credibility_note} onChange={e => set("source_credibility_note", e.target.value)} placeholder="e.g. Internal survey of 120 adjusters, conducted June 2026" className="sig-input" />
      </div>

      {tx.status !== "idle" && <TransactionCommandBar tx={tx} />}

      <button onClick={submit} disabled={submitting} style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px",
        background: submitting ? "#C8D2F0" : "linear-gradient(135deg, #2655FF 0%, #5046E5 100%)",
        color: submitting ? "#8492B4" : "white",
        fontWeight: 700, fontSize: "13px", padding: "11px 0",
        borderRadius: "10px", cursor: submitting ? "not-allowed" : "pointer",
        width: "100%", border: "none",
        boxShadow: submitting ? "none" : "0 4px 16px rgba(38,85,255,0.3)",
      }}>
        {submitting ? <><Loader2 size={14} className="animate-spin-slow" /> Submitting to GenLayer…</> : "Add Stakeholder Signal"}
      </button>
    </div>
  );
}
