"use client";

import { useEffect, useRef, useState, type CSSProperties, type ChangeEvent, type KeyboardEvent, type RefObject } from "react";
import { useEditorStore } from "@/store/editor-store";
import { cn } from "@/lib/utils";

type InlineEditableTextProps = {
  nodeId: string;
  value: string;
  propKey: string;
  className?: string;
  style?: CSSProperties;
  multiline?: boolean;
  placeholder?: string;
  as?: "span" | "p" | "div";
};

export function InlineEditableText({
  nodeId,
  value,
  propKey,
  className,
  style,
  multiline = false,
  placeholder = "Click to edit",
  as: Component = "span",
}: InlineEditableTextProps) {
  const isPreviewMode = useEditorStore((state) => state.isPreviewMode);
  const updateNodeProps = useEditorStore((state) => state.updateNodeProps);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  function commitEdit() {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== value) {
      updateNodeProps(nodeId, { [propKey]: trimmed });
    } else {
      setDraft(value);
    }
    setIsEditing(false);
  }

  if (isPreviewMode) {
    return (
      <Component className={className} style={style}>
        {value}
      </Component>
    );
  }

  if (isEditing) {
    const sharedProps = {
      ref: inputRef as RefObject<HTMLInputElement & HTMLTextAreaElement>,
      value: draft,
      onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setDraft(event.target.value),
      onBlur: commitEdit,
      onKeyDown: (event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (event.key === "Enter" && !multiline) {
          event.preventDefault();
          commitEdit();
        }
        if (event.key === "Escape") {
          setDraft(value);
          setIsEditing(false);
        }
      },
      className: cn(
        "w-full resize-none bg-transparent outline-none ring-2 ring-primary/30",
        className,
      ),
      style,
      placeholder,
    };

    return multiline ? (
      <textarea rows={3} {...sharedProps} />
    ) : (
      <input type="text" {...sharedProps} />
    );
  }

  return (
    <Component
      className={cn(
        "cursor-text rounded-sm outline-none transition-shadow hover:ring-1 hover:ring-primary/20",
        className,
      )}
      style={style}
      onDoubleClick={(event) => {
        event.stopPropagation();
        setIsEditing(true);
      }}
      title="Double-click to edit"
    >
      {value || placeholder}
    </Component>
  );
}
