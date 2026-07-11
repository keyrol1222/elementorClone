"use client";

import { ImageIcon } from "lucide-react";
import type { WidgetRenderProps } from "@/renderer/types";
import { getStringProp } from "@/renderer/types";
import { WidgetRegistry } from "@/editor/widgets/registry";
import { createNodeFromDefaults } from "@/widgets/shared/create-node";
import {
  getImageFallbackLabel,
  mergeImageStyles,
} from "@/widgets/shared/media-utils";
import type { ImageProps, WidgetDefaults } from "@/types/widget";
import { cn } from "@/lib/utils";

const defaults: WidgetDefaults = {
  props: {
    src: "https://placehold.co/800x450/e2e8f0/64748b?text=Image",
    alt: "Image",
    objectFit: "cover",
    link: "",
  } satisfies ImageProps,
  style: {
    desktop: {
      width: "100%",
      borderRadius: "8px",
    },
  },
};

export function ImageWidget({ node, style, context }: WidgetRenderProps) {
  const src = getStringProp(node.props, "src", defaults.props.src as string);
  const alt = getStringProp(node.props, "alt", "Image");
  const objectFit = getStringProp(node.props, "objectFit", "cover");
  const link = getStringProp(node.props, "link", "");
  const isEditor = context.mode === "editor";
  const imageStyle = mergeImageStyles(style, objectFit);

  const imageElement = src ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={cn(isEditor && "pointer-events-none select-none")}
      style={imageStyle}
      draggable={false}
    />
  ) : (
    <div
      className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-lg bg-muted text-muted-foreground"
      style={imageStyle}
    >
      <ImageIcon className="h-8 w-8 opacity-50" />
      <span className="text-xs">Add image URL in properties</span>
    </div>
  );

  const content = (
    <figure className="m-0 w-full">
      {imageElement}
      {alt && !isEditor && (
        <figcaption className="mt-2 text-center text-xs text-muted-foreground">
          {getImageFallbackLabel(alt)}
        </figcaption>
      )}
    </figure>
  );

  if (link && !isEditor) {
    return (
      <a href={link} className="block no-underline">
        {content}
      </a>
    );
  }

  return content;
}

WidgetRegistry.register({
  type: "image",
  label: "Image",
  category: "media",
  icon: ImageIcon,
  description: "Responsive image with alt text and optional link",
  isContainer: false,
  defaultProps: defaults.props,
  defaultStyle: defaults.style,
  createNode: () => createNodeFromDefaults("image", defaults),
  render: ImageWidget,
});
