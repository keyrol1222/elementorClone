import type { EditorNode } from "@/types";
import type { WidgetDefaults } from "@/types/widget";

function createId(type: string): string {
  return `${type}-${Math.random().toString(36).slice(2, 10)}`;
}

export function createNodeFromDefaults(
  type: string,
  defaults: WidgetDefaults,
): EditorNode {
  return {
    id: createId(type),
    type,
    props: { ...defaults.props },
    style: {
      desktop: defaults.style.desktop ? { ...defaults.style.desktop } : undefined,
      tablet: defaults.style.tablet ? { ...defaults.style.tablet } : undefined,
      mobile: defaults.style.mobile ? { ...defaults.style.mobile } : undefined,
    },
    children: [],
  };
}
