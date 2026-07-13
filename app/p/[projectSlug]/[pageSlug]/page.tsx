import { notFound } from "next/navigation";
import { PreviewCanvas } from "@/features/preview/preview-canvas";
import { getPublishedPageBySlugs } from "@/server/pages";

type PublishedPageProps = {
  params: Promise<{ projectSlug: string; pageSlug: string }>;
};

export async function generateMetadata({ params }: PublishedPageProps) {
  const { projectSlug, pageSlug } = await params;
  const page = await getPublishedPageBySlugs(projectSlug, pageSlug);

  if (!page) {
    return { title: "Page not found" };
  }

  return {
    title: `${page.title} · ${page.projectName}`,
    description: `Published page from ${page.projectName}`,
  };
}

export default async function PublishedPage({ params }: PublishedPageProps) {
  const { projectSlug, pageSlug } = await params;
  const page = await getPublishedPageBySlugs(projectSlug, pageSlug);

  if (!page) {
    notFound();
  }

  return (
    <main>
      <PreviewCanvas content={page.content} mode="published" />
    </main>
  );
}
