"use client";

import { Droplets } from "lucide-react";
import type { EditorNode } from "@/types";
import { PropertySection } from "./property-section";
import { PropertyField, PropertySelect } from "./property-field";
import { useStyleField } from "./use-style-field";

type BackgroundControlsProps = {
  nodeId: string;
  style: EditorNode["style"];
};

const backgroundSizeOptions = [
  { label: "Auto", value: "auto" },
  { label: "Cover", value: "cover" },
  { label: "Contain", value: "contain" },
];

const backgroundRepeatOptions = [
  { label: "No repeat", value: "no-repeat" },
  { label: "Repeat", value: "repeat" },
  { label: "Repeat X", value: "repeat-x" },
  { label: "Repeat Y", value: "repeat-y" },
];

export function BackgroundControls({ nodeId, style }: BackgroundControlsProps) {
  const backgroundColor = useStyleField(nodeId, style, "backgroundColor");
  const backgroundImage = useStyleField(nodeId, style, "backgroundImage");
  const backgroundSize = useStyleField(nodeId, style, "backgroundSize");
  const backgroundPosition = useStyleField(nodeId, style, "backgroundPosition");
  const backgroundRepeat = useStyleField(nodeId, style, "backgroundRepeat");

  function onImageChange(value: string) {
    const trimmed = value.trim();
    if (!trimmed) {
      backgroundImage.onChange("");
      return;
    }
    if (trimmed.startsWith("url(")) {
      backgroundImage.onChange(trimmed);
      return;
    }
    backgroundImage.onChange(`url("${trimmed}")`);
  }

  const imageValue = backgroundImage.value.replace(/^url\(["']?|["']?\)$/g, "");

  return (
    <PropertySection title="Background" icon={<Droplets className="h-4 w-4" />}>
      <PropertyField
        label="Color"
        type="color"
        value={backgroundColor.value || "#ffffff"}
        onChange={backgroundColor.onChange}
        inherited={backgroundColor.inherited}
      />
      <PropertyField
        label="Image URL"
        type="url"
        value={imageValue}
        onChange={onImageChange}
        placeholder="https://..."
        inherited={backgroundImage.inherited}
      />
      <div className="grid grid-cols-2 gap-2">
        <PropertySelect
          label="Size"
          value={backgroundSize.value || "auto"}
          onChange={backgroundSize.onChange}
          options={backgroundSizeOptions}
        />
        <PropertySelect
          label="Repeat"
          value={backgroundRepeat.value || "no-repeat"}
          onChange={backgroundRepeat.onChange}
          options={backgroundRepeatOptions}
        />
      </div>
      <PropertyField
        label="Position"
        value={backgroundPosition.value}
        onChange={backgroundPosition.onChange}
        placeholder="center center"
        inherited={backgroundPosition.inherited}
      />
    </PropertySection>
  );
}
