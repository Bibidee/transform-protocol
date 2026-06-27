import { z } from "zod";

export const evidenceSchema = z.object({
  title: z.string().min(3, "Evidence title required").max(200),
  evidence_type: z.string().min(1, "Evidence type required"),
  url: z
    .string()
    .url("Must be a valid, publicly accessible URL")
    .refine(
      (u) => u.startsWith("https://") || u.startsWith("http://"),
      "URL must start with http:// or https://"
    ),
  source_name: z.string().min(2, "Source name required").max(200),
  credibility_note: z.string().max(400),
  relevance_note: z
    .string()
    .min(5, "Relevance note required")
    .max(600),
  category: z.string().min(1, "Category required"),
});

export type EvidenceSchemaInput = z.infer<typeof evidenceSchema>;
