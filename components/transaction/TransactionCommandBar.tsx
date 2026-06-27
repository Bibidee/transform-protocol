"use client";

import type { TxState } from "@/types";
import { cn } from "@/lib/utils/cn";
import { shortHash } from "@/lib/genlayer/explorerUtils";
import {
  CheckCircle,
  XCircle,
  Loader2,
  ExternalLink,
  Clock,
  Zap,
} from "lucide-react";

const STATUS_LABELS: Record<string, string> = {
  idle: "",
  signing: "Waiting for wallet signature…",
  pending: "Transaction submitted — awaiting GenLayer consensus…",
  proposing: "Validators proposing…",
  committing: "Validators committing…",
  revealing: "Validators revealing…",
  accepted: "Consensus reached — accepted",
  finalized: "Transaction finalised",
  error: "Transaction failed",
  cancelled: "Transaction cancelled",
};

interface TransactionCommandBarProps {
  tx: TxState;
  className?: string;
  onRetry?: () => void;
}

export function TransactionCommandBar({
  tx,
  className,
  onRetry,
}: TransactionCommandBarProps) {
  if (tx.status === "idle") return null;

  const isLoading = ["signing", "pending", "proposing", "committing", "revealing"].includes(
    tx.status
  );
  const isSuccess = tx.status === "accepted" || tx.status === "finalized";
  const isError = tx.status === "error" || tx.status === "cancelled";

  return (
    <div
      className={cn("rounded-lg px-4 py-3 flex items-center gap-3", className)}
      style={{
        background: isSuccess
          ? "var(--color-green-light)"
          : isError
          ? "var(--color-clay-light)"
          : "var(--color-cobalt-light)",
        border: `1px solid ${
          isSuccess
            ? "rgba(47,133,90,0.25)"
            : isError
            ? "rgba(182,90,60,0.25)"
            : "rgba(36,87,255,0.2)"
        }`,
      }}
    >
      {/* Icon */}
      <div className="shrink-0">
        {isLoading && (
          <Loader2
            size={18}
            className="animate-spin-slow"
            style={{ color: "var(--color-cobalt)" }}
          />
        )}
        {isSuccess && (
          <CheckCircle size={18} style={{ color: "var(--color-green)" }} />
        )}
        {isError && <XCircle size={18} style={{ color: "var(--color-clay)" }} />}
      </div>

      {/* Label */}
      <div className="flex-1 min-w-0">
        <p
          style={{
            fontSize: "13px",
            fontWeight: 500,
            color: isSuccess
              ? "var(--color-green)"
              : isError
              ? "var(--color-clay)"
              : "var(--color-cobalt)",
          }}
        >
          {STATUS_LABELS[tx.status] || tx.status}
        </p>
        {tx.hash && (
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              color: "var(--color-stone)",
              marginTop: "1px",
            }}
          >
            {shortHash(tx.hash)}
          </p>
        )}
        {tx.error && (
          <p style={{ fontSize: "12px", color: "var(--color-clay)", marginTop: "1px" }}>
            {tx.error}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        {tx.explorerUrl && (
          <a
            href={tx.explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs hover:underline"
            style={{ color: "var(--color-cobalt)" }}
          >
            Explorer <ExternalLink size={11} />
          </a>
        )}
        {isError && onRetry && (
          <button
            onClick={onRetry}
            className="text-xs px-2.5 py-1 rounded"
            style={{
              background: "var(--color-clay)",
              color: "white",
              fontSize: "11px",
            }}
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
}
