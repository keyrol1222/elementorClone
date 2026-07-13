"use client";

import { useCallback, useEffect } from "react";
import { useEditorStore } from "@/store/editor-store";

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  if (target.isContentEditable) {
    return true;
  }

  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
}

/**
 * Editor keyboard shortcuts:
 * Escape — clear selection
 * Cmd/Ctrl+Z — undo
 * Cmd/Ctrl+Shift+Z or Cmd/Ctrl+Y — redo
 * Cmd/Ctrl+C — copy
 * Cmd/Ctrl+V — paste
 * Cmd/Ctrl+D — duplicate
 * Delete / Backspace — delete selected
 */
export function useEditorKeyboard() {
  const isPreviewMode = useEditorStore((state) => state.isPreviewMode);
  const clearSelection = useEditorStore((state) => state.clearSelection);
  const undo = useEditorStore((state) => state.undo);
  const redo = useEditorStore((state) => state.redo);
  const copySelected = useEditorStore((state) => state.copySelected);
  const pasteClipboard = useEditorStore((state) => state.pasteClipboard);
  const duplicateSelected = useEditorStore((state) => state.duplicateSelected);
  const deleteSelected = useEditorStore((state) => state.deleteSelected);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (isPreviewMode) {
        return;
      }

      if (event.key === "Escape") {
        clearSelection();
        return;
      }

      const mod = event.metaKey || event.ctrlKey;
      const editable = isEditableTarget(event.target);

      if (mod && event.key.toLowerCase() === "z" && !event.shiftKey) {
        if (editable) {
          return;
        }
        event.preventDefault();
        undo();
        return;
      }

      if (
        (mod && event.key.toLowerCase() === "z" && event.shiftKey) ||
        (mod && event.key.toLowerCase() === "y")
      ) {
        if (editable) {
          return;
        }
        event.preventDefault();
        redo();
        return;
      }

      if (mod && event.key.toLowerCase() === "c") {
        if (editable) {
          return;
        }
        event.preventDefault();
        copySelected();
        return;
      }

      if (mod && event.key.toLowerCase() === "v") {
        if (editable) {
          return;
        }
        event.preventDefault();
        pasteClipboard();
        return;
      }

      if (mod && event.key.toLowerCase() === "d") {
        if (editable) {
          return;
        }
        event.preventDefault();
        duplicateSelected();
        return;
      }

      if (event.key === "Delete" || event.key === "Backspace") {
        if (editable) {
          return;
        }
        event.preventDefault();
        deleteSelected();
      }
    },
    [
      clearSelection,
      copySelected,
      deleteSelected,
      duplicateSelected,
      isPreviewMode,
      pasteClipboard,
      redo,
      undo,
    ],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}
