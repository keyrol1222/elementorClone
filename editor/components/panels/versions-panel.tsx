"use client";

import { useCallback, useEffect, useState } from "react";
import { History, RotateCcw } from "lucide-react";
import { pagesApi } from "@/lib/api/client";
import { parsePageContent } from "@/lib/page-content";
import { useEditorStore } from "@/store/editor-store";
import type {
  PublishVersionSummary,
  RevisionSummary,
} from "@/types/versioning";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

function formatDate(value: string): string {
  return new Date(value).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function VersionsPanel() {
  const projectId = useEditorStore((state) => state.projectId);
  const pageId = useEditorStore((state) => state.pageId);
  const replaceContent = useEditorStore((state) => state.replaceContent);
  const markSaved = useEditorStore((state) => state.markSaved);
  const [revisions, setRevisions] = useState<RevisionSummary[]>([]);
  const [versions, setVersions] = useState<PublishVersionSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [restoringId, setRestoringId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!projectId || !pageId) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [nextRevisions, nextVersions] = await Promise.all([
        pagesApi.listRevisions(projectId, pageId),
        pagesApi.listPublishVersions(projectId, pageId),
      ]);
      setRevisions(nextRevisions);
      setVersions(nextVersions);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load versions");
    } finally {
      setLoading(false);
    }
  }, [pageId, projectId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleRestore(revisionId: string) {
    setRestoringId(revisionId);
    setError(null);

    try {
      const page = await pagesApi.restoreRevision(
        projectId,
        pageId,
        revisionId,
      );
      replaceContent(parsePageContent(page.content), { dirty: false });
      markSaved(page.status);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to restore");
    } finally {
      setRestoringId(null);
    }
  }

  return (
    <ScrollArea className="h-full">
      <div className="space-y-4 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Versions</h3>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
            onClick={() => void load()}
          >
            Refresh
          </Button>
        </div>

        {error && (
          <p className="rounded-md bg-destructive/10 p-2 text-xs text-destructive">
            {error}
          </p>
        )}

        {loading ? (
          <p className="text-xs text-muted-foreground">Loading…</p>
        ) : (
          <>
            <div className="space-y-2">
              <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Publish versions
              </p>
              {versions.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  No publishes yet.
                </p>
              ) : (
                versions.map((version) => (
                  <div
                    key={version.id}
                    className="rounded-md border px-3 py-2"
                  >
                    <p className="text-xs font-medium">
                      Published v{version.version}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {formatDate(version.publishedAt)}
                    </p>
                  </div>
                ))
              )}
            </div>

            <Separator />

            <div className="space-y-2">
              <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Revisions
              </p>
              {revisions.length === 0 ? (
                <div className="flex flex-col items-center py-6 text-center">
                  <History className="mb-2 h-8 w-8 text-muted-foreground/40" />
                  <p className="text-xs text-muted-foreground">
                    Manual saves and publishes create revisions.
                  </p>
                </div>
              ) : (
                revisions.map((revision) => (
                  <div
                    key={revision.id}
                    className="flex items-start gap-2 rounded-md border px-3 py-2"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium">
                        v{revision.version}
                        {revision.message ? ` · ${revision.message}` : ""}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {formatDate(revision.createdAt)}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-7 shrink-0 text-xs"
                      disabled={restoringId === revision.id}
                      onClick={() => void handleRestore(revision.id)}
                    >
                      <RotateCcw className="mr-1 h-3 w-3" />
                      Restore
                    </Button>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </ScrollArea>
  );
}
