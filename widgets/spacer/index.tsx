"use client";

import { SeparatorHorizontal } from "lucide-react";
import type { WidgetRenderProps } from "@/renderer/types";
import { getNumberProp } from "@/renderer/types";
import { WidgetRegistry } from "@/editor/widgets/registry";
import { createNodeFromDefaults } from "@/widgets/shared/create-node";
import type { SpacerProps, WidgetDefaults } from "@/types/widget";
import { cn } from "@/lib/utils";

const defaults: WidgetDefaults = {
  props: {
    height: 40,
  } satisfies SpacerProps,
  style: {},
};

export function SpacerWidget({ node, style, context }: WidgetRenderProps) {
  const height = getNumberProp(node.props, "height", 40);
  const isEditor = context.mode === "editor";

  return (
    <div
      aria-hidden={!isEditor}
      className={cn(
        "w-full",
        isEditor &&
          "rounded border border-dashed border-muted-foreground/30 bg-muted/20",
      )}
      style={{ ...style, height, minHeight: height }}
    >
      {isEditor && (
        <div className="flex h-full items-center justify-center text-[10px] text-muted-foreground">
          Spacer · {height}px
        </div>
      )}
    </div>
  );
}

WidgetRegistry.register({
  type: "spacer",
  label: "Spacer",
  category: "basic",
  icon: SeparatorHorizontal,
  description: "Vertical spacing block",
  isContainer: false,
  defaultProps: defaults.props,
  defaultStyle: defaults.style,
  createNode: () => createNodeFromDefaults("spacer", defaults),
  render: SpacerWidget,
});
