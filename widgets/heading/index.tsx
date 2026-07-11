"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { ElementType } from "react";
import { Heading } from "lucide-react";
import type { WidgetRenderProps } from "@/renderer/types";
import { getStringProp } from "@/renderer/types";
import { WidgetRegistry } from "@/editor/widgets/registry";
import { createNodeFromDefaults } from "@/widgets/shared/create-node";
import { InlineEditableText } from "@/widgets/shared/inline-editable-text";
import type { HeadingProps, WidgetDefaults } from "@/types/widget";

const headingTags = new Set(["h1", "h2", "h3", "h4", "h5", "h6"]);

const defaults: WidgetDefaults = {
  props: {
    text: "New Heading",
    tag: "h2",
    align: "left",
  } satisfies HeadingProps,
  style: {
    desktop: {
      fontSize: "32px",
      fontWeight: "700",
      lineHeight: "1.2",
      marginBottom: "12px",
      color: "#0f172a",
    },
  },
};

export function HeadingWidget({ node, style, context }: WidgetRenderProps) {
  const text = getStringProp(node.props, "text", defaults.props.text as string);
  const tag = getStringProp(node.props, "tag", "h2").toLowerCase();
  const align = getStringProp(node.props, "align", "left");
  const Tag = (headingTags.has(tag) ? tag : "h2") as ElementType;

  const mergedStyle = {
    ...style,
    textAlign: align as CSSProperties["textAlign"],
  };

  if (context.mode === "editor") {
    return (
      <Tag className="m-0 font-semibold tracking-tight" style={mergedStyle}>
        <InlineEditableText
          nodeId={node.id}
          value={text}
          propKey="text"
          as="span"
        />
      </Tag>
    );
  }

  return (
    <Tag className="m-0 font-semibold tracking-tight" style={mergedStyle}>
      {text}
    </Tag>
  );
}

WidgetRegistry.register({
  type: "heading",
  label: "Heading",
  category: "basic",
  icon: Heading,
  description: "Title or heading text with inline editing",
  isContainer: false,
  defaultProps: defaults.props,
  defaultStyle: defaults.style,
  createNode: () => createNodeFromDefaults("heading", defaults),
  render: HeadingWidget,
});
