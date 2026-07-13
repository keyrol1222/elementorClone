import { describe, expect, it } from "vitest";
import {
  createHistoryEntry,
  pushPastEntry,
  shouldCoalesceHistory,
} from "@/editor/history/create-history";
import { MAX_HISTORY, type HistoryEntry } from "@/editor/history/types";

describe("history helpers", () => {
  it("creates deep-cloned content snapshots", () => {
    const content = {
      version: 1,
      root: [
        {
          id: "s1",
          type: "section",
          props: { a: 1 },
          style: {},
          children: [],
        },
      ],
    };

    const entry = createHistoryEntry({
      label: "Add section",
      action: "add",
      content,
      selectedNodeIds: ["s1"],
      nodeId: "s1",
    });

    content.root[0].props.a = 99;
    expect(entry.content.root[0].props.a).toBe(1);
  });

  it("coalesces rapid prop edits on the same node", () => {
    const last = createHistoryEntry({
      label: "Edit",
      action: "update-props",
      content: { version: 1, root: [] },
      selectedNodeIds: [],
      nodeId: "n1",
    });

    expect(shouldCoalesceHistory(last, "update-props", "n1")).toBe(true);
    expect(shouldCoalesceHistory(last, "update-style", "n1")).toBe(false);
  });

  it("caps history length", () => {
    let past: HistoryEntry[] = [];
    for (let i = 0; i < MAX_HISTORY + 5; i += 1) {
      past = pushPastEntry(
        past,
        createHistoryEntry({
          label: `Step ${i}`,
          action: "add",
          content: { version: 1, root: [] },
          selectedNodeIds: [],
        }),
      );
    }

    expect(past).toHaveLength(MAX_HISTORY);
  });
});
