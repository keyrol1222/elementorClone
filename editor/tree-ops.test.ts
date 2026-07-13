import { describe, expect, it } from "vitest";
import type { EditorNode } from "@/types";
import {
  cloneNodeWithNewIds,
  findNode,
  insertNode,
  removeNode,
} from "@/editor/tree-ops";

function node(
  id: string,
  type: string,
  children: EditorNode[] = [],
): EditorNode {
  return { id, type, props: {}, style: {}, children };
}

describe("tree-ops", () => {
  it("finds nested nodes", () => {
    const root = [node("s1", "section", [node("c1", "container")])];
    expect(findNode(root, "c1")?.type).toBe("container");
  });

  it("inserts and removes nodes", () => {
    let root = [node("s1", "section")];
    root = insertNode(root, null, 1, node("s2", "section"));
    expect(root).toHaveLength(2);

    const { tree, removed } = removeNode(root, "s1");
    expect(removed?.id).toBe("s1");
    expect(tree).toHaveLength(1);
    expect(tree[0].id).toBe("s2");
  });

  it("clones with new ids", () => {
    const original = node("s1", "section", [node("c1", "container")]);
    const cloned = cloneNodeWithNewIds(original);

    expect(cloned.id).not.toBe(original.id);
    expect(cloned.children[0].id).not.toBe(original.children[0].id);
    expect(cloned.type).toBe("section");
  });
});
