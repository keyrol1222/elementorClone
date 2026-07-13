export type HistoryActionType =
  | "add"
  | "move"
  | "delete"
  | "update-props"
  | "update-style"
  | "paste"
  | "duplicate"
  | "copy-styles"
  | "clear-styles"
  | "initial";

export type HistoryEntry = {
  id: string;
  label: string;
  action: HistoryActionType;
  nodeId?: string;
  content: import("@/types").PageContent;
  selectedNodeIds: string[];
  timestamp: number;
};

export const MAX_HISTORY = 50;
export const HISTORY_COALESCE_MS = 600;
