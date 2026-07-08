import { notFound } from "next/navigation";
import { EditorShell } from "@/editor/components/editor-shell";
import type { EditorPageData } from "@/editor/types";
import type { PageContent } from "@/types";
import { getCurrentUser } from "@/server/auth";
import { getPageById } from "@/server/pages";

type EditorPageProps = {
  params: Promise<{ projectId: string; pageId: string }>;
};

function parsePageContent(content: unknown): PageContent {
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

export default async function EditorPage({ params }: EditorPageProps) {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const { projectId, pageId } = await params;
  const page = await getPageById(user.id, projectId, pageId);

  if (!page) {
    notFound();
  }

  const editorData: EditorPageData = {
    projectId,
    pageId,
    title: page.title,
    slug: page.slug,
    status: page.status,
    content: parsePageContent(page.content),
  };

  return <EditorShell data={editorData} />;
}
