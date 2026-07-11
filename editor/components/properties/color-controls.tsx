"use client";

import { Palette } from "lucide-react";
import type { EditorNode } from "@/types";
import { PropertySection } from "./property-section";
import { PropertyField } from "./property-field";
import { useStyleField } from "./use-style-field";

type ColorControlsProps = {
  nodeId: string;
  style: EditorNode["style"];
};

export function ColorControls({ nodeId, style }: ColorControlsProps) {
  const color = useStyleField(nodeId, style, "color");
  const backgroundColor = useStyleField(nodeId, style, "backgroundColor");
  const borderColor = useStyleField(nodeId, style, "borderColor");
  const opacity = useStyleField(nodeId, style, "opacity");

  return (
    <PropertySection title="Colors" icon={<Palette className="h-4 w-4" />}>
      <PropertyField
        label="Text color"
        type="color"
        value={color.value || "#000000"}
        onChange={color.onChange}
        inherited={color.inherited}
      />
      <PropertyField
        label="Background"
        type="color"
        value={backgroundColor.value || "#ffffff"}
        onChange={backgroundColor.onChange}
        inherited={backgroundColor.inherited}
      />
      <PropertyField
        label="Border color"
        type="color"
        value={borderColor.value || "#e2e8f0"}
        onChange={borderColor.onChange}
        inherited={borderColor.inherited}
      />
      <PropertyField
        label="Opacity"
        value={opacity.value}
        onChange={opacity.onChange}
        placeholder="1"
        inherited={opacity.inherited}
      />
    </PropertySection>
  );
}
