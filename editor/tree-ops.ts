import type { EditorNode } from "@/types";
import type { EditorDevice } from "@/editor/types";
import { applyStyleUpdates } from "@/lib/styles/responsive-style";

export type NodeLocation = {
  parentId: string | null;
  index: number;
};

export function cloneTree(nodes: EditorNode[]): EditorNode[] {
  return nodes.map((node) => ({
    ...node,
    props: { ...node.props },
    style: {
      desktop: node.style.desktop ? { ...node.style.desktop } : undefined,
      tablet: node.style.tablet ? { ...node.style.tablet } : undefined,
      mobile: node.style.mobile ? { ...node.style.mobile } : undefined,
    },
    children: cloneTree(node.children),
  }));
}

function createNodeId(type: string): string {
  return `${type}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Deep-clone a node tree and assign fresh IDs (for paste / duplicate). */
export function cloneNodeWithNewIds(node: EditorNode): EditorNode {
  return {
    id: createNodeId(node.type),
    type: node.type,
    props: { ...node.props },
    style: {
      desktop: node.style.desktop ? { ...node.style.desktop } : undefined,
      tablet: node.style.tablet ? { ...node.style.tablet } : undefined,
      mobile: node.style.mobile ? { ...node.style.mobile } : undefined,
    },
    children: node.children.map(cloneNodeWithNewIds),
  };
}

export function findNode(nodes: EditorNode[], nodeId: string): EditorNode | null {
  for (const node of nodes) {
    if (node.id === nodeId) {
      return node;
    }
    const found = findNode(node.children, nodeId);
    if (found) {
      return found;
    }
  }
  return null;
}

export function findNodeLocation(
  nodes: EditorNode[],
  nodeId: string,
  parentId: string | null = null,
): NodeLocation | null {
  for (let index = 0; index < nodes.length; index += 1) {
    const node = nodes[index];
    if (node.id === nodeId) {
      return { parentId, index };
    }
    const found = findNodeLocation(node.children, nodeId, node.id);
    if (found) {
      return found;
    }
  }
  return null;
}

export function isDescendant(
  nodes: EditorNode[],
  ancestorId: string,
  maybeDescendantId: string,
): boolean {
  const ancestor = findNode(nodes, ancestorId);
  if (!ancestor) {
    return false;
  }
  return findNode(ancestor.children, maybeDescendantId) !== null;
}

function updateChildren(
  nodes: EditorNode[],
  parentId: string | null,
  updater: (children: EditorNode[]) => EditorNode[],
): EditorNode[] {
  if (parentId === null) {
    return updater(nodes);
  }

  return nodes.map((node) => {
    if (node.id === parentId) {
      return {
        ...node,
        children: updater(node.children),
      };
    }

    return {
      ...node,
      children: updateChildren(node.children, parentId, updater),
    };
  });
}

export function removeNode(
  nodes: EditorNode[],
  nodeId: string,
): { tree: EditorNode[]; removed: EditorNode | null } {
  const location = findNodeLocation(nodes, nodeId);
  if (!location) {
    return { tree: nodes, removed: null };
  }

  let removed: EditorNode | null = null;
  const tree = updateChildren(nodes, location.parentId, (children) => {
    removed = children[location.index] ?? null;
    return children.filter((_, index) => index !== location.index);
  });

  return { tree, removed };
}

export function insertNode(
  nodes: EditorNode[],
  parentId: string | null,
  index: number,
  node: EditorNode,
): EditorNode[] {
  return updateChildren(nodes, parentId, (children) => {
    const next = [...children];
    const safeIndex = Math.max(0, Math.min(index, next.length));
    next.splice(safeIndex, 0, node);
    return next;
  });
}

export function moveNode(
  nodes: EditorNode[],
  nodeId: string,
  targetParentId: string | null,
  targetIndex: number,
): EditorNode[] {
  if (nodeId === targetParentId) {
    return nodes;
  }

  if (
    targetParentId !== null &&
    isDescendant(nodes, nodeId, targetParentId)
  ) {
    return nodes;
  }

  const location = findNodeLocation(nodes, nodeId);
  if (!location) {
    return nodes;
  }

  let adjustedIndex = targetIndex;
  if (
    location.parentId === targetParentId &&
    location.index < targetIndex
  ) {
    adjustedIndex -= 1;
  }

  if (
    location.parentId === targetParentId &&
    (location.index === targetIndex || location.index === adjustedIndex)
  ) {
    return nodes;
  }

  const { tree, removed } = removeNode(nodes, nodeId);
  if (!removed) {
    return nodes;
  }

  return insertNode(tree, targetParentId, adjustedIndex, removed);
}

export function getChildIds(
  nodes: EditorNode[],
  parentId: string | null,
): string[] {
  if (parentId === null) {
    return nodes.map((node) => node.id);
  }

  const parent = findNode(nodes, parentId);
  return parent?.children.map((child) => child.id) ?? [];
}

export function updateNodeProps(
  nodes: EditorNode[],
  nodeId: string,
  props: Record<string, unknown>,
): EditorNode[] {
  return nodes.map((node) => {
    if (node.id === nodeId) {
      return {
        ...node,
        props: { ...node.props, ...props },
      };
    }

    if (node.children.length > 0) {
      return {
        ...node,
        children: updateNodeProps(node.children, nodeId, props),
      };
    }

    return node;
  });
}

export function updateNodeStyle(
  nodes: EditorNode[],
  nodeId: string,
  device: EditorDevice,
  updates: Record<string, string | number | undefined>,
): EditorNode[] {
  return nodes.map((node) => {
    if (node.id === nodeId) {
      return {
        ...node,
        style: applyStyleUpdates(node.style, device, updates),
      };
    }

    if (node.children.length > 0) {
      return {
        ...node,
        children: updateNodeStyle(node.children, nodeId, device, updates),
      };
    }

    return node;
  });
}

export function replaceNodeStyle(
  nodes: EditorNode[],
  nodeId: string,
  style: EditorNode["style"],
): EditorNode[] {
  return nodes.map((node) => {
    if (node.id === nodeId) {
      return { ...node, style };
    }

    if (node.children.length > 0) {
      return {
        ...node,
        children: replaceNodeStyle(node.children, nodeId, style),
      };
    }

    return node;
  });
}

export function canAcceptChild(
  parentType: string | null,
  childType: string,
): boolean {
  if (parentType === null) {
    return childType === "section";
  }

  if (parentType === "section") {
    return childType === "container" || childType === "columns";
  }

  if (parentType === "container" || parentType === "columns") {
    return true;
  }

  return false;
}
