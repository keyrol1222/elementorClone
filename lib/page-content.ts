import type { PageContent } from "@/types";

export function parsePageContent(content: unknown): PageContent {
  if (
    content &&
    typeof content === "object" &&
    "version" in content &&
    "root" in content &&
    Array.isArray((content as PageContent).root)
  ) {
    return content as PageContent;
  }

  return { version: 1, root: [] };
}
