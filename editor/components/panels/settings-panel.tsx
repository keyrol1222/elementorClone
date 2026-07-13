"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { pagesApi, templatesApi } from "@/lib/api/client";
import { parsePageContent } from "@/lib/page-content";
import { useEditorStore } from "@/store/editor-store";
import type { TemplateSummary } from "@/types/versioning";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export function SettingsPanel() {
  const {
    projectId,
    pageId,
    pageTitle,
    pageSlug,
    pageStatus,
    device,
    content,
    projectSlug,
    replaceContent,
    markSaved,
  } = useEditorStore();

  const [templates, setTemplates] = useState<TemplateSummary[]>([]);
  const [templateName, setTemplateName] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadTemplates = useCallback(async () => {
    try {
      const list = await templatesApi.list();
      setTemplates(list);
    } catch {
      // Non-blocking for settings panel
    }
  }, []);

  useEffect(() => {
    void loadTemplates();
  }, [loadTemplates]);

  async function handleSaveAsTemplate() {
    if (!templateName.trim()) {
      setError("Template name is required");
      return;
    }

    setBusy(true);
    setError(null);
    setMessage(null);

    try {
      await templatesApi.create({
        name: templateName.trim(),
        type: "PAGE",
        content,
        description: `Saved from ${pageTitle}`,
      });
      setTemplateName("");
      setMessage("Template saved");
      await loadTemplates();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save template");
    } finally {
      setBusy(false);
    }
  }

  async function handleApplyTemplate(
    templateId: string,
    mode: "replace" | "append",
  ) {
    setBusy(true);
    setError(null);
    setMessage(null);

    try {
      const page = await pagesApi.applyTemplate(projectId, pageId, {
        templateId,
        mode,
      });
      replaceContent(parsePageContent(page.content), { dirty: false });
      markSaved(page.status);
      setMessage(mode === "replace" ? "Template applied" : "Template appended");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to apply template");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ScrollArea className="h-full">
      <div className="space-y-6 p-4">
        <div>
          <h3 className="mb-3 text-sm font-semibold">Page Settings</h3>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Title</Label>
              <p className="text-sm font-medium">{pageTitle}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Slug</Label>
              <p className="text-sm font-medium">/{pageSlug}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Status</Label>
              <Badge variant="secondary">{pageStatus}</Badge>
            </div>
            {pageStatus === "PUBLISHED" && (
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Live URL</Label>
                <p className="break-all text-xs text-muted-foreground">
                  /p/{projectSlug}/{pageSlug}
                </p>
              </div>
            )}
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="mb-3 text-sm font-semibold">Editor</h3>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">
              Active device
            </Label>
            <p className="text-sm font-medium capitalize">{device}</p>
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <h3 className="text-sm font-semibold">Templates</h3>
          <div className="space-y-2">
            <Label htmlFor="template-name" className="text-xs">
              Save page as template
            </Label>
            <Input
              id="template-name"
              value={templateName}
              onChange={(event) => setTemplateName(event.target.value)}
              placeholder="My landing page"
              className="h-8 text-xs"
            />
            <Button
              type="button"
              size="sm"
              className="h-8 w-full text-xs"
              disabled={busy}
              onClick={() => void handleSaveAsTemplate()}
            >
              {busy ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : null}
              Save as template
            </Button>
          </div>

          <div className="space-y-2">
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Apply template
            </p>
            {templates.length === 0 ? (
              <p className="text-xs text-muted-foreground">No templates yet.</p>
            ) : (
              templates.map((template) => (
                <div
                  key={template.id}
                  className="space-y-2 rounded-md border p-2"
                >
                  <div>
                    <p className="text-xs font-medium">{template.name}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {template.type}
                      {template.description ? ` · ${template.description}` : ""}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-7 flex-1 text-[10px]"
                      disabled={busy}
                      onClick={() =>
                        void handleApplyTemplate(template.id, "replace")
                      }
                    >
                      Replace
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 flex-1 text-[10px]"
                      disabled={busy}
                      onClick={() =>
                        void handleApplyTemplate(template.id, "append")
                      }
                    >
                      Append
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          {message && (
            <p className="text-xs text-emerald-600 dark:text-emerald-400">
              {message}
            </p>
          )}
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
      </div>
    </ScrollArea>
  );
}
