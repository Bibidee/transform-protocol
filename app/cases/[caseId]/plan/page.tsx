"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { AddPlanForm } from "@/components/forms/AddPlanForm";
import { ImplementationCorridor } from "@/components/atlas/ImplementationCorridor";
import { WalletConnect } from "@/components/wallet/WalletConnect";
import { useWallet } from "@/lib/context/WalletContext";
import { getCase } from "@/lib/genlayer/contractService";
import type { TransformationCase } from "@/types";
import { ArrowLeft, FileText, Loader2 } from "lucide-react";

export default function PlanPage() {
  const { caseId } = useParams<{ caseId: string }>();
  const { address } = useWallet();
  const [caseData, setCaseData] = useState<TransformationCase | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => { setLoading(true); setCaseData(await getCase(caseId)); setLoading(false); };
  useEffect(() => { load(); }, [caseId]);

  const isOwner = address && caseData && caseData.owner.toLowerCase() === address.toLowerCase();

  return (
    <PageWrapper>
      <Link href={`/cases/${caseId}`} className="inline-flex items-center gap-1.5 text-sm mb-6" style={{ color: "var(--color-stone)" }}>
        <ArrowLeft size={13} /> Back to Case
      </Link>
      <div className="flex items-center gap-2 mb-2">
        <FileText size={20} style={{ color: "var(--color-cobalt)" }} />
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", fontWeight: 700, color: "var(--color-plum)" }}>
          Implementation Plan
        </h1>
      </div>
      <p style={{ color: "var(--color-stone)", fontSize: "13px", marginBottom: "2rem" }}>
        Submit the proposed transformation plan, phases, milestones, risks, and mitigation strategy.
      </p>

      {loading ? (
        <div className="flex items-center gap-2 py-12 justify-center" style={{ color: "var(--color-stone)" }}>
          <Loader2 size={18} className="animate-spin-slow" /> Loading…
        </div>
      ) : !address ? (
        <WalletConnect />
      ) : !isOwner ? (
        <div className="text-center py-12" style={{ color: "var(--color-stone)", fontSize: "13px" }}>
          Only the case owner can manage this case.
        </div>
      ) : caseData?.implementation_plan ? (
        <div>
          <div className="mb-4 px-4 py-2 rounded-lg" style={{ background: "var(--color-green-light)", border: "1px solid rgba(47,133,90,0.2)", fontSize: "13px", color: "var(--color-green)", fontWeight: 500 }}>
            Implementation plan submitted.
          </div>
          <ImplementationCorridor plan={caseData.implementation_plan} />
        </div>
      ) : (
        <div className="rounded-2xl p-6" style={{ background: "var(--color-glass)", border: "1px solid var(--color-sand)" }}>
          <AddPlanForm caseId={caseId} onSuccess={load} />
        </div>
      )}
    </PageWrapper>
  );
}
