"use client";

import { WidgetRegistry } from "@/editor/widgets";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

const categoryLabels: Record<string, string> = {
  layout: "Layout",
  basic: "Basic",
  media: "Media",
};

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
                {widgets.map((widget) => {
                  const Icon = widget.icon;

                  return (
                    <button
                      key={widget.type}
                      type="button"
                      className={cn(
                        "flex flex-col items-center gap-2 rounded-lg border bg-card p-3 text-center transition-colors",
                        "hover:border-primary/50 hover:bg-accent",
                        "cursor-grab active:cursor-grabbing",
                      )}
                      title={widget.description}
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="text-xs font-medium">{widget.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}
