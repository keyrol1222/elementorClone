"use client";

import { Sparkles } from "lucide-react";
import type { EditorNode } from "@/types";
import { PropertySection } from "./property-section";
import { PropertyField, PropertySelect } from "./property-field";
import { useStyleField } from "./use-style-field";

type EffectsControlsProps = {
  nodeId: string;
  style: EditorNode["style"];
};

const overflowOptions = [
  { label: "Visible", value: "visible" },
  { label: "Hidden", value: "hidden" },
  { label: "Auto", value: "auto" },
  { label: "Scroll", value: "scroll" },
];

export function EffectsControls({ nodeId, style }: EffectsControlsProps) {
  const boxShadow = useStyleField(nodeId, style, "boxShadow");
  const opacity = useStyleField(nodeId, style, "opacity");
  const transform = useStyleField(nodeId, style, "transform");
  const overflow = useStyleField(nodeId, style, "overflow");
  const zIndex = useStyleField(nodeId, style, "zIndex");

  return (
    <PropertySection title="Effects" icon={<Sparkles className="h-4 w-4" />}>
      <PropertyField
        label="Box shadow"
        value={boxShadow.value}
        onChange={boxShadow.onChange}
        placeholder="0 4px 6px rgba(0,0,0,0.1)"
        inherited={boxShadow.inherited}
      />
      <PropertyField
        label="Opacity"
        value={opacity.value}
        onChange={opacity.onChange}
        placeholder="1"
        inherited={opacity.inherited}
      />
      <PropertyField
        label="Transform"
        value={transform.value}
        onChange={transform.onChange}
        placeholder="rotate(0deg)"
        inherited={transform.inherited}
      />
      <div className="grid grid-cols-2 gap-2">
        <PropertySelect
          label="Overflow"
          value={overflow.value || "visible"}
          onChange={overflow.onChange}
          options={overflowOptions}
        />
        <PropertyField
          label="Z-index"
          value={zIndex.value}
          onChange={zIndex.onChange}
          placeholder="auto"
          inherited={zIndex.inherited}
        />
      </div>
    </PropertySection>
  );
}
