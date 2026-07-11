"use client";

import { useDraggable } from "@dnd-kit/core";
import { WidgetRegistry } from "@/editor/widgets";
import type { PaletteDragData } from "@/editor/dnd/types";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

const categoryLabels: Record<string, string> = {
  layout: "Layout",
  basic: "Basic",
  media: "Media",
};

type PaletteItemProps = {
  type: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
};

function PaletteItem({ type, label, description, icon: Icon }: PaletteItemProps) {
  const data: PaletteDragData = {
    kind: "palette",
    widgetType: type,
  };

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette:${type}`,
    data,
  });

  return (
    <button
      ref={setNodeRef}
      type="button"
      className={cn(
        "flex flex-col items-center gap-2 rounded-lg border bg-card p-3 text-center transition-colors",
        "hover:border-primary/50 hover:bg-accent",
        "cursor-grab active:cursor-grabbing",
        isDragging && "opacity-40",
      )}
      title={description}
      {...listeners}
      {...attributes}
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
}

export function WidgetsPanel() {
  const categories = WidgetRegistry.getCategories();

  return (
    <ScrollArea className="h-full">
      <div className="space-y-6 p-4">
        {categories.map((category) => {
          const widgets = WidgetRegistry.getByCategory(category);

          return (
            <div key={category} className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {categoryLabels[category] ?? category}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {widgets.map((widget) => (
                  <PaletteItem
                    key={widget.type}
                    type={widget.type}
                    label={widget.label}
                    description={widget.description}
                    icon={widget.icon}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}
