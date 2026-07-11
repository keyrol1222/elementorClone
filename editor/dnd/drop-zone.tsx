"use client";

import { useDroppable } from "@dnd-kit/core";
import { dropZoneId, type DropZoneData } from "@/editor/dnd/types";
import { cn } from "@/lib/utils";

type DropZoneProps = {
  parentId: string | null;
  index: number;
};

export function DropZone({ parentId, index }: DropZoneProps) {
  const id = dropZoneId(parentId, index);
  const data: DropZoneData = {
    kind: "drop-zone",
    parentId,
    index,
  };

  const { setNodeRef, isOver } = useDroppable({
    id,
    data,
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "relative my-0.5 h-2 w-full transition-all",
        isOver && "h-8",
      )}
      aria-hidden="true"
    >
      <div
        className={cn(
          "absolute inset-x-2 top-1/2 h-0.5 -translate-y-1/2 rounded-full transition-all",
          isOver
            ? "h-1 bg-primary opacity-100"
            : "bg-transparent opacity-0 group-hover/canvas:bg-primary/20 group-hover/canvas:opacity-100",
        )}
      />
      {isOver && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="rounded bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
            Drop here
          </span>
        </div>
      )}
    </div>
  );
}
