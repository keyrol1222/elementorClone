import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { PreviewCanvas } from "@/features/preview/preview-canvas";
import { parsePageContent } from "@/lib/page-content";
import { getCurrentUser } from "@/server/auth";
import { getPageById } from "@/server/pages";
import { getProjectById } from "@/server/projects";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type DraftPreviewPageProps = {
  params: Promise<{ projectId: string; pageId: string }>;
};

export default async function DraftPreviewPage({
  params,
}: DraftPreviewPageProps) {
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

  const publishedUrl =
    page.status === "PUBLISHED"
      ? `/p/${project.slug}/${page.slug}`
      : null;

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-50 flex h-12 items-center gap-3 border-b bg-card px-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/editor/${projectId}/${pageId}`}>
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
            Back to editor
          </Link>
        </Button>
        <span className="text-sm font-medium">{page.title}</span>
        <Badge variant="secondary">{page.status}</Badge>
        <div className="flex-1" />
        {publishedUrl && (
          <Button variant="outline" size="sm" asChild>
            <Link href={publishedUrl} target="_blank">
              <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
              Live page
            </Link>
          </Button>
        )}
      </header>
      <PreviewCanvas content={parsePageContent(page.content)} mode="preview" />
    </div>
  );
}
