"use client";

import { MousePointerClick } from "lucide-react";
import type { CSSProperties } from "react";
import type { WidgetRenderProps } from "@/renderer/types";
import { getStringProp } from "@/renderer/types";
import { WidgetRegistry } from "@/editor/widgets/registry";
import { createNodeFromDefaults } from "@/widgets/shared/create-node";
import { InlineEditableText } from "@/widgets/shared/inline-editable-text";
import type { ButtonProps, WidgetDefaults } from "@/types/widget";
import { cn } from "@/lib/utils";

const defaults: WidgetDefaults = {
  props: {
    text: "Click me",
    href: "#",
    target: "_self",
    variant: "solid",
    size: "md",
  } satisfies ButtonProps,
  style: {
    desktop: {
      backgroundColor: "#4f46e5",
      color: "#ffffff",
      padding: "12px 24px",
      borderRadius: "8px",
      fontWeight: "600",
      fontSize: "14px",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      textDecoration: "none",
      border: "2px solid transparent",
    },
  },
};

const sizeStyles: Record<ButtonProps["size"], CSSProperties> = {
  sm: { padding: "8px 16px", fontSize: "13px" },
  md: { padding: "12px 24px", fontSize: "14px" },
  lg: { padding: "14px 28px", fontSize: "16px" },
};

function getVariantStyle(
  variant: ButtonProps["variant"],
  baseStyle: CSSProperties,
): CSSProperties {
  switch (variant) {
    case "outline":
      return {
        ...baseStyle,
        backgroundColor: "transparent",
        color: (baseStyle.color as string) ?? "#4f46e5",
        border: `2px solid ${(baseStyle.backgroundColor as string) ?? "#4f46e5"}`,
      };
    case "ghost":
      return {
        ...baseStyle,
        backgroundColor: "transparent",
        color: (baseStyle.color as string) ?? "#4f46e5",
        border: "2px solid transparent",
      };
    default:
      return baseStyle;
  }
}

export function ButtonWidget({ node, style, context }: WidgetRenderProps) {
  const text = getStringProp(node.props, "text", defaults.props.text as string);
  const href = getStringProp(node.props, "href", "#");
  const target = getStringProp(node.props, "target", "_self") as ButtonProps["target"];
  const variant = getStringProp(node.props, "variant", "solid") as ButtonProps["variant"];
  const size = getStringProp(node.props, "size", "md") as ButtonProps["size"];

  const mergedStyle = getVariantStyle(variant, {
    ...style,
    ...sizeStyles[size],
  });

  if (context.mode === "editor") {
    return (
      <span
        className={cn(
          "inline-flex cursor-default items-center justify-center font-medium no-underline",
        )}
        style={mergedStyle}
        role="button"
        aria-disabled="true"
      >
        <InlineEditableText
          nodeId={node.id}
          value={text}
          propKey="text"
          as="span"
        />
      </span>
    );
  }

  return (
    <a
      href={href}
      target={target}
      rel={target === "_blank" ? "noopener noreferrer" : undefined}
      className="inline-flex items-center justify-center font-medium no-underline transition-opacity hover:opacity-90"
      style={mergedStyle}
    >
      {text}
    </a>
  );
}

WidgetRegistry.register({
  type: "button",
  label: "Button",
  category: "basic",
  icon: MousePointerClick,
  description: "Call-to-action button with variants",
  isContainer: false,
  defaultProps: defaults.props,
  defaultStyle: defaults.style,
  createNode: () => createNodeFromDefaults("button", defaults),
  render: ButtonWidget,
});
