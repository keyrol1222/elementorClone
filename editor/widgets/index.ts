/**
 * Bootstrap all widgets. Each widget module self-registers via WidgetRegistry.register().
 * Adding a new widget only requires creating its module and importing it here.
 */
import "@/widgets/layout";
import "@/widgets/heading";
import "@/widgets/text";
import "@/widgets/button";
import "@/widgets/spacer";
import "@/widgets/divider";
import "@/widgets/image";
import "@/widgets/video";
import "@/widgets/icon";

export { WidgetRegistry } from "@/editor/widgets/registry";
