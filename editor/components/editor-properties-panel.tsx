"use client";

import {
  AlignLeft,
  Box,
  Droplets,
  Layers,
  Move,
  Palette,
  Sparkles,
  Type,
} from "lucide-react";
import { findNodeById } from "@/editor/utils";
import { WidgetRegistry } from "@/editor/widgets";
import { useEditorStore } from "@/store/editor-store";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const propertySections = [
  { icon: Type, label: "Typography", phase: "Phase 7" },
  { icon: Move, label: "Spacing", phase: "Phase 7" },
  { icon: Palette, label: "Colors", phase: "Phase 7" },
  { icon: Box, label: "Border", phase: "Phase 7" },
  { icon: Droplets, label: "Background", phase: "Phase 7" },
  { icon: Sparkles, label: "Effects", phase: "Phase 7" },
  { icon: Layers, label: "Responsive", phase: "Phase 7" },
];

export function EditorPropertiesPanel() {
  const { content, selectedNodeId } = useEditorStore();
  const selectedNode = selectedNodeId
    ? findNodeById(content.root, selectedNodeId)
    : null;
  const widget = selectedNode ? WidgetRegistry.get(selectedNode.type) : null;
  const Icon = widget?.icon;

  return (
    <aside className="flex h-full w-72 flex-col border-l bg-card">
      <div className="flex h-12 items-center border-b px-4">
        <h2 className="text-sm font-semibold">Properties</h2>
      </div>

      <ScrollArea className="flex-1">
        {!selectedNode ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <AlignLeft className="mb-3 h-8 w-8 text-muted-foreground/40" />
            <p className="text-sm font-medium">No selection</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Click an element on the canvas or in the structure panel to edit
              its properties.
            </p>
          </div>
        ) : (
          <div className="space-y-4 p-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {Icon && <Icon className="h-4 w-4 text-primary" />}
                <span className="font-medium">
                  {widget?.label ?? selectedNode.type}
                </span>
                <Badge variant="outline" className="ml-auto text-xs">
                  {selectedNode.type}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                ID: {selectedNode.id}
              </p>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Props
              </h3>
              <pre className="overflow-auto rounded-md bg-muted p-3 text-xs">
                {JSON.stringify(selectedNode.props, null, 2)}
              </pre>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Style
              </h3>
              <pre className="overflow-auto rounded-md bg-muted p-3 text-xs">
                {JSON.stringify(selectedNode.style, null, 2)}
              </pre>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Controls
              </h3>
              {propertySections.map((section) => {
                const SectionIcon = section.icon;

                return (
                  <div
                    key={section.label}
                    className="flex items-center gap-3 rounded-lg border bg-muted/30 px-3 py-2 opacity-60"
                  >
                    <SectionIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{section.label}</span>
                    <Badge variant="secondary" className="ml-auto text-[10px]">
                      {section.phase}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </ScrollArea>
    </aside>
  );
}
