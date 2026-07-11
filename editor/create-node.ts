import type { EditorNode } from "@/types";
import { WidgetRegistry } from "@/editor/widgets/registry";
import { createNodeFromDefaults } from "@/widgets/shared/create-node";

export function createWidgetNode(type: string): EditorNode {
  const definition = WidgetRegistry.get(type);

  if (definition?.createNode) {
    return definition.createNode();
  }

  if (definition) {
    return createNodeFromDefaults(type, {
      props: definition.defaultProps,
      style: definition.defaultStyle,
    });
  }

  return {
    id: `${type}-${Math.random().toString(36).slice(2, 10)}`,
    type,
    props: {},
    style: {},
    children: [],
  };
}

/**
 * When dropping a non-section widget onto the root, wrap it in
 * section → container so the page remains Elementor-like.
 */
export function wrapForRoot(node: EditorNode): EditorNode {
  if (node.type === "section") {
    return node;
  }

  if (node.type === "container" || node.type === "columns") {
    return {
      ...createWidgetNode("section"),
      children: [node],
    };
  }

  return {
    ...createWidgetNode("section"),
    children: [
      {
        ...createWidgetNode("container"),
        children: [node],
      },
    ],
  };
}
