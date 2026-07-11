"use client";

import type { ReactNode } from "react";
import { WidgetRegistry } from "@/editor/widgets/registry";
import { cn } from "@/lib/utils";

type SelectionWrapperProps = {
  nodeId: string;
  type: string;
  label: string;
  isSelected: boolean;
  isContainer: boolean;
  onSelect: (nodeId: string | null) => void;
  children: ReactNode;
};

export function SelectionWrapper({
  nodeId,
  type,
  label,
  isSelected,
  isContainer,
  onSelect,
  children,
}: SelectionWrapperProps) {
  const widget = WidgetRegistry.get(type);

  return (
    <div
      data-node-id={nodeId}
      data-node-type={type}
      className={cn(
        "group/selection relative transition-shadow",
        isSelected
          ? "ring-2 ring-primary ring-offset-1"
          : "hover:ring-1 hover:ring-primary/40 hover:ring-offset-1",
        isContainer && "min-h-[40px]",
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
      {isSelected && (
        <div className="pointer-events-none absolute -top-6 left-0 z-20 flex items-center gap-1 rounded-t bg-primary px-2 py-0.5 text-[10px] font-medium text-primary-foreground">
          {widget?.label ?? label}
        </div>
      )}
      {children}
    </div>
  );
}
