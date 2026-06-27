import type { CaseStatus } from "@/types";
import { cn } from "@/lib/utils/cn";

const STATUS_META: Record<CaseStatus, { label: string; color: string; bg: string; border: string }> = {
  OPEN: {
    label: "Open",
    color: "var(--color-cobalt)",
    bg: "var(--color-cobalt-light)",
    border: "rgba(36,87,255,0.2)",
  },
  UNDER_REVIEW: {
    label: "Under Review",
    color: "var(--color-gold)",
    bg: "var(--color-gold-light)",
    border: "rgba(200,155,60,0.25)",
  },
  VERDICT_ISSUED: {
    label: "Verdict Issued",
    color: "var(--color-green)",
    bg: "var(--color-green-light)",
    border: "rgba(47,133,90,0.25)",
  },
};

interface CaseStatusBadgeProps {
  status: CaseStatus | string;
  className?: string;
}

export function CaseStatusBadge({ status, className }: CaseStatusBadgeProps) {
  const meta = STATUS_META[status as CaseStatus] ?? {
    label: status,
    color: "var(--color-stone)",
    bg: "transparent",
    border: "var(--color-sand)",
  };

  return (
    <span
      className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium", className)}
      style={{
        background: meta.bg,
        border: `1px solid ${meta.border}`,
        color: meta.color,
        fontFamily: "var(--font-body)",
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: meta.color }}
      />
      {meta.label}
    </span>
  );
}
