import { create } from "zustand";
import type { PageContent } from "@/types";
import type { EditorDevice, EditorPanel } from "@/editor/types";
import { createWidgetNode, wrapForRoot } from "@/editor/create-node";
import {
  canAcceptChild,
  findNode,
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

type SelectionState = {
  selectedNodeIds: string[];
  selectedNodeId: string | null;
};

type EditorState = SelectionState & {
  projectId: string;
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
  initialize: (data: {
    projectId: string;
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

export const useEditorStore = create<EditorState>((set, get) => ({
  projectId: "",
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
  initialize: (data) =>
    set({
      projectId: data.projectId,
      pageId: data.pageId,
      pageTitle: data.pageTitle,
      pageSlug: data.pageSlug,
      pageStatus: data.pageStatus,
      content: data.content,
      selectedNodeIds: [],
      selectedNodeId: null,
      isDirty: false,
      isPreviewMode: false,
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

    const nextRoot = insertNode(
      state.content.root,
      insertParentId,
      insertIndex,
      insertNodeTree,
    );

    set({
      content: { ...state.content, root: nextRoot },
      selectedNodeIds: [selectId],
      selectedNodeId: selectId,
      isDirty: true,
    });

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

    const nextRoot = moveNode(
      state.content.root,
      nodeId,
      targetParentId,
      targetIndex,
    );

    set({
      content: { ...state.content, root: nextRoot },
      selectedNodeIds: [nodeId],
      selectedNodeId: nodeId,
      isDirty: true,
    });
  },
  removeWidget: (nodeId) => {
    const state = get();
    const { tree, removed } = removeNode(state.content.root, nodeId);
    if (!removed) {
      return;
    }

    const selectedNodeIds = state.selectedNodeIds.filter((id) => id !== nodeId);

    set({
      content: { ...state.content, root: tree },
      selectedNodeIds,
      selectedNodeId: toPrimarySelection(selectedNodeIds),
      isDirty: true,
    });
  },
  updateNodeProps: (nodeId, props) => {
    const state = get();
    const nextRoot = updateNodePropsInTree(state.content.root, nodeId, props);

    set({
      content: { ...state.content, root: nextRoot },
      isDirty: true,
    });
  },
  updateNodeStyle: (nodeId, updates) => {
    const state = get();
    const nextRoot = updateNodeStyleInTree(
      state.content.root,
      nodeId,
      state.device,
      updates,
    );

    set({
      content: { ...state.content, root: nextRoot },
      isDirty: true,
    });
  },
  copyStylesToDevice: (nodeId, targetDevice) => {
    const state = get();
    const node = findNode(state.content.root, nodeId);
    if (!node) {
      return;
    }

    const nextStyle = copyDeviceStyles(node.style, state.device, targetDevice);
    const nextRoot = replaceNodeStyle(state.content.root, nodeId, nextStyle);

    set({
      content: { ...state.content, root: nextRoot },
      isDirty: true,
    });
  },
  clearDeviceStyles: (nodeId) => {
    const state = get();
    const node = findNode(state.content.root, nodeId);
    if (!node) {
      return;
    }

    const nextStyle = clearDeviceStylesHelper(node.style, state.device);
    const nextRoot = replaceNodeStyle(state.content.root, nodeId, nextStyle);

    set({
      content: { ...state.content, root: nextRoot },
      isDirty: true,
    });
  },
}));
