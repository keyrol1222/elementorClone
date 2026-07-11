"use client";

import { AlignLeft } from "lucide-react";
import { useSelectedNode } from "@/hooks/use-selected-node";
import { WidgetRegistry } from "@/editor/widgets";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DeviceIndicator } from "./properties/device-indicator";
import { ContentControls } from "./properties/content-controls";
import { TypographyControls } from "./properties/typography-controls";
import { SpacingControls } from "./properties/spacing-controls";
import { ColorControls } from "./properties/color-controls";
import { BorderControls } from "./properties/border-controls";
import { BackgroundControls } from "./properties/background-controls";
import { EffectsControls } from "./properties/effects-controls";
import { ResponsiveControls } from "./properties/responsive-controls";

export function EditorPropertiesPanel() {
  const selectedNode = useSelectedNode();
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
          <div className="space-y-3 p-4">
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
            </div>

            <DeviceIndicator />

            <ContentControls node={selectedNode} />
            <TypographyControls
              nodeId={selectedNode.id}
              style={selectedNode.style}
            />
            <SpacingControls nodeId={selectedNode.id} style={selectedNode.style} />
            <ColorControls nodeId={selectedNode.id} style={selectedNode.style} />
            <BorderControls nodeId={selectedNode.id} style={selectedNode.style} />
            <BackgroundControls
              nodeId={selectedNode.id}
              style={selectedNode.style}
            />
            <EffectsControls nodeId={selectedNode.id} style={selectedNode.style} />
            <ResponsiveControls
              nodeId={selectedNode.id}
              style={selectedNode.style}
            />
          </div>
        )}
      </ScrollArea>
    </aside>
  );
}
