import { describe, expect, it } from "vitest";
import {
  applyStyleUpdates,
  getResolvedStyleValue,
  parseNumericStyle,
} from "@/lib/styles/responsive-style";

describe("responsive-style", () => {
  it("resolves cascading style values", () => {
    const style = {
      desktop: { fontSize: "24px", color: "#000" },
      tablet: { fontSize: "20px" },
    };

    expect(getResolvedStyleValue(style, "desktop", "fontSize")).toBe("24px");
    expect(getResolvedStyleValue(style, "tablet", "fontSize")).toBe("20px");
    expect(getResolvedStyleValue(style, "mobile", "color")).toBe("#000");
  });

  it("applies and clears device overrides", () => {
    const next = applyStyleUpdates(
      { desktop: { padding: "8px" } },
      "tablet",
      { padding: "16px" },
    );

    expect(next.tablet?.padding).toBe("16px");

    const cleared = applyStyleUpdates(next, "tablet", { padding: undefined });
    expect(cleared.tablet).toBeUndefined();
  });

  it("parses numeric style values", () => {
    expect(parseNumericStyle("12")).toBe(12);
    expect(parseNumericStyle("12px")).toBe("12px");
    expect(parseNumericStyle("")).toBe("");
  });
});
