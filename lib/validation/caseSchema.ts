import { z } from "zod";

const MAX = (n: number, label: string) =>
  z.string().max(n, `${label} must be at most ${n} characters`);

export const caseSchema = z.object({
  title: z.string().min(3, "Title required").max(120, "Title too long"),
  organisation: z.string().min(2, "Organisation name required").max(120),
  industry: z.string().min(1, "Industry required"),
  transformation_type: z.string().min(1, "Transformation type required"),
  current_state: MAX(600, "Current state").min(10, "Current state required"),
  target_state: MAX(600, "Target state").min(10, "Target state required"),
  business_objective: MAX(600, "Business objective").min(10, "Business objective required"),
  scope: MAX(500, "Scope").min(5, "Scope required"),
  implementation_timeline: z.string().min(2, "Timeline required").max(200),
  decision_deadline: z.string().min(2, "Decision deadline required").max(120),
  stakeholder_groups: MAX(400, "Stakeholder groups").min(5, "Stakeholder groups required"),
  known_constraints: MAX(600, "Known constraints"),
  risk_hypothesis: MAX(600, "Risk hypothesis").min(10, "Risk hypothesis required"),
  evidence_summary: MAX(800, "Evidence summary").min(10, "Evidence summary required"),
});

export type CaseSchemaInput = z.infer<typeof caseSchema>;
