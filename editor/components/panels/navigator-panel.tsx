"use client";

import { WidgetRegistry } from "@/editor/widgets";
import { flattenNodes } from "@/editor/utils";
import { useEditorStore } from "@/store/editor-store";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

export function NavigatorPanel() {
  const { content, selectedNodeId, setSelectedNodeId } = useEditorStore();
  const nodes = flattenNodes(content.root);

  return (
    <ScrollArea className="h-full">
      <div className="space-y-1 p-2">
        {nodes.length === 0 ? (
          <p className="p-4 text-center text-sm text-muted-foreground">
            No elements to navigate.
          </p>
        ) : (
          nodes.map((node) => {
            const widget = WidgetRegistry.get(node.type);
            const Icon = widget?.icon;
            const isSelected = selectedNodeId === node.id;

            return (
              <button
                key={node.id}
                type="button"
                onClick={() => setSelectedNodeId(node.id)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors",
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent",
                )}
                style={{ paddingLeft: `${node.depth * 12 + 8}px` }}
              >
                {Icon && <Icon className="h-3.5 w-3.5 shrink-0" />}
                <span className="truncate capitalize">
                  {widget?.label ?? node.type}
                </span>
                <span className="ml-auto truncate text-xs opacity-60">
                  {node.label}
                </span>
              </button>
            );
          })
        )}
      </div>
    </ScrollArea>
  );
}
