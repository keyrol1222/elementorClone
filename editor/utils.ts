import type { EditorNode } from "@/types";
import type { EditorDevice } from "@/editor/types";

export type FlatNode = {
  id: string;
  type: string;
  depth: number;
  label: string;
  parentId: string | null;
};

export function flattenNodes(
  nodes: EditorNode[],
  depth = 0,
  parentId: string | null = null,
): FlatNode[] {
  const result: FlatNode[] = [];

  for (const node of nodes) {
    const label =
      typeof node.props.text === "string"
        ? node.props.text
        : typeof node.props.label === "string"
          ? node.props.label
          : node.type;

    result.push({
      id: node.id,
      type: node.type,
      depth,
      label: String(label).slice(0, 40),
      parentId,
    });

    if (node.children.length > 0) {
      result.push(...flattenNodes(node.children, depth + 1, node.id));
    }
  }

  return result;
}

export function findNodeById(
  nodes: EditorNode[],
  nodeId: string,
): EditorNode | null {
  for (const node of nodes) {
    if (node.id === nodeId) {
      return node;
    }

    const found = findNodeById(node.children, nodeId);
    if (found) {
      return found;
    }
  }

  return null;
}

export function getDeviceWidth(device: EditorDevice): number {
  const widths = { desktop: 1280, tablet: 768, mobile: 375 };
  return widths[device];
}
