"use client";

import { Type } from "lucide-react";
import type { CSSProperties } from "react";
import type { WidgetRenderProps } from "@/renderer/types";
import { getStringProp } from "@/renderer/types";
import { WidgetRegistry } from "@/editor/widgets/registry";
import { createNodeFromDefaults } from "@/widgets/shared/create-node";
import { InlineEditableText } from "@/widgets/shared/inline-editable-text";
import type { TextProps, WidgetDefaults } from "@/types/widget";

const defaults: WidgetDefaults = {
  props: {
    text: "Add your text here. Double-click to edit this paragraph inline.",
    align: "left",
  } satisfies TextProps,
  style: {
    desktop: {
      fontSize: "16px",
      lineHeight: "1.7",
      color: "#64748b",
      marginBottom: "12px",
    },
  },
};

export function TextWidget({ node, style, context }: WidgetRenderProps) {
  const text = getStringProp(node.props, "text", defaults.props.text as string);
  const align = getStringProp(node.props, "align", "left");

  const mergedStyle = {
    ...style,
    textAlign: align as React.CSSProperties["textAlign"],
  };

  if (context.mode === "editor") {
    return (
      <InlineEditableText
        nodeId={node.id}
        value={text}
        propKey="text"
        as="p"
        multiline
        className="m-0 leading-relaxed"
        style={mergedStyle}
      />
    );
  }

  return (
    <p className="m-0 leading-relaxed whitespace-pre-wrap" style={mergedStyle}>
      {text}
    </p>
  );
}

WidgetRegistry.register({
  type: "text",
  label: "Text",
  category: "basic",
  icon: Type,
  description: "Paragraph text with inline editing",
  isContainer: false,
  defaultProps: defaults.props,
  defaultStyle: defaults.style,
  createNode: () => createNodeFromDefaults("text", defaults),
  render: TextWidget,
});
