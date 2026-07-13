import { z } from "zod";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Allow omitted or empty slug; validate only when a value is provided. */
const optionalSlug = z
  .union([
    z.literal(""),
    z
      .string()
      .min(2, "Slug must be at least 2 characters")
      .max(60)
      .regex(slugPattern, "Slug must be lowercase with hyphens only"),
  ])
  .optional();

export const createProjectSchema = z.object({
  name: z.string().min(2, "Project name must be at least 2 characters").max(80),
  description: z.string().max(500).optional(),
  slug: optionalSlug,
});

export const updateProjectSchema = createProjectSchema.partial();

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
