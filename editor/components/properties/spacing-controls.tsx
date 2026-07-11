"use client";

import { Move } from "lucide-react";
import type { EditorNode } from "@/types";
import { PropertySection } from "./property-section";
import { PropertyField } from "./property-field";
import { useStyleField } from "./use-style-field";

type SpacingControlsProps = {
  nodeId: string;
  style: EditorNode["style"];
};

export function SpacingControls({ nodeId, style }: SpacingControlsProps) {
  const paddingTop = useStyleField(nodeId, style, "paddingTop");
  const paddingRight = useStyleField(nodeId, style, "paddingRight");
  const paddingBottom = useStyleField(nodeId, style, "paddingBottom");
  const paddingLeft = useStyleField(nodeId, style, "paddingLeft");
  const marginTop = useStyleField(nodeId, style, "marginTop");
  const marginRight = useStyleField(nodeId, style, "marginRight");
  const marginBottom = useStyleField(nodeId, style, "marginBottom");
  const marginLeft = useStyleField(nodeId, style, "marginLeft");
  const gap = useStyleField(nodeId, style, "gap");

  return (
    <PropertySection title="Spacing" icon={<Move className="h-4 w-4" />}>
      <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        Padding
      </p>
      <div className="grid grid-cols-2 gap-2">
        <PropertyField
          label="Top"
          value={paddingTop.value}
          onChange={paddingTop.onChange}
          placeholder="0px"
          inherited={paddingTop.inherited}
        />
        <PropertyField
          label="Right"
          value={paddingRight.value}
          onChange={paddingRight.onChange}
          placeholder="0px"
          inherited={paddingRight.inherited}
        />
        <PropertyField
          label="Bottom"
          value={paddingBottom.value}
          onChange={paddingBottom.onChange}
          placeholder="0px"
          inherited={paddingBottom.inherited}
        />
        <PropertyField
          label="Left"
          value={paddingLeft.value}
          onChange={paddingLeft.onChange}
          placeholder="0px"
          inherited={paddingLeft.inherited}
        />
      </div>

      <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        Margin
      </p>
      <div className="grid grid-cols-2 gap-2">
        <PropertyField
          label="Top"
          value={marginTop.value}
          onChange={marginTop.onChange}
          placeholder="0px"
          inherited={marginTop.inherited}
        />
        <PropertyField
          label="Right"
          value={marginRight.value}
          onChange={marginRight.onChange}
          placeholder="0px"
          inherited={marginRight.inherited}
        />
        <PropertyField
          label="Bottom"
          value={marginBottom.value}
          onChange={marginBottom.onChange}
          placeholder="0px"
          inherited={marginBottom.inherited}
        />
        <PropertyField
          label="Left"
          value={marginLeft.value}
          onChange={marginLeft.onChange}
          placeholder="0px"
          inherited={marginLeft.inherited}
        />
      </div>

      <PropertyField
        label="Gap"
        value={gap.value}
        onChange={gap.onChange}
        placeholder="16px"
        inherited={gap.inherited}
      />
    </PropertySection>
  );
}
