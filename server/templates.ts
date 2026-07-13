import { prisma } from "@/lib/prisma";
import { parsePageContent } from "@/lib/page-content";
import { verifyProjectOwnership } from "@/server/projects";
import type {
  ApplyTemplateInput,
  CreateTemplateInput,
  UpdateTemplateInput,
} from "@/lib/validations/template";
import type { PageDetail } from "@/types/project";
import type { TemplateDetail, TemplateSummary } from "@/types/versioning";
import type { PageContent } from "@/types";

function mapTemplate(template: {
  id: string;
  name: string;
  description: string | null;
  type: "PAGE" | "SECTION" | "BLOCK";
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  content?: unknown;
}): TemplateSummary {
  return {
    id: template.id,
    name: template.name,
    description: template.description,
    type: template.type,
    isPublic: template.isPublic,
    createdAt: template.createdAt.toISOString(),
    updatedAt: template.updatedAt.toISOString(),
  };
}

function mapTemplateDetail(template: {
  id: string;
  name: string;
  description: string | null;
  type: "PAGE" | "SECTION" | "BLOCK";
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  content: unknown;
}): TemplateDetail {
  return {
    ...mapTemplate(template),
    content: template.content as TemplateDetail["content"],
  };
}

export async function listTemplates(
  userId: string,
): Promise<TemplateSummary[]> {
  const templates = await prisma.template.findMany({
    where: {
      OR: [{ userId }, { isPublic: true }],
    },
    orderBy: { updatedAt: "desc" },
  });

  return templates.map(mapTemplate);
}

export async function getTemplateById(
  userId: string,
  templateId: string,
): Promise<TemplateDetail | null> {
  const template = await prisma.template.findFirst({
    where: {
      id: templateId,
      OR: [{ userId }, { isPublic: true }],
    },
  });

  if (!template) {
    return null;
  }

  return mapTemplateDetail(template);
}

export async function createTemplate(
  userId: string,
  input: CreateTemplateInput,
): Promise<TemplateDetail> {
  const template = await prisma.template.create({
    data: {
      userId,
      name: input.name,
      description: input.description,
      type: input.type,
      content: input.content as object,
      isPublic: input.isPublic ?? false,
    },
  });

  return mapTemplateDetail(template);
}

export async function updateTemplate(
  userId: string,
  templateId: string,
  input: UpdateTemplateInput,
): Promise<TemplateDetail | null> {
  const existing = await prisma.template.findFirst({
    where: { id: templateId, userId },
  });

  if (!existing) {
    return null;
  }

  const template = await prisma.template.update({
    where: { id: templateId },
    data: {
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.description !== undefined
        ? { description: input.description }
        : {}),
      ...(input.type !== undefined ? { type: input.type } : {}),
      ...(input.content !== undefined
        ? { content: input.content as object }
        : {}),
      ...(input.isPublic !== undefined ? { isPublic: input.isPublic } : {}),
    },
  });

  return mapTemplateDetail(template);
}

export async function deleteTemplate(
  userId: string,
  templateId: string,
): Promise<boolean> {
  const existing = await prisma.template.findFirst({
    where: { id: templateId, userId },
    select: { id: true },
  });

  if (!existing) {
    return false;
  }

  await prisma.template.delete({ where: { id: templateId } });
  return true;
}

function templateToPageContent(content: unknown): PageContent {
  if (
    content &&
    typeof content === "object" &&
    "root" in content &&
    Array.isArray((content as PageContent).root)
  ) {
    return parsePageContent(content);
  }

  // SECTION / BLOCK templates store a single node
  if (content && typeof content === "object" && "type" in content) {
    return {
      version: 1,
      root: [content as PageContent["root"][number]],
    };
  }

  return { version: 1, root: [] };
}

export async function applyTemplateToPage(
  userId: string,
  projectId: string,
  pageId: string,
  input: ApplyTemplateInput,
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

  const template = await getTemplateById(userId, input.templateId);

  if (!template) {
    return null;
  }

  const templateContent = templateToPageContent(template.content);
  const current = parsePageContent(page.content);

  const nextContent: PageContent =
    input.mode === "append"
      ? {
          version: current.version,
          root: [...current.root, ...templateContent.root],
        }
      : templateContent;

  const updated = await prisma.page.update({
    where: { id: pageId },
    data: {
      content: nextContent as object,
      status: page.status === "PUBLISHED" ? "DRAFT" : page.status,
    },
  });

  return {
    id: updated.id,
    projectId: updated.projectId,
    title: updated.title,
    slug: updated.slug,
    status: updated.status,
    sortOrder: updated.sortOrder,
    createdAt: updated.createdAt.toISOString(),
    updatedAt: updated.updatedAt.toISOString(),
    publishedAt: updated.publishedAt?.toISOString() ?? null,
    content: updated.content as Record<string, unknown>,
    meta: updated.meta as Record<string, unknown>,
  };
}
