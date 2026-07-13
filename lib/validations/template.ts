import { z } from "zod";

const pageContentSchema = z.object({
  version: z.number().int().positive(),
  root: z.array(z.record(z.string(), z.unknown())),
});

export const createTemplateSchema = z.object({
  name: z.string().min(1, "Template name is required").max(120),
  description: z.string().max(500).optional(),
  type: z.enum(["PAGE", "SECTION", "BLOCK"]).default("PAGE"),
  content: pageContentSchema.or(z.record(z.string(), z.unknown())),
  isPublic: z.boolean().optional().default(false),
});

export const updateTemplateSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  description: z.string().max(500).nullable().optional(),
  type: z.enum(["PAGE", "SECTION", "BLOCK"]).optional(),
  content: pageContentSchema.or(z.record(z.string(), z.unknown())).optional(),
  isPublic: z.boolean().optional(),
});

export const applyTemplateSchema = z.object({
  templateId: z.string().min(1),
  mode: z.enum(["replace", "append"]).default("replace"),
});

export type CreateTemplateInput = z.infer<typeof createTemplateSchema>;
export type UpdateTemplateInput = z.infer<typeof updateTemplateSchema>;
export type ApplyTemplateInput = z.infer<typeof applyTemplateSchema>;
