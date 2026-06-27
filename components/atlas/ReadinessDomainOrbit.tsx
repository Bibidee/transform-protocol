"use client";

import type { ReadinessDomain } from "@/types";
import { READINESS_DOMAINS } from "@/lib/constants/domains";
import { ALIGNMENT_COLORS } from "@/lib/constants/verdictLabels";
import {
  Crown, Users, ShieldAlert, Target, Heart, Settings,
  Database, Cpu, GraduationCap, MessageSquare, Zap,
} from "lucide-react";

const DOMAIN_ICONS: Record<string, React.ElementType> = {
  LEADERSHIP_ALIGNMENT: Crown,
  MIDDLE_MANAGEMENT_ALIGNMENT: Users,
  STAKEHOLDER_RESISTANCE: ShieldAlert,
  INCENTIVE_ALIGNMENT: Target,
  CULTURE_READINESS: Heart,
  PROCESS_MATURITY: Settings,
  DATA_READINESS: Database,
  TECHNOLOGY_READINESS: Cpu,
  TRAINING_READINESS: GraduationCap,
  COMMUNICATION_READINESS: MessageSquare,
  DELIVERY_CAPACITY: Zap,
};

const LEVEL_BG: Record<string, string> = {
  STRONG: "rgba(47,133,90,0.08)",
  GOOD: "rgba(47,133,90,0.06)",
  MODERATE: "rgba(201,154,62,0.08)",
  WEAK: "rgba(183,92,61,0.08)",
  CRITICAL: "rgba(153,27,27,0.08)",
};

interface ReadinessDomainOrbitProps {
  domains: ReadinessDomain[];
  compact?: boolean;
}

export function ReadinessDomainOrbit({ domains, compact }: ReadinessDomainOrbitProps) {
  const domainMap = new Map(domains.map((d) => [d.domain_name, d]));
  const assessed = domains.length;
  const total = READINESS_DOMAINS.length;

  return (
    <div
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: "12px",
        overflow: "hidden",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "1rem 1.25rem 0.85rem",
          borderBottom: "1px solid var(--color-border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "9px",
              color: "var(--color-stone)",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: "3px",
            }}
          >
            Zone 02
          </div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "13px",
              fontWeight: 700,
              color: "var(--color-aubergine)",
            }}
          >
            Readiness Terrain
          </div>
        </div>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            color: assessed === total ? "var(--color-green)" : "var(--color-stone)",
            background: assessed === total ? "var(--color-green-light)" : "var(--color-aubergine-light)",
            border: `1px solid ${assessed === total ? "rgba(47,133,90,0.2)" : "rgba(34,21,43,0.08)"}`,
            padding: "3px 8px",
            borderRadius: "6px",
          }}
        >
          {assessed}/{total} domains
        </div>
      </div>

      {/* Domain terrain */}
      <div style={{ flex: 1, padding: "0.75rem 1rem", overflowY: "auto" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {READINESS_DOMAINS.map((meta) => {
            const registered = domainMap.get(meta.name);
            const level = registered?.self_assessed_level ?? null;
            const color = level ? ALIGNMENT_COLORS[level] ?? "var(--color-stone)" : "var(--color-border)";
            const bg = level ? LEVEL_BG[level] ?? "rgba(34,21,43,0.03)" : "transparent";
            const Icon = DOMAIN_ICONS[meta.name] ?? Zap;

            return (
              <div
                key={meta.name}
                className="terrain-region"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "8px 10px",
                  borderRadius: "7px",
                  background: bg,
                  borderLeft: `3px solid ${color}`,
                  transition: "background 0.15s ease",
                }}
              >
                <div
                  style={{
                    width: "26px",
                    height: "26px",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    background: level ? `${color}18` : "rgba(34,21,43,0.04)",
                  }}
                >
                  <Icon size={12} style={{ color: level ? color : "var(--color-stone)" }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: 600,
                      color: "var(--color-aubergine)",
                      lineHeight: 1.2,
                    }}
                  >
                    {meta.label}
                  </div>
                  {registered?.notes && !compact && (
                    <div
                      style={{
                        fontSize: "10px",
                        color: "var(--color-stone)",
                        marginTop: "1px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {registered.notes.slice(0, 60)}{registered.notes.length > 60 ? "…" : ""}
                    </div>
                  )}
                </div>
                {level ? (
                  <span
                    style={{
                      fontSize: "9px",
                      fontWeight: 700,
                      color,
                      fontFamily: "var(--font-mono)",
                      letterSpacing: "0.03em",
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                    }}
                  >
                    {level}
                  </span>
                ) : (
                  <span style={{ fontSize: "9px", color: "var(--color-stone)", fontFamily: "var(--font-mono)", flexShrink: 0 }}>
                    —
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
