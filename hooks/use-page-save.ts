"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { pagesApi } from "@/lib/api/client";
import { useEditorStore } from "@/store/editor-store";

const AUTOSAVE_DELAY_MS = 3000;

export function usePageSave() {
  const projectId = useEditorStore((state) => state.projectId);
  const pageId = useEditorStore((state) => state.pageId);
  const content = useEditorStore((state) => state.content);
  const isDirty = useEditorStore((state) => state.isDirty);
  const markSaved = useEditorStore((state) => state.markSaved);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const contentRef = useRef(content);
  const dirtyRef = useRef(isDirty);

  contentRef.current = content;
  dirtyRef.current = isDirty;

  const save = useCallback(
    async (options?: { createRevision?: boolean; message?: string }) => {
      if (!projectId || !pageId) {
        return false;
      }

      setIsSaving(true);
      setSaveError(null);

      try {
        const result = await pagesApi.save(projectId, pageId, {
          content: contentRef.current,
          createRevision: options?.createRevision ?? false,
          message: options?.message,
        });

        markSaved(result.page.status);
        setLastSavedAt(new Date());
        return true;
      } catch (error) {
        setSaveError(
          error instanceof Error ? error.message : "Failed to save page",
        );
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [markSaved, pageId, projectId],
  );

  const publish = useCallback(async () => {
    if (!projectId || !pageId) {
      return null;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      const page = await pagesApi.publish(projectId, pageId, {
        content: contentRef.current,
      });
      markSaved(page.status);
      setLastSavedAt(new Date());
      return page;
    } catch (error) {
      setSaveError(
        error instanceof Error ? error.message : "Failed to publish page",
      );
      return null;
    } finally {
      setIsSaving(false);
    }
  }, [markSaved, pageId, projectId]);

  useEffect(() => {
    if (!isDirty || !projectId || !pageId) {
      return;
    }

    const timer = window.setTimeout(() => {
      if (!dirtyRef.current) {
        return;
      }
      void save({ createRevision: false });
    }, AUTOSAVE_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [content, isDirty, pageId, projectId, save]);

  return {
    save,
    publish,
    isSaving,
    lastSavedAt,
    saveError,
  };
}
