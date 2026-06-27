"use client";

import { useState } from "react";
import { addDomain, buildTxState, idleTxState } from "@/lib/genlayer/contractService";
import { TransactionCommandBar } from "@/components/transaction/TransactionCommandBar";
import { READINESS_DOMAINS } from "@/lib/constants/domains";
import { ALIGNMENT_COLORS } from "@/lib/constants/verdictLabels";
import type { DomainFormData, TxState, ReadinessDomainName, AlignmentLevel } from "@/types";
import { Loader2 } from "lucide-react";

const LEVELS: AlignmentLevel[] = ["STRONG", "MODERATE", "PARTIAL", "WEAK", "ABSENT"];

const INPUT_CSS = `
.dom-input {
  width: 100%; padding: 10px 14px; border-radius: 9px;
  border: 1.5px solid #C8D2F0; background: #FFFFFF;
  font-family: inherit; font-size: 13px; color: #0F172A;
  outline: none; transition: border-color 0.15s, box-shadow 0.15s; resize: vertical;
}
.dom-input::placeholder { color: #9AAABF; }
.dom-input:focus { border-color: #5046E5; box-shadow: 0 0 0 3px rgba(80,70,229,0.12); }
.dom-input.err { border-color: #C24B2A; }
`;

function Label({ text, required }: { text: string; required?: boolean }) {
  return (
    <label style={{ fontSize: "11px", fontWeight: 700, color: "#1E0B3B", letterSpacing: "0.06em", textTransform: "uppercase" as const, display: "block", marginBottom: "5px" }}>
      {text}{required && <span style={{ color: "#5046E5", marginLeft: "3px" }}>*</span>}
    </label>
  );
}

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
      <div style={{ textAlign: "center", padding: "2rem", fontSize: "13px", color: "#8492B4" }}>
        All 11 readiness domains have been assessed.
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
      <style>{INPUT_CSS}</style>

      {/* Domain selector */}
      <div>
        <Label text="Readiness Domain" required />
        <select value={selected} onChange={e => { setSelected(e.target.value as ReadinessDomainName); setError(""); }}
          className={`dom-input${error ? " err" : ""}`}>
          <option value="">Select a domain to assess…</option>
          {availableDomains.map(d => <option key={d.name} value={d.name}>{d.label}</option>)}
        </select>
        {error && <p style={{ fontSize: "11px", color: "#C24B2A", fontWeight: 600, marginTop: "4px" }}>{error}</p>}
      </div>

      {/* Domain description */}
      {selectedMeta && (
        <div style={{ padding: "12px 14px", borderRadius: "10px", background: "#EEF1FF", border: "1px solid #C8D2F0" }}>
          <p style={{ fontSize: "12px", color: "#1E0B3B", lineHeight: 1.6, fontWeight: 500, marginBottom: "4px" }}>{selectedMeta.description}</p>
          <p style={{ fontSize: "11px", color: "#5046E5", fontStyle: "italic" }}>{selectedMeta.frictionIndicator}</p>
        </div>
      )}

      {/* Self-assessed level */}
      <div>
        <Label text="Self-Assessed Level" />
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {LEVELS.map(lvl => {
            const color = ALIGNMENT_COLORS[lvl];
            const active = level === lvl;
            return (
              <button key={lvl} type="button" onClick={() => setLevel(lvl)} style={{
                padding: "6px 14px", borderRadius: "8px", fontSize: "11px", fontWeight: 700,
                background: active ? color + "18" : "#F5F7FF",
                border: `1.5px solid ${active ? color : "#C8D2F0"}`,
                color: active ? color : "#8492B4", cursor: "pointer",
              }}>
                {lvl.charAt(0) + lvl.slice(1).toLowerCase()}
              </button>
            );
          })}
        </div>
      </div>

      {/* Evidence URL */}
      <div>
        <Label text="Evidence URL" />
        <input type="text" value={evidenceUrl} onChange={e => setEvidenceUrl(e.target.value)}
          placeholder="https://… optional public URL supporting this assessment"
          className="dom-input" />
      </div>

      {/* Notes */}
      <div>
        <Label text="Assessment Notes" />
        <textarea rows={3} value={notes} onChange={e => setNotes(e.target.value)}
          placeholder="What evidence or reasoning supports this self-assessment?"
          className="dom-input" />
      </div>

      {tx.status !== "idle" && <TransactionCommandBar tx={tx} />}

      <button onClick={submit} disabled={submitting} style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px",
        background: submitting ? "#C8D2F0" : "linear-gradient(135deg, #5046E5 0%, #2655FF 100%)",
        color: submitting ? "#8492B4" : "white",
        fontWeight: 700, fontSize: "13px", padding: "11px 0",
        borderRadius: "10px", cursor: submitting ? "not-allowed" : "pointer",
        width: "100%", border: "none",
        boxShadow: submitting ? "none" : "0 4px 16px rgba(80,70,229,0.3)",
      }}>
        {submitting ? <><Loader2 size={14} className="animate-spin-slow" /> Submitting to GenLayer…</> : "Register Domain Assessment"}
      </button>
    </div>
  );
}
