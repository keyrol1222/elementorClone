import type { ApiResponse, PageContent } from "@/types";
import type { ProjectDetail, ProjectSummary, PageSummary, PageDetail } from "@/types/project";
import type { DashboardStats } from "@/types";
import type {
  PublishVersionSummary,
  RevisionSummary,
  TemplateDetail,
  TemplateSummary,
} from "@/types/versioning";

async function fetchApi<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  const result = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !result.success || result.data === undefined) {
    throw new Error(result.error ?? "Request failed");
  }

  return result.data;
}

export const projectsApi = {
  list: () => fetchApi<ProjectSummary[]>("/api/projects"),
  get: (projectId: string) => fetchApi<ProjectDetail>(`/api/projects/${projectId}`),
  create: (data: { name: string; description?: string; slug?: string }) =>
    fetchApi<ProjectSummary>("/api/projects", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (
    projectId: string,
    data: { name?: string; description?: string; slug?: string },
  ) =>
    fetchApi<ProjectSummary>(`/api/projects/${projectId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  delete: (projectId: string) =>
    fetchApi<{ id: string }>(`/api/projects/${projectId}`, {
      method: "DELETE",
    }),
};

export const pagesApi = {
  list: (projectId: string) =>
    fetchApi<PageSummary[]>(`/api/projects/${projectId}/pages`),
  get: (projectId: string, pageId: string) =>
    fetchApi<PageDetail>(`/api/projects/${projectId}/pages/${pageId}`),
  create: (projectId: string, data: { title: string; slug?: string }) =>
    fetchApi<PageSummary>(`/api/projects/${projectId}/pages`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (
    projectId: string,
    pageId: string,
    data: {
      title?: string;
      slug?: string;
      content?: PageContent;
      meta?: Record<string, unknown>;
    },
  ) =>
    fetchApi<PageSummary>(`/api/projects/${projectId}/pages/${pageId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  delete: (projectId: string, pageId: string) =>
    fetchApi<{ id: string }>(`/api/projects/${projectId}/pages/${pageId}`, {
      method: "DELETE",
    }),
  save: (
    projectId: string,
    pageId: string,
    data: {
      content: PageContent;
      meta?: Record<string, unknown>;
      createRevision?: boolean;
      message?: string;
    },
  ) =>
    fetchApi<{ page: PageDetail; revision: RevisionSummary | null }>(
      `/api/projects/${projectId}/pages/${pageId}/save`,
      {
        method: "POST",
        body: JSON.stringify(data),
      },
    ),
  publish: (
    projectId: string,
    pageId: string,
    data?: { content?: PageContent },
  ) =>
    fetchApi<PageSummary>(
      `/api/projects/${projectId}/pages/${pageId}/publish`,
      {
        method: "POST",
        body: JSON.stringify(data ?? {}),
      },
    ),
  listRevisions: (projectId: string, pageId: string) =>
    fetchApi<RevisionSummary[]>(
      `/api/projects/${projectId}/pages/${pageId}/revisions`,
    ),
  restoreRevision: (
    projectId: string,
    pageId: string,
    revisionId: string,
  ) =>
    fetchApi<PageDetail>(
      `/api/projects/${projectId}/pages/${pageId}/revisions`,
      {
        method: "POST",
        body: JSON.stringify({ revisionId }),
      },
    ),
  listPublishVersions: (projectId: string, pageId: string) =>
    fetchApi<PublishVersionSummary[]>(
      `/api/projects/${projectId}/pages/${pageId}/versions`,
    ),
  applyTemplate: (
    projectId: string,
    pageId: string,
    data: { templateId: string; mode?: "replace" | "append" },
  ) =>
    fetchApi<PageDetail & { content: PageContent }>(
      `/api/projects/${projectId}/pages/${pageId}/apply-template`,
      {
        method: "POST",
        body: JSON.stringify(data),
      },
    ),
};

export const templatesApi = {
  list: () => fetchApi<TemplateSummary[]>("/api/templates"),
  get: (templateId: string) =>
    fetchApi<TemplateDetail>(`/api/templates/${templateId}`),
  create: (data: {
    name: string;
    description?: string;
    type?: "PAGE" | "SECTION" | "BLOCK";
    content: PageContent | Record<string, unknown>;
    isPublic?: boolean;
  }) =>
    fetchApi<TemplateDetail>("/api/templates", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (
    templateId: string,
    data: {
      name?: string;
      description?: string | null;
      type?: "PAGE" | "SECTION" | "BLOCK";
      content?: PageContent | Record<string, unknown>;
      isPublic?: boolean;
    },
  ) =>
    fetchApi<TemplateDetail>(`/api/templates/${templateId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  delete: (templateId: string) =>
    fetchApi<{ id: string }>(`/api/templates/${templateId}`, {
      method: "DELETE",
    }),
};

export const dashboardApi = {
  stats: () => fetchApi<DashboardStats>("/api/dashboard/stats"),
};
