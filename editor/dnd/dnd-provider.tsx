"use client";

import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useState, type ReactNode } from "react";
import { findNodeLocation } from "@/editor/tree-ops";
import {
  isDropZoneData,
  isNodeDragData,
  isPaletteDragData,
  parseNodeSortableId,
  type EditorDragData,
} from "@/editor/dnd/types";
import { WidgetRegistry } from "@/editor/widgets/registry";
import { useEditorStore } from "@/store/editor-store";
import { cn } from "@/lib/utils";

type EditorDndProviderProps = {
  children: ReactNode;
};

function resolveDropTarget(
  event: DragEndEvent,
  root: ReturnType<typeof useEditorStore.getState>["content"]["root"],
): { parentId: string | null; index: number } | null {
  const { over } = event;
  if (!over) {
    return null;
  }

  const overData = over.data.current as EditorDragData | undefined;

  if (isDropZoneData(overData)) {
    return { parentId: overData.parentId, index: overData.index };
  }

  if (isNodeDragData(overData)) {
    return { parentId: overData.parentId, index: overData.index };
  }

  const overNodeId = parseNodeSortableId(String(over.id));
  if (overNodeId) {
    const location = findNodeLocation(root, overNodeId);
    if (location) {
      return { parentId: location.parentId, index: location.index };
    }
  }

  if (String(over.id) === "drop:root") {
    return { parentId: null, index: root.length };
  }

  return null;
}

export function EditorDndProvider({ children }: EditorDndProviderProps) {
  const addWidget = useEditorStore((state) => state.addWidget);
  const moveWidget = useEditorStore((state) => state.moveWidget);
  const content = useEditorStore((state) => state.content);
  const isPreviewMode = useEditorStore((state) => state.isPreviewMode);
  const [activeLabel, setActiveLabel] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragStart(event: DragStartEvent) {
    if (isPreviewMode) {
      return;
    }

    const data = event.active.data.current as EditorDragData | undefined;

    if (isPaletteDragData(data)) {
      const widget = WidgetRegistry.get(data.widgetType);
      setActiveLabel(widget?.label ?? data.widgetType);
      return;
    }

    if (isNodeDragData(data)) {
      const widget = WidgetRegistry.get(
        findNodeType(content.root, data.nodeId) ?? data.nodeId,
      );
      setActiveLabel(widget?.label ?? "Element");
    }
  }

  function handleDragOver(_event: DragOverEvent) {
    // Reserved for future snap-line / indicator refinements
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveLabel(null);

    if (isPreviewMode) {
      return;
    }

    const { active } = event;
    const data = active.data.current as EditorDragData | undefined;
    const target = resolveDropTarget(event, useEditorStore.getState().content.root);

    if (!target) {
      return;
    }

    if (isPaletteDragData(data)) {
      addWidget(data.widgetType, target.parentId, target.index);
      return;
    }

    if (isNodeDragData(data)) {
      moveWidget(data.nodeId, target.parentId, target.index);
    }
  }

  function handleDragCancel() {
    setActiveLabel(null);
  }

  if (isPreviewMode) {
    return <>{children}</>;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      {children}
      <DragOverlay dropAnimation={null}>
        {activeLabel ? (
          <div
            className={cn(
              "rounded-md border bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-lg",
            )}
          >
            {activeLabel}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

function findNodeType(
  nodes: ReturnType<typeof useEditorStore.getState>["content"]["root"],
  nodeId: string,
): string | null {
  for (const node of nodes) {
    if (node.id === nodeId) {
      return node.type;
    }
    const nested = findNodeType(node.children, nodeId);
    if (nested) {
      return nested;
    }
  }
  return null;
}
