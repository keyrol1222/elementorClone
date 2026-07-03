export type ResponsiveStyle = {
  desktop?: Record<string, string | number>;
  tablet?: Record<string, string | number>;
  mobile?: Record<string, string | number>;
};

export type EditorNode = {
  id: string;
  type: string;
  props: Record<string, unknown>;
  style: ResponsiveStyle;
  children: EditorNode[];
};

export type PageContent = {
  version: number;
  root: EditorNode[];
};

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export type NavItem = {
  title: string;
  href: string;
  icon?: string;
  disabled?: boolean;
};

export type DashboardStats = {
  projectCount: number;
  pageCount: number;
  publishedCount: number;
};
