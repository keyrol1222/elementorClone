import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(2, "Project name must be at least 2 characters").max(80),
  description: z.string().max(500).optional(),
  slug: z
    .string()
    .min(2)
    .max(60)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase with hyphens only")
    .optional(),
});

export const updateProjectSchema = createProjectSchema.partial();

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
