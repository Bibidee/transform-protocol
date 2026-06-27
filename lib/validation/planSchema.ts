import { z } from "zod";

const F = (label: string, max = 800) =>
  z.string().min(5, `${label} required`).max(max, `${label} too long`);

export const planSchema = z.object({
  plan_title: z.string().min(3, "Plan title required").max(120),
  objective: F("Objective"),
  delivery_phases: F("Delivery phases"),
  milestones: F("Milestones"),
  responsible_teams: F("Responsible teams", 400),
  dependency_map: F("Dependency map"),
  training_approach: F("Training approach"),
  communication_approach: F("Communication approach"),
  governance_approach: F("Governance approach"),
  budget_assumption: F("Budget assumption", 400),
  timeline_assumption: F("Timeline assumption", 400),
  success_criteria: F("Success criteria"),
  known_risks: F("Known risks"),
  mitigation_plan: F("Mitigation plan"),
  failure_conditions: F("Failure conditions"),
});

export type PlanSchemaInput = z.infer<typeof planSchema>;
