export type WidgetDefinition = {
  type: string;
  label: string;
  category: string;
  icon: string;
};

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

  static getByCategory(category: string): WidgetDefinition[] {
    return this.getAll().filter((widget) => widget.category === category);
  }
}
