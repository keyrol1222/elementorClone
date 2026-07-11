"use client";

import { useEffect } from "react";
import "@/editor/widgets";
import type { EditorPageData } from "@/editor/types";
import { EditorCanvas } from "@/editor/components/editor-canvas";
import { EditorLeftSidebar } from "@/editor/components/editor-left-sidebar";
import { EditorPropertiesPanel } from "@/editor/components/editor-properties-panel";
import { EditorToolbar } from "@/editor/components/editor-toolbar";
import { EditorDndProvider } from "@/editor/dnd/dnd-provider";
import { useSelectionKeyboard } from "@/hooks/use-selection-keyboard";
import { useEditorStore } from "@/store/editor-store";
import { cn } from "@/lib/utils";

type EditorShellProps = {
  data: EditorPageData;
};

export function EditorShell({ data }: EditorShellProps) {
  const initialize = useEditorStore((state) => state.initialize);
  const leftSidebarOpen = useEditorStore((state) => state.leftSidebarOpen);
  const rightSidebarOpen = useEditorStore((state) => state.rightSidebarOpen);

  useSelectionKeyboard();

  useEffect(() => {
    initialize({
      projectId: data.projectId,
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
