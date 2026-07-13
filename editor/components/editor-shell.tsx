"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import "@/editor/widgets";
import type { EditorPageData } from "@/editor/types";
import { EditorDndProvider } from "@/editor/dnd/dnd-provider";
import { useEditorKeyboard } from "@/hooks/use-editor-keyboard";
import { useEditorStore } from "@/store/editor-store";
import { cn } from "@/lib/utils";

const EditorToolbar = dynamic(
  () =>
    import("@/editor/components/editor-toolbar").then(
      (mod) => mod.EditorToolbar,
    ),
  { ssr: false },
);

const EditorLeftSidebar = dynamic(
  () =>
    import("@/editor/components/editor-left-sidebar").then(
      (mod) => mod.EditorLeftSidebar,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-72 animate-pulse border-r bg-muted/30" />
    ),
  },
);

const EditorCanvas = dynamic(
  () =>
    import("@/editor/components/editor-canvas").then(
      (mod) => mod.EditorCanvas,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex flex-1 items-center justify-center bg-muted/40">
        <p className="text-sm text-muted-foreground">Loading canvas…</p>
      </div>
    ),
  },
);

const EditorPropertiesPanel = dynamic(
  () =>
    import("@/editor/components/editor-properties-panel").then(
      (mod) => mod.EditorPropertiesPanel,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-72 animate-pulse border-l bg-muted/30" />
    ),
  },
);

type EditorShellProps = {
  data: EditorPageData;
};

export function EditorShell({ data }: EditorShellProps) {
  const initialize = useEditorStore((state) => state.initialize);
  const leftSidebarOpen = useEditorStore((state) => state.leftSidebarOpen);
  const rightSidebarOpen = useEditorStore((state) => state.rightSidebarOpen);

  useEditorKeyboard();

  useEffect(() => {
    initialize({
      projectId: data.projectId,
      projectSlug: data.projectSlug,
      pageId: data.pageId,
      pageTitle: data.title,
      pageSlug: data.slug,
      pageStatus: data.status,
      content: data.content,
    });
  }, [data, initialize]);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      <EditorDndProvider>
        <EditorToolbar />

        <div className="flex min-h-0 flex-1">
          <div
            className={cn(
              "shrink-0 transition-all duration-300",
              leftSidebarOpen ? "w-72" : "w-0 overflow-hidden",
            )}
          >
            <EditorLeftSidebar />
          </div>

          <EditorCanvas />

          <div
            className={cn(
              "shrink-0 transition-all duration-300",
              rightSidebarOpen ? "w-72" : "w-0 overflow-hidden",
            )}
          >
            <EditorPropertiesPanel />
          </div>
        </div>
      </EditorDndProvider>
    </div>
  );
}
