"use client";

import { Box } from "lucide-react";
import type { EditorNode } from "@/types";
import { PropertySection } from "./property-section";
import { PropertyField, PropertySelect } from "./property-field";
import { useStyleField } from "./use-style-field";

type BorderControlsProps = {
  nodeId: string;
  style: EditorNode["style"];
};

const borderStyleOptions = [
  { label: "None", value: "none" },
  { label: "Solid", value: "solid" },
  { label: "Dashed", value: "dashed" },
  { label: "Dotted", value: "dotted" },
];

export function BorderControls({ nodeId, style }: BorderControlsProps) {
  const borderWidth = useStyleField(nodeId, style, "borderWidth");
  const borderStyle = useStyleField(nodeId, style, "borderStyle");
  const borderRadius = useStyleField(nodeId, style, "borderRadius");
  const borderColor = useStyleField(nodeId, style, "borderColor");

  return (
    <PropertySection title="Border" icon={<Box className="h-4 w-4" />}>
      <div className="grid grid-cols-2 gap-2">
        <PropertyField
          label="Width"
          value={borderWidth.value}
          onChange={borderWidth.onChange}
          placeholder="0px"
          inherited={borderWidth.inherited}
        />
        <PropertySelect
          label="Style"
          value={borderStyle.value || "none"}
          onChange={borderStyle.onChange}
          options={borderStyleOptions}
        />
      </div>
      <PropertyField
        label="Radius"
        value={borderRadius.value}
        onChange={borderRadius.onChange}
        placeholder="0px"
        inherited={borderRadius.inherited}
      />
      <PropertyField
        label="Color"
        type="color"
        value={borderColor.value || "#e2e8f0"}
        onChange={borderColor.onChange}
        inherited={borderColor.inherited}
      />
    </PropertySection>
  );
}
