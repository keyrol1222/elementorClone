import { create } from "zustand";
import type { PageContent } from "@/types";
import type { EditorDevice, EditorPanel } from "@/editor/types";

type EditorState = {
  projectId: string;
  pageId: string;
  pageTitle: string;
  pageSlug: string;
  pageStatus: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  content: PageContent;
  selectedNodeId: string | null;
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
  setActivePanel: (panel: EditorPanel) => void;
  setDevice: (device: EditorDevice) => void;
  toggleLeftSidebar: () => void;
  toggleRightSidebar: () => void;
  setPreviewMode: (preview: boolean) => void;
  setPageTitle: (title: string) => void;
};

export const useEditorStore = create<EditorState>((set) => ({
  projectId: "",
  pageId: "",
  pageTitle: "",
  pageSlug: "",
  pageStatus: "DRAFT",
  content: { version: 1, root: [] },
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
      selectedNodeId: null,
      isDirty: false,
      isPreviewMode: false,
    }),
  setSelectedNodeId: (nodeId) => set({ selectedNodeId: nodeId }),
  setActivePanel: (panel) => set({ activePanel: panel }),
  setDevice: (device) => set({ device }),
  toggleLeftSidebar: () =>
    set((state) => ({ leftSidebarOpen: !state.leftSidebarOpen })),
  toggleRightSidebar: () =>
    set((state) => ({ rightSidebarOpen: !state.rightSidebarOpen })),
  setPreviewMode: (preview) => set({ isPreviewMode: preview }),
  setPageTitle: (title) => set({ pageTitle: title }),
}));
