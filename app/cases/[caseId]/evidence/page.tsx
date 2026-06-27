"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { AddEvidenceForm } from "@/components/forms/AddEvidenceForm";
import { WalletConnect } from "@/components/wallet/WalletConnect";
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
    <PageWrapper>
      <Link href={`/cases/${caseId}`} className="inline-flex items-center gap-1.5 text-sm mb-6" style={{ color: "var(--color-stone)" }}>
        <ArrowLeft size={13} /> Back to Case
      </Link>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Folder size={20} style={{ color: "var(--color-cobalt)" }} />
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", fontWeight: 700, color: "var(--color-plum)" }}>
            Evidence Registry
          </h1>
        </div>
        {isOwner && !formOpen && (
          <button onClick={() => setFormOpen(true)} className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium"
            style={{ background: "var(--color-plum)", color: "white" }}>
            <Plus size={14} /> Add Evidence
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center gap-2 py-12 justify-center" style={{ color: "var(--color-stone)" }}>
          <Loader2 size={18} className="animate-spin-slow" />
        </div>
      ) : !address ? (
        <WalletConnect message="Connect wallet to manage evidence." />
      ) : (
        <>
          {isOwner && formOpen && (
            <div className="rounded-2xl p-6 mb-6" style={{ background: "var(--color-glass)", border: "1px solid var(--color-sand)" }}>
              <div className="flex items-center justify-between mb-4">
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 600, color: "var(--color-plum)", fontSize: "15px" }}>Register Public Evidence</h3>
                <button onClick={() => setFormOpen(false)} style={{ fontSize: "12px", color: "var(--color-stone)" }}>Cancel</button>
              </div>
              <AddEvidenceForm caseId={caseId} onSuccess={() => { setFormOpen(false); load(); }} />
            </div>
          )}

          {caseData?.evidence.length === 0 ? (
            <div className="text-center py-16 rounded-2xl" style={{ background: "var(--color-glass)", border: "1px dashed var(--color-sand)" }}>
              <p style={{ fontSize: "13px", color: "var(--color-stone)" }}>No evidence submitted yet.</p>
              {isOwner && <button onClick={() => setFormOpen(true)} className="mt-3 text-sm" style={{ color: "var(--color-cobalt)" }}>Add first evidence</button>}
            </div>
          ) : (
            <div className="space-y-3">
              {caseData?.evidence.map(ev => {
                const date = (() => { try { return format(new Date(ev.submitted_at), "d MMM yyyy"); } catch { return ev.submitted_at; } })();
                return (
                  <div key={ev.evidence_id} className="rounded-xl p-4" style={{ background: "var(--color-glass)", border: "1px solid var(--color-sand)" }}>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 rounded text-xs font-medium"
                            style={{ background: "var(--color-cobalt-light)", color: "var(--color-cobalt)", border: "1px solid rgba(36,87,255,0.15)", fontFamily: "var(--font-mono)", fontSize: "10px" }}>
                            {ev.category.replace(/_/g, " ")}
                          </span>
                          <span style={{ fontSize: "11px", color: "var(--color-stone)" }}>{date}</span>
                        </div>
                        <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "14px", color: "var(--color-plum)" }}>{ev.title}</h3>
                      </div>
                      <a href={ev.url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs shrink-0" style={{ color: "var(--color-cobalt)" }}>
                        View <ExternalLink size={11} />
                      </a>
                    </div>
                    <p style={{ fontSize: "12px", color: "var(--color-ink)", lineHeight: 1.5, marginBottom: "0.5rem" }}>{ev.relevance_note}</p>
                    <div className="flex flex-wrap gap-3">
                      <span style={{ fontSize: "11px", color: "var(--color-stone)" }}>Source: {ev.source_name}</span>
                      <span style={{ fontSize: "11px", color: "var(--color-stone)" }}>{ev.evidence_type}</span>
                    </div>
                    {ev.credibility_note && (
                      <p style={{ fontSize: "11px", color: "var(--color-stone)", marginTop: "4px", fontStyle: "italic" }}>{ev.credibility_note}</p>
                    )}
                    <div className="mt-2 flex items-center gap-1" style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--color-stone)" }}>
                      Hash: {ev.hash.slice(0, 18)}…
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
