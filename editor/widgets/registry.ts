import type { WidgetDefinition } from "@/editor/types";

export class WidgetRegistry {
  private static widgets = new Map<string, WidgetDefinition>();

  static register(widget: WidgetDefinition): void {
    this.widgets.set(widget.type, widget);
  }

  static get(type: string): WidgetDefinition | undefined {
    return this.widgets.get(type);
  }

  static getAll(): WidgetDefinition[] {
    return Array.from(this.widgets.values());
  }

  static getByCategory(category: WidgetDefinition["category"]): WidgetDefinition[] {
    return this.getAll().filter((widget) => widget.category === category);
  }

  static getCategories(): WidgetDefinition["category"][] {
    const categories = new Set<WidgetDefinition["category"]>();
    for (const widget of this.widgets.values()) {
      categories.add(widget.category);
    }
    return Array.from(categories);
  }
}
