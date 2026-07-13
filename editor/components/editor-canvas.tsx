"use client";

import { useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { DEVICE_WIDTHS } from "@/editor/types";
import { PageRenderer } from "@/renderer/page-renderer";
import type { RenderContext } from "@/renderer/types";
import { useEditorStore } from "@/store/editor-store";
import { cn } from "@/lib/utils";

export function EditorCanvas() {
  const content = useEditorStore((state) => state.content);
  const device = useEditorStore((state) => state.device);
  const isPreviewMode = useEditorStore((state) => state.isPreviewMode);
  const selectedNodeId = useEditorStore((state) => state.selectedNodeId);
  const setSelectedNodeId = useEditorStore((state) => state.setSelectedNodeId);
  const canvasWidth = DEVICE_WIDTHS[device];

  const handleSelectNode = useCallback(
    (nodeId: string | null) => {
      if (isPreviewMode) {
        return;
      }
      setSelectedNodeId(nodeId);
    },
    [isPreviewMode, setSelectedNodeId],
  );

  const renderContext = useMemo<RenderContext>(
    () => ({
      mode: isPreviewMode ? "preview" : "editor",
      device,
      selectedNodeId: isPreviewMode ? null : selectedNodeId,
      onSelectNode: handleSelectNode,
    }),
    [device, handleSelectNode, isPreviewMode, selectedNodeId],
  );

  return (
    <div
      className="flex h-full flex-1 items-start justify-center overflow-auto bg-muted/40 p-8"
      onClick={() => handleSelectNode(null)}
    >
      <motion.div
        layout
        className={cn(
          "min-h-[600px] w-full overflow-hidden rounded-xl border bg-background shadow-sm",
          isPreviewMode && "shadow-lg",
        )}
        animate={{ maxWidth: canvasWidth }}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
        onClick={(event) => event.stopPropagation()}
      >
        {!isPreviewMode && (
          <div className="border-b px-4 py-2">
            <p className="text-xs text-muted-foreground">
              Canvas · {device} ({canvasWidth}px)
            </p>
          </div>
        )}

        <PageRenderer content={content} context={renderContext} />
      </motion.div>
    </div>
  );
}
