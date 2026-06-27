"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { AddDomainForm } from "@/components/forms/AddDomainForm";
import { ReadinessDomainOrbit } from "@/components/atlas/ReadinessDomainOrbit";
import { WalletConnect } from "@/components/wallet/WalletConnect";
import { useWallet } from "@/lib/context/WalletContext";
import { getCase } from "@/lib/genlayer/contractService";
import type { TransformationCase } from "@/types";
import { ArrowLeft, Layers, Plus, Loader2 } from "lucide-react";

export default function DomainsPage() {
  const { caseId } = useParams<{ caseId: string }>();
  const { address } = useWallet();
  const [caseData, setCaseData] = useState<TransformationCase | null>(null);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);

  const load = async () => { setLoading(true); setCaseData(await getCase(caseId)); setLoading(false); };
  useEffect(() => { load(); }, [caseId]);

  const isOwner = address && caseData && caseData.owner.toLowerCase() === address.toLowerCase();
  const existingDomains = caseData?.domains.map(d => d.domain_name) ?? [];

  return (
    <PageWrapper>
      <Link href={`/cases/${caseId}`} className="inline-flex items-center gap-1.5 text-sm mb-6" style={{ color: "var(--color-stone)" }}>
        <ArrowLeft size={13} /> Back to Case
      </Link>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Layers size={20} style={{ color: "var(--color-cobalt)" }} />
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", fontWeight: 700, color: "var(--color-plum)" }}>
            Readiness Domains
          </h1>
        </div>
        {isOwner && existingDomains.length < 11 && !formOpen && (
          <button onClick={() => setFormOpen(true)} className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium"
            style={{ background: "var(--color-plum)", color: "white" }}>
            <Plus size={14} /> Assess Domain
          </button>
        )}
      </div>

      <p style={{ fontSize: "13px", color: "var(--color-stone)", marginBottom: "1.5rem" }}>
        Self-assess each of the 11 readiness domains. These assessments provide GenLayer validators with structured context for the consensus review.
      </p>

      {loading ? (
        <div className="flex items-center gap-2 py-12 justify-center" style={{ color: "var(--color-stone)" }}>
          <Loader2 size={18} className="animate-spin-slow" />
        </div>
      ) : !address ? (
        <WalletConnect />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Atlas view */}
          <div>
            <ReadinessDomainOrbit domains={caseData?.domains ?? []} />
          </div>

          {/* Add form */}
          {isOwner && (
            <div>
              {formOpen ? (
                <div className="rounded-2xl p-6" style={{ background: "var(--color-glass)", border: "1px solid var(--color-sand)" }}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 600, color: "var(--color-plum)", fontSize: "15px" }}>
                      Assess Readiness Domain
                    </h3>
                    <button onClick={() => setFormOpen(false)} style={{ fontSize: "12px", color: "var(--color-stone)" }}>Cancel</button>
                  </div>
                  <AddDomainForm caseId={caseId} existingDomains={existingDomains}
                    onSuccess={() => { setFormOpen(false); load(); }} />
                </div>
              ) : (
                <div className="text-center py-12 rounded-2xl" style={{ background: "var(--color-glass)", border: "1px dashed var(--color-sand)" }}>
                  <p style={{ fontSize: "13px", color: "var(--color-stone)", marginBottom: "0.75rem" }}>
                    {existingDomains.length === 11
                      ? "All 11 domains assessed."
                      : `${11 - existingDomains.length} domain${11 - existingDomains.length !== 1 ? "s" : ""} remaining.`}
                  </p>
                  {existingDomains.length < 11 && (
                    <button onClick={() => setFormOpen(true)} className="text-sm" style={{ color: "var(--color-cobalt)" }}>
                      Assess next domain
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </PageWrapper>
  );
}
