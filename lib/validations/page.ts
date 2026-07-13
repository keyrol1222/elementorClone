import { z } from "zod";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Allow omitted or empty slug; validate only when a value is provided. */
const optionalSlug = z
  .union([
    z.literal(""),
    z
      .string()
      .min(1, "Slug is required when provided")
      .max(60)
      .regex(slugPattern, "Slug must be lowercase with hyphens only"),
  ])
  .optional();

const pageContentSchema = z.object({
  version: z.number().int().positive(),
  root: z.array(z.record(z.string(), z.unknown())),
});

export const createPageSchema = z.object({
  title: z.string().min(1, "Page title is required").max(120),
  slug: optionalSlug,
});

export const updatePageSchema = z.object({
  title: z.string().min(1).max(120).optional(),
  slug: optionalSlug,
  sortOrder: z.number().int().min(0).optional(),
  content: pageContentSchema.optional(),
  meta: z.record(z.string(), z.unknown()).optional(),
});

export const savePageSchema = z.object({
  content: pageContentSchema,
  meta: z.record(z.string(), z.unknown()).optional(),
  createRevision: z.boolean().optional().default(false),
  message: z.string().max(200).optional(),
});

export const restoreRevisionSchema = z.object({
  revisionId: z.string().min(1),
});

export type CreatePageInput = z.infer<typeof createPageSchema>;
export type UpdatePageInput = z.infer<typeof updatePageSchema>;
export type SavePageInput = z.infer<typeof savePageSchema>;
export type RestoreRevisionInput = z.infer<typeof restoreRevisionSchema>;
