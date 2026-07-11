"use client";

import type { WidgetRenderProps } from "@/renderer/types";
import { getBooleanProp, getStringProp } from "@/renderer/types";
import { WidgetRegistry } from "@/editor/widgets/registry";
import { createNodeFromDefaults } from "@/widgets/shared/create-node";
import type { WidgetDefaults } from "@/types/widget";
import { cn } from "@/lib/utils";
import { Columns3, LayoutGrid, Square } from "lucide-react";

const sectionDefaults: WidgetDefaults = {
  props: { fullWidth: true },
  style: {
    desktop: {
      paddingTop: "40px",
      paddingBottom: "40px",
    },
  },
};

const containerDefaults: WidgetDefaults = {
  props: { maxWidth: "1200px" },
  style: {},
};

const columnsDefaults: WidgetDefaults = {
  props: { columns: 2 },
  style: {
    desktop: { gap: "16px" },
  },
};

export function SectionWidget({ node, style, children }: WidgetRenderProps) {
  const fullWidth = getBooleanProp(node.props, "fullWidth", true);

  return (
    <section
      className={cn("w-full", !fullWidth && "mx-auto max-w-7xl")}
      style={style}
    >
      {children}
    </section>
  );
}

export function ContainerWidget({ node, style, children }: WidgetRenderProps) {
  const maxWidth = getStringProp(node.props, "maxWidth", "1200px");

  return (
    <div className="mx-auto w-full px-4" style={{ ...style, maxWidth }}>
      {children}
    </div>
  );
}

export function ColumnsWidget({ node, style, children }: WidgetRenderProps) {
  const columns = (() => {
    const value = node.props.columns;
    return typeof value === "number" && value > 0 ? value : 2;
  })();

  return (
    <div
      className="grid w-full"
      style={{
        ...style,
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gap: style.gap ?? "16px",
      }}
    >
      {children}
    </div>
  );
}

WidgetRegistry.register({
  type: "section",
  label: "Section",
  category: "layout",
  icon: LayoutGrid,
  description: "Full-width section container",
  isContainer: true,
  defaultProps: sectionDefaults.props,
  defaultStyle: sectionDefaults.style,
  createNode: () => createNodeFromDefaults("section", sectionDefaults),
  render: SectionWidget,
});

WidgetRegistry.register({
  type: "container",
  label: "Container",
  category: "layout",
  icon: Square,
  description: "Content width container",
  isContainer: true,
  defaultProps: containerDefaults.props,
  defaultStyle: containerDefaults.style,
  createNode: () => createNodeFromDefaults("container", containerDefaults),
  render: ContainerWidget,
});

WidgetRegistry.register({
  type: "columns",
  label: "Columns",
  category: "layout",
  icon: Columns3,
  description: "Multi-column layout",
  isContainer: true,
  defaultProps: columnsDefaults.props,
  defaultStyle: columnsDefaults.style,
  createNode: () => createNodeFromDefaults("columns", columnsDefaults),
  render: ColumnsWidget,
});
