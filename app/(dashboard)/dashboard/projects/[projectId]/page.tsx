import { notFound } from "next/navigation";
import { getCurrentUser } from "@/server/auth";
import { getProjectById } from "@/server/projects";
import { DeleteProjectButton } from "@/features/projects/components/delete-project-button";
import { PagesList } from "@/features/pages/components/pages-list";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type ProjectDetailPageProps = {
  params: Promise<{ projectId: string }>;
};

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const { projectId } = await params;
  const project = await getProjectById(user.id, projectId);

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-2xl">{project.name}</CardTitle>
            <CardDescription>
              {project.description ?? "No description provided."}
            </CardDescription>
          </div>
          <DeleteProjectButton
            projectId={project.id}
            projectName={project.name}
          />
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <Badge variant="secondary">{project.slug}</Badge>
          <span>{project.pageCount} pages</span>
          <span>Updated {formatDate(project.updatedAt)}</span>
        </CardContent>
      </Card>

      <PagesList project={project} />
    </div>
  );
}
