"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import type { TransformationCase, ProtocolStats } from "@/types";
import {
  getCase,
  getAllCaseIds,
  getProtocolStats,
} from "@/lib/genlayer/contractService";

interface TransformState {
  cases: TransformationCase[];
  stats: ProtocolStats;
  loadingCases: boolean;
  refreshCases: () => Promise<void>;
  refreshCase: (caseId: string) => Promise<void>;
  getCachedCase: (caseId: string) => TransformationCase | undefined;
}

const TransformContext = createContext<TransformState>({
  cases: [],
  stats: { total_cases: 0, total_verdicts: 0, total_signals: 0, total_evidence: 0 },
  loadingCases: false,
  refreshCases: async () => {},
  refreshCase: async () => {},
  getCachedCase: () => undefined,
});

export function TransformProvider({ children }: { children: React.ReactNode }) {
  const [cases, setCases] = useState<TransformationCase[]>([]);
  const [stats, setStats] = useState<ProtocolStats>({
    total_cases: 0,
    total_verdicts: 0,
    total_signals: 0,
    total_evidence: 0,
  });
  const [loadingCases, setLoadingCases] = useState(false);

  const refreshCases = useCallback(async () => {
    const contractAddr = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";
    if (!contractAddr) return;

    setLoadingCases(true);
    try {
      const [ids, s] = await Promise.all([getAllCaseIds(), getProtocolStats()]);
      setStats(s);
      const fetched = await Promise.all(ids.map((id) => getCase(id)));
      setCases(fetched.filter(Boolean) as TransformationCase[]);
    } catch {
      // silent fail — UI handles empty state
    } finally {
      setLoadingCases(false);
    }
  }, []);

  const refreshCase = useCallback(async (caseId: string) => {
    const fresh = await getCase(caseId);
    if (!fresh) return;
    setCases((prev) => {
      const existing = prev.findIndex((c) => c.case_id === caseId);
      if (existing === -1) return [...prev, fresh];
      const next = [...prev];
      next[existing] = fresh;
      return next;
    });
  }, []);

  const getCachedCase = useCallback(
    (caseId: string) => cases.find((c) => c.case_id === caseId),
    [cases]
  );

  useEffect(() => {
    refreshCases();
  }, [refreshCases]);

  return (
    <TransformContext.Provider
      value={{ cases, stats, loadingCases, refreshCases, refreshCase, getCachedCase }}
    >
      {children}
    </TransformContext.Provider>
  );
}

export const useTransform = () => useContext(TransformContext);
