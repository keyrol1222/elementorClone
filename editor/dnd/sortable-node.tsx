"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import type { ReactNode } from "react";
import {
  nodeSortableId,
  type NodeDragData,
} from "@/editor/dnd/types";
import { WidgetRegistry } from "@/editor/widgets/registry";
import { cn } from "@/lib/utils";

type SortableNodeProps = {
  nodeId: string;
  type: string;
  label: string;
  parentId: string | null;
  index: number;
  isSelected: boolean;
  isContainer: boolean;
  onSelect: (nodeId: string | null) => void;
  children: ReactNode;
};

export function SortableNode({
  nodeId,
  type,
  label,
  parentId,
  index,
  isSelected,
  isContainer,
  onSelect,
  children,
}: SortableNodeProps) {
  const data: NodeDragData = {
    kind: "node",
    nodeId,
    parentId,
    index,
  };

  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: nodeSortableId(nodeId),
    data,
  });

  const widget = WidgetRegistry.get(type);
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      data-node-id={nodeId}
      data-node-type={type}
      className={cn(
        "group/selection relative transition-shadow",
        isSelected
          ? "ring-2 ring-primary ring-offset-1"
          : "hover:ring-1 hover:ring-primary/40 hover:ring-offset-1",
        isContainer && "min-h-[40px]",
        isDragging && "z-30 opacity-40",
      )}
      onClick={(event) => {
        event.stopPropagation();
        onSelect(nodeId);
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.stopPropagation();
          onSelect(nodeId);
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`Select ${label}`}
      aria-pressed={isSelected}
    >
      <button
        type="button"
        ref={setActivatorNodeRef}
        className={cn(
          "absolute -left-3 top-1 z-20 flex h-6 w-6 items-center justify-center rounded border bg-background text-muted-foreground opacity-0 shadow-sm transition-opacity",
          "hover:text-foreground group-hover/selection:opacity-100",
          isSelected && "opacity-100",
          "cursor-grab active:cursor-grabbing",
        )}
        {...attributes}
        {...listeners}
        onClick={(event) => event.stopPropagation()}
        aria-label={`Drag ${label}`}
      >
        <GripVertical className="h-3.5 w-3.5" />
      </button>

      {isSelected && (
        <div className="pointer-events-none absolute -top-6 left-0 z-20 flex items-center gap-1 rounded-t bg-primary px-2 py-0.5 text-[10px] font-medium text-primary-foreground">
          {widget?.label ?? label}
        </div>
      )}
      {children}
    </div>
  );
}
