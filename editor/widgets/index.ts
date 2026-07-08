import {
  Columns3,
  Heading,
  Image,
  LayoutGrid,
  Minus,
  MousePointerClick,
  SeparatorHorizontal,
  Square,
  Type,
  Video,
} from "lucide-react";
import { WidgetRegistry } from "@/editor/widgets/registry";

WidgetRegistry.register({
  type: "section",
  label: "Section",
  category: "layout",
  icon: LayoutGrid,
  description: "Full-width section container",
  isContainer: true,
});

WidgetRegistry.register({
  type: "container",
  label: "Container",
  category: "layout",
  icon: Square,
  description: "Content width container",
  isContainer: true,
});

WidgetRegistry.register({
  type: "columns",
  label: "Columns",
  category: "layout",
  icon: Columns3,
  description: "Multi-column layout",
  isContainer: true,
});

WidgetRegistry.register({
  type: "heading",
  label: "Heading",
  category: "basic",
  icon: Heading,
  description: "Title or heading text",
  isContainer: false,
});

WidgetRegistry.register({
  type: "text",
  label: "Text",
  category: "basic",
  icon: Type,
  description: "Paragraph or rich text",
  isContainer: false,
});

WidgetRegistry.register({
  type: "button",
  label: "Button",
  category: "basic",
  icon: MousePointerClick,
  description: "Call-to-action button",
  isContainer: false,
});

WidgetRegistry.register({
  type: "spacer",
  label: "Spacer",
  category: "basic",
  icon: SeparatorHorizontal,
  description: "Vertical spacing block",
  isContainer: false,
});

WidgetRegistry.register({
  type: "divider",
  label: "Divider",
  category: "basic",
  icon: Minus,
  description: "Horizontal divider line",
  isContainer: false,
});

WidgetRegistry.register({
  type: "image",
  label: "Image",
  category: "media",
  icon: Image,
  description: "Image with alt text",
  isContainer: false,
});

WidgetRegistry.register({
  type: "video",
  label: "Video",
  category: "media",
  icon: Video,
  description: "Embedded video player",
  isContainer: false,
});

WidgetRegistry.register({
  type: "icon",
  label: "Icon",
  category: "media",
  icon: Square,
  description: "Lucide or custom icon",
  isContainer: false,
});

export { WidgetRegistry };
