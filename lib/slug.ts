export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export function appendSlugSuffix(baseSlug: string, index: number): string {
  if (index <= 1) {
    return baseSlug;
  }
  return `${baseSlug}-${index}`;
}
