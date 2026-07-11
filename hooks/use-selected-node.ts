"use client";

import type { EditorNode } from "@/types";
import { findNodeById } from "@/editor/utils";
import { useEditorStore } from "@/store/editor-store";

export function useSelectedNode(): EditorNode | null {
  const content = useEditorStore((state) => state.content);
  const selectedNodeId = useEditorStore((state) => state.selectedNodeId);

  if (!selectedNodeId) {
    return null;
  }

  return findNodeById(content.root, selectedNodeId);
}

export function useSelectedNodeId(): string | null {
  return useEditorStore((state) => state.selectedNodeId);
}
