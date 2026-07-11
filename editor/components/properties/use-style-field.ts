"use client";

import type { CSSProperties } from "react";
import type { EditorNode } from "@/types";
import type { EditorDevice } from "@/editor/types";
import {
  getDeviceStyleOverride,
  getResolvedStyleValue,
  hasDeviceOverride,
  parseNumericStyle,
} from "@/lib/styles/responsive-style";
import { useEditorStore } from "@/store/editor-store";
import { findNode } from "@/editor/tree-ops";

export function useStyleField(
  nodeId: string,
  nodeStyle: EditorNode["style"],
  key: keyof CSSProperties,
) {
  const device = useEditorStore((state) => state.device);
  const updateNodeStyle = useEditorStore((state) => state.updateNodeStyle);

  const value = getResolvedStyleValue(nodeStyle, device, key);
  const inherited =
    device !== "desktop" &&
    !hasDeviceOverride(nodeStyle, device, key as string) &&
    getDeviceStyleOverride(nodeStyle, device, key as string) === undefined;

  function onChange(nextValue: string) {
    const parsed = parseNumericStyle(nextValue);
    updateNodeStyle(nodeId, {
      [key]: parsed === "" ? undefined : parsed,
    });
  }

  return { value, inherited, onChange, device };
}

export function usePropField(
  nodeId: string,
  key: string,
  fallback = "",
) {
  const updateNodeProps = useEditorStore((state) => state.updateNodeProps);
  const value = useEditorStore((state) => {
    const node = findNode(state.content.root, nodeId);
    const prop = node?.props[key];
    return typeof prop === "string" ||
      typeof prop === "number" ||
      typeof prop === "boolean"
      ? String(prop)
      : fallback;
  });

  function onChange(nextValue: string) {
    updateNodeProps(nodeId, { [key]: nextValue });
  }

  function onChangeBoolean(checked: boolean) {
    updateNodeProps(nodeId, { [key]: checked });
  }

  function onChangeNumber(nextValue: string) {
    const num = Number(nextValue);
    updateNodeProps(nodeId, {
      [key]: Number.isNaN(num) ? nextValue : num,
    });
  }

  return { value, onChange, onChangeBoolean, onChangeNumber };
}

export type { EditorDevice };
