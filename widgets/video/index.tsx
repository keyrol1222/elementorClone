"use client";

import { Play, Video } from "lucide-react";
import type { WidgetRenderProps } from "@/renderer/types";
import { getBooleanProp, getStringProp } from "@/renderer/types";
import { WidgetRegistry } from "@/editor/widgets/registry";
import { createNodeFromDefaults } from "@/widgets/shared/create-node";
import {
  isDirectVideoFile,
  parseVideoEmbedUrl,
} from "@/widgets/shared/media-utils";
import type { VideoProps, WidgetDefaults } from "@/types/widget";

const defaults: WidgetDefaults = {
  props: {
    src: "",
    poster: "",
    autoplay: false,
    loop: false,
    muted: false,
    controls: true,
  } satisfies VideoProps,
  style: {
    desktop: {
      width: "100%",
      borderRadius: "8px",
      overflow: "hidden",
    },
  },
};

export function VideoWidget({ node, style, context }: WidgetRenderProps) {
  const src = getStringProp(node.props, "src", "");
  const poster = getStringProp(node.props, "poster", "");
  const autoplay = getBooleanProp(node.props, "autoplay", false);
  const loop = getBooleanProp(node.props, "loop", false);
  const muted = getBooleanProp(node.props, "muted", false);
  const controls = getBooleanProp(node.props, "controls", true);
  const isEditor = context.mode === "editor";

  if (!src) {
    return (
      <div
        className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-lg bg-muted text-muted-foreground"
        style={style}
      >
        <Video className="h-8 w-8 opacity-50" />
        <span className="text-xs">Add a YouTube, Vimeo, or MP4 URL</span>
      </div>
    );
  }

  const embedUrl = parseVideoEmbedUrl(src);

  if (embedUrl && !isDirectVideoFile(src)) {
    return (
      <div className="relative aspect-video w-full overflow-hidden" style={style}>
        <iframe
          src={embedUrl}
          title="Video"
          className="h-full w-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={isEditor ? { pointerEvents: "none" } : undefined}
        />
        {isEditor && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/10">
            <div className="rounded-full bg-background/90 p-3 shadow">
              <Play className="h-5 w-5 text-foreground" />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <video
      src={src}
      poster={poster || undefined}
      autoPlay={autoplay && !isEditor}
      loop={loop}
      muted={muted || autoplay}
      controls={controls && !isEditor}
      playsInline
      className="aspect-video w-full bg-black object-cover"
      style={{
        ...style,
        pointerEvents: isEditor ? "none" : undefined,
      }}
    >
      <track kind="captions" />
    </video>
  );
}

WidgetRegistry.register({
  type: "video",
  label: "Video",
  category: "media",
  icon: Video,
  description: "YouTube, Vimeo, or direct video file",
  isContainer: false,
  defaultProps: defaults.props,
  defaultStyle: defaults.style,
  createNode: () => createNodeFromDefaults("video", defaults),
  render: VideoWidget,
});
