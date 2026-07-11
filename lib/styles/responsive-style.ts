import type { CSSProperties } from "react";
import type { EditorDevice } from "@/editor/types";
import type { ResponsiveStyle } from "@/types";
import { resolveNodeStyle } from "@/renderer/types";

export function getResolvedStyleValue(
  style: ResponsiveStyle,
  device: EditorDevice,
  key: keyof CSSProperties,
): string {
  const resolved = resolveNodeStyle(style, device);
  const value = resolved[key];
  return value !== undefined && value !== null ? String(value) : "";
}

export function getDeviceStyleOverride(
  style: ResponsiveStyle,
  device: EditorDevice,
  key: string,
): string | number | undefined {
  return style[device]?.[key];
}

export function hasDeviceOverride(
  style: ResponsiveStyle,
  device: EditorDevice,
  key: string,
): boolean {
  return style[device]?.[key] !== undefined;
}

export function applyStyleUpdates(
  style: ResponsiveStyle,
  device: EditorDevice,
  updates: Record<string, string | number | undefined>,
): ResponsiveStyle {
  const currentBucket = { ...(style[device] ?? {}) };

  for (const [key, value] of Object.entries(updates)) {
    if (value === undefined || value === "") {
      delete currentBucket[key];
    } else {
      currentBucket[key] = value;
    }
  }

  const nextStyle: ResponsiveStyle = {
    ...style,
    [device]: Object.keys(currentBucket).length > 0 ? currentBucket : undefined,
  };

  if (nextStyle[device] && Object.keys(nextStyle[device]!).length === 0) {
    delete nextStyle[device];
  }

  return nextStyle;
}

export function copyDeviceStyles(
  style: ResponsiveStyle,
  from: EditorDevice,
  to: EditorDevice,
): ResponsiveStyle {
  if (from === to) {
    return style;
  }

  const source = resolveNodeStyle(style, from);
  return {
    ...style,
    [to]: { ...source },
  };
}

export function clearDeviceStyles(
  style: ResponsiveStyle,
  device: EditorDevice,
): ResponsiveStyle {
  const next = { ...style };
  delete next[device];
  return next;
}

export function parseNumericStyle(value: string): string | number {
  const trimmed = value.trim();
  if (trimmed === "") {
    return "";
  }
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
    return Number(trimmed);
  }
  return trimmed;
}
