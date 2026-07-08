import type { LucideIcon } from "lucide-react";
import type { PageContent } from "@/types";

export type WidgetCategory = "layout" | "basic" | "media";

export type WidgetDefinition = {
  type: string;
  label: string;
  category: WidgetCategory;
  icon: LucideIcon;
  description: string;
  isContainer: boolean;
};

export type EditorPanel =
  | "widgets"
  | "structure"
  | "navigator"
  | "history"
  | "settings";

export type EditorDevice = "desktop" | "tablet" | "mobile";

export const DEVICE_WIDTHS: Record<EditorDevice, number> = {
  desktop: 1280,
  tablet: 768,
  mobile: 375,
};

export type EditorPageData = {
  projectId: string;
  pageId: string;
  title: string;
  slug: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  content: PageContent;
};
