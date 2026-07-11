import type { CSSProperties } from "react";
import type { WidgetRenderProps } from "@/renderer/types";
import { getStringProp } from "@/renderer/types";

export function parseVideoEmbedUrl(src: string): string | null {
  if (!src) {
    return null;
  }

  const youtubeMatch = src.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{6,})/,
  );
  if (youtubeMatch?.[1]) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  }

  const vimeoMatch = src.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch?.[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  if (src.endsWith(".mp4") || src.endsWith(".webm") || src.endsWith(".ogg")) {
    return src;
  }

  return null;
}

export function isDirectVideoFile(src: string): boolean {
  return /\.(mp4|webm|ogg)(\?.*)?$/i.test(src);
}

export function getImageFallbackLabel(alt: string): string {
  return alt.trim() || "Image";
}

export function mergeImageStyles(
  style: CSSProperties,
  objectFit: string,
): CSSProperties {
  return {
    ...style,
    objectFit: objectFit as React.CSSProperties["objectFit"],
    width: style.width ?? "100%",
    height: style.height ?? "auto",
    display: "block",
    maxWidth: "100%",
  };
}

export type { WidgetRenderProps };
