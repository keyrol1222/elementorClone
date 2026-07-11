import type { ResponsiveStyle } from "@/types";

export type WidgetPropType =
  | "string"
  | "number"
  | "boolean"
  | "select"
  | "url"
  | "color";

export type WidgetPropDefinition = {
  key: string;
  label: string;
  type: WidgetPropType;
  defaultValue: string | number | boolean;
  options?: string[];
  group?: "content" | "style" | "layout";
};

export type WidgetDefaults = {
  props: Record<string, unknown>;
  style: ResponsiveStyle;
};

export type HeadingProps = {
  text: string;
  tag: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  align: "left" | "center" | "right";
};

export type TextProps = {
  text: string;
  align: "left" | "center" | "right";
};

export type ButtonProps = {
  text: string;
  href: string;
  target: "_self" | "_blank";
  variant: "solid" | "outline" | "ghost";
  size: "sm" | "md" | "lg";
};

export type SpacerProps = {
  height: number;
};

export type DividerProps = {
  color: string;
  thickness: number;
  width: string;
  style: "solid" | "dashed" | "dotted";
};

export type ImageProps = {
  src: string;
  alt: string;
  objectFit: "cover" | "contain" | "fill" | "none";
  link: string;
};

export type VideoProps = {
  src: string;
  poster: string;
  autoplay: boolean;
  loop: boolean;
  muted: boolean;
  controls: boolean;
};

export type IconProps = {
  icon: string;
  size: number;
  color: string;
  strokeWidth: number;
};
