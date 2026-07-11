export const ROOT_DROPPABLE_ID = "drop:root";

export type PaletteDragData = {
  kind: "palette";
  widgetType: string;
};

export type NodeDragData = {
  kind: "node";
  nodeId: string;
  parentId: string | null;
  index: number;
};

export type DropZoneData = {
  kind: "drop-zone";
  parentId: string | null;
  index: number;
};

export type EditorDragData = PaletteDragData | NodeDragData | DropZoneData;

export function isPaletteDragData(data: unknown): data is PaletteDragData {
  return (
    typeof data === "object" &&
    data !== null &&
    "kind" in data &&
    (data as PaletteDragData).kind === "palette" &&
    typeof (data as PaletteDragData).widgetType === "string"
  );
}

export function isNodeDragData(data: unknown): data is NodeDragData {
  return (
    typeof data === "object" &&
    data !== null &&
    "kind" in data &&
    (data as NodeDragData).kind === "node" &&
    typeof (data as NodeDragData).nodeId === "string"
  );
}

export function isDropZoneData(data: unknown): data is DropZoneData {
  return (
    typeof data === "object" &&
    data !== null &&
    "kind" in data &&
    (data as DropZoneData).kind === "drop-zone"
  );
}

export function dropZoneId(parentId: string | null, index: number): string {
  return `drop:${parentId ?? "root"}:${index}`;
}

export function nodeSortableId(nodeId: string): string {
  return `node:${nodeId}`;
}

export function parseNodeSortableId(id: string): string | null {
  if (!id.startsWith("node:")) {
    return null;
  }
  return id.slice(5);
}
