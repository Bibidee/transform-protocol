import { ExternalLink } from "lucide-react";
import { txExplorerUrl, shortHash } from "@/lib/genlayer/explorerUtils";

interface ExplorerAuditLinkProps {
  txHash?: string;
  label?: string;
  size?: "sm" | "md";
}

export function ExplorerAuditLink({
  txHash,
  label,
  size = "sm",
}: ExplorerAuditLinkProps) {
  if (!txHash) return null;
  const url = txExplorerUrl(txHash);
  const display = label ?? `TX ${shortHash(txHash)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 hover:underline"
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: size === "sm" ? "11px" : "13px",
        color: "var(--color-cobalt)",
      }}
    >
      {display}
      <ExternalLink size={size === "sm" ? 10 : 12} />
    </a>
  );
}
