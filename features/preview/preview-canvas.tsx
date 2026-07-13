"use client";

import "@/editor/widgets";
import type { PageContent } from "@/types";
import type { EditorDevice } from "@/editor/types";
import { PageRenderer } from "@/renderer/page-renderer";
import { cn } from "@/lib/utils";

type PreviewCanvasProps = {
  content: PageContent;
  device?: EditorDevice;
  mode?: "preview" | "published";
  className?: string;
};

export function PreviewCanvas({
  content,
  device = "desktop",
  mode = "preview",
  className,
}: PreviewCanvasProps) {
  return (
    <div className={cn("min-h-screen bg-background", className)}>
      <PageRenderer
        content={content}
        context={{
          mode,
          device,
          selectedNodeId: null,
          onSelectNode: () => undefined,
        }}
      />
    </div>
  );
}
