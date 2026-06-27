"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { AddEvidenceForm } from "@/components/forms/AddEvidenceForm";
import { useWallet } from "@/lib/context/WalletContext";
import { getCase } from "@/lib/genlayer/contractService";
import type { TransformationCase } from "@/types";
import { ArrowLeft, Folder, Plus, Loader2, ExternalLink } from "lucide-react";
import { format } from "date-fns";

export default function EvidencePage() {
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
      <Link href={`/cases/${caseId}`} style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#8492B4", textDecoration: "none", marginBottom: "1.5rem" }}>
        <ArrowLeft size={13} /> Back to Case
      </Link>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", marginBottom: "1.75rem", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "34px", height: "34px", borderRadius: "9px", background: "linear-gradient(135deg, #D4900A 0%, #C24B2A 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Folder size={16} style={{ color: "#fff" }} />
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "#D4900A", textTransform: "uppercase", letterSpacing: "0.08em" }}>Zone — Evidence Layer</div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", fontWeight: 700, color: "#1E0B3B", letterSpacing: "-0.01em" }}>Evidence Registry</h1>
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
            <Plus size={14} /> Add Evidence
          </button>
        )}
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "4rem 0", color: "#8492B4" }}>
          <Loader2 size={20} style={{ animation: "spinSlow 1s linear infinite" }} />
        </div>
      ) : !address ? (
        <div style={{ textAlign: "center", padding: "3rem", background: "#fff", border: "1.5px dashed #C8D2F0", borderRadius: "16px" }}>
          <p style={{ fontSize: "14px", color: "#4B5675" }}>Connect your wallet to manage evidence.</p>
        </div>
      ) : (
        <>
          {/* Form */}
          {isOwner && formOpen && (
            <div style={{ background: "#fff", border: "1px solid #C8D2F0", borderRadius: "16px", padding: "1.5rem", marginBottom: "1.5rem", boxShadow: "0 2px 16px rgba(30,11,59,0.07)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", paddingBottom: "0.875rem", borderBottom: "1px solid #E8EDFF" }}>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1rem", color: "#1E0B3B" }}>Register Public Evidence</div>
                <button onClick={() => setFormOpen(false)} style={{ fontSize: "12px", color: "#8492B4", background: "none", border: "none", cursor: "pointer", padding: "4px 8px" }}>Cancel</button>
              </div>
              <AddEvidenceForm caseId={caseId} onSuccess={() => { setFormOpen(false); load(); }} />
            </div>
          )}

          {/* Empty state */}
          {!caseData || caseData.evidence.length === 0 ? (
            <div style={{ textAlign: "center", padding: "4rem 2rem", background: "#fff", border: "1.5px dashed #C8D2F0", borderRadius: "18px" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "#FFF4E6", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
                <Folder size={22} style={{ color: "#D4900A" }} />
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 700, color: "#1E0B3B", marginBottom: "6px" }}>No evidence submitted yet</div>
              <p style={{ fontSize: "13px", color: "#8492B4", marginBottom: "1.25rem", maxWidth: "360px", margin: "0 auto 1.25rem" }}>Evidence URLs are stored permanently on GenLayer and used by validators during consensus review.</p>
              {isOwner && (
                <button onClick={() => setFormOpen(true)} style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "10px 20px", borderRadius: "9px", background: "linear-gradient(135deg, #D4900A 0%, #C24B2A 100%)", color: "#fff", fontSize: "13px", fontWeight: 700, border: "none", cursor: "pointer", boxShadow: "0 4px 14px rgba(212,144,10,0.3)" }}>
                  <Plus size={14} /> Add First Evidence
                </button>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {caseData.evidence.map(ev => {
                const date = (() => { try { return format(new Date(ev.submitted_at), "d MMM yyyy"); } catch { return ev.submitted_at; } })();
                return (
                  <div key={ev.evidence_id} style={{ background: "#fff", border: "1px solid #C8D2F0", borderLeft: "4px solid #D4900A", borderRadius: "12px", padding: "1rem 1.25rem", boxShadow: "0 1px 6px rgba(30,11,59,0.05)" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", marginBottom: "8px" }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "5px" }}>
                          <span style={{ fontSize: "10px", fontFamily: "var(--font-mono)", fontWeight: 700, color: "#D4900A", background: "rgba(212,144,10,0.08)", border: "1px solid rgba(212,144,10,0.2)", padding: "2px 8px", borderRadius: "5px" }}>
                            {ev.category.replace(/_/g, " ")}
                          </span>
                          <span style={{ fontSize: "11px", color: "#8492B4" }}>{date}</span>
                        </div>
                        <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "14px", color: "#1E0B3B" }}>{ev.title}</h3>
                      </div>
                      <a href={ev.url} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#2655FF", fontWeight: 600, textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0 }}>
                        View <ExternalLink size={11} />
                      </a>
                    </div>
                    <p style={{ fontSize: "13px", color: "#0F172A", lineHeight: 1.6, marginBottom: "10px" }}>{ev.relevance_note}</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                      {[`Source: ${ev.source_name}`, ev.evidence_type].map(tag => (
                        <span key={tag} style={{ fontSize: "11px", color: "#4B5675", background: "#F5F7FF", border: "1px solid #C8D2F0", borderRadius: "6px", padding: "2px 8px", fontWeight: 500 }}>{tag}</span>
                      ))}
                    </div>
                    {ev.credibility_note && <p style={{ fontSize: "11px", color: "#8492B4", marginTop: "6px", fontStyle: "italic" }}>{ev.credibility_note}</p>}
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "#C8D2F0", marginTop: "8px" }}>
                      Hash: {ev.hash.slice(0, 20)}…
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </PageWrapper>
  );
}
