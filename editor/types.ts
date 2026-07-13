import type { LucideIcon } from "lucide-react";
import type { ReactElement } from "react";
import type { EditorNode, PageContent, ResponsiveStyle } from "@/types";
import type { WidgetRenderProps } from "@/renderer/types";

export type WidgetCategory = "layout" | "basic" | "media";

export type WidgetDefinition = {
  type: string;
  label: string;
  category: WidgetCategory;
  icon: LucideIcon;
  description: string;
  isContainer: boolean;
  defaultProps: Record<string, unknown>;
  defaultStyle: ResponsiveStyle;
  createNode: () => EditorNode;
  render: (props: WidgetRenderProps) => ReactElement;
};

export type EditorPanel =
  | "widgets"
  | "structure"
  | "navigator"
  | "history"
  | "versions"
  | "settings";

export type EditorDevice = "desktop" | "tablet" | "mobile";

export const DEVICE_WIDTHS: Record<EditorDevice, number> = {
  desktop: 1280,
  tablet: 768,
  mobile: 375,
};

export type EditorPageData = {
  projectId: string;
  projectSlug: string;
  pageId: string;
  title: string;
  slug: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  content: PageContent;
};
