"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { ReactNode } from "react";
import { DropZone } from "@/editor/dnd/drop-zone";
import {
  ROOT_DROPPABLE_ID,
  nodeSortableId,
  type DropZoneData,
} from "@/editor/dnd/types";
import type { EditorNode } from "@/types";
import { cn } from "@/lib/utils";

type SortableChildrenProps = {
  parentId: string | null;
  nodes: EditorNode[];
  renderNode: (node: EditorNode, index: number) => ReactNode;
  emptyLabel?: string;
};

export function SortableChildren({
  parentId,
  nodes,
  renderNode,
  emptyLabel = "Drop widgets here",
}: SortableChildrenProps) {
  const droppableId =
    parentId === null ? ROOT_DROPPABLE_ID : `container:${parentId}`;
  const emptyData: DropZoneData = {
    kind: "drop-zone",
    parentId,
    index: 0,
  };

  const { setNodeRef, isOver } = useDroppable({
    id: droppableId,
    data: emptyData,
  });

  const itemIds = nodes.map((node) => nodeSortableId(node.id));

  if (nodes.length === 0) {
    return (
      <div
        ref={setNodeRef}
        className={cn(
          "flex min-h-[72px] items-center justify-center rounded-lg border-2 border-dashed px-4 py-6 text-center text-xs text-muted-foreground transition-colors",
          isOver
            ? "border-primary bg-primary/5 text-primary"
            : "border-muted-foreground/25",
        )}
      >
        {emptyLabel}
      </div>
    );
  }

  return (
    <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
      <div ref={setNodeRef} className="w-full">
        <DropZone parentId={parentId} index={0} />
        {nodes.map((node, index) => (
          <div key={node.id}>
            {renderNode(node, index)}
            <DropZone parentId={parentId} index={index + 1} />
          </div>
        ))}
      </div>
    </SortableContext>
  );
}
