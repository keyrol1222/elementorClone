import { notFound } from "next/navigation";
import { EditorShell } from "@/editor/components/editor-shell";
import type { EditorPageData } from "@/editor/types";
import { parsePageContent } from "@/lib/page-content";
import { getCurrentUser } from "@/server/auth";
import { getPageById } from "@/server/pages";
import { getProjectById } from "@/server/projects";

type EditorPageProps = {
  params: Promise<{ projectId: string; pageId: string }>;
};

export default async function EditorPage({ params }: EditorPageProps) {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const { projectId, pageId } = await params;
  const [page, project] = await Promise.all([
    getPageById(user.id, projectId, pageId),
    getProjectById(user.id, projectId),
  ]);

  if (!page || !project) {
    notFound();
  }

  const editorData: EditorPageData = {
    projectId,
    projectSlug: project.slug,
    pageId,
    title: page.title,
    slug: page.slug,
    status: page.status,
    content: parsePageContent(page.content),
  };

  return <EditorShell data={editorData} />;
}
