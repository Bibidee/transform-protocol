"use client";

import { useState } from "react";
import { addDomain, buildTxState, idleTxState } from "@/lib/genlayer/contractService";
import { TransactionCommandBar } from "@/components/transaction/TransactionCommandBar";
import { READINESS_DOMAINS } from "@/lib/constants/domains";
import { ALIGNMENT_COLORS } from "@/lib/constants/verdictLabels";
import type { DomainFormData, TxState, ReadinessDomainName, AlignmentLevel } from "@/types";

const LEVELS: AlignmentLevel[] = ["STRONG", "MODERATE", "PARTIAL", "WEAK", "ABSENT"];

interface AddDomainFormProps {
  caseId: string;
  existingDomains: string[];
  onSuccess?: () => void;
}

export function AddDomainForm({ caseId, existingDomains, onSuccess }: AddDomainFormProps) {
  const availableDomains = READINESS_DOMAINS.filter(d => !existingDomains.includes(d.name));
  const [selected, setSelected] = useState<ReadinessDomainName | "">("");
  const [level, setLevel] = useState<AlignmentLevel>("MODERATE");
  const [evidenceUrl, setEvidenceUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [tx, setTx] = useState<TxState>(idleTxState());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const selectedMeta = READINESS_DOMAINS.find(d => d.name === selected);

  const submit = async () => {
    if (!selected) { setError("Select a readiness domain"); return; }
    setError("");
    setSubmitting(true);
    setTx(buildTxState("signing"));
    const form: DomainFormData = {
      domain_name: selected as ReadinessDomainName,
      self_assessed_level: level,
      evidence_url: evidenceUrl,
      notes,
    };
    try {
      const res = await addDomain(caseId, form, s => setTx(buildTxState(s)));
      setTx(buildTxState("finalized", res.txHash));
      setSelected("");
      setNotes("");
      setEvidenceUrl("");
      onSuccess?.();
    } catch (e) {
      setTx(buildTxState("error", null, e instanceof Error ? e.message : "Failed to add domain"));
      setSubmitting(false);
    }
  };

  if (availableDomains.length === 0) {
    return (
      <div className="text-center py-8" style={{ color: "var(--color-stone)", fontSize: "13px" }}>
        All 11 readiness domains have been assessed.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--color-plum)", marginBottom: "0.35rem" }}>
          Readiness Domain *
        </label>
        <select value={selected} onChange={e => setSelected(e.target.value as ReadinessDomainName)}
          style={{ width: "100%", padding: "0.55rem 0.7rem", borderRadius: "8px", border: `1px solid ${error ? "var(--color-clay)" : "var(--color-sand)"}`, background: "var(--color-glass)", fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--color-ink)", outline: "none" }}>
          <option value="">Select a domain to assess…</option>
          {availableDomains.map(d => <option key={d.name} value={d.name}>{d.label}</option>)}
        </select>
        {error && <p style={{ fontSize: "11px", color: "var(--color-clay)", marginTop: "0.2rem" }}>{error}</p>}
      </div>

      {selectedMeta && (
        <div className="px-3 py-2.5 rounded-lg" style={{ background: "var(--color-lilac)", border: "1px solid rgba(33,20,45,0.1)" }}>
          <p style={{ fontSize: "12px", color: "var(--color-plum)", lineHeight: 1.5 }}>{selectedMeta.description}</p>
          <p style={{ fontSize: "11px", color: "var(--color-stone)", marginTop: "4px", fontStyle: "italic" }}>{selectedMeta.frictionIndicator}</p>
        </div>
      )}

      <div>
        <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--color-plum)", marginBottom: "0.5rem" }}>
          Self-Assessed Level
        </label>
        <div className="flex gap-2 flex-wrap">
          {LEVELS.map(lvl => {
            const color = ALIGNMENT_COLORS[lvl];
            const active = level === lvl;
            return (
              <button key={lvl} type="button" onClick={() => setLevel(lvl)}
                style={{ padding: "0.35rem 1rem", borderRadius: "8px", fontSize: "12px", fontWeight: 600, cursor: "pointer",
                  background: active ? color + "18" : "var(--color-canvas)",
                  border: `1px solid ${active ? color + "55" : "var(--color-sand)"}`,
                  color: active ? color : "var(--color-stone)" }}>
                {lvl.charAt(0) + lvl.slice(1).toLowerCase()}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--color-plum)", marginBottom: "0.35rem" }}>Evidence URL</label>
        <input type="text" value={evidenceUrl} onChange={e => setEvidenceUrl(e.target.value)} placeholder="https://…optional public evidence URL for this domain"
          style={{ width: "100%", padding: "0.55rem 0.7rem", borderRadius: "8px", border: "1px solid var(--color-sand)", background: "var(--color-glass)", fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--color-ink)", outline: "none" }} />
      </div>

      <div>
        <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--color-plum)", marginBottom: "0.35rem" }}>Assessment Notes</label>
        <textarea rows={3} value={notes} onChange={e => setNotes(e.target.value)} placeholder="What evidence or reasoning supports this self-assessment?"
          style={{ width: "100%", padding: "0.55rem 0.7rem", borderRadius: "8px", border: "1px solid var(--color-sand)", background: "var(--color-glass)", fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--color-ink)", resize: "vertical", outline: "none" }} />
      </div>

      <TransactionCommandBar tx={tx} />

      <button onClick={submit} disabled={submitting}
        style={{ background: submitting ? "var(--color-sand)" : "var(--color-plum)", color: submitting ? "var(--color-stone)" : "white",
          fontWeight: 600, fontSize: "13px", padding: "0.6rem 1.5rem", borderRadius: "8px", cursor: submitting ? "not-allowed" : "pointer", width: "100%" }}>
        {submitting ? "Submitting to GenLayer…" : "Register Domain Assessment"}
      </button>
    </div>
  );
}
