import type { ApiResponse } from "@/types";
import type { ProjectDetail, ProjectSummary } from "@/types/project";
import type { PageSummary } from "@/types/project";
import type { DashboardStats } from "@/types";

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
  create: (projectId: string, data: { title: string; slug?: string }) =>
    fetchApi<PageSummary>(`/api/projects/${projectId}/pages`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (
    projectId: string,
    pageId: string,
    data: { title?: string; slug?: string },
  ) =>
    fetchApi<PageSummary>(`/api/projects/${projectId}/pages/${pageId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  delete: (projectId: string, pageId: string) =>
    fetchApi<{ id: string }>(`/api/projects/${projectId}/pages/${pageId}`, {
      method: "DELETE",
    }),
  publish: (projectId: string, pageId: string) =>
    fetchApi<PageSummary>(
      `/api/projects/${projectId}/pages/${pageId}/publish`,
      { method: "POST" },
    ),
};

export const dashboardApi = {
  stats: () => fetchApi<DashboardStats>("/api/dashboard/stats"),
};
