"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import type { EditorNode } from "@/types";
import { WidgetRegistry } from "@/editor/widgets";
import { useEditorStore } from "@/store/editor-store";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

type StructureNodeProps = {
  node: EditorNode;
  depth: number;
};

function StructureNode({ node, depth }: StructureNodeProps) {
  const { selectedNodeId, setSelectedNodeId } = useEditorStore();
  const [expanded, setExpanded] = useState(true);
  const widget = WidgetRegistry.get(node.type);
  const Icon = widget?.icon;
  const hasChildren = node.children.length > 0;
  const isSelected = selectedNodeId === node.id;

  return (
    <div>
      <button
        type="button"
        onClick={() => setSelectedNodeId(node.id)}
        className={cn(
          "flex w-full items-center gap-1 rounded-md px-2 py-1.5 text-left text-sm transition-colors",
          isSelected
            ? "bg-primary text-primary-foreground"
            : "hover:bg-accent",
        )}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
      >
        {hasChildren ? (
          <span
            role="button"
            tabIndex={0}
            onClick={(event) => {
              event.stopPropagation();
              setExpanded((value) => !value);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.stopPropagation();
                setExpanded((value) => !value);
              }
            }}
            className="shrink-0"
          >
            {expanded ? (
              <ChevronDown className="h-3.5 w-3.5" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5" />
            )}
          </span>
        ) : (
          <span className="w-3.5 shrink-0" />
        )}
        {Icon && <Icon className="h-3.5 w-3.5 shrink-0" />}
        <span className="truncate capitalize">{widget?.label ?? node.type}</span>
      </button>

      {hasChildren && expanded && (
        <div>
          {node.children.map((child) => (
            <StructureNode key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function StructurePanel() {
  const content = useEditorStore((state) => state.content);

  return (
    <ScrollArea className="h-full">
      <div className="p-2">
        {content.root.length === 0 ? (
          <p className="p-4 text-center text-sm text-muted-foreground">
            No elements on the page yet. Drag widgets onto the canvas in Phase 5.
          </p>
        ) : (
          content.root.map((node) => (
            <StructureNode key={node.id} node={node} depth={0} />
          ))
        )}
      </div>
    </ScrollArea>
  );
}
