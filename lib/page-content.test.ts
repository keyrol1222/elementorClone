import { describe, expect, it } from "vitest";
import { parsePageContent } from "@/lib/page-content";

describe("parsePageContent", () => {
  it("returns empty content for invalid input", () => {
    expect(parsePageContent(null)).toEqual({ version: 1, root: [] });
    expect(parsePageContent({})).toEqual({ version: 1, root: [] });
  });

  it("accepts valid page trees", () => {
    const content = {
      version: 1,
      root: [{ id: "a", type: "section", props: {}, style: {}, children: [] }],
    };

    expect(parsePageContent(content)).toEqual(content);
  });
});
