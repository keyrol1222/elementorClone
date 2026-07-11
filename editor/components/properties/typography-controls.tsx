"use client";

import { Type } from "lucide-react";
import type { EditorNode } from "@/types";
import { PropertySection } from "./property-section";
import { PropertyField, PropertySelect } from "./property-field";
import { useStyleField } from "./use-style-field";

type TypographyControlsProps = {
  nodeId: string;
  style: EditorNode["style"];
};

const fontWeightOptions = [
  { label: "Normal", value: "400" },
  { label: "Medium", value: "500" },
  { label: "Semibold", value: "600" },
  { label: "Bold", value: "700" },
  { label: "Extra Bold", value: "800" },
];

const textAlignOptions = [
  { label: "Left", value: "left" },
  { label: "Center", value: "center" },
  { label: "Right", value: "right" },
  { label: "Justify", value: "justify" },
];

const textTransformOptions = [
  { label: "None", value: "none" },
  { label: "Uppercase", value: "uppercase" },
  { label: "Lowercase", value: "lowercase" },
  { label: "Capitalize", value: "capitalize" },
];

export function TypographyControls({ nodeId, style }: TypographyControlsProps) {
  const fontSize = useStyleField(nodeId, style, "fontSize");
  const fontWeight = useStyleField(nodeId, style, "fontWeight");
  const lineHeight = useStyleField(nodeId, style, "lineHeight");
  const letterSpacing = useStyleField(nodeId, style, "letterSpacing");
  const textAlign = useStyleField(nodeId, style, "textAlign");
  const textTransform = useStyleField(nodeId, style, "textTransform");
  const fontFamily = useStyleField(nodeId, style, "fontFamily");

  return (
    <PropertySection title="Typography" icon={<Type className="h-4 w-4" />}>
      <PropertyField
        label="Font family"
        value={fontFamily.value}
        onChange={fontFamily.onChange}
        placeholder="Inter, sans-serif"
        inherited={fontFamily.inherited}
      />
      <div className="grid grid-cols-2 gap-2">
        <PropertyField
          label="Font size"
          value={fontSize.value}
          onChange={fontSize.onChange}
          placeholder="16px"
          inherited={fontSize.inherited}
        />
        <PropertySelect
          label="Font weight"
          value={fontWeight.value || "400"}
          onChange={fontWeight.onChange}
          options={fontWeightOptions}
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <PropertyField
          label="Line height"
          value={lineHeight.value}
          onChange={lineHeight.onChange}
          placeholder="1.5"
          inherited={lineHeight.inherited}
        />
        <PropertyField
          label="Letter spacing"
          value={letterSpacing.value}
          onChange={letterSpacing.onChange}
          placeholder="0px"
          inherited={letterSpacing.inherited}
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <PropertySelect
          label="Text align"
          value={textAlign.value || "left"}
          onChange={textAlign.onChange}
          options={textAlignOptions}
        />
        <PropertySelect
          label="Transform"
          value={textTransform.value || "none"}
          onChange={textTransform.onChange}
          options={textTransformOptions}
        />
      </div>
    </PropertySection>
  );
}
