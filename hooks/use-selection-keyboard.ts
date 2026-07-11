"use client";

import { useCallback, useEffect } from "react";
import { useEditorStore } from "@/store/editor-store";

/**
 * Keyboard shortcuts for the selection system (Escape to clear).
 * Copy/paste/duplicate/delete shortcuts arrive in Phase 8.
 */
export function useSelectionKeyboard() {
  const clearSelection = useEditorStore((state) => state.clearSelection);
  const isPreviewMode = useEditorStore((state) => state.isPreviewMode);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (isPreviewMode) {
        return;
      }

      if (event.key === "Escape") {
        clearSelection();
      }
    },
    [clearSelection, isPreviewMode],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}
