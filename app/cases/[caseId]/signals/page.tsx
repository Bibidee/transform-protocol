"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { AddSignalForm } from "@/components/forms/AddSignalForm";
import { useWallet } from "@/lib/context/WalletContext";
import { getCase } from "@/lib/genlayer/contractService";
import type { TransformationCase } from "@/types";
import { ArrowLeft, Users, Plus, Loader2, ShieldAlert } from "lucide-react";

const RESISTANCE_COLOR: Record<string, string> = {
  NONE: "#1A7A4A", LOW: "#D4900A", MODERATE: "#2655FF", HIGH: "#C24B2A", BLOCKING: "#991b1b",
};
const RESISTANCE_BG: Record<string, string> = {
  NONE: "rgba(26,122,74,0.08)", LOW: "rgba(212,144,10,0.08)", MODERATE: "rgba(38,85,255,0.08)", HIGH: "rgba(194,75,42,0.08)", BLOCKING: "rgba(153,27,27,0.08)",
};

export default function SignalsPage() {
  const { caseId } = useParams<{ caseId: string }>();
  const { address } = useWallet();
  const [caseData, setCaseData] = useState<TransformationCase | null>(null);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);

  const load = async () => { setLoading(true); setCaseData(await getCase(caseId)); setLoading(false); };
  useEffect(() => { load(); }, [caseId]);

  const isOwner = address && caseData && caseData.owner.toLowerCase() === address.toLowerCase();

  return (
    <PageWrapper narrow>
      {/* Back */}
      <Link href={`/cases/${caseId}`} style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#8492B4", textDecoration: "none", marginBottom: "1.5rem" }}>
        <ArrowLeft size={13} /> Back to Case
      </Link>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", marginBottom: "1.75rem", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "34px", height: "34px", borderRadius: "9px", background: "linear-gradient(135deg, #2655FF 0%, #5046E5 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Users size={16} style={{ color: "#fff" }} />
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "#2655FF", textTransform: "uppercase", letterSpacing: "0.08em" }}>Zone 03 — Friction Field</div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", fontWeight: 700, color: "#1E0B3B", letterSpacing: "-0.01em" }}>Stakeholder Signals</h1>
          </div>
        </div>
        {isOwner && !formOpen && (
          <button onClick={() => setFormOpen(true)} style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            padding: "9px 18px", borderRadius: "9px",
            background: "#1E0B3B", color: "#fff",
            fontSize: "13px", fontWeight: 700, border: "none", cursor: "pointer",
            boxShadow: "0 3px 12px rgba(30,11,59,0.25)", whiteSpace: "nowrap",
          }}>
            <Plus size={14} /> Add Signal
          </button>
        )}
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "4rem 0", color: "#8492B4" }}>
          <Loader2 size={20} style={{ animation: "spinSlow 1s linear infinite" }} />
        </div>
      ) : !address ? (
        <div style={{ textAlign: "center", padding: "3rem", background: "#fff", border: "1.5px dashed #C8D2F0", borderRadius: "16px" }}>
          <p style={{ fontSize: "14px", color: "#4B5675", marginBottom: "1rem" }}>Connect your wallet to add stakeholder signals.</p>
        </div>
      ) : (
        <>
          {/* Add form */}
          {isOwner && formOpen && (
            <div style={{ background: "#fff", border: "1px solid #C8D2F0", borderRadius: "16px", padding: "1.5rem", marginBottom: "1.5rem", boxShadow: "0 2px 16px rgba(30,11,59,0.07)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", paddingBottom: "0.875rem", borderBottom: "1px solid #E8EDFF" }}>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1rem", color: "#1E0B3B" }}>New Stakeholder Signal</div>
                <button onClick={() => setFormOpen(false)} style={{ fontSize: "12px", color: "#8492B4", background: "none", border: "none", cursor: "pointer", padding: "4px 8px" }}>Cancel</button>
              </div>
              <AddSignalForm caseId={caseId} onSuccess={() => { setFormOpen(false); load(); }} />
            </div>
          )}

          {/* Signal list */}
          {!caseData || caseData.signals.length === 0 ? (
            <div style={{ textAlign: "center", padding: "4rem 2rem", background: "#fff", border: "1.5px dashed #C8D2F0", borderRadius: "18px" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "#EEF1FF", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
                <ShieldAlert size={22} style={{ color: "#2655FF" }} />
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 700, color: "#1E0B3B", marginBottom: "6px" }}>No signals registered yet</div>
              <p style={{ fontSize: "13px", color: "#8492B4", marginBottom: "1.25rem" }}>Stakeholder signals capture resistance patterns and readiness indicators across your organisation.</p>
              {isOwner && (
                <button onClick={() => setFormOpen(true)} style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "10px 20px", borderRadius: "9px", background: "linear-gradient(135deg, #2655FF 0%, #5046E5 100%)", color: "#fff", fontSize: "13px", fontWeight: 700, border: "none", cursor: "pointer", boxShadow: "0 4px 14px rgba(38,85,255,0.3)" }}>
                  <Plus size={14} /> Add First Signal
                </button>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {caseData.signals.map(sig => (
                <div key={sig.signal_id} style={{ background: "#fff", border: "1px solid #C8D2F0", borderLeft: `4px solid ${RESISTANCE_COLOR[sig.resistance_level] ?? "#C8D2F0"}`, borderRadius: "12px", padding: "1rem 1.25rem", boxShadow: "0 1px 6px rgba(30,11,59,0.05)" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", marginBottom: "8px" }}>
                    <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "14px", color: "#1E0B3B", lineHeight: 1.3 }}>{sig.title}</h3>
                    <span style={{ padding: "3px 10px", borderRadius: "999px", fontSize: "10px", fontWeight: 700, fontFamily: "var(--font-mono)", background: RESISTANCE_BG[sig.resistance_level], border: `1px solid ${RESISTANCE_COLOR[sig.resistance_level]}44`, color: RESISTANCE_COLOR[sig.resistance_level], whiteSpace: "nowrap", flexShrink: 0 }}>
                      {sig.resistance_level}
                    </span>
                  </div>
                  <p style={{ fontSize: "13px", color: "#0F172A", lineHeight: 1.6, marginBottom: "10px" }}>{sig.readiness_implication}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {[sig.stakeholder_group, sig.signal_type, `Confidence: ${sig.confidence_level}`, sig.related_domain?.replace(/_/g, " ")].filter(Boolean).map(tag => (
                      <span key={tag} style={{ fontSize: "11px", color: "#4B5675", background: "#F5F7FF", border: "1px solid #C8D2F0", borderRadius: "6px", padding: "2px 8px", fontWeight: 500 }}>{tag}</span>
                    ))}
                  </div>
                  {sig.evidence_url && (
                    <a href={sig.evidence_url} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "4px", marginTop: "8px", fontSize: "12px", color: "#2655FF", fontWeight: 600, textDecoration: "none" }}>
                      Evidence URL →
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </PageWrapper>
  );
}
