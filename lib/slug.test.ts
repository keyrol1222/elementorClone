import { describe, expect, it } from "vitest";
import { appendSlugSuffix, slugify } from "@/lib/slug";

describe("slugify", () => {
  it("lowercases and hyphenates text", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("strips special characters", () => {
    expect(slugify("Hello, World!")).toBe("hello-world");
  });

  it("trims leading and trailing hyphens", () => {
    expect(slugify("  --Hello--  ")).toBe("hello");
  });
});

describe("appendSlugSuffix", () => {
  it("returns base slug for index 1", () => {
    expect(appendSlugSuffix("home", 1)).toBe("home");
  });

  it("appends index for collisions", () => {
    expect(appendSlugSuffix("home", 2)).toBe("home-2");
  });
});
