import type { CSSProperties, ReactNode } from "react";
import type { EditorNode, ResponsiveStyle } from "@/types";
import type { EditorDevice } from "@/editor/types";

export type RenderMode = "editor" | "preview" | "published";

export type RenderContext = {
  mode: RenderMode;
  device: EditorDevice;
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string | null) => void;
};

export type WidgetRenderProps = {
  node: EditorNode;
  style: CSSProperties;
  context: RenderContext;
  children: ReactNode;
};

export type StyleMap = ResponsiveStyle;

export function resolveNodeStyle(
  style: ResponsiveStyle,
  device: EditorDevice,
): CSSProperties {
  const desktop = style.desktop ?? {};
  const tablet = style.tablet ?? {};
  const mobile = style.mobile ?? {};

  let resolved: Record<string, string | number> = { ...desktop };

  if (device === "tablet" || device === "mobile") {
    resolved = { ...resolved, ...tablet };
  }

  if (device === "mobile") {
    resolved = { ...resolved, ...mobile };
  }

  return resolved as CSSProperties;
}

export function getStringProp(
  props: Record<string, unknown>,
  key: string,
  fallback = "",
): string {
  const value = props[key];
  return typeof value === "string" ? value : fallback;
}

export function getNumberProp(
  props: Record<string, unknown>,
  key: string,
  fallback: number,
): number {
  const value = props[key];
  return typeof value === "number" ? value : fallback;
}

export function getBooleanProp(
  props: Record<string, unknown>,
  key: string,
  fallback = false,
): boolean {
  const value = props[key];
  return typeof value === "boolean" ? value : fallback;
}
