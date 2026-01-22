import { z } from "zod";

const textDocSchema = z.object({
  label: z.string().min(1, "Label is required"),
  description: z.string().min(1, "Description is required"),
});

const documentSchema = z.object({
  textDoc: z.array(textDocSchema).default([]),
  attachments: z.array(z.string()).default([]),
});

export const createORSSchema = z.object({
  vehicle: z.string().min(1, "Vehicle name is required"),
  roadWorthinessScore: z
    .string()
    .regex(/^\d+%?$/, "Score must be a number with optional %"),
  overallTrafficScore: z.enum(["A", "B", "C", "D", "F"]),
  actionRequired: z.string().min(1, "Action required is required"),
  documents: z.array(documentSchema).default([]),
});

export const updateORSSchema = createORSSchema.partial();

export type CreateORSInput = z.infer<typeof createORSSchema>;
export type UpdateORSInput = z.infer<typeof updateORSSchema>;
