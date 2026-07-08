"use client";

import type { EditorNode } from "@/types";
import { DEVICE_WIDTHS } from "@/editor/types";
import { WidgetRegistry } from "@/editor/widgets";
import { useEditorStore } from "@/store/editor-store";
import { cn } from "@/lib/utils";

type CanvasNodeProps = {
  node: EditorNode;
};

function CanvasNode({ node }: CanvasNodeProps) {
  const { selectedNodeId, setSelectedNodeId, isPreviewMode } = useEditorStore();
  const widget = WidgetRegistry.get(node.type);
  const Icon = widget?.icon;
  const isSelected = selectedNodeId === node.id && !isPreviewMode;
  const label =
    typeof node.props.text === "string"
      ? node.props.text
      : typeof node.props.label === "string"
        ? node.props.label
        : widget?.label ?? node.type;

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => !isPreviewMode && setSelectedNodeId(node.id)}
        className={cn(
          "w-full rounded-lg border-2 border-dashed p-4 text-left transition-all",
          isSelected
            ? "border-primary bg-primary/5 ring-2 ring-primary/20"
            : "border-border bg-card hover:border-primary/40",
          isPreviewMode && "cursor-default",
        )}
      >
        <div className="flex items-center gap-2 text-sm font-medium">
          {Icon && <Icon className="h-4 w-4 text-primary" />}
          <span className="capitalize">{widget?.label ?? node.type}</span>
        </div>
        <p className="mt-1 truncate text-xs text-muted-foreground">{label}</p>
      </button>

      {node.children.length > 0 && (
        <div className="ml-4 space-y-2 border-l-2 border-dashed border-border pl-4">
          {node.children.map((child) => (
            <CanvasNode key={child.id} node={child} />
          ))}
        </div>
      )}
    </div>
  );
}

export function EditorCanvas() {
  const { content, device, isPreviewMode, setSelectedNodeId } = useEditorStore();
  const canvasWidth = DEVICE_WIDTHS[device];

  return (
    <div
      className="flex h-full flex-1 items-start justify-center overflow-auto bg-muted/40 p-8"
      onClick={() => setSelectedNodeId(null)}
    >
      <div
        className={cn(
          "min-h-[600px] w-full rounded-xl border bg-background shadow-sm transition-all duration-300",
          isPreviewMode && "shadow-lg",
        )}
        style={{ maxWidth: canvasWidth }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="border-b px-4 py-2">
          <p className="text-xs text-muted-foreground">
            {isPreviewMode ? "Preview mode" : "Canvas"} · {device} ({canvasWidth}px)
          </p>
        </div>

        <div className="p-6">
          {content.root.length === 0 ? (
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/20 text-center">
              <p className="text-sm font-medium text-muted-foreground">
                Empty canvas
              </p>
              <p className="mt-1 max-w-xs text-xs text-muted-foreground">
                Drag widgets from the left panel onto the canvas. Full rendering
                arrives in Phase 4, drag-and-drop in Phase 5.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {content.root.map((node) => (
                <CanvasNode key={node.id} node={node} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
