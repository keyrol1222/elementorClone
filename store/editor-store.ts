import { create } from "zustand";
import type { EditorNode, PageContent } from "@/types";
import type { EditorDevice, EditorPanel } from "@/editor/types";
import { createWidgetNode, wrapForRoot } from "@/editor/create-node";
import {
  canAcceptChild,
  cloneNodeWithNewIds,
  cloneTree,
  findNode,
  findNodeLocation,
  insertNode,
  moveNode,
  removeNode,
  updateNodeProps as updateNodePropsInTree,
  updateNodeStyle as updateNodeStyleInTree,
  replaceNodeStyle,
} from "@/editor/tree-ops";
import { WidgetRegistry } from "@/editor/widgets/registry";
import {
  clearDeviceStyles as clearDeviceStylesHelper,
  copyDeviceStyles,
} from "@/lib/styles/responsive-style";
import type { HistoryActionType, HistoryEntry } from "@/editor/history/types";
import {
  clonePageContent,
  createHistoryEntry,
  pushPastEntry,
  shouldCoalesceHistory,
} from "@/editor/history/create-history";

type SelectionState = {
  selectedNodeIds: string[];
  selectedNodeId: string | null;
};

type EditorState = SelectionState & {
  projectId: string;
  projectSlug: string;
  pageId: string;
  pageTitle: string;
  pageSlug: string;
  pageStatus: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  content: PageContent;
  activePanel: EditorPanel;
  device: EditorDevice;
  leftSidebarOpen: boolean;
  rightSidebarOpen: boolean;
  isPreviewMode: boolean;
  isDirty: boolean;
  past: HistoryEntry[];
  future: HistoryEntry[];
  clipboard: EditorNode | null;
  initialize: (data: {
    projectId: string;
    projectSlug: string;
    pageId: string;
    pageTitle: string;
    pageSlug: string;
    pageStatus: "DRAFT" | "PUBLISHED" | "ARCHIVED";
    content: PageContent;
  }) => void;
  setSelectedNodeId: (nodeId: string | null) => void;
  toggleNodeSelection: (nodeId: string) => void;
  clearSelection: () => void;
  setActivePanel: (panel: EditorPanel) => void;
  setDevice: (device: EditorDevice) => void;
  toggleLeftSidebar: () => void;
  toggleRightSidebar: () => void;
  setPreviewMode: (preview: boolean) => void;
  setPageTitle: (title: string) => void;
  markSaved: (status?: "DRAFT" | "PUBLISHED" | "ARCHIVED") => void;
  replaceContent: (content: PageContent, options?: { dirty?: boolean }) => void;
  addWidget: (
    widgetType: string,
    parentId: string | null,
    index: number,
  ) => string | null;
  moveWidget: (
    nodeId: string,
    targetParentId: string | null,
    targetIndex: number,
  ) => void;
  removeWidget: (nodeId: string) => void;
  updateNodeProps: (
    nodeId: string,
    props: Record<string, unknown>,
  ) => void;
  updateNodeStyle: (
    nodeId: string,
    updates: Record<string, string | number | undefined>,
  ) => void;
  copyStylesToDevice: (nodeId: string, targetDevice: EditorDevice) => void;
  clearDeviceStyles: (nodeId: string) => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  jumpToHistory: (entryId: string) => void;
  copySelected: () => boolean;
  pasteClipboard: () => string | null;
  duplicateSelected: () => string | null;
  deleteSelected: () => void;
};

function toPrimarySelection(ids: string[]): string | null {
  return ids[0] ?? null;
}

function resolveInsertParentType(
  root: PageContent["root"],
  parentId: string | null,
): string | null {
  if (parentId === null) {
    return null;
  }
  return findNode(root, parentId)?.type ?? null;
}

function widgetLabel(type: string): string {
  return WidgetRegistry.get(type)?.label ?? type;
}

type CommitOptions = {
  label: string;
  action: HistoryActionType;
  nodeId?: string;
};

/**
 * Snapshot current content into `past` before a mutation.
 * Coalesces rapid prop/style edits on the same node.
 */
function commitHistory(
  get: () => EditorState,
  set: (
    partial:
      | Partial<EditorState>
      | ((state: EditorState) => Partial<EditorState>),
  ) => void,
  options: CommitOptions,
): boolean {
  const state = get();
  const last = state.past[state.past.length - 1];

  if (shouldCoalesceHistory(last, options.action, options.nodeId)) {
    set({
      past: state.past.map((entry, index) =>
        index === state.past.length - 1
          ? { ...entry, timestamp: Date.now() }
          : entry,
      ),
      future: [],
    });
    return true;
  }

  const entry = createHistoryEntry({
    label: options.label,
    action: options.action,
    content: state.content,
    selectedNodeIds: state.selectedNodeIds,
    nodeId: options.nodeId,
  });

  set({
    past: pushPastEntry(state.past, entry),
    future: [],
  });

  return true;
}

function applyContent(
  set: (
    partial:
      | Partial<EditorState>
      | ((state: EditorState) => Partial<EditorState>),
  ) => void,
  content: PageContent,
  selectedNodeIds: string[],
  dirty = true,
) {
  set({
    content,
    selectedNodeIds,
    selectedNodeId: toPrimarySelection(selectedNodeIds),
    isDirty: dirty,
  });
}

export const useEditorStore = create<EditorState>((set, get) => ({
  projectId: "",
  projectSlug: "",
  pageId: "",
  pageTitle: "",
  pageSlug: "",
  pageStatus: "DRAFT",
  content: { version: 1, root: [] },
  selectedNodeIds: [],
  selectedNodeId: null,
  activePanel: "widgets",
  device: "desktop",
  leftSidebarOpen: true,
  rightSidebarOpen: true,
  isPreviewMode: false,
  isDirty: false,
  past: [],
  future: [],
  clipboard: null,
  initialize: (data) =>
    set({
      projectId: data.projectId,
      projectSlug: data.projectSlug,
      pageId: data.pageId,
      pageTitle: data.pageTitle,
      pageSlug: data.pageSlug,
      pageStatus: data.pageStatus,
      content: data.content,
      selectedNodeIds: [],
      selectedNodeId: null,
      isDirty: false,
      isPreviewMode: false,
      past: [],
      future: [],
      clipboard: null,
    }),
  setSelectedNodeId: (nodeId) =>
    set({
      selectedNodeIds: nodeId ? [nodeId] : [],
      selectedNodeId: nodeId,
    }),
  toggleNodeSelection: (nodeId) =>
    set((state) => {
      const exists = state.selectedNodeIds.includes(nodeId);
      const selectedNodeIds = exists
        ? state.selectedNodeIds.filter((id) => id !== nodeId)
        : [...state.selectedNodeIds, nodeId];

      return {
        selectedNodeIds,
        selectedNodeId: toPrimarySelection(selectedNodeIds),
      };
    }),
  clearSelection: () => set({ selectedNodeIds: [], selectedNodeId: null }),
  setActivePanel: (panel) => set({ activePanel: panel }),
  setDevice: (device) => set({ device }),
  toggleLeftSidebar: () =>
    set((state) => ({ leftSidebarOpen: !state.leftSidebarOpen })),
  toggleRightSidebar: () =>
    set((state) => ({ rightSidebarOpen: !state.rightSidebarOpen })),
  setPreviewMode: (preview) =>
    set({
      isPreviewMode: preview,
      ...(preview ? { selectedNodeIds: [], selectedNodeId: null } : {}),
    }),
  setPageTitle: (title) => set({ pageTitle: title }),
  markSaved: (status) =>
    set((state) => ({
      isDirty: false,
      ...(status ? { pageStatus: status } : {}),
    })),
  replaceContent: (content, options) =>
    set({
      content,
      isDirty: options?.dirty ?? false,
      past: [],
      future: [],
      selectedNodeIds: [],
      selectedNodeId: null,
    }),
  addWidget: (widgetType, parentId, index) => {
    if (!WidgetRegistry.get(widgetType)) {
      return null;
    }

    const state = get();
    const created = createWidgetNode(widgetType);
    let insertNodeTree = created;
    let insertParentId = parentId;
    let insertIndex = index;
    const selectId = created.id;

    if (insertParentId === null) {
      insertNodeTree = wrapForRoot(created);
      insertIndex = Math.max(
        0,
        Math.min(insertIndex, state.content.root.length),
      );
    } else {
      const parentType = resolveInsertParentType(
        state.content.root,
        insertParentId,
      );

      if (!canAcceptChild(parentType, widgetType)) {
        if (parentType === "section" && widgetType !== "section") {
          insertNodeTree = {
            ...createWidgetNode("container"),
            children: [created],
          };
        } else if (widgetType === "section") {
          insertParentId = null;
          insertNodeTree = createWidgetNode("section");
          insertIndex = state.content.root.length;
        } else {
          return null;
        }
      }
    }

    commitHistory(get, set, {
      label: `Add ${widgetLabel(widgetType)}`,
      action: "add",
      nodeId: selectId,
    });

    const nextRoot = insertNode(
      get().content.root,
      insertParentId,
      insertIndex,
      insertNodeTree,
    );

    applyContent(set, { ...get().content, root: nextRoot }, [selectId]);
    return selectId;
  },
  moveWidget: (nodeId, targetParentId, targetIndex) => {
    const state = get();
    const moving = findNode(state.content.root, nodeId);
    if (!moving) {
      return;
    }

    const parentType = resolveInsertParentType(
      state.content.root,
      targetParentId,
    );

    if (!canAcceptChild(parentType, moving.type)) {
      return;
    }

    commitHistory(get, set, {
      label: `Move ${widgetLabel(moving.type)}`,
      action: "move",
      nodeId,
    });

    const nextRoot = moveNode(
      get().content.root,
      nodeId,
      targetParentId,
      targetIndex,
    );

    applyContent(set, { ...get().content, root: nextRoot }, [nodeId]);
  },
  removeWidget: (nodeId) => {
    const state = get();
    const node = findNode(state.content.root, nodeId);
    if (!node) {
      return;
    }

    commitHistory(get, set, {
      label: `Delete ${widgetLabel(node.type)}`,
      action: "delete",
      nodeId,
    });

    const { tree, removed } = removeNode(get().content.root, nodeId);
    if (!removed) {
      return;
    }

    const selectedNodeIds = get().selectedNodeIds.filter((id) => id !== nodeId);

    applyContent(set, { ...get().content, root: tree }, selectedNodeIds);
  },
  updateNodeProps: (nodeId, props) => {
    const node = findNode(get().content.root, nodeId);
    if (!node) {
      return;
    }

    commitHistory(get, set, {
      label: `Edit ${widgetLabel(node.type)}`,
      action: "update-props",
      nodeId,
    });

    const nextRoot = updateNodePropsInTree(get().content.root, nodeId, props);

    set({
      content: { ...get().content, root: nextRoot },
      isDirty: true,
    });
  },
  updateNodeStyle: (nodeId, updates) => {
    const state = get();
    const node = findNode(state.content.root, nodeId);
    if (!node) {
      return;
    }

    commitHistory(get, set, {
      label: `Style ${widgetLabel(node.type)}`,
      action: "update-style",
      nodeId,
    });

    const nextRoot = updateNodeStyleInTree(
      get().content.root,
      nodeId,
      get().device,
      updates,
    );

    set({
      content: { ...get().content, root: nextRoot },
      isDirty: true,
    });
  },
  copyStylesToDevice: (nodeId, targetDevice) => {
    const state = get();
    const node = findNode(state.content.root, nodeId);
    if (!node) {
      return;
    }

    commitHistory(get, set, {
      label: `Copy styles to ${targetDevice}`,
      action: "copy-styles",
      nodeId,
    });

    const nextStyle = copyDeviceStyles(node.style, state.device, targetDevice);
    const nextRoot = replaceNodeStyle(get().content.root, nodeId, nextStyle);

    set({
      content: { ...get().content, root: nextRoot },
      isDirty: true,
    });
  },
  clearDeviceStyles: (nodeId) => {
    const state = get();
    const node = findNode(state.content.root, nodeId);
    if (!node) {
      return;
    }

    commitHistory(get, set, {
      label: `Clear ${state.device} styles`,
      action: "clear-styles",
      nodeId,
    });

    const nextStyle = clearDeviceStylesHelper(node.style, state.device);
    const nextRoot = replaceNodeStyle(get().content.root, nodeId, nextStyle);

    set({
      content: { ...get().content, root: nextRoot },
      isDirty: true,
    });
  },
  undo: () => {
    const state = get();
    const previous = state.past[state.past.length - 1];
    if (!previous) {
      return;
    }

    const currentEntry = createHistoryEntry({
      label: previous.label,
      action: previous.action,
      content: state.content,
      selectedNodeIds: state.selectedNodeIds,
      nodeId: previous.nodeId,
    });

    set({
      past: state.past.slice(0, -1),
      future: [currentEntry, ...state.future],
      content: clonePageContent(previous.content),
      selectedNodeIds: [...previous.selectedNodeIds],
      selectedNodeId: toPrimarySelection(previous.selectedNodeIds),
      isDirty: true,
    });
  },
  redo: () => {
    const state = get();
    const next = state.future[0];
    if (!next) {
      return;
    }

    const currentEntry = createHistoryEntry({
      label: next.label,
      action: next.action,
      content: state.content,
      selectedNodeIds: state.selectedNodeIds,
      nodeId: next.nodeId,
    });

    set({
      past: pushPastEntry(state.past, currentEntry),
      future: state.future.slice(1),
      content: clonePageContent(next.content),
      selectedNodeIds: [...next.selectedNodeIds],
      selectedNodeId: toPrimarySelection(next.selectedNodeIds),
      isDirty: true,
    });
  },
  canUndo: () => get().past.length > 0,
  canRedo: () => get().future.length > 0,
  jumpToHistory: (entryId) => {
    const state = get();
    const index = state.past.findIndex((entry) => entry.id === entryId);
    if (index < 0) {
      return;
    }

    const steps = state.past.length - index;
    for (let i = 0; i < steps; i += 1) {
      get().undo();
    }
  },
  copySelected: () => {
    const state = get();
    if (!state.selectedNodeId) {
      return false;
    }

    const node = findNode(state.content.root, state.selectedNodeId);
    if (!node) {
      return false;
    }

    set({ clipboard: cloneTree([node])[0] });
    return true;
  },
  pasteClipboard: () => {
    const state = get();
    if (!state.clipboard) {
      return null;
    }

    const pasted = cloneNodeWithNewIds(state.clipboard);
    let parentId: string | null = null;
    let index = state.content.root.length;

    if (state.selectedNodeId) {
      const selected = findNode(state.content.root, state.selectedNodeId);
      const location = findNodeLocation(
        state.content.root,
        state.selectedNodeId,
      );

      if (selected && canAcceptChild(selected.type, pasted.type)) {
        parentId = selected.id;
        index = selected.children.length;
      } else if (location) {
        parentId = location.parentId;
        index = location.index + 1;

        const parentType = resolveInsertParentType(
          state.content.root,
          parentId,
        );
        if (!canAcceptChild(parentType, pasted.type)) {
          if (pasted.type === "section") {
            parentId = null;
            index = state.content.root.length;
          } else {
            return null;
          }
        }
      }
    } else if (pasted.type !== "section") {
      const wrapped = wrapForRoot(pasted);
      commitHistory(get, set, {
        label: `Paste ${widgetLabel(pasted.type)}`,
        action: "paste",
        nodeId: pasted.id,
      });
      const nextRoot = insertNode(
        get().content.root,
        null,
        get().content.root.length,
        wrapped,
      );
      applyContent(set, { ...get().content, root: nextRoot }, [pasted.id]);
      return pasted.id;
    }

    commitHistory(get, set, {
      label: `Paste ${widgetLabel(pasted.type)}`,
      action: "paste",
      nodeId: pasted.id,
    });

    const nextRoot = insertNode(get().content.root, parentId, index, pasted);
    applyContent(set, { ...get().content, root: nextRoot }, [pasted.id]);
    return pasted.id;
  },
  duplicateSelected: () => {
    const state = get();
    if (!state.selectedNodeId) {
      return null;
    }

    const node = findNode(state.content.root, state.selectedNodeId);
    const location = findNodeLocation(
      state.content.root,
      state.selectedNodeId,
    );
    if (!node || !location) {
      return null;
    }

    const duplicate = cloneNodeWithNewIds(node);

    commitHistory(get, set, {
      label: `Duplicate ${widgetLabel(node.type)}`,
      action: "duplicate",
      nodeId: duplicate.id,
    });

    const nextRoot = insertNode(
      get().content.root,
      location.parentId,
      location.index + 1,
      duplicate,
    );

    applyContent(set, { ...get().content, root: nextRoot }, [duplicate.id]);
    return duplicate.id;
  },
  deleteSelected: () => {
    const state = get();
    if (!state.selectedNodeId) {
      return;
    }
    get().removeWidget(state.selectedNodeId);
  },
}));
