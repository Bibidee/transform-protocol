"use client";

import { getClientReady } from "./client";
import { waitForTxFinality } from "./txWaiter";
import { txExplorerUrl } from "./explorerUtils";
import type {
  TransformationCase,
  CaseFormData,
  PlanFormData,
  SignalFormData,
  EvidenceFormData,
  DomainFormData,
  ProtocolStats,
  TxState,
} from "@/types";
import type { StatusCallback } from "./txWaiter";

const addr = () =>
  (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "") as `0x${string}`;

// ============================================================
// Helpers
// ============================================================

function nowIso(): string {
  return new Date().toISOString();
}

async function sha256Hex(input: string): Promise<string> {
  if (typeof window === "undefined") return "0x" + "0".repeat(64);
  const data = new TextEncoder().encode(input);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return "0x" + Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}

function nanoid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// ============================================================
// Write: Create Transformation Case
// ============================================================

export async function createCase(
  form: CaseFormData,
  onStatus?: StatusCallback
): Promise<{ txHash: `0x${string}`; caseId: string; explorerUrl: string }> {
  const client = await getClientReady();
  const caseId = `case_${nanoid()}`;
  const packetJson = JSON.stringify({ ...form, created_at: nowIso() });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const txHash = await (client as any).sendTransaction({
    address: addr(),
    functionName: "create_case",
    args: [caseId, packetJson],
  });

  onStatus?.("pending");
  await waitForTxFinality(txHash as `0x${string}`, onStatus);

  return {
    txHash: txHash as `0x${string}`,
    caseId,
    explorerUrl: txExplorerUrl(txHash as string),
  };
}

// ============================================================
// Write: Add Implementation Plan
// ============================================================

export async function addImplementationPlan(
  caseId: string,
  form: PlanFormData,
  onStatus?: StatusCallback
): Promise<{ txHash: `0x${string}`; explorerUrl: string }> {
  const client = await getClientReady();
  const planJson = JSON.stringify({ ...form, added_at: nowIso() });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const txHash = await (client as any).sendTransaction({
    address: addr(),
    functionName: "add_implementation_plan",
    args: [caseId, planJson],
  });

  onStatus?.("pending");
  await waitForTxFinality(txHash as `0x${string}`, onStatus);

  return { txHash: txHash as `0x${string}`, explorerUrl: txExplorerUrl(txHash as string) };
}

// ============================================================
// Write: Add Stakeholder Signal
// ============================================================

export async function addSignal(
  caseId: string,
  form: SignalFormData,
  onStatus?: StatusCallback
): Promise<{ txHash: `0x${string}`; signalId: string; explorerUrl: string }> {
  const client = await getClientReady();
  const signalId = `sig_${nanoid()}`;
  const signalJson = JSON.stringify({ ...form, signal_id: signalId, added_at: nowIso() });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const txHash = await (client as any).sendTransaction({
    address: addr(),
    functionName: "add_signal",
    args: [caseId, signalId, signalJson],
  });

  onStatus?.("pending");
  await waitForTxFinality(txHash as `0x${string}`, onStatus);

  return {
    txHash: txHash as `0x${string}`,
    signalId,
    explorerUrl: txExplorerUrl(txHash as string),
  };
}

// ============================================================
// Write: Add Readiness Domain
// ============================================================

export async function addDomain(
  caseId: string,
  form: DomainFormData,
  onStatus?: StatusCallback
): Promise<{ txHash: `0x${string}`; explorerUrl: string }> {
  const client = await getClientReady();
  const domainJson = JSON.stringify({ ...form, added_at: nowIso() });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const txHash = await (client as any).sendTransaction({
    address: addr(),
    functionName: "add_domain",
    args: [caseId, form.domain_name, domainJson],
  });

  onStatus?.("pending");
  await waitForTxFinality(txHash as `0x${string}`, onStatus);

  return { txHash: txHash as `0x${string}`, explorerUrl: txExplorerUrl(txHash as string) };
}

// ============================================================
// Write: Add Evidence
// ============================================================

export async function addEvidence(
  caseId: string,
  form: EvidenceFormData,
  onStatus?: StatusCallback
): Promise<{ txHash: `0x${string}`; evidenceId: string; explorerUrl: string }> {
  const client = await getClientReady();
  const evidenceId = `ev_${nanoid()}`;
  const hash = await sha256Hex(form.url + form.title);
  const evidenceJson = JSON.stringify({
    ...form,
    evidence_id: evidenceId,
    hash,
    submitted_at: nowIso(),
    related_signal_ids: [],
    related_plan_ids: [],
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const txHash = await (client as any).sendTransaction({
    address: addr(),
    functionName: "add_evidence",
    args: [caseId, evidenceId, evidenceJson],
  });

  onStatus?.("pending");
  await waitForTxFinality(txHash as `0x${string}`, onStatus);

  return {
    txHash: txHash as `0x${string}`,
    evidenceId,
    explorerUrl: txExplorerUrl(txHash as string),
  };
}

// ============================================================
// Write: Request Consensus
// ============================================================

export async function requestConsensus(
  caseId: string,
  onStatus?: StatusCallback
): Promise<{ txHash: `0x${string}`; explorerUrl: string }> {
  const client = await getClientReady();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const txHash = await (client as any).sendTransaction({
    address: addr(),
    functionName: "request_consensus",
    args: [caseId],
  });

  onStatus?.("pending");
  await waitForTxFinality(txHash as `0x${string}`, onStatus);

  return { txHash: txHash as `0x${string}`, explorerUrl: txExplorerUrl(txHash as string) };
}

// ============================================================
// Read: Get Case
// ============================================================

export async function getCase(caseId: string): Promise<TransformationCase | null> {
  try {
    const client = await getClientReady();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw = await (client as any).readContract({
      address: addr(),
      functionName: "get_case",
      args: [caseId],
    });
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (parsed?.error) return null;
    return parsed as TransformationCase;
  } catch {
    return null;
  }
}

// ============================================================
// Read: Get All Case IDs
// ============================================================

export async function getAllCaseIds(): Promise<string[]> {
  try {
    const client = await getClientReady();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw = await (client as any).readContract({
      address: addr(),
      functionName: "get_all_case_ids",
      args: [],
    });
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// ============================================================
// Read: Get Owner Cases
// ============================================================

export async function getOwnerCases(ownerAddress: string): Promise<string[]> {
  try {
    const client = await getClientReady();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw = await (client as any).readContract({
      address: addr(),
      functionName: "get_owner_cases",
      args: [ownerAddress],
    });
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// ============================================================
// Read: Get Protocol Stats
// ============================================================

export async function getProtocolStats(): Promise<ProtocolStats> {
  try {
    const client = await getClientReady();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw = await (client as any).readContract({
      address: addr(),
      functionName: "get_protocol_stats",
      args: [],
    });
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    return parsed as ProtocolStats;
  } catch {
    return { total_cases: 0, total_verdicts: 0, total_signals: 0, total_evidence: 0 };
  }
}

// ============================================================
// TxState helpers
// ============================================================

export function idleTxState(): TxState {
  return { status: "idle", hash: null, error: null, explorerUrl: null };
}

export function buildTxState(
  status: TxState["status"],
  hash?: `0x${string}` | null,
  error?: string | null
): TxState {
  return {
    status,
    hash: hash ?? null,
    error: error ?? null,
    explorerUrl: hash ? txExplorerUrl(hash) : null,
  };
}
