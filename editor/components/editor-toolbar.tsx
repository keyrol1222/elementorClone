"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ExternalLink,
  Eye,
  EyeOff,
  Loader2,
  Monitor,
  PanelLeft,
  PanelRight,
  Redo2,
  Save,
  Smartphone,
  Tablet,
  Undo2,
  Upload,
} from "lucide-react";
import type { EditorDevice } from "@/editor/types";
import { usePageSave } from "@/hooks/use-page-save";
import { useEditorStore } from "@/store/editor-store";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const devices: { id: EditorDevice; icon: typeof Monitor; label: string }[] = [
  { id: "desktop", icon: Monitor, label: "Desktop" },
  { id: "tablet", icon: Tablet, label: "Tablet" },
  { id: "mobile", icon: Smartphone, label: "Mobile" },
];

export function EditorToolbar() {
  const router = useRouter();
  const {
    projectId,
    projectSlug,
    pageId,
    pageTitle,
    pageSlug,
    pageStatus,
    device,
    setDevice,
    isPreviewMode,
    setPreviewMode,
    isDirty,
    leftSidebarOpen,
    rightSidebarOpen,
    toggleLeftSidebar,
    toggleRightSidebar,
    past,
    future,
    undo,
    redo,
  } = useEditorStore();

  const { save, publish, isSaving, lastSavedAt, saveError } = usePageSave();

  const canUndo = past.length > 0;
  const canRedo = future.length > 0;
  const liveUrl =
    pageStatus === "PUBLISHED" ? `/p/${projectSlug}/${pageSlug}` : null;

  async function handleSave() {
    const ok = await save({ createRevision: true, message: "Manual save" });
    if (ok) {
      router.refresh();
    }
  }

  async function handlePublish() {
    const page = await publish();
    if (page) {
      router.refresh();
    }
  }

  return (
    <header className="flex h-12 items-center gap-2 border-b bg-card px-3">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
            <Link href={`/dashboard/projects/${projectId}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Back to project</TooltipContent>
      </Tooltip>

      <Separator orientation="vertical" className="h-6" />

      <div className="flex min-w-0 items-center gap-2">
        <span className="truncate text-sm font-medium">{pageTitle}</span>
        <Badge variant="secondary" className="shrink-0 text-[10px]">
          {pageStatus}
        </Badge>
        {isDirty ? (
          <Badge variant="outline" className="shrink-0 text-[10px]">
            Unsaved
          </Badge>
        ) : lastSavedAt ? (
          <Badge variant="outline" className="shrink-0 text-[10px]">
            Saved
          </Badge>
        ) : null}
      </div>

      <div className="flex-1" />

      {saveError && (
        <span className="hidden max-w-[160px] truncate text-[10px] text-destructive sm:inline">
          {saveError}
        </span>
      )}

      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              disabled={!canUndo}
              onClick={() => undo()}
            >
              <Undo2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Undo (⌘Z)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              disabled={!canRedo}
              onClick={() => redo()}
            >
              <Redo2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Redo (⌘⇧Z)</TooltipContent>
        </Tooltip>
      </div>

      <Separator orientation="vertical" className="h-6" />

      <div className="flex items-center rounded-lg border bg-muted/50 p-0.5">
        {devices.map((item) => {
          const Icon = item.icon;
          const isActive = device === item.id;

          return (
            <Tooltip key={item.id}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-7 w-7",
                    isActive && "bg-background shadow-sm",
                  )}
                  onClick={() => setDevice(item.id)}
                >
                  <Icon className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{item.label}</TooltipContent>
            </Tooltip>
          );
        })}
      </div>

      <Separator orientation="vertical" className="h-6" />

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={isPreviewMode ? "secondary" : "ghost"}
            size="sm"
            className="h-8"
            onClick={() => setPreviewMode(!isPreviewMode)}
          >
            {isPreviewMode ? (
              <EyeOff className="mr-1.5 h-3.5 w-3.5" />
            ) : (
              <Eye className="mr-1.5 h-3.5 w-3.5" />
            )}
            Preview
          </Button>
        </TooltipTrigger>
        <TooltipContent>Canvas preview mode</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
            <Link href={`/preview/${projectId}/${pageId}`} target="_blank">
              <ExternalLink className="h-4 w-4" />
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Open full preview</TooltipContent>
      </Tooltip>

      {liveUrl && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8" asChild>
              <Link href={liveUrl} target="_blank">
                Live
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Open published page</TooltipContent>
        </Tooltip>
      )}

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8"
            disabled={isSaving}
            onClick={() => void handleSave()}
          >
            {isSaving ? (
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="mr-1.5 h-3.5 w-3.5" />
            )}
            Save
          </Button>
        </TooltipTrigger>
        <TooltipContent>Save draft + revision (autosaves too)</TooltipContent>
      </Tooltip>

      <Button
        size="sm"
        className="h-8"
        onClick={() => void handlePublish()}
        disabled={isSaving}
      >
        {isSaving ? (
          <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
        ) : (
          <Upload className="mr-1.5 h-3.5 w-3.5" />
        )}
        Publish
      </Button>

      <Separator orientation="vertical" className="h-6" />

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={toggleLeftSidebar}
          >
            <PanelLeft className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {leftSidebarOpen ? "Hide" : "Show"} left panel
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={toggleRightSidebar}
          >
            <PanelRight className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {rightSidebarOpen ? "Hide" : "Show"} properties
        </TooltipContent>
      </Tooltip>
    </header>
  );
}
