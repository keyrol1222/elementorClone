"use client";

import type { PageContent } from "@/types";
import type { RenderContext } from "@/renderer/types";
import { RenderNode } from "@/renderer/render-node";
import { SortableChildren } from "@/editor/dnd/sortable-children";
import { cn } from "@/lib/utils";

type PageRendererProps = {
  content: PageContent;
  context: RenderContext;
  className?: string;
};

export function PageRenderer({ content, context, className }: PageRendererProps) {
  const isEditor = context.mode === "editor";

  if (!isEditor) {
    if (content.root.length === 0) {
      return (
        <div
          className={cn(
            "flex min-h-[400px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/20 text-center",
            className,
          )}
        >
          <p className="text-sm font-medium text-muted-foreground">Empty page</p>
          <p className="mt-1 max-w-xs text-xs text-muted-foreground">
            This page has no content yet.
          </p>
        </div>
      );
    }

    return (
      <div className={cn("w-full", className)}>
        {content.root.map((node, index) => (
          <RenderNode
            key={node.id}
            node={node}
            context={context}
            parentId={null}
            index={index}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={cn("group/canvas w-full p-4", className)}>
      <SortableChildren
        parentId={null}
        nodes={content.root}
        emptyLabel="Drag a Section or widget here to start building"
        renderNode={(node, index) => (
          <RenderNode
            key={node.id}
            node={node}
            context={context}
            parentId={null}
            index={index}
          />
        )}
      />
    </div>
  );
}
