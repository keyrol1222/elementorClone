export type ProjectSummary = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  pageCount: number;
};

export type ProjectDetail = ProjectSummary & {
  pages: PageSummary[];
};

export type PageSummary = {
  id: string;
  projectId: string;
  title: string;
  slug: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
};

export type PageDetail = PageSummary & {
  content: Record<string, unknown>;
  meta: Record<string, unknown>;
};
