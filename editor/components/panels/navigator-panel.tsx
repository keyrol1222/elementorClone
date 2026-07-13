"use client";

import { WidgetRegistry } from "@/editor/widgets";
import { flattenNodes } from "@/editor/utils";
import { useEditorStore } from "@/store/editor-store";
import { VirtualList } from "@/components/virtual-list";
import { cn } from "@/lib/utils";

const VIRTUALIZE_THRESHOLD = 40;

export function NavigatorPanel() {
  const { content, selectedNodeId, setSelectedNodeId } = useEditorStore();
  const nodes = flattenNodes(content.root);

  if (nodes.length === 0) {
    return (
      <p className="p-4 text-center text-sm text-muted-foreground">
        No elements to navigate.
      </p>
    );
  }

  function renderRow(node: (typeof nodes)[number]) {
    const widget = WidgetRegistry.get(node.type);
    const Icon = widget?.icon;
    const isSelected = selectedNodeId === node.id;

    return (
      <button
        type="button"
        onClick={() => setSelectedNodeId(node.id)}
        className={cn(
          "flex h-full w-full items-center gap-2 px-2 text-left text-sm transition-colors",
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
        <span className="ml-auto truncate text-xs opacity-60">{node.label}</span>
      </button>
    );
  }

  if (nodes.length < VIRTUALIZE_THRESHOLD) {
    return (
      <div className="space-y-0.5 overflow-auto p-2">
        {nodes.map((node) => (
          <div key={node.id} className="h-9">
            {renderRow(node)}
          </div>
        ))}
      </div>
    );
  }

  return (
    <VirtualList
      items={nodes}
      estimateSize={36}
      className="p-2"
      getItemKey={(node) => node.id}
      renderItem={(node) => renderRow(node)}
    />
  );
}
