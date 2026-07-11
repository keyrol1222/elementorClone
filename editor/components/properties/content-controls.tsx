"use client";

import { FileText } from "lucide-react";
import type { EditorNode } from "@/types";
import { PropertySection } from "./property-section";
import {
  PropertyField,
  PropertySelect,
  PropertyToggle,
} from "./property-field";
import { usePropField } from "./use-style-field";

type ContentControlsProps = {
  node: EditorNode;
};

export function ContentControls({ node }: ContentControlsProps) {
  switch (node.type) {
    case "heading":
      return <HeadingContent nodeId={node.id} />;
    case "text":
      return <TextContent nodeId={node.id} />;
    case "button":
      return <ButtonContent nodeId={node.id} />;
    case "spacer":
      return <SpacerContent nodeId={node.id} />;
    case "divider":
      return <DividerContent nodeId={node.id} />;
    case "image":
      return <ImageContent nodeId={node.id} />;
    case "video":
      return <VideoContent nodeId={node.id} />;
    case "icon":
      return <IconContent nodeId={node.id} />;
    case "section":
      return <SectionContent nodeId={node.id} />;
    case "container":
      return <ContainerContent nodeId={node.id} />;
    case "columns":
      return <ColumnsContent nodeId={node.id} />;
    default:
      return null;
  }
}

function HeadingContent({ nodeId }: { nodeId: string }) {
  const text = usePropField(nodeId, "text", "Heading");
  const tag = usePropField(nodeId, "tag", "h2");
  const align = usePropField(nodeId, "align", "left");

  return (
    <PropertySection title="Content" icon={<FileText className="h-4 w-4" />}>
      <PropertyField label="Text" value={text.value} onChange={text.onChange} />
      <PropertySelect
        label="Tag"
        value={tag.value}
        onChange={tag.onChange}
        options={[
          { label: "H1", value: "h1" },
          { label: "H2", value: "h2" },
          { label: "H3", value: "h3" },
          { label: "H4", value: "h4" },
          { label: "H5", value: "h5" },
          { label: "H6", value: "h6" },
        ]}
      />
      <PropertySelect
        label="Align"
        value={align.value}
        onChange={align.onChange}
        options={[
          { label: "Left", value: "left" },
          { label: "Center", value: "center" },
          { label: "Right", value: "right" },
        ]}
      />
    </PropertySection>
  );
}

function TextContent({ nodeId }: { nodeId: string }) {
  const text = usePropField(nodeId, "text", "");
  const align = usePropField(nodeId, "align", "left");

  return (
    <PropertySection title="Content" icon={<FileText className="h-4 w-4" />}>
      <PropertyField
        label="Text"
        value={text.value}
        onChange={text.onChange}
        placeholder="Enter text..."
      />
      <PropertySelect
        label="Align"
        value={align.value}
        onChange={align.onChange}
        options={[
          { label: "Left", value: "left" },
          { label: "Center", value: "center" },
          { label: "Right", value: "right" },
        ]}
      />
    </PropertySection>
  );
}

function ButtonContent({ nodeId }: { nodeId: string }) {
  const text = usePropField(nodeId, "text", "Button");
  const href = usePropField(nodeId, "href", "#");
  const target = usePropField(nodeId, "target", "_self");
  const variant = usePropField(nodeId, "variant", "solid");
  const size = usePropField(nodeId, "size", "md");

  return (
    <PropertySection title="Content" icon={<FileText className="h-4 w-4" />}>
      <PropertyField label="Label" value={text.value} onChange={text.onChange} />
      <PropertyField
        label="Link"
        type="url"
        value={href.value}
        onChange={href.onChange}
        placeholder="https://..."
      />
      <PropertySelect
        label="Target"
        value={target.value}
        onChange={target.onChange}
        options={[
          { label: "Same tab", value: "_self" },
          { label: "New tab", value: "_blank" },
        ]}
      />
      <div className="grid grid-cols-2 gap-2">
        <PropertySelect
          label="Variant"
          value={variant.value}
          onChange={variant.onChange}
          options={[
            { label: "Solid", value: "solid" },
            { label: "Outline", value: "outline" },
            { label: "Ghost", value: "ghost" },
          ]}
        />
        <PropertySelect
          label="Size"
          value={size.value}
          onChange={size.onChange}
          options={[
            { label: "Small", value: "sm" },
            { label: "Medium", value: "md" },
            { label: "Large", value: "lg" },
          ]}
        />
      </div>
    </PropertySection>
  );
}

function SpacerContent({ nodeId }: { nodeId: string }) {
  const height = usePropField(nodeId, "height", "40");

  return (
    <PropertySection title="Content" icon={<FileText className="h-4 w-4" />}>
      <PropertyField
        label="Height (px)"
        type="number"
        value={height.value}
        onChange={height.onChangeNumber}
      />
    </PropertySection>
  );
}

function DividerContent({ nodeId }: { nodeId: string }) {
  const color = usePropField(nodeId, "color", "#e2e8f0");
  const thickness = usePropField(nodeId, "thickness", "1");
  const width = usePropField(nodeId, "width", "100%");
  const style = usePropField(nodeId, "style", "solid");

  return (
    <PropertySection title="Content" icon={<FileText className="h-4 w-4" />}>
      <PropertyField
        label="Color"
        type="color"
        value={color.value}
        onChange={color.onChange}
      />
      <div className="grid grid-cols-2 gap-2">
        <PropertyField
          label="Thickness"
          type="number"
          value={thickness.value}
          onChange={thickness.onChangeNumber}
        />
        <PropertyField
          label="Width"
          value={width.value}
          onChange={width.onChange}
          placeholder="100%"
        />
      </div>
      <PropertySelect
        label="Style"
        value={style.value}
        onChange={style.onChange}
        options={[
          { label: "Solid", value: "solid" },
          { label: "Dashed", value: "dashed" },
          { label: "Dotted", value: "dotted" },
        ]}
      />
    </PropertySection>
  );
}

function ImageContent({ nodeId }: { nodeId: string }) {
  const src = usePropField(nodeId, "src", "");
  const alt = usePropField(nodeId, "alt", "");
  const objectFit = usePropField(nodeId, "objectFit", "cover");
  const link = usePropField(nodeId, "link", "");

  return (
    <PropertySection title="Content" icon={<FileText className="h-4 w-4" />}>
      <PropertyField
        label="Image URL"
        type="url"
        value={src.value}
        onChange={src.onChange}
        placeholder="https://..."
      />
      <PropertyField label="Alt text" value={alt.value} onChange={alt.onChange} />
      <PropertySelect
        label="Object fit"
        value={objectFit.value}
        onChange={objectFit.onChange}
        options={[
          { label: "Cover", value: "cover" },
          { label: "Contain", value: "contain" },
          { label: "Fill", value: "fill" },
          { label: "None", value: "none" },
        ]}
      />
      <PropertyField
        label="Link"
        type="url"
        value={link.value}
        onChange={link.onChange}
        placeholder="Optional link"
      />
    </PropertySection>
  );
}

function VideoContent({ nodeId }: { nodeId: string }) {
  const src = usePropField(nodeId, "src", "");
  const poster = usePropField(nodeId, "poster", "");
  const autoplay = usePropField(nodeId, "autoplay", "false");
  const loop = usePropField(nodeId, "loop", "false");
  const muted = usePropField(nodeId, "muted", "false");
  const controls = usePropField(nodeId, "controls", "true");

  return (
    <PropertySection title="Content" icon={<FileText className="h-4 w-4" />}>
      <PropertyField
        label="Video URL"
        type="url"
        value={src.value}
        onChange={src.onChange}
        placeholder="https://..."
      />
      <PropertyField
        label="Poster"
        type="url"
        value={poster.value}
        onChange={poster.onChange}
        placeholder="Poster image URL"
      />
      <PropertyToggle
        label="Autoplay"
        checked={autoplay.value === "true"}
        onChange={autoplay.onChangeBoolean}
      />
      <PropertyToggle
        label="Loop"
        checked={loop.value === "true"}
        onChange={loop.onChangeBoolean}
      />
      <PropertyToggle
        label="Muted"
        checked={muted.value === "true"}
        onChange={muted.onChangeBoolean}
      />
      <PropertyToggle
        label="Controls"
        checked={controls.value === "true"}
        onChange={controls.onChangeBoolean}
      />
    </PropertySection>
  );
}

function IconContent({ nodeId }: { nodeId: string }) {
  const icon = usePropField(nodeId, "icon", "star");
  const size = usePropField(nodeId, "size", "24");
  const color = usePropField(nodeId, "color", "#0f172a");
  const strokeWidth = usePropField(nodeId, "strokeWidth", "2");

  return (
    <PropertySection title="Content" icon={<FileText className="h-4 w-4" />}>
      <PropertyField
        label="Icon name"
        value={icon.value}
        onChange={icon.onChange}
        placeholder="star, heart, check..."
      />
      <div className="grid grid-cols-2 gap-2">
        <PropertyField
          label="Size"
          type="number"
          value={size.value}
          onChange={size.onChangeNumber}
        />
        <PropertyField
          label="Stroke"
          type="number"
          value={strokeWidth.value}
          onChange={strokeWidth.onChangeNumber}
        />
      </div>
      <PropertyField
        label="Color"
        type="color"
        value={color.value}
        onChange={color.onChange}
      />
    </PropertySection>
  );
}

function SectionContent({ nodeId }: { nodeId: string }) {
  const fullWidth = usePropField(nodeId, "fullWidth", "true");

  return (
    <PropertySection title="Content" icon={<FileText className="h-4 w-4" />}>
      <PropertyToggle
        label="Full width"
        checked={fullWidth.value === "true"}
        onChange={fullWidth.onChangeBoolean}
      />
    </PropertySection>
  );
}

function ContainerContent({ nodeId }: { nodeId: string }) {
  const maxWidth = usePropField(nodeId, "maxWidth", "1200px");

  return (
    <PropertySection title="Content" icon={<FileText className="h-4 w-4" />}>
      <PropertyField
        label="Max width"
        value={maxWidth.value}
        onChange={maxWidth.onChange}
        placeholder="1200px"
      />
    </PropertySection>
  );
}

function ColumnsContent({ nodeId }: { nodeId: string }) {
  const columns = usePropField(nodeId, "columns", "2");

  return (
    <PropertySection title="Content" icon={<FileText className="h-4 w-4" />}>
      <PropertySelect
        label="Columns"
        value={columns.value}
        onChange={columns.onChangeNumber}
        options={[
          { label: "1", value: "1" },
          { label: "2", value: "2" },
          { label: "3", value: "3" },
          { label: "4", value: "4" },
        ]}
      />
    </PropertySection>
  );
}
