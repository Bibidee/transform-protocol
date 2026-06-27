"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { AddSignalForm } from "@/components/forms/AddSignalForm";
import { WalletConnect } from "@/components/wallet/WalletConnect";
import { useWallet } from "@/lib/context/WalletContext";
import { getCase } from "@/lib/genlayer/contractService";
import type { TransformationCase } from "@/types";
import { ArrowLeft, Users, Plus, Loader2, ChevronDown, ChevronUp } from "lucide-react";

const RESISTANCE_COLOR: Record<string, string> = {
  NONE: "var(--color-green)", LOW: "var(--color-gold)",
  MODERATE: "var(--color-cobalt)", HIGH: "var(--color-clay)", BLOCKING: "#991b1b",
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
    <PageWrapper>
      <Link href={`/cases/${caseId}`} className="inline-flex items-center gap-1.5 text-sm mb-6" style={{ color: "var(--color-stone)" }}>
        <ArrowLeft size={13} /> Back to Case
      </Link>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Users size={20} style={{ color: "var(--color-cobalt)" }} />
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", fontWeight: 700, color: "var(--color-plum)" }}>
            Stakeholder Signals
          </h1>
        </div>
        {isOwner && !formOpen && (
          <button onClick={() => setFormOpen(true)} className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium"
            style={{ background: "var(--color-plum)", color: "white" }}>
            <Plus size={14} /> Add Signal
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center gap-2 py-12 justify-center" style={{ color: "var(--color-stone)" }}>
          <Loader2 size={18} className="animate-spin-slow" />
        </div>
      ) : !address ? (
        <WalletConnect message="Connect wallet to add stakeholder signals." />
      ) : (
        <>
          {/* Add form */}
          {isOwner && formOpen && (
            <div className="rounded-2xl p-6 mb-6" style={{ background: "var(--color-glass)", border: "1px solid var(--color-sand)" }}>
              <div className="flex items-center justify-between mb-4">
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 600, color: "var(--color-plum)", fontSize: "15px" }}>
                  Add Stakeholder Signal
                </h3>
                <button onClick={() => setFormOpen(false)} style={{ fontSize: "12px", color: "var(--color-stone)" }}>Cancel</button>
              </div>
              <AddSignalForm caseId={caseId} onSuccess={() => { setFormOpen(false); load(); }} />
            </div>
          )}

          {/* Signal list */}
          {caseData?.signals.length === 0 ? (
            <div className="text-center py-16 rounded-2xl" style={{ background: "var(--color-glass)", border: "1px dashed var(--color-sand)" }}>
              <p style={{ fontSize: "13px", color: "var(--color-stone)" }}>No stakeholder signals submitted yet.</p>
              {isOwner && <button onClick={() => setFormOpen(true)} className="mt-3 text-sm" style={{ color: "var(--color-cobalt)" }}>Add first signal</button>}
            </div>
          ) : (
            <div className="space-y-3">
              {caseData?.signals.map(sig => (
                <div key={sig.signal_id} className="rounded-xl p-4" style={{ background: "var(--color-glass)", border: "1px solid var(--color-sand)" }}>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "14px", color: "var(--color-plum)" }}>
                      {sig.title}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold shrink-0"
                      style={{ background: RESISTANCE_COLOR[sig.resistance_level] + "15", border: `1px solid ${RESISTANCE_COLOR[sig.resistance_level]}44`, color: RESISTANCE_COLOR[sig.resistance_level] }}>
                      {sig.resistance_level}
                    </span>
                  </div>
                  <p style={{ fontSize: "13px", color: "var(--color-ink)", lineHeight: 1.5, marginBottom: "0.75rem" }}>
                    {sig.readiness_implication}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <span style={{ fontSize: "11px", color: "var(--color-stone)" }}>{sig.stakeholder_group}</span>
                    <span style={{ fontSize: "11px", color: "var(--color-stone)" }}>{sig.signal_type}</span>
                    <span style={{ fontSize: "11px", color: "var(--color-stone)" }}>Confidence: {sig.confidence_level}</span>
                    {sig.related_domain && <span style={{ fontSize: "11px", color: "var(--color-cobalt)" }}>{sig.related_domain.replace(/_/g, " ")}</span>}
                  </div>
                  {sig.evidence_url && (
                    <a href={sig.evidence_url} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-2 text-xs" style={{ color: "var(--color-cobalt)" }}>
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
