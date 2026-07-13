"use client";

import { memo, type ReactElement } from "react";
import type { EditorNode } from "@/types";
import type { RenderContext, WidgetRenderProps } from "@/renderer/types";
import { resolveNodeStyle } from "@/renderer/types";
import { WidgetRegistry } from "@/editor/widgets/registry";
import { SortableChildren } from "@/editor/dnd/sortable-children";
import { SortableNode } from "@/editor/dnd/sortable-node";

type RenderNodeProps = {
  node: EditorNode;
  context: RenderContext;
  parentId: string | null;
  index: number;
};

function UnknownWidget({ node }: { node: EditorNode }) {
  return (
    <div className="rounded border border-dashed border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
      Unknown widget type: <code>{node.type}</code>
    </div>
  );
}

function RenderNodeComponent({
  node,
  context,
  parentId,
  index,
}: RenderNodeProps): ReactElement {
  const definition = WidgetRegistry.get(node.type);
  const style = resolveNodeStyle(node.style, context.device);
  const isSelected =
    context.mode === "editor" && context.selectedNodeId === node.id;
  const isEditor = context.mode === "editor";
  const isContainer = definition?.isContainer ?? false;

  const children = isEditor ? (
    isContainer ? (
      <SortableChildren
        parentId={node.id}
        nodes={node.children}
        emptyLabel={`Drop into ${definition?.label ?? node.type}`}
        renderNode={(child, childIndex) => (
          <RenderNode
            key={child.id}
            node={child}
            context={context}
            parentId={node.id}
            index={childIndex}
          />
        )}
      />
    ) : node.children.length > 0 ? (
      <>
        {node.children.map((child, childIndex) => (
          <RenderNode
            key={child.id}
            node={child}
            context={context}
            parentId={node.id}
            index={childIndex}
          />
        ))}
      </>
    ) : null
  ) : node.children.length > 0 ? (
    <>
      {node.children.map((child, childIndex) => (
        <RenderNode
          key={child.id}
          node={child}
          context={context}
          parentId={node.id}
          index={childIndex}
        />
      ))}
    </>
  ) : null;

  const renderProps: WidgetRenderProps = {
    node,
    style,
    context,
    children,
  };

  const content = definition?.render ? (
    definition.render(renderProps)
  ) : (
    <UnknownWidget node={node} />
  );

  if (!isEditor) {
    return <>{content}</>;
  }

  return (
    <SortableNode
      nodeId={node.id}
      type={node.type}
      label={definition?.label ?? node.type}
      parentId={parentId}
      index={index}
      isSelected={isSelected}
      isContainer={isContainer}
      onSelect={context.onSelectNode}
    >
      {content}
    </SortableNode>
  );
}

function propsAreEqual(
  prev: RenderNodeProps,
  next: RenderNodeProps,
): boolean {
  return (
    prev.node === next.node &&
    prev.parentId === next.parentId &&
    prev.index === next.index &&
    prev.context.mode === next.context.mode &&
    prev.context.device === next.context.device &&
    prev.context.selectedNodeId === next.context.selectedNodeId &&
    prev.context.onSelectNode === next.context.onSelectNode
  );
}

export const RenderNode = memo(RenderNodeComponent, propsAreEqual);
