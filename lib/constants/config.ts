export const GENLAYER_RPC_URL =
  process.env.NEXT_PUBLIC_GENLAYER_RPC_URL || "https://studio.genlayer.com/api";

export const GENLAYER_CHAIN_ID = parseInt(
  process.env.NEXT_PUBLIC_GENLAYER_CHAIN_ID || "61999",
  10
);

export const CONTRACT_ADDRESS =
  (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "") as `0x${string}`;

export const EXPLORER_BASE_URL =
  process.env.NEXT_PUBLIC_EXPLORER_BASE_URL || "https://studio.genlayer.com";

export const MAX_SIGNALS = 20;
export const MAX_EVIDENCE = 20;
export const MAX_DOMAINS = 11;

export const INDUSTRIES = [
  "Financial Services",
  "Healthcare & Life Sciences",
  "Public Sector & Government",
  "Retail & Consumer",
  "Manufacturing & Supply Chain",
  "Technology & Software",
  "Energy & Utilities",
  "Telecommunications",
  "Education",
  "Professional Services",
  "Transportation & Logistics",
  "Media & Entertainment",
  "Real Estate",
  "Non-Profit & NGO",
  "Other",
];

export const TRANSFORMATION_TYPES = [
  "ERP Rollout",
  "AI Adoption",
  "Cloud Migration",
  "Operating Model Redesign",
  "Digital Transformation",
  "Public Sector Reform",
  "Process Transformation",
  "Cultural Change Programme",
  "Merger & Integration",
  "Technology Platform Migration",
  "Customer Experience Transformation",
  "Supply Chain Redesign",
  "Regulatory Compliance Transformation",
  "Data & Analytics Transformation",
  "Organisational Restructure",
  "Other",
];

export const STAKEHOLDER_GROUPS = [
  "Executive Leadership",
  "Senior Management",
  "Middle Management",
  "Frontline Staff",
  "Technology Team",
  "Finance Team",
  "HR & People Team",
  "Legal & Compliance",
  "External Vendors",
  "Board of Directors",
  "Customers",
  "Regulators",
  "Union Representatives",
  "Implementation Partners",
  "Other",
];

export const SIGNAL_TYPES = [
  "Resistance Signal",
  "Alignment Signal",
  "Capacity Concern",
  "Incentive Misalignment",
  "Timeline Pressure",
  "Dependency Risk",
  "Culture Blocker",
  "Budget Concern",
  "Training Gap",
  "Communication Failure",
  "Governance Weakness",
  "Technology Risk",
  "Data Readiness Issue",
  "Stakeholder Conflict",
  "Leadership Inconsistency",
  "Other",
];
