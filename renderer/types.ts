export type RenderContext = {
  mode: "editor" | "preview" | "published";
  device: "desktop" | "tablet" | "mobile";
};

export type RenderNodeProps = {
  id: string;
  type: string;
  props: Record<string, unknown>;
  style: Record<string, unknown>;
  children: RenderNodeProps[];
};
