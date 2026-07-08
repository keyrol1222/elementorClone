"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft,
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
import { pagesApi } from "@/lib/api/client";
import type { EditorDevice } from "@/editor/types";
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
  const [isPublishing, setIsPublishing] = useState(false);
  const {
    projectId,
    pageId,
    pageTitle,
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
  } = useEditorStore();

  async function handlePublish() {
    setIsPublishing(true);

    try {
      await pagesApi.publish(projectId, pageId);
      router.refresh();
    } finally {
      setIsPublishing(false);
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
        {isDirty && (
          <Badge variant="outline" className="shrink-0 text-[10px]">
            Unsaved
          </Badge>
        )}
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              disabled
              title="Undo — Phase 8"
            >
              <Undo2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Undo (Phase 8)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              disabled
              title="Redo — Phase 8"
            >
              <Redo2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Redo (Phase 8)</TooltipContent>
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
        <TooltipContent>Toggle preview mode</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8" disabled>
            <Save className="mr-1.5 h-3.5 w-3.5" />
            Save
          </Button>
        </TooltipTrigger>
        <TooltipContent>Save (Phase 9)</TooltipContent>
      </Tooltip>

      <Button
        size="sm"
        className="h-8"
        onClick={handlePublish}
        disabled={isPublishing}
      >
        {isPublishing ? (
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
