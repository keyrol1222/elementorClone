export type RevisionSummary = {
  id: string;
  pageId: string;
  version: number;
  message: string | null;
  createdAt: string;
  userId: string;
};

export type PublishVersionSummary = {
  id: string;
  pageId: string;
  version: number;
  publishedAt: string;
};

export type TemplateSummary = {
  id: string;
  name: string;
  description: string | null;
  type: "PAGE" | "SECTION" | "BLOCK";
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
};

export type TemplateDetail = TemplateSummary & {
  content: Record<string, unknown> | import("@/types").PageContent;
};
