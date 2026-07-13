import { prisma } from "@/lib/prisma";
import { appendSlugSuffix, slugify } from "@/lib/slug";
import { parsePageContent } from "@/lib/page-content";
import { verifyProjectOwnership } from "@/server/projects";
import type {
  CreatePageInput,
  SavePageInput,
  UpdatePageInput,
} from "@/lib/validations/page";
import type { PageDetail, PageSummary } from "@/types/project";
import type {
  PublishVersionSummary,
  RevisionSummary,
} from "@/types/versioning";
import type { PageContent } from "@/types";

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
      ...(input.content !== undefined
        ? { content: input.content as object }
        : {}),
      ...(input.meta !== undefined ? { meta: input.meta as object } : {}),
      slug,
      ...(input.title
        ? {
            meta: {
              ...(existing.meta as Record<string, unknown>),
              ...(input.meta ?? {}),
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

export async function savePageContent(
  userId: string,
  projectId: string,
  pageId: string,
  input: SavePageInput,
): Promise<{ page: PageDetail; revision: RevisionSummary | null } | null> {
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

  const content = input.content as object;
  let revision: RevisionSummary | null = null;

  const page = await prisma.page.update({
    where: { id: pageId },
    data: {
      content,
      ...(input.meta !== undefined ? { meta: input.meta as object } : {}),
      // Editing a published page returns it to draft until republished
      ...(existing.status === "PUBLISHED" ? { status: "DRAFT" } : {}),
    },
  });

  if (input.createRevision) {
    const latest = await prisma.revision.findFirst({
      where: { pageId },
      orderBy: { version: "desc" },
      select: { version: true },
    });

    const created = await prisma.revision.create({
      data: {
        pageId,
        userId,
        version: (latest?.version ?? 0) + 1,
        content,
        message: input.message ?? "Manual save",
      },
    });

    revision = {
      id: created.id,
      pageId: created.pageId,
      version: created.version,
      message: created.message,
      createdAt: created.createdAt.toISOString(),
      userId: created.userId,
    };
  }

  return { page: mapPageDetail(page), revision };
}

export async function listRevisions(
  userId: string,
  projectId: string,
  pageId: string,
): Promise<RevisionSummary[] | null> {
  const ownsProject = await verifyProjectOwnership(userId, projectId);

  if (!ownsProject) {
    return null;
  }

  const page = await prisma.page.findFirst({
    where: { id: pageId, projectId },
    select: { id: true },
  });

  if (!page) {
    return null;
  }

  const revisions = await prisma.revision.findMany({
    where: { pageId },
    orderBy: { version: "desc" },
  });

  return revisions.map((revision) => ({
    id: revision.id,
    pageId: revision.pageId,
    version: revision.version,
    message: revision.message,
    createdAt: revision.createdAt.toISOString(),
    userId: revision.userId,
  }));
}

export async function restoreRevision(
  userId: string,
  projectId: string,
  pageId: string,
  revisionId: string,
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

  const revision = await prisma.revision.findFirst({
    where: { id: revisionId, pageId },
  });

  if (!revision) {
    return null;
  }

  const content = revision.content as object;

  const latest = await prisma.revision.findFirst({
    where: { pageId },
    orderBy: { version: "desc" },
    select: { version: true },
  });

  const [updated] = await prisma.$transaction([
    prisma.page.update({
      where: { id: pageId },
      data: {
        content,
        status: page.status === "PUBLISHED" ? "DRAFT" : page.status,
      },
    }),
    prisma.revision.create({
      data: {
        pageId,
        userId,
        version: (latest?.version ?? 0) + 1,
        content,
        message: `Restored from v${revision.version}`,
      },
    }),
  ]);

  return mapPageDetail(updated);
}

export async function listPublishVersions(
  userId: string,
  projectId: string,
  pageId: string,
): Promise<PublishVersionSummary[] | null> {
  const ownsProject = await verifyProjectOwnership(userId, projectId);

  if (!ownsProject) {
    return null;
  }

  const page = await prisma.page.findFirst({
    where: { id: pageId, projectId },
    select: { id: true },
  });

  if (!page) {
    return null;
  }

  const versions = await prisma.publishVersion.findMany({
    where: { pageId },
    orderBy: { version: "desc" },
  });

  return versions.map((version) => ({
    id: version.id,
    pageId: version.pageId,
    version: version.version,
    publishedAt: version.publishedAt.toISOString(),
  }));
}

export async function publishPage(
  userId: string,
  projectId: string,
  pageId: string,
  contentOverride?: PageContent,
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

  const content = (contentOverride ??
    parsePageContent(existing.content)) as object;

  const latestVersion = await prisma.publishVersion.findFirst({
    where: { pageId },
    orderBy: { version: "desc" },
    select: { version: true },
  });

  const latestRevision = await prisma.revision.findFirst({
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
        content,
      },
    }),
    prisma.publishVersion.create({
      data: {
        pageId,
        version: nextVersion,
        content,
        publishedAt,
      },
    }),
    prisma.revision.create({
      data: {
        pageId,
        userId,
        version: (latestRevision?.version ?? 0) + 1,
        content,
        message: `Published v${nextVersion}`,
      },
    }),
  ]);

  return mapPage(page);
}

export async function getPublishedPageBySlugs(
  projectSlug: string,
  pageSlug: string,
): Promise<{
  title: string;
  slug: string;
  projectName: string;
  projectSlug: string;
  content: PageContent;
  publishedAt: string | null;
} | null> {
  const page = await prisma.page.findFirst({
    where: {
      slug: pageSlug,
      status: "PUBLISHED",
      project: { slug: projectSlug },
    },
    include: {
      project: { select: { name: true, slug: true } },
      publishVersions: {
        orderBy: { version: "desc" },
        take: 1,
      },
    },
  });

  if (!page) {
    return null;
  }

  const publishedContent = page.publishVersions[0]?.content ?? page.content;

  return {
    title: page.title,
    slug: page.slug,
    projectName: page.project.name,
    projectSlug: page.project.slug,
    content: parsePageContent(publishedContent),
    publishedAt: page.publishedAt?.toISOString() ?? null,
  };
}
