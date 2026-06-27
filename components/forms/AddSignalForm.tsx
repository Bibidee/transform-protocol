"use client";

import { useState } from "react";
import { signalSchema } from "@/lib/validation/signalSchema";
import { addSignal, buildTxState, idleTxState } from "@/lib/genlayer/contractService";
import { TransactionCommandBar } from "@/components/transaction/TransactionCommandBar";
import { SIGNAL_TYPES, STAKEHOLDER_GROUPS } from "@/lib/constants/config";
import { READINESS_DOMAINS } from "@/lib/constants/domains";
import type { SignalFormData, TxState } from "@/types";

const EMPTY: SignalFormData = {
  title: "",
  stakeholder_group: "",
  signal_type: "",
  readiness_implication: "",
  resistance_level: "NONE",
  confidence_level: "MEDIUM",
  evidence_url: "",
  source_credibility_note: "",
  related_domain: "",
};

interface AddSignalFormProps {
  caseId: string;
  onSuccess?: () => void;
}

export function AddSignalForm({ caseId, onSuccess }: AddSignalFormProps) {
  const [form, setForm] = useState<SignalFormData>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof SignalFormData, string>>>({});
  const [tx, setTx] = useState<TxState>(idleTxState());
  const [submitting, setSubmitting] = useState(false);

  const setField = (name: keyof SignalFormData, value: string) => {
    setForm(p => ({ ...p, [name]: value }));
    setErrors(p => ({ ...p, [name]: undefined }));
  };

  const submit = async () => {
    const result = signalSchema.safeParse(form);
    if (!result.success) {
      const fe: Partial<Record<keyof SignalFormData, string>> = {};
      for (const issue of result.error.issues) {
        const p = issue.path[0] as keyof SignalFormData;
        if (!fe[p]) fe[p] = issue.message;
      }
      setErrors(fe);
      return;
    }
    setSubmitting(true);
    setTx(buildTxState("signing"));
    try {
      const res = await addSignal(caseId, form, s => setTx(buildTxState(s)));
      setTx(buildTxState("finalized", res.txHash));
      setForm(EMPTY);
      onSuccess?.();
    } catch (e) {
      setTx(buildTxState("error", null, e instanceof Error ? e.message : "Failed to add signal"));
      setSubmitting(false);
    }
  };

  const input = (name: keyof SignalFormData, label: string, placeholder?: string, multiline?: boolean, rows = 2) => (
    <div>
      <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--color-plum)", marginBottom: "0.35rem" }}>
        {label}
      </label>
      {multiline
        ? <textarea rows={rows} value={form[name]} onChange={e => setField(name, e.target.value)} placeholder={placeholder}
            style={{ width: "100%", padding: "0.55rem 0.7rem", borderRadius: "8px", border: `1px solid ${errors[name] ? "var(--color-clay)" : "var(--color-sand)"}`, background: "var(--color-glass)", fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--color-ink)", resize: "vertical", outline: "none" }} />
        : <input type="text" value={form[name]} onChange={e => setField(name, e.target.value)} placeholder={placeholder}
            style={{ width: "100%", padding: "0.55rem 0.7rem", borderRadius: "8px", border: `1px solid ${errors[name] ? "var(--color-clay)" : "var(--color-sand)"}`, background: "var(--color-glass)", fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--color-ink)", outline: "none" }} />
      }
      {errors[name] && <p style={{ fontSize: "11px", color: "var(--color-clay)", marginTop: "0.2rem" }}>{errors[name]}</p>}
    </div>
  );

  const select = (name: keyof SignalFormData, label: string, options: string[], withEmpty = true) => (
    <div>
      <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--color-plum)", marginBottom: "0.35rem" }}>{label}</label>
      <select value={form[name]} onChange={e => setField(name, e.target.value)}
        style={{ width: "100%", padding: "0.55rem 0.7rem", borderRadius: "8px", border: `1px solid ${errors[name] ? "var(--color-clay)" : "var(--color-sand)"}`, background: "var(--color-glass)", fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--color-ink)", outline: "none" }}>
        {withEmpty && <option value="">Select…</option>}
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      {errors[name] && <p style={{ fontSize: "11px", color: "var(--color-clay)", marginTop: "0.2rem" }}>{errors[name]}</p>}
    </div>
  );

  return (
    <div className="space-y-4">
      {input("title", "Signal Title *", "e.g. Middle managers concerned about workload impact")}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {select("stakeholder_group", "Stakeholder Group *", STAKEHOLDER_GROUPS)}
        {select("signal_type", "Signal Type *", SIGNAL_TYPES)}
      </div>
      {input("readiness_implication", "Readiness Implication *", "What does this signal mean for transformation readiness?", true, 3)}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--color-plum)", marginBottom: "0.35rem" }}>Resistance Level</label>
          <div className="flex gap-1.5 flex-wrap">
            {(["NONE", "LOW", "MODERATE", "HIGH", "BLOCKING"] as const).map(lvl => {
              const colors: Record<string, string> = { NONE: "var(--color-green)", LOW: "var(--color-gold)", MODERATE: "var(--color-cobalt)", HIGH: "var(--color-clay)", BLOCKING: "#991b1b" };
              const active = form.resistance_level === lvl;
              return (
                <button key={lvl} type="button" onClick={() => setField("resistance_level", lvl)}
                  style={{ padding: "0.3rem 0.75rem", borderRadius: "6px", fontSize: "11px", fontWeight: 600,
                    background: active ? colors[lvl] + "18" : "var(--color-canvas)",
                    border: `1px solid ${active ? colors[lvl] + "55" : "var(--color-sand)"}`,
                    color: active ? colors[lvl] : "var(--color-stone)", cursor: "pointer" }}>
                  {lvl}
                </button>
              );
            })}
          </div>
        </div>
        <div>
          <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--color-plum)", marginBottom: "0.35rem" }}>Confidence Level</label>
          <div className="flex gap-1.5 flex-wrap">
            {(["LOW", "MEDIUM", "HIGH", "VERY_HIGH"] as const).map(lvl => {
              const active = form.confidence_level === lvl;
              return (
                <button key={lvl} type="button" onClick={() => setField("confidence_level", lvl)}
                  style={{ padding: "0.3rem 0.75rem", borderRadius: "6px", fontSize: "11px", fontWeight: 600,
                    background: active ? "var(--color-cobalt-light)" : "var(--color-canvas)",
                    border: `1px solid ${active ? "rgba(36,87,255,0.3)" : "var(--color-sand)"}`,
                    color: active ? "var(--color-cobalt)" : "var(--color-stone)", cursor: "pointer" }}>
                  {lvl.replace("_", " ")}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {input("evidence_url", "Evidence URL", "https://…public URL to supporting evidence for this signal")}
      {input("source_credibility_note", "Source Credibility Note", "e.g. Internal survey of 120 middle managers, conducted March 2026")}
      {select("related_domain", "Related Readiness Domain", READINESS_DOMAINS.map(d => d.name))}

      <TransactionCommandBar tx={tx} />

      <button onClick={submit} disabled={submitting}
        style={{ background: submitting ? "var(--color-sand)" : "var(--color-plum)", color: submitting ? "var(--color-stone)" : "white",
          fontWeight: 600, fontSize: "13px", padding: "0.6rem 1.5rem", borderRadius: "8px", cursor: submitting ? "not-allowed" : "pointer", width: "100%" }}>
        {submitting ? "Submitting to GenLayer…" : "Add Stakeholder Signal"}
      </button>
    </div>
  );
}
