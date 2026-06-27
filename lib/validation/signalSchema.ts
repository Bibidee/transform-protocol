import { z } from "zod";

export const signalSchema = z.object({
  title: z.string().min(3, "Signal title required").max(200),
  stakeholder_group: z.string().min(1, "Stakeholder group required"),
  signal_type: z.string().min(1, "Signal type required"),
  readiness_implication: z
    .string()
    .min(10, "Readiness implication required")
    .max(600),
  resistance_level: z.enum(["NONE", "LOW", "MODERATE", "HIGH", "BLOCKING"]),
  confidence_level: z.enum(["LOW", "MEDIUM", "HIGH", "VERY_HIGH"]),
  evidence_url: z.string().url("Must be a valid URL").or(z.literal("")),
  source_credibility_note: z.string().max(400),
  related_domain: z.string(),
});

export type SignalSchemaInput = z.infer<typeof signalSchema>;
