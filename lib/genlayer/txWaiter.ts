"use client";

import { getClient } from "./client";
import type { TxStatus } from "@/types";

const POLL_INTERVAL = 10_000;
const MAX_ATTEMPTS = 90;

const STATUS_MAP: Record<number, TxStatus> = {
  0: "pending",
  1: "proposing",
  2: "committing",
  3: "revealing",
  4: "accepted",
  5: "finalized",
  6: "cancelled",
  7: "cancelled",
};

function getStatus(receipt: unknown): TxStatus {
  if (!receipt || typeof receipt !== "object") return "pending";
  const raw = (receipt as Record<string, unknown>)["status"];
  if (typeof raw === "number") return STATUS_MAP[raw] ?? "pending";
  const str = String(raw ?? "").toLowerCase();
  return str as TxStatus;
}

export type StatusCallback = (status: TxStatus) => void;

export async function waitForTxFinality(
  txHash: `0x${string}`,
  onStatusChange?: StatusCallback
): Promise<TxStatus> {
  const client = getClient();

  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const receipt = await (client as any).getTransaction({ hash: txHash });
      if (receipt) {
        const status = getStatus(receipt);
        onStatusChange?.(status);
        if (status === "accepted" || status === "finalized") return status;
        if (status === "cancelled") throw new Error("Transaction cancelled by GenLayer network.");
      }
    } catch (e) {
      if (e instanceof Error && e.message.includes("cancelled")) throw e;
    }
    await new Promise((r) => setTimeout(r, POLL_INTERVAL));
  }

  throw new Error("Transaction timed out waiting for GenLayer consensus.");
}
