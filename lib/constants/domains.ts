import type { ReadinessDomainName } from "@/types";

export interface DomainMeta {
  name: ReadinessDomainName;
  label: string;
  description: string;
  icon: string;
  frictionIndicator: string;
}

export const READINESS_DOMAINS: DomainMeta[] = [
  {
    name: "LEADERSHIP_ALIGNMENT",
    label: "Leadership Alignment",
    description: "Are senior leaders unified on vision, pace, and accountability?",
    icon: "crown",
    frictionIndicator: "Leadership conflict is the primary driver of transformation failure.",
  },
  {
    name: "MIDDLE_MANAGEMENT_ALIGNMENT",
    label: "Middle-Management Alignment",
    description: "Do middle managers understand, accept, and enable the change?",
    icon: "users",
    frictionIndicator: "Middle management resistance is where most transformations stall.",
  },
  {
    name: "STAKEHOLDER_RESISTANCE",
    label: "Stakeholder Resistance",
    description: "How resistant are key stakeholder groups to this transformation?",
    icon: "shield-alert",
    frictionIndicator: "Unaddressed resistance converts into active sabotage.",
  },
  {
    name: "INCENTIVE_ALIGNMENT",
    label: "Incentive Alignment",
    description: "Are performance incentives aligned to the desired transformation behaviour?",
    icon: "target",
    frictionIndicator: "Misaligned incentives guarantee adoption failure regardless of readiness.",
  },
  {
    name: "CULTURE_READINESS",
    label: "Culture Readiness",
    description: "Does the organisational culture support the behaviours required for this transformation?",
    icon: "heart",
    frictionIndicator: "Culture absorbs strategy. An unsupportive culture blocks all progress.",
  },
  {
    name: "PROCESS_MATURITY",
    label: "Process Maturity",
    description: "Are existing processes mature enough to support the transformation workload?",
    icon: "settings",
    frictionIndicator: "Immature processes create instability during the transition period.",
  },
  {
    name: "DATA_READINESS",
    label: "Data Readiness",
    description: "Is the data quality and availability sufficient for the transformation requirements?",
    icon: "database",
    frictionIndicator: "Data gaps cause implementation delays that cascade into timeline failure.",
  },
  {
    name: "TECHNOLOGY_READINESS",
    label: "Technology Readiness",
    description: "Is the technology infrastructure ready for the transformation?",
    icon: "cpu",
    frictionIndicator: "Technology debt creates hidden blockers that surface mid-implementation.",
  },
  {
    name: "TRAINING_READINESS",
    label: "Training Readiness",
    description: "Is the training programme sufficient for the required capability uplift?",
    icon: "graduation-cap",
    frictionIndicator: "Undertrained users drive adoption failure and workaround behaviour.",
  },
  {
    name: "COMMUNICATION_READINESS",
    label: "Communication Readiness",
    description: "Is the communication plan clear, timely, and trusted by all groups?",
    icon: "message-square",
    frictionIndicator: "Communication gaps create rumours that amplify resistance.",
  },
  {
    name: "DELIVERY_CAPACITY",
    label: "Delivery Capacity",
    description: "Does the organisation have the delivery capacity to execute this transformation?",
    icon: "zap",
    frictionIndicator: "Capacity overestimation is the most common cause of missed milestones.",
  },
];

export const DOMAIN_LEVEL_LABELS: Record<string, string> = {
  STRONG: "Strong",
  MODERATE: "Moderate",
  PARTIAL: "Partial",
  WEAK: "Weak",
  ABSENT: "Absent",
};
