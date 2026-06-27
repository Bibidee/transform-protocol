"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { ConsensusTheatre } from "@/components/atlas/ConsensusTheatre";
import { ReadinessVerdictCard } from "@/components/verdict/ReadinessVerdictCard";
import { useWallet } from "@/lib/context/WalletContext";
import { getCase } from "@/lib/genlayer/contractService";
import type { TransformationCase } from "@/types";
import { ArrowLeft, Zap, Loader2 } from "lucide-react";

export default function VerdictPage() {
  const { caseId } = useParams<{ caseId: string }>();
  const [caseData, setCaseData] = useState<TransformationCase | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => { setLoading(true); setCaseData(await getCase(caseId)); setLoading(false); };
  useEffect(() => { load(); }, [caseId]);

  return (
    <PageWrapper>
      <Link href={`/cases/${caseId}`} className="inline-flex items-center gap-1.5 text-sm mb-6" style={{ color: "var(--color-stone)" }}>
        <ArrowLeft size={13} /> Back to Case
      </Link>
      <div className="flex items-center gap-2 mb-6">
        <Zap size={20} style={{ color: "var(--color-gold)" }} />
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", fontWeight: 700, color: "var(--color-plum)" }}>
          Verdict Theatre
        </h1>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 py-12 justify-center" style={{ color: "var(--color-stone)" }}>
          <Loader2 size={18} className="animate-spin-slow" />
        </div>
      ) : !caseData ? (
        <p style={{ color: "var(--color-stone)", fontSize: "13px" }}>Case not found.</p>
      ) : (
        <div className="space-y-6">
          <ConsensusTheatre caseData={caseData} onVerdictIssued={load} />
          {caseData.verdicts.length > 0 && (
            <div>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 600, color: "var(--color-plum)", marginBottom: "1rem" }}>
                All Verdicts ({caseData.verdicts.length})
              </h2>
              <div className="space-y-4">
                {[...caseData.verdicts].reverse().map((v, i) => (
                  <ReadinessVerdictCard key={i} verdict={v} round={v.round} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </PageWrapper>
  );
}
