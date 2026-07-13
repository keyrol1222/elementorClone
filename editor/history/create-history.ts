import type { PageContent } from "@/types";
import { cloneTree } from "@/editor/tree-ops";
import type { HistoryActionType, HistoryEntry } from "@/editor/history/types";
import { HISTORY_COALESCE_MS, MAX_HISTORY } from "@/editor/history/types";

export function clonePageContent(content: PageContent): PageContent {
  return {
    version: content.version,
    root: cloneTree(content.root),
  };
}

export function createHistoryEntry(input: {
  label: string;
  action: HistoryActionType;
  content: PageContent;
  selectedNodeIds: string[];
  nodeId?: string;
}): HistoryEntry {
  return {
    id: `hist-${Math.random().toString(36).slice(2, 10)}`,
    label: input.label,
    action: input.action,
    nodeId: input.nodeId,
    content: clonePageContent(input.content),
    selectedNodeIds: [...input.selectedNodeIds],
    timestamp: Date.now(),
  };
}

export function shouldCoalesceHistory(
  last: HistoryEntry | undefined,
  action: HistoryActionType,
  nodeId: string | undefined,
): boolean {
  if (!last || !nodeId) {
    return false;
  }

  if (last.action !== action || last.nodeId !== nodeId) {
    return false;
  }

  if (action !== "update-props" && action !== "update-style") {
    return false;
  }

  return Date.now() - last.timestamp < HISTORY_COALESCE_MS;
}

export function pushPastEntry(
  past: HistoryEntry[],
  entry: HistoryEntry,
): HistoryEntry[] {
  const next = [...past, entry];
  if (next.length > MAX_HISTORY) {
    return next.slice(next.length - MAX_HISTORY);
  }
  return next;
}
