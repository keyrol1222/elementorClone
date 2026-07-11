"use client";

import {
  ArrowRight,
  Check,
  Circle,
  Heart,
  Mail,
  Phone,
  Sparkles,
  Square,
  Star,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { WidgetRenderProps } from "@/renderer/types";
import { getNumberProp, getStringProp } from "@/renderer/types";
import { WidgetRegistry } from "@/editor/widgets/registry";
import { createNodeFromDefaults } from "@/widgets/shared/create-node";
import type { IconProps, WidgetDefaults } from "@/types/widget";

const iconMap: Record<string, LucideIcon> = {
  star: Star,
  heart: Heart,
  zap: Zap,
  circle: Circle,
  check: Check,
  mail: Mail,
  phone: Phone,
  sparkles: Sparkles,
  "arrow-right": ArrowRight,
};

export const AVAILABLE_ICONS = Object.keys(iconMap);

const defaults: WidgetDefaults = {
  props: {
    icon: "star",
    size: 32,
    color: "#4f46e5",
    strokeWidth: 2,
  } satisfies IconProps,
  style: {
    desktop: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
    },
  },
};

export function IconWidget({ node, style }: WidgetRenderProps) {
  const name = getStringProp(node.props, "icon", "star").toLowerCase();
  const size = getNumberProp(node.props, "size", 32);
  const color = getStringProp(node.props, "color", "#4f46e5");
  const strokeWidth = getNumberProp(node.props, "strokeWidth", 2);
  const Icon = iconMap[name] ?? Star;

  return (
    <span className="inline-flex items-center justify-center" style={style}>
      <Icon
        size={size}
        color={color}
        strokeWidth={strokeWidth}
        aria-hidden="true"
      />
    </span>
  );
}

WidgetRegistry.register({
  type: "icon",
  label: "Icon",
  category: "media",
  icon: Square,
  description: "Lucide icon with size and color controls",
  isContainer: false,
  defaultProps: defaults.props,
  defaultStyle: defaults.style,
  createNode: () => createNodeFromDefaults("icon", defaults),
  render: IconWidget,
});
