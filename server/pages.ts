import { prisma } from "@/lib/prisma";
import { appendSlugSuffix, slugify } from "@/lib/slug";
import { verifyProjectOwnership } from "@/server/projects";
import type { CreatePageInput, UpdatePageInput } from "@/lib/validations/page";
import type { PageDetail, PageSummary } from "@/types/project";

export const EMPTY_PAGE_CONTENT = {
  version: 1,
  root: [],
};

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
  content?: unknown;
  meta?: unknown;
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

function mapPageDetail(page: {
  id: string;
  projectId: string;
  title: string;
  slug: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
  content: unknown;
  meta: unknown;
}): PageDetail {
  return {
    ...mapPage(page),
    content: page.content as Record<string, unknown>,
    meta: page.meta as Record<string, unknown>,
  };
}

async function resolveUniquePageSlug(
  projectId: string,
  baseSlug: string,
  excludePageId?: string,
): Promise<string> {
  let candidate = baseSlug;
  let index = 1;

  while (true) {
    const existing = await prisma.page.findFirst({
      where: {
        projectId,
        slug: candidate,
        ...(excludePageId ? { NOT: { id: excludePageId } } : {}),
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

export async function listPages(
  userId: string,
  projectId: string,
): Promise<PageSummary[] | null> {
  const ownsProject = await verifyProjectOwnership(userId, projectId);

  if (!ownsProject) {
    return null;
  }

  const pages = await prisma.page.findMany({
    where: { projectId },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });

  return pages.map(mapPage);
}

export async function getPageById(
  userId: string,
  projectId: string,
  pageId: string,
): Promise<PageDetail | null> {
  const ownsProject = await verifyProjectOwnership(userId, projectId);

  if (!ownsProject) {
    return null;
  }

  const page = await prisma.page.findFirst({
    where: { id: pageId, projectId },
  });

  if (!page) {
    return null;
  }

  return mapPageDetail(page);
}

export async function createPage(
  userId: string,
  projectId: string,
  input: CreatePageInput,
): Promise<PageSummary | null> {
  const ownsProject = await verifyProjectOwnership(userId, projectId);

  if (!ownsProject) {
    return null;
  }

  const baseSlug = slugify(input.slug ?? input.title);
  const slug = await resolveUniquePageSlug(projectId, baseSlug);

  const lastPage = await prisma.page.findFirst({
    where: { projectId },
    orderBy: { sortOrder: "desc" },
    select: { sortOrder: true },
  });

  const page = await prisma.page.create({
    data: {
      projectId,
      title: input.title,
      slug,
      content: EMPTY_PAGE_CONTENT,
      meta: {
        title: input.title,
        description: "",
      },
      sortOrder: (lastPage?.sortOrder ?? -1) + 1,
    },
  });

  return mapPage(page);
}

export async function updatePage(
  userId: string,
  projectId: string,
  pageId: string,
  input: UpdatePageInput,
): Promise<PageSummary | null> {
  const ownsProject = await verifyProjectOwnership(userId, projectId);

  if (!ownsProject) {
    return null;
  }

  const existing = await prisma.page.findFirst({
    where: { id: pageId, projectId },
  });

  if (!existing) {
    return null;
  }

  let slug = existing.slug;

  if (input.slug) {
    slug = await resolveUniquePageSlug(projectId, input.slug, pageId);
  }

  const page = await prisma.page.update({
    where: { id: pageId },
    data: {
      ...(input.title !== undefined ? { title: input.title } : {}),
      ...(input.sortOrder !== undefined ? { sortOrder: input.sortOrder } : {}),
      slug,
      ...(input.title
        ? {
            meta: {
              ...(existing.meta as Record<string, unknown>),
              title: input.title,
            },
          }
        : {}),
    },
  });

  return mapPage(page);
}

export async function deletePage(
  userId: string,
  projectId: string,
  pageId: string,
): Promise<boolean> {
  const ownsProject = await verifyProjectOwnership(userId, projectId);

  if (!ownsProject) {
    return false;
  }

  const existing = await prisma.page.findFirst({
    where: { id: pageId, projectId },
    select: { id: true },
  });

  if (!existing) {
    return false;
  }

  await prisma.page.delete({
    where: { id: pageId },
  });

  return true;
}

export async function publishPage(
  userId: string,
  projectId: string,
  pageId: string,
): Promise<PageSummary | null> {
  const ownsProject = await verifyProjectOwnership(userId, projectId);

  if (!ownsProject) {
    return null;
  }

  const existing = await prisma.page.findFirst({
    where: { id: pageId, projectId },
  });

  if (!existing) {
    return null;
  }

  const latestVersion = await prisma.publishVersion.findFirst({
    where: { pageId },
    orderBy: { version: "desc" },
    select: { version: true },
  });

  const nextVersion = (latestVersion?.version ?? 0) + 1;
  const publishedAt = new Date();

  const [page] = await prisma.$transaction([
    prisma.page.update({
      where: { id: pageId },
      data: {
        status: "PUBLISHED",
        publishedAt,
      },
    }),
    prisma.publishVersion.create({
      data: {
        pageId,
        version: nextVersion,
        content: existing.content as object,
        publishedAt,
      },
    }),
  ]);

  return mapPage(page);
}
