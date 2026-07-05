import { z } from "zod";

export const createPageSchema = z.object({
  title: z.string().min(1, "Page title is required").max(120),
  slug: z
    .string()
    .min(1)
    .max(60)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase with hyphens only")
    .optional(),
});

export const updatePageSchema = z.object({
  title: z.string().min(1).max(120).optional(),
  slug: z
    .string()
    .min(1)
    .max(60)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .optional(),
  sortOrder: z.number().int().min(0).optional(),
});

export type CreatePageInput = z.infer<typeof createPageSchema>;
export type UpdatePageInput = z.infer<typeof updatePageSchema>;
