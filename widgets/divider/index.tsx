"use client";

import { Minus } from "lucide-react";
import type { WidgetRenderProps } from "@/renderer/types";
import { getNumberProp, getStringProp } from "@/renderer/types";
import { WidgetRegistry } from "@/editor/widgets/registry";
import { createNodeFromDefaults } from "@/widgets/shared/create-node";
import type { DividerProps, WidgetDefaults } from "@/types/widget";

const defaults: WidgetDefaults = {
  props: {
    color: "#e2e8f0",
    thickness: 1,
    width: "100%",
    style: "solid",
  } satisfies DividerProps,
  style: {
    desktop: {
      marginTop: "16px",
      marginBottom: "16px",
    },
  },
};

export function DividerWidget({ node, style }: WidgetRenderProps) {
  const color = getStringProp(node.props, "color", "#e2e8f0");
  const thickness = getNumberProp(node.props, "thickness", 1);
  const width = getStringProp(node.props, "width", "100%");
  const lineStyle = getStringProp(node.props, "style", "solid");

  return (
    <div
      className="flex w-full items-center justify-center"
      style={style}
      role="separator"
      aria-hidden="true"
    >
      <div
        style={{
          width,
          height: thickness,
          backgroundColor: lineStyle === "solid" ? color : "transparent",
          borderTop:
            lineStyle !== "solid"
              ? `${thickness}px ${lineStyle} ${color}`
              : undefined,
        }}
      />
    </div>
  );
}

WidgetRegistry.register({
  type: "divider",
  label: "Divider",
  category: "basic",
  icon: Minus,
  description: "Horizontal divider line",
  isContainer: false,
  defaultProps: defaults.props,
  defaultStyle: defaults.style,
  createNode: () => createNodeFromDefaults("divider", defaults),
  render: DividerWidget,
});
