"use client";

import { Layers } from "lucide-react";
import type { EditorDevice } from "@/editor/types";
import { useEditorStore } from "@/store/editor-store";
import { hasDeviceOverride } from "@/lib/styles/responsive-style";
import type { EditorNode } from "@/types";
import { PropertySection } from "./property-section";
import { Button } from "@/components/ui/button";

type ResponsiveControlsProps = {
  nodeId: string;
  style: EditorNode["style"];
};

const devices: EditorDevice[] = ["desktop", "tablet", "mobile"];

export function ResponsiveControls({ nodeId, style }: ResponsiveControlsProps) {
  const device = useEditorStore((state) => state.device);
  const copyStylesToDevice = useEditorStore((state) => state.copyStylesToDevice);
  const clearDeviceStyles = useEditorStore((state) => state.clearDeviceStyles);

  const hasOverrides = hasDeviceOverride(style, device, "fontSize") ||
    Boolean(style[device] && Object.keys(style[device]!).length > 0);

  return (
    <PropertySection title="Responsive" icon={<Layers className="h-4 w-4" />}>
      <p className="text-xs text-muted-foreground">
        Copy current breakpoint styles to another device or reset overrides for{" "}
        <span className="font-medium capitalize">{device}</span>.
      </p>

      <div className="space-y-2">
        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          Copy styles to
        </p>
        <div className="flex flex-wrap gap-1">
          {devices
            .filter((target) => target !== device)
            .map((target) => (
              <Button
                key={target}
                type="button"
                variant="outline"
                size="sm"
                className="h-7 text-xs capitalize"
                onClick={() => copyStylesToDevice(nodeId, target)}
              >
                {target}
              </Button>
            ))}
        </div>
      </div>

      <Button
        type="button"
        variant="destructive"
        size="sm"
        className="h-7 w-full text-xs"
        disabled={!hasOverrides}
        onClick={() => clearDeviceStyles(nodeId)}
      >
        Clear {device} overrides
      </Button>
    </PropertySection>
  );
}
