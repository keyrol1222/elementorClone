import { prisma } from "@/lib/prisma";
import { appendSlugSuffix, slugify } from "@/lib/slug";
import type { CreateProjectInput, UpdateProjectInput } from "@/lib/validations/project";
import type { ProjectSummary, ProjectDetail } from "@/types/project";
import type { PageSummary } from "@/types/project";

function mapProject(
  project: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
    _count: { pages: number };
  },
): ProjectSummary {
  return {
    id: project.id,
    name: project.name,
    slug: project.slug,
    description: project.description,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
    pageCount: project._count.pages,
  };
}

function mapPage(page: {
  id: string;
  projectId: string;
  title: string;
  slug: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
}): PageSummary {
  return {
    id: page.id,
    projectId: page.projectId,
    title: page.title,
    slug: page.slug,
    status: page.status,
    sortOrder: page.sortOrder,
    createdAt: page.createdAt.toISOString(),
    updatedAt: page.updatedAt.toISOString(),
    publishedAt: page.publishedAt?.toISOString() ?? null,
  };
}

async function resolveUniqueProjectSlug(
  userId: string,
  baseSlug: string,
  excludeProjectId?: string,
): Promise<string> {
  let candidate = baseSlug;
  let index = 1;

  while (true) {
    const existing = await prisma.project.findFirst({
      where: {
        userId,
        slug: candidate,
        ...(excludeProjectId ? { NOT: { id: excludeProjectId } } : {}),
      },
      select: { id: true },
    });

    if (!existing) {
      return candidate;
    }

    index += 1;
    candidate = appendSlugSuffix(baseSlug, index);
  }
}

export async function listProjects(userId: string): Promise<ProjectSummary[]> {
  const projects = await prisma.project.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    include: {
      _count: { select: { pages: true } },
    },
  });

  return projects.map(mapProject);
}

export async function getProjectById(
  userId: string,
  projectId: string,
): Promise<ProjectDetail | null> {
  const project = await prisma.project.findFirst({
    where: { id: projectId, userId },
    include: {
      _count: { select: { pages: true } },
      pages: {
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      },
    },
  });

  if (!project) {
    return null;
  }

  return {
    ...mapProject(project),
    pages: project.pages.map(mapPage),
  };
}

export async function createProject(
  userId: string,
  input: CreateProjectInput,
): Promise<ProjectSummary> {
  const baseSlug = slugify(input.slug ?? input.name);
  const slug = await resolveUniqueProjectSlug(userId, baseSlug);

  const project = await prisma.project.create({
    data: {
      name: input.name,
      slug,
      description: input.description ?? null,
      userId,
    },
    include: {
      _count: { select: { pages: true } },
    },
  });

  return mapProject(project);
}

export async function updateProject(
  userId: string,
  projectId: string,
  input: UpdateProjectInput,
): Promise<ProjectSummary | null> {
  const existing = await prisma.project.findFirst({
    where: { id: projectId, userId },
  });

  if (!existing) {
    return null;
  }

  let slug = existing.slug;

  if (input.slug) {
    slug = await resolveUniqueProjectSlug(userId, input.slug, projectId);
  }

  const project = await prisma.project.update({
    where: { id: projectId },
    data: {
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.description !== undefined ? { description: input.description } : {}),
      slug,
    },
    include: {
      _count: { select: { pages: true } },
    },
  });

  return mapProject(project);
}

export async function deleteProject(
  userId: string,
  projectId: string,
): Promise<boolean> {
  const existing = await prisma.project.findFirst({
    where: { id: projectId, userId },
    select: { id: true },
  });

  if (!existing) {
    return false;
  }

  await prisma.project.delete({
    where: { id: projectId },
  });

  return true;
}

export async function verifyProjectOwnership(
  userId: string,
  projectId: string,
): Promise<boolean> {
  const project = await prisma.project.findFirst({
    where: { id: projectId, userId },
    select: { id: true },
  });

  return !!project;
}
